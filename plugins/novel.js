
import axios from 'axios';
import { cmd } from '../command.js';

const API = 'https://ur.wikisource.org/w/api.php';
const cache = new Map();

const PAGE_SIZE = 3000;
const MAX_RESULTS = 15;

function getKey(from, m) {
  return `${from}:${m.sender || m.key?.participant || ''}`;
}

function splitText(text, size = PAGE_SIZE) {
  const chars = Array.from(text || '');
  const pages = [];

  for (let i = 0; i < chars.length; i += size) {
    pages.push(chars.slice(i, i + size).join(''));
  }

  return pages.length ? pages : ['اس صفحے پر پڑھنے کے لیے متن دستیاب نہیں۔'];
}

function cleanText(text = '') {
  return text
    .replace(/<[^>]*>/g, ' ')
    .replace(/\{\{[^{}]*\}\}/g, ' ')
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/\[https?:\/\/\S+\s*([^\]]*)\]/g, '$1')
    .replace(/'''?/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function searchWikisource(query) {
  const { data } = await axios.get(API, {
    params: {
      action: 'query',
      list: 'search',
      srsearch: query,
      srnamespace: 0,
      srlimit: 10,
      format: 'json'
    },
    timeout: 15000
  });

  return data?.query?.search || [];
}

async function getNovelList() {
  const searches = [
    'اردو ناول',
    'اردو کہانی',
    'داستان اردو'
  ];

  const results = await Promise.all(
    searches.map(term => searchWikisource(term).catch(() => []))
  );

  const unique = new Map();

  for (const group of results) {
    for (const item of group) {
      if (item?.title && !unique.has(item.title)) {
        unique.set(item.title, {
          title: item.title,
          pageid: item.pageid
        });
      }
    }
  }

  return [...unique.values()].slice(0, MAX_RESULTS);
}

async function getPageText(title) {
  const { data } = await axios.get(API, {
    params: {
      action: 'query',
      prop: 'extracts',
      explaintext: 1,
      explaintext: 1,
      titles: title,
      format: 'json'
    },
    timeout: 20000
  });

  const pages = data?.query?.pages;
  const page = pages ? Object.values(pages)[0] : null;

  if (!page || page.missing || !page.extract) {
    throw new Error('اس کتاب کا متن دستیاب نہیں ہے۔');
  }

  return cleanText(page.extract);
}

async function sendNovelPage(reply, state, pageIndex) {
  const page = state.pages[pageIndex];

  if (!page) {
    return reply('یہ صفحہ موجود نہیں۔');
  }

  state.page = pageIndex;

  const message =
    `📖 *${state.title}*\n` +
    `صفحہ: ${pageIndex + 1}/${state.pages.length}\n\n` +
    `${page}\n\n` +
    `اگلا صفحہ: .next\n` +
    `پچھلا صفحہ: .back\n` +
    `مخصوص صفحہ: .page ${pageIndex + 1}`;

  return reply(message);
}

async function openNovel(reply, key, title) {
  try {
    await reply(`📚 *${title}*\n\nکتاب کا متن لوڈ ہو رہا ہے، براہِ کرم انتظار کریں...`);

    const text = await getPageText(title);
    const pages = splitText(text);

    const state = {
      title,
      pages,
      page: 0
    };

    cache.set(key, {
      ...(cache.get(key) || {}),
      current: state
    });

    return sendNovelPage(reply, state, 0);
  } catch (error) {
    console.error('Novel plugin error:', error.message);
    return reply(
      '❌ اس کتاب کا متن حاصل نہیں ہو سکا۔\n' +
      'براہِ کرم کسی دوسری کتاب کا نام یا نمبر آزمائیں۔'
    );
  }
}

cmd({
  pattern: 'novel',
  desc: 'اردو کتابوں کی فہرست اور مطالعہ',
  category: 'reading',
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  const key = getKey(from, m);
  const input = (q || '').trim();

  try {
    // نمبر یا نام سے کتاب کھولیں
    if (input) {
      const saved = cache.get(key);
      const number = Number(input);

      if (
        saved?.list?.length &&
        Number.isInteger(number) &&
        number >= 1 &&
        number <= saved.list.length
      ) {
        const selected = saved.list[number - 1];
        return openNovel(reply, key, selected.title);
      }

      const results = await searchWikisource(input);

      if (!results.length) {
        return reply(
          '❌ اس نام سے کوئی کتاب نہیں ملی۔\n' +
          'فہرست کے لیے .novel لکھیں۔'
        );
      }

      const selected = results[0];
      return openNovel(reply, key, selected.title);
    }

    // پہلے اردو کتابوں کی فہرست دکھائیں
    await reply('📚 *اردو کتابوں کی فہرست تلاش کی جا رہی ہے...*');

    const list = await getNovelList();

    if (!list.length) {
      return reply(
        '❌ اس وقت Wikisource سے کتابوں کی فہرست حاصل نہیں ہو سکی۔\n' +
        'کچھ دیر بعد دوبارہ کوشش کریں۔'
      );
    }

    cache.set(key, {
      ...(cache.get(key) || {}),
      list
    });

    let message = '📚 *NAWAZ-MD Urdu Books*\n\n';

    list.forEach((book, index) => {
      message += `${index + 1}. ${book.title}\n`;
    });

    message +=
      '\n📖 *کتاب کھولنے کا طریقہ*\n' +
      'مثال: .novel 2\n' +
      'یا: .novel کتاب کا نام\n\n' +
      'صفحہ آگے: .next\n' +
      'صفحہ پیچھے: .back\n' +
      'مخصوص صفحہ: .page 3';

    return reply(message);
  } catch (error) {
    console.error('Novel list error:', error.message);
    return reply('❌ کتابوں کی فہرست حاصل نہیں ہو سکی۔ دوبارہ کوشش کریں۔');
  }
});

cmd({
  pattern: 'next',
  desc: 'اگلا ناول صفحہ',
  category: 'reading',
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  const key = getKey(from, m);
  const state = cache.get(key)?.current;

  if (!state) {
    return reply('پہلے .novel لکھ کر کوئی کتاب کھولیں۔');
  }

  if (state.page >= state.pages.length - 1) {
    return reply('یہ آخری دستیاب صفحہ ہے۔');
  }

  return sendNovelPage(reply, state, state.page + 1);
});

cmd({
  pattern: 'back',
  desc: 'پچھلا ناول صفحہ',
  category: 'reading',
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  const key = getKey(from, m);
  const state = cache.get(key)?.current;

  if (!state) {
    return reply('پہلے .novel لکھ کر کوئی کتاب کھولیں۔');
  }

  if (state.page <= 0) {
    return reply('آپ پہلے ہی پہلے صفحے پر ہیں۔');
  }

  return sendNovelPage(reply, state, state.page - 1);
});

cmd({
  pattern: 'page',
  desc: 'ناول کا مخصوص صفحہ کھولیں',
  category: 'reading',
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  const key = getKey(from, m);
  const state = cache.get(key)?.current;
  const pageNumber = Number((q || '').trim());

  if (!state) {
    return reply('پہلے .novel لکھ کر کوئی کتاب کھولیں۔');
  }

  if (
    !Number.isInteger(pageNumber) ||
    pageNumber < 1 ||
    pageNumber > state.pages.length
  ) {
    return reply(
      `براہِ کرم 1 سے ${state.pages.length} کے درمیان صفحہ نمبر دیں۔\n` +
      'مثال: .page 3'
    );
  }

  return sendNovelPage(reply, state, pageNumber - 1);
});
       
