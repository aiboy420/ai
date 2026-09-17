import { fileURLToPath } from 'url';
import axios from 'axios';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

const API = 'https://gutendex.com/books/';
const sessions = new Map();
const cache = new Map();

const getKey = (from, m) =>
    `${from}:${m.sender || m.key?.participant || ''}`;

async function getBooks(query = '') {
    const res = await axios.get(API, {
        params: {
            search: query,
            page_size: 10
        },
        timeout: 30000
    });

    return res.data?.results || [];
}

function getTextUrl(book) {
    const formats = book.formats || {};

    return (
        formats['text/plain; charset=utf-8'] ||
        formats['text/plain; charset=us-ascii'] ||
        formats['text/plain']
    );
}

function splitPages(text, size = 2500) {
    const pages = [];

    for (let i = 0; i < text.length; i += size) {
        pages.push(text.slice(i, i + size));
    }

    return pages;
}

async function loadBook(book) {
    const url = getTextUrl(book);

    if (!url) {
        throw new Error('No readable text available');
    }

    const res = await axios.get(url, {
        timeout: 60000,
        responseType: 'text',
        maxContentLength: 15 * 1024 * 1024
    });

    let text = String(res.data || '');

    // Remove Gutenberg header and footer when present
    const start = text.search(
        /\*\*\*\s*START OF (THE|THIS) PROJECT GUTENBERG/i
    );

    const end = text.search(
        /\*\*\*\s*END OF (THE|THIS) PROJECT GUTENBERG/i
    );

    if (start !== -1 && end > start) {
        const headerEnd = text.indexOf('\n', start);
        text = text.slice(headerEnd + 1, end);
    }

    text = text.trim();

    if (!text) {
        throw new Error('Empty book');
    }

    return splitPages(text);
}

async function sendPage(conn, mek, from, reply, session, page) {
    if (page < 0) {
        return reply('❌ آپ پہلے ہی پہلے صفحے پر ہیں۔');
    }

    if (page >= session.pages.length) {
        return reply('✅ یہ ناول مکمل ہو چکا ہے۔');
    }

    session.page = page;

    const content = session.pages[page];

    return conn.sendMessage(from, {
        text:
            `📚 *${session.title}*\n` +
            `📖 *Page ${page + 1}/${session.pages.length}*\n\n` +
            `${content}\n\n` +
            `━━━━━━━━━━━━\n` +
            `➡️ Next: .next\n` +
            `⬅️ Back: .back\n` +
            `📄 Page: .page 5\n` +
            `📚 Books: .novel`
    }, { quoted: mek });
}

// 📚 NOVEL COMMAND
cmd({
    pattern: 'novel',
    desc: 'Read novels in WhatsApp',
    category: 'novel',
    react: '📚',
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const key = getKey(from, m);
        const query = (q || '').trim();

        // Show available books
        if (!query) {
            const books = await getBooks();

            if (!books.length) {
                return reply('❌ کوئی کتاب دستیاب نہیں ملی۔');
            }

            sessions.set(key, {
                mode: 'choose',
                books
            });

            const list = books.map((book, i) =>
                `${i + 1}. ${book.title}\n` +
                `   ✍️ ${book.authors?.[0]?.name || 'Unknown'}`
            ).join('\n\n');

            return reply(
                `📚 *NAWAZ MD NOVEL READER*\n\n` +
                `*Available Books:*\n\n${list}\n\n` +
                `━━━━━━━━━━━━\n` +
                `📖 کتاب شروع کرنے کے لیے:\n` +
                `.novel 1\n\n` +
                `یا کتاب کا نام لکھیں:\n` +
                `.novel Romeo and Juliet`
            );
        }

        const oldSession = sessions.get(key);

        // Select from the displayed list
        if (
            /^\d+$/.test(query) &&
            oldSession?.mode === 'choose'
        ) {
            const index = Number(query) - 1;
            const book = oldSession.books[index];

            if (!book) {
                return reply('❌ غلط نمبر۔ دوبارہ .novel لکھیں۔');
            }

            const pages = await loadBook(book);

            const session = {
                mode: 'reading',
                title: book.title,
                pages,
                page: 0
            };

            sessions.set(key, session);

            return sendPage(
                conn, mek, from, reply, session, 0
            );
        }

        // Search by book name
        const books = await getBooks(query);

        if (!books.length) {
            return reply(
                '❌ کوئی کتاب نہیں ملی۔ دوسرا نام آزمائیں۔'
            );
        }

        const book = books[0];
        const pages = await loadBook(book);

        const session = {
            mode: 'reading',
            title: book.title,
            pages,
            page: 0
        };

        sessions.set(key, session);

        return sendPage(
            conn, mek, from, reply, session, 0
        );

    } catch (e) {
        console.error('Novel command error:', e.message);

        return reply(
            '❌ کتاب لوڈ نہیں ہو سکی۔ API یا کتاب کا متن دستیاب نہیں ہے۔'
        );
    }
});

// ➡️ NEXT PAGE
cmd({
    pattern: 'next',
    desc: 'Next novel page',
    category: 'novel',
    react: '➡️',
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    const session = sessions.get(getKey(from, m));

    if (!session || session.mode !== 'reading') {
        return reply('📚 پہلے .novel سے کتاب منتخب کریں۔');
    }

    return sendPage(
        conn, mek, from, reply,
        session, session.page + 1
    );
});

// ⬅️ PREVIOUS PAGE
cmd({
    pattern: 'back',
    desc: 'Previous novel page',
    category: 'novel',
    react: '⬅️',
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    const session = sessions.get(getKey(from, m));

    if (!session || session.mode !== 'reading') {
        return reply('📚 پہلے .novel سے کتاب منتخب کریں۔');
    }

    return sendPage(
        conn, mek, from, reply,
        session, session.page - 1
    );
});

// 📄 SPECIFIC PAGE
cmd({
    pattern: 'page',
    desc: 'Open specific novel page',
    category: 'novel',
    react: '📄',
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    const session = sessions.get(getKey(from, m));

    if (!session || session.mode !== 'reading') {
        return reply('📚 پہلے .novel سے کتاب منتخب کریں۔');
    }

    const number = Number(q);

    if (
        !Number.isInteger(number) ||
        number < 1 ||
        number > session.pages.length
    ) {
        return reply(
            `❌ صفحہ 1 سے ${session.pages.length} تک منتخب کریں۔`
        );
    }

    return sendPage(
        conn, mek, from, reply,
        session, number - 1
    );
});

