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

function splitText(text) {
  const words = String(text || '').split(/\s+/);
  const pages = [];
  let current = '';

  for (const word of words) {
    if (!word) continue;

    if (current && (current.length + word.length + 1 > PAGE_SIZE)) {
      pages.push(current);
      current = word;
    } else {
      current += (current ? ' ' : '') + word;
    }
  }

  if (current) pages.push(current);
  return pages.length ? pages : ['متن دستیاب نہیں۔'];
}

function cleanText(text = '') {
  return String(text)
    .replace(/سانچہ\s*:\s*PD-Pakistan/gi, '')
    .replace(/PD-Pakistan/gi, '')
    .replace(/^\s*سانچہ\s*:.*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function isUsableText(text) {
  const cleaned = cleanText(text);
  const letters = (cleaned.match(/[\u0600-\u06FF]/g) || []).length;

  return cleaned.length >= 100 && letters >= 50;
}

async function apiGet(params) {
  const response = await axios.get(API, {
    params: {
      ...params,
      format: 'json',
      formatversion: 2
    },
    headers: {
      'User-Agent': 'NAWAZ-MD-UrduNovelBot/1.0 (WhatsApp bot)'
    },
    timeout: 30000
  });

  return response.data;
}

async function searchBooks(query) {
  const data = await apiGet({
    action: 'query',
    list: 'search',
    srsearch: query,
    srnamespace: 0,
    srlimit: 20
  });

  return data?.query?.search || [];
}

async function getBookText(title) {
  const data = await apiGet({
    action: 'query',
    prop: 'extracts',
    explaintext: 1,
    titles: title
  });

  const pages = data?.query?.pages;
  const page = Array.isArray(pages) ? pages[0] : null;

  if (!page || page.missing || !page.extract) {
    return '';
  }

  return cleanText(page.extract);
}

async function getBookList() {
  const queries = [
    'اردو ناول',
    'اردو کہانی',
    'اردو داستان',
    'اردو ادب'
  ];

  const found = new Map();

  for (const query of queries) {
    try {
      const results = await searchBooks(query);

      for (const item of results) {
        if (!item.title || found.has(item.title)) continue;

        try {
          const text = await getBookText(item.title);

          if (isUsableText(text)) {
            found.set(item.title, {
              title: item.title,
              pageid: item.pageid
            });
          }
        } catch (error) {
          console.log(
            '[NOVEL] Skipped:',
            item.title,
            error.message
          );
        }

        if (found.size >= MAX_BOOKS) break;
      }
    } catch (error) {
      console.log(
        '[NOVEL] Search failed:',
        query,
        error.response?.status || error.message
      );
    }

    if (found.size >= MAX_BOOKS) break;
  }

  return [...found.values()];
}

async function showPage(reply, state, pageIndex) {
  if (pageIndex < 0 || pageIndex >= state.pages.length) {
    return reply('❌ یہ صفحہ دستیاب نہیں ہے۔');
  }

  state.page = pageIndex;

  return reply(
    `📖 *${state.title}*\n` +
    `صفحہ: ${pageIndex + 1}/${state.pages.length}\n\n` +
    `${state.pages[pageIndex]}\n\n` +
    `اگلا صفحہ: .next\n` +
    `پچھلا صفحہ: .back\n` +
    `مخصوص صفحہ: .page 3`
  );
}

async function openBook(reply, key, title) {
  try {
    const text = await getBookText(title);

    if (!isUsableText(text)) {
      return reply(
        '❌ اس نتیجے میں اصل کتاب کا کافی متن موجود نہیں۔\n' +
        'براہِ کرم فہرست میں سے کوئی دوسری کتاب منتخب کریں۔'
      );
    }

    const state = {
      title,
      pages: splitText(text),
      page: 0
    };

    readingBooks.set(key, state);

    return showPage(reply, state, 0);
  } catch (error) {
    console.error('[NOVEL] Open error:', error.message);

    return reply(
      '❌ کتاب کا متن حاصل نہیں ہو سکا۔\n' +
      'کسی دوسری کتاب کا نام یا نمبر آزمائیں۔'
    );
  }
}

cmd({
  pattern: 'novel',
  desc: 'Urdu novel reader',
  category: 'reading',
  react: '📚',
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  const key = getKey(from, m);
  const input = (q || '').trim();

  try {
    if (input) {
      const number = Number(input);
      const saved = bookLists.get(key);

      if (
        /^\d+$/.test(input) &&
        saved &&
        number >= 1 &&
        number <= saved.length
      ) {
        return openBook(reply, key, saved[number - 1].title);
      }

      const results = await searchBooks(input);

      for (const item of results) {
        if (!item.title) continue;

        const text = await getBookText(item.title);

        if (isUsableText(text)) {
          return openBook(reply, key, item.title);
        }
      }

      return reply(
        '❌ اس نام سے اصل اردو متن نہیں ملا۔\n' +
        'کتابوں کی فہرست کے لیے .novel لکھیں۔'
      );
    }

    await reply('📚 اردو کتابیں تلاش ہو رہی ہیں، انتظار کریں...');

    const books = await getBookList();

    if (!books.length) {
      return reply(
        '❌ کوئی قابلِ مطالعہ کتاب نہیں ملی۔\n' +
        'سرور یا Wikisource API کا کنکشن چیک کریں۔'
      );
    }

    bookLists.set(key, books);

    let message = '*NAWAZ-MD Urdu Books*\n\n';

    books.forEach((book, index) => {
      message += `${index + 1}. ${book.title}\n`;
    });

    message +=
      '\nکتاب کھولنے کے لیے: .novel 2\n' +
      'یا کتاب کا نام: .novel کتاب کا نام\n\n' +
      'اگلا صفحہ: .next\n' +
      'پچھلا صفحہ: .back\n' +
      'مخصوص صفحہ: .page 3';

    return reply(message);
  } catch (error) {
    console.error('[NOVEL] Command error:', error.message);

    return reply(
      '❌ کمانڈ میں مسئلہ آیا۔\n' +
      'سرور لاگ میں [NOVEL] والی error چیک کریں۔'
    );
  }
});

cmd({
  pattern: 'next',
  desc: 'Next novel page',
  category: 'reading',
  react: '📖',
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  const state = readingBooks.get(getKey(from, m));

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
  const state = readingBooks.get(getKey(from, m));

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
  desc: 'Open specific novel page',
  category: 'reading',
  react: '📖',
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  const state = readingBooks.get(getKey(from, m));
  const number = Number((q || '').trim());

  if (!state) {
    return reply('پہلے .novel لکھ کر کتاب کھولیں۔');
  }

  if (
    !Number.isInteger(number) ||
    number < 1 ||
    number > state.pages.length
  ) {
    return reply(
      `صفحہ نمبر 1 سے ${state.pages.length} تک درج کریں۔\n` +
      'مثال: .page 3'
    );
  }

  return showPage(reply, state, number - 1);
});
    
