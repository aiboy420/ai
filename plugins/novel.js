import { fileURLToPath } from 'url';
import axios from 'axios';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

const API = 'https://gutendex.com/books/';

const sessions = new Map();
const pendingBooks = new Map();

const PAGE_SIZE = 2500;
const MAX_BOOK_SIZE = 12 * 1024 * 1024;

function getKey(from, m) {
    return `${from}:${m.sender || m.key?.participant || ''}`;
}

function cleanText(text) {
    return String(text || '')
        .replace(/\r/g, '')
        .replace(/\u0000/g, '')
        .trim();
}

function splitPages(text) {
    const pages = [];
    let current = '';

    for (const paragraph of text.split(/\n\s*\n/)) {
        const part = paragraph.trim();

        if (!part) continue;

        if (part.length > PAGE_SIZE) {
            if (current) {
                pages.push(current);
                current = '';
            }

            for (let i = 0; i < part.length; i += PAGE_SIZE) {
                pages.push(part.slice(i, i + PAGE_SIZE));
            }

            continue;
        }

        const combined = current
            ? `${current}\n\n${part}`
            : part;

        if (combined.length > PAGE_SIZE) {
            pages.push(current);
            current = part;
        } else {
            current = combined;
        }
    }

    if (current) pages.push(current);

    return pages;
}

async function getBooks(query = '') {
    const response = await axios.get(API, {
        params: {
            search: query,
            page_size: 10
        },
        timeout: 30000,
        headers: {
            'User-Agent': 'NAWAZ-MD-Novel-Reader/1.0'
        }
    });

    return response.data?.results || [];
}

function getTextUrl(book) {
    const formats = book.formats || {};

    const entries = Object.entries(formats);

    const plainText = entries.find(([type, url]) =>
        type.toLowerCase().startsWith('text/plain') &&
        typeof url === 'string' &&
        /^https?:\/\//i.test(url)
    );

    return plainText?.[1] || null;
}

async function loadBook(book) {
    const url = getTextUrl(book);

    if (!url) {
        throw new Error(
            'اس کتاب کا Plain Text فارمیٹ دستیاب نہیں ہے۔'
        );
    }

    const response = await axios.get(url, {
        timeout: 60000,
        responseType: 'text',
        maxContentLength: MAX_BOOK_SIZE,
        headers: {
            'User-Agent': 'NAWAZ-MD-Novel-Reader/1.0'
        }
    });

    let text = cleanText(response.data);

    const startRegex =
        /\*\*\*\s*START OF (?:THE|THIS) PROJECT GUTENBERG/i;

    const endRegex =
        /\*\*\*\s*END OF (?:THE|THIS) PROJECT GUTENBERG/i;

    const start = text.search(startRegex);
    const end = text.search(endRegex);

    if (start !== -1 && end > start) {
        const headerEnd = text.indexOf('\n', start);

        if (headerEnd !== -1) {
            text = text.slice(headerEnd + 1, end).trim();
        }
    }

    if (!text) {
        throw new Error('کتاب کا متن خالی ہے۔');
    }

    return splitPages(text);
}

async function showPage(
    conn,
    mek,
    from,
    session,
    page
) {
    if (page < 0) {
        return conn.sendMessage(from, {
            text: '❌ آپ پہلے صفحے پر ہیں۔'
        }, { quoted: mek });
    }

    if (page >= session.pages.length) {
        return conn.sendMessage(from, {
            text: '✅ یہ ناول مکمل ہو چکا ہے۔'
        }, { quoted: mek });
    }

    session.page = page;

    const content = session.pages[page];

    return conn.sendMessage(from, {
        text:
            `📚 *${session.title}*\n` +
            `📖 *Page ${page + 1}/${session.pages.length}*\n\n` +
            `${content}\n\n` +
            `━━━━━━━━━━━━\n` +
            `➡️ .next — Next Page\n` +
            `⬅️ .back — Previous Page\n` +
            `📄 .page 5 — Open Page\n` +
            `📚 .novel — Books List`
    }, { quoted: mek });
}

async function startBook(
    conn,
    mek,
    from,
    key,
    book
) {
    await conn.sendMessage(from, {
        text:
            `📚 *NAWAZ-MD NOVEL READER*\n\n` +
            `⏳ Loading: ${book.title}\n` +
            `Please wait...`
    }, { quoted: mek });

    const pages = await loadBook(book);

    const session = {
        title: book.title,
        pages,
        page: 0
    };

    sessions.set(key, session);
    pendingBooks.delete(key);

    return showPage(
        conn,
        mek,
        from,
        session,
        0
    );
}

// 📚 NOVEL COMMAND
cmd({
    pattern: 'novel',
    desc: 'Read books in WhatsApp',
    category: 'novel',
    react: '📚',
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    const key = getKey(from, m);
    const query = String(q || '').trim();

    try {
        // Show available books
        if (!query) {
            const books = await getBooks();

            if (!books.length) {
                return reply(
                    '❌ فی الحال کوئی کتاب دستیاب نہیں۔'
                );
            }

            pendingBooks.set(key, books);

            const list = books.map((book, i) =>
                `${i + 1}. *${book.title}*\n` +
                `✍️ ${book.authors?.[0]?.name || 'Unknown'}`
            ).join('\n\n');

            return reply(
                `📚 *NAWAZ-MD NOVEL READER*\n\n` +
                `*Available Books:*\n\n${list}\n\n` +
                `━━━━━━━━━━━━\n` +
                `کتاب منتخب کرنے کے لیے:\n` +
                `.novel 1\n\n` +
                `یا کتاب کا نام لکھیں:\n` +
                `.novel Romeo and Juliet`
            );
        }

        // Select a book from the list
        if (/^\d+$/.test(query)) {
            const books = pendingBooks.get(key);
            const index = Number(query) - 1;

            if (!books || !books[index]) {
                return reply(
                    '❌ غلط نمبر۔ پہلے .novel لکھ کر فہرست حاصل کریں۔'
                );
            }

            return await startBook(
                conn,
                mek,
                from,
                key,
                books[index]
            );
        }

        // Search book by name
        const books = await getBooks(query);

        if (!books.length) {
            return reply(
                `❌ "${query}" نام کی کوئی کتاب نہیں ملی۔\n\n` +
                `دوسرا نام آزمائیں یا .novel لکھیں۔`
            );
        }

        // Exact match first, otherwise first result
        const book =
            books.find(b =>
                b.title.toLowerCase() === query.toLowerCase()
            ) || books[0];

        return await startBook(
            conn,
            mek,
            from,
            key,
            book
        );

    } catch (error) {
        console.error(
            'NOVEL ERROR:',
            error.response?.status || '',
            error.message
        );

        return reply(
            `❌ *Book Loading Failed*\n\n` +
            `Reason: ${error.message}\n\n` +
            `براہِ کرم دوسرا ناول آزمائیں۔`
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

    if (!session) {
        return reply(
            '📚 پہلے .novel سے کوئی کتاب شروع کریں۔'
        );
    }

    return showPage(
        conn,
        mek,
        from,
        session,
        session.page + 1
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

    if (!session) {
        return reply(
            '📚 پہلے .novel سے کوئی کتاب شروع کریں۔'
        );
    }

    return showPage(
        conn,
        mek,
        from,
        session,
        session.page - 1
    );
});

// 📄 SPECIFIC PAGE
cmd({
    pattern: 'page',
    desc: 'Open a specific novel page',
    category: 'novel',
    react: '📄',
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    const session = sessions.get(getKey(from, m));

    if (!session) {
        return reply(
            '📚 پہلے .novel سے کوئی کتاب شروع کریں۔'
        );
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

    return showPage(
        conn,
        mek,
        from,
        session,
        number - 1
    );
});
        
