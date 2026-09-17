import axios from 'axios';
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);
const API = 'https://ur.wikisource.org/w/api.php';

const bookLists = new Map();
const readingBooks = new Map();

const PAGE_SIZE = 2500;
const MAX_BOOKS = 15;

function getKey(from, m) {
  return `${from}:${m.sender || m.key?.participant || ''}`;
}

function splitIntoPages(text) {
  const words = String(text || '').split(/\s+/);
  const pages = [];
  let current = '';

  for (const word of words) {
    if (!word) continue;

    if ((current + ' ' + word).length > PAGE_SIZE && current) {
      pages.push(current);
      current = word;
    } else {
      current += (current ? ' ' : '') + word;
    }
  }

  if (current) pages.push(current);

  return pages.length ? pages : ['اس صفحے پر متن دستیاب نہیں۔'];
}

async function searchBooks(query) {
  const response = await axios.get(API, {
    params: {
      action: 'query',
      list: 'search',
      srsearch: query,
      srnamespace: 0,
      srlimit: 15,
      format: 'json'
    },
    headers: {
      'User-Agent': 'NAWAZ-MD-UrduNovelBot/1.0'
    },
    timeout: 30000
  });

  return response.data?.query?.search || [];
}

async function getBookList() {
  const queries = ['ناول', 'کہانی', 'داستان', 'اردو ادب'];
  const found = new Map();

  for (const query of queries) {
    try {
      const results = await searchBooks(query);

      for (const item of results) {
        if (item.title && !found.has(item.title)) {
          found.set(item.title, {
            title: item.title,
            pageid: item.pageid
          });
        }
      }
    } catch (error) {
      console.error(
        '[NAWAZ-MD NOVEL] Search error:',
        error.response?.status || error.code || error.message
      );
    }
  }

  return [...found.values()].slice(0, MAX_BOOKS);
}

async function getBookText(title) {
  const response = await axios.get(API, {
    params: {
      action: 'query',
      prop: 'extracts',
      explaintext: 1,
      titles: title,
      format: 'json'
    },
    headers: {
      'User-Agent': 'NAWAZ-MD-UrduNovelBot/1.0'
    },
    timeout: 30000
  });

  const pages = response.data?.query?.pages;
  const page = pages ? Object.values(pages)[0] : null;

  if (!page || page.missing || !page.extract) {
    throw new Error('Book text unavailable');
  }

  return page.extract.trim();
}

async function sendPage(reply, state, pageIndex) {
  if (pageIndex < 0 || pageIndex >= state.pages.length) {
    return reply('❌ یہ صفحہ دستیاب نہیں ہے۔');
  }

  state.page = pageIndex;

  const message =
    `📖 *${state.title}*\n` +
    `صفحہ: ${pageIndex + 1}/${state.pages.length}\n\n` +
    `${state.pages[pageIndex]}\n\n` +
    `اگلا صفحہ: .next\n` +
    `پچھلا صفحہ: .back\n` +
    `مخصوص صفحہ: .page 3`;

  return reply(message);
}

async function openBook(reply, key, title) {
  try {
    await reply(`📚 *${title}*\n\nکتاب کا متن لوڈ ہو رہا ہے...`);

    const text = await getBookText(title);
    const state = {
      title,
      pages: splitIntoPages(text),
      page: 0
    };

    readingBooks.set(key, state);

    return sendPage(reply, state, 0);
  } catch (error) {
    console.error('[NAWAZ-MD NOVEL] Open error:', error.message);

    return reply(
      '❌ کتاب کا متن حاصل نہیں ہو سکا۔\n' +
      'کسی دوسری کتاب کا نام آزمائیں۔'
    );
  }
}

cmd({
  pattern: 'novel',
  desc: 'Urdu novel and story reader',
  category: 'reading',
  react: '📚',
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  const key = getKey(from, m);
  const input = (q || '').trim();

  try {
    // کتاب نمبر یا نام سے کھولیں
    if (input) {
      const number = Number(input);
      const savedList = bookLists.get(key);

      if (
        savedList &&
        /^\d+$/.test(input) &&
        number >= 1 &&
        number <= savedList.length
      ) {
        return openBook(reply, key, savedList[number - 1].title);
      }

      const results = await searchBooks(input);

      if (!results.length) {
        return reply(
          '❌ کوئی کتاب نہیں ملی۔\n' +
          'فہرست کے لیے .novel لکھیں۔'
        );
      }

      return openBook(reply, key, results[0].title);
    }

    await reply('📚 اردو کتابوں کی فہرست تلاش ہو رہی ہے...');

    const books = await getBookList();

    if (!books.length) {
      return reply(
        '❌ کتابوں کی فہرست حاصل نہیں ہو سکی۔\n' +
        'براہِ کرم کچھ دیر بعد دوبارہ کوشش کریں۔'
      );
    }

    bookLists.set(key, books);

    let message = '*NAWAZ-MD Urdu Books*\n\n';

    books.forEach((book, index) => {
      message += `${index + 1}. ${book.title}\n`;
    });

    message +=
      '\nکتاب کھولنے کے لیے:\n' +
      '.novel 2\n' +
      'یا .novel کتاب کا نام\n\n' +
      'اگلا صفحہ: .next\n' +
      'پچھلا صفحہ: .back\n' +
      'مخصوص صفحہ: .page 3';

    return reply(message);
  } catch (error) {
    console.error('[NAWAZ-MD NOVEL] Command error:', error.message);
    return reply('❌ کمانڈ چلانے میں مسئلہ ہوا۔ دوبارہ کوشش کریں۔');
  }
});

cmd({
  pattern: 'next',
  desc: 'Next novel page',
  category: 'reading',
  react: '📖',
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  const key = getKey(from, m);
  const state = readingBooks.get(key);

  if (!state) {
    return reply('پہلے .novel لکھ کر کتاب کھولیں۔');
  }

  if (state.page >= state.pages.length - 1) {
    return reply('آپ آخری دستیاب صفحے پر ہیں۔');
  }

  return sendPage(reply, state, state.page + 1);
});

cmd({
  pattern: 'back',
  desc: 'Previous novel page',
  category: 'reading',
  react: '📖',
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  const key = getKey(from, m);
  const state = readingBooks.get(key);

  if (!state) {
    return reply('پہلے .novel لکھ کر کتاب کھولیں۔');
  }

  if (state.page <= 0) {
    return reply('آپ پہلے صفحے پر ہیں۔');
  }

  return sendPage(reply, state, state.page - 1);
});

cmd({
  pattern: 'page',
  desc: 'Open a specific novel page',
  category: 'reading',
  react: '📖',
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  const key = getKey(from, m);
  const state = readingBooks.get(key);
  const pageNumber = Number((q || '').trim());

  if (!state) {
    return reply('پہلے .novel لکھ کر کتاب کھولیں۔');
  }

  if (
    !Number.isInteger(pageNumber) ||
    pageNumber < 1 ||
    pageNumber > state.pages.length
  ) {
    return reply(
      `صفحہ نمبر 1 سے ${state.pages.length} تک درج کریں۔\n` +
      'مثال: .page 3'
    );
  }

  return sendPage(reply, state, pageNumber - 1);
});
                              
