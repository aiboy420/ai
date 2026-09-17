import axios from 'axios';
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);
const API = 'https://ur.wikisource.org/w/api.php';

const userBooks = new Map();
const userReading = new Map();

const PAGE_SIZE = 2500;

function getKey(from, m) {
  return `${from}:${m.sender || m.key?.participant || ''}`;
}

function splitText(text) {
  const chars = Array.from(text || '');
  const pages = [];

  for (let i = 0; i < chars.length; i += PAGE_SIZE) {
    pages.push(chars.slice(i, i + PAGE_SIZE).join(''));
  }

  return pages.length ? pages : ['متن دستیاب نہیں۔'];
}

async function searchBooks(query) {
  const response = await axios.get(API, {
    params: {
      action: 'query',
      list: 'search',
      srsearch: query,
      srnamespace: 0,
      srlimit: 10,
      format: 'json'
    },
    timeout: 20000
  });

  return response.data?.query?.search || [];
}

async function getBookList() {
  const queries = ['اردو ناول', 'اردو کہانی', 'داستان اردو'];
  const found = new Map();

  for (const query of queries) {
    try {
      const results = await searchBooks(query);

      for (const item of results) {
        if (item.title && !found.has(item.title)) {
          found.set(item.title, item);
        }
      }
    } catch (error) {
      console.error(`Novel search error (${query}):`, error.message);
    }
  }

  return [...found.values()].slice(0, 15);
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
    timeout: 20000
  });

  const pages = response.data?.query?.pages;
  const page = pages ? Object.values(pages)[0] : null;

  if (!page || page.missing || !page.extract) {
    throw new Error('Book text not found');
  }

  return page.extract.trim();
}

async function showPage(reply, state, pageIndex) {
  if (pageIndex < 0 || pageIndex >= state.pages.length) {
    return reply('❌ یہ صفحہ دستیاب نہیں ہے۔');
  }

  state.page = pageIndex;

  const text =
    `📖 *${state.title}*\n` +
    `صفحہ: ${pageIndex + 1}/${state.pages.length}\n\n` +
    `${state.pages[pageIndex]}\n\n` +
    `اگلا صفحہ: .next\n` +
    `پچھلا صفحہ: .back\n` +
    `مخصوص صفحہ: .page 3`;

  return reply(text);
}

async function openBook(reply, key, title) {
  try {
    await reply(`📚 *${title}*\n\nمتن لوڈ ہو رہا ہے...`);

    const text = await getBookText(title);
    const state = {
      title,
      pages: splitText(text),
      page: 0
    };

    userReading.set(key, state);

    return showPage(reply, state, 0);
  } catch (error) {
    console.error('Open novel error:', error.message);
    return reply(
      '❌ کتاب کا متن لوڈ نہیں ہو سکا۔\n' +
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
    if (input) {
      const number = Number(input);
      const savedList = userBooks.get(key);

      if (
        savedList &&
        Number.isInteger(number) &&
        number >= 1 &&
        number <= savedList.length
      ) {
        return openBook(reply, key, savedList[number - 1].title);
      }

      const results = await searchBooks(input);

      if (!results.length) {
        return reply(
          '❌ کوئی کتاب نہیں ملی۔\n' +
          'تمام کتابوں کی فہرست کے لیے .novel لکھیں۔'
        );
      }

      return openBook(reply, key, results[0].title);
    }

    await reply('📚 اردو کتابوں کی فہرست تلاش ہو رہی ہے...');

    const books = await getBookList();

    if (!books.length) {
      return reply(
        '❌ کتابوں کی فہرست حاصل نہیں ہو سکی۔\n' +
        'بعد میں دوبارہ کوشش کریں۔'
      );
    }

    userBooks.set(key, books);

    let text = '*NAWAZ-MD Urdu Books*\n\n';

    books.forEach((book, index) => {
      text += `${index + 1}. ${book.title}\n`;
    });

    text +=
      '\nکتاب کھولنے کے لیے:\n' +
      '.novel 2\n' +
      'یا .novel کتاب کا نام\n\n' +
      'اگلا صفحہ: .next\n' +
      'پچھلا صفحہ: .back\n' +
      'مخصوص صفحہ: .page 3';

    return reply(text);
  } catch (error) {
    console.error('Novel command error:', error.message);
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
  const state = userReading.get(key);

  if (!state) {
    return reply('پہلے .novel لکھ کر کتاب کھولیں۔');
  }

  if (state.page >= state.pages.length - 1) {
    return reply('آپ آخری دستیاب صفحے پر ہیں۔');
  }

  return showPage(reply, state, state.page + 1);
});

cmd({
  pattern: 'back',
  desc: 'Previous novel page',
  category: 'reading',
  react: '📖',
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  const key = getKey(from, m);
  const state = userReading.get(key);

  if (!state) {
    return reply('پہلے .novel لکھ کر کتاب کھولیں۔');
  }

  if (state.page <= 0) {
    return reply('آپ پہلے صفحے پر ہیں۔');
  }

  return showPage(reply, state, state.page - 1);
});

cmd({
  pattern: 'page',
  desc: 'Open a specific novel page',
  category: 'reading',
  react: '📖',
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  const key = getKey(from, m);
  const state = userReading.get(key);
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

  return showPage(reply, state, pageNumber - 1);
});
  
