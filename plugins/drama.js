// drama.js - ESM Version
// NAWAZ MD - DRAMA DOCUMENT DOWNLOADER

import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { cmd } from '../command.js';
import yts from 'yt-search';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const require = createRequire(import.meta.url);

let ytdl = null;

try {
    ytdl = require('@distube/ytdl-core');
} catch {
    try {
        ytdl = require('ytdl-core');
    } catch {
        ytdl = null;
    }
}

const MAX_FILE_SIZE = 95 * 1024 * 1024;

const AXIOS_CONFIG = {
    timeout: 30000,
    maxRedirects: 5,
    headers: {
        'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
    }
};

/* =========================
   YOUTUBE URL
========================= */

function normalizeYouTubeUrl(url) {
    const match = url.match(
        /(?:youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/.*[?&]v=)([a-zA-Z0-9_-]{11})/
    );

    return match
        ? `https://youtube.com/watch?v=${match[1]}`
        : null;
}

/* =========================
   DRAMA FILTER
========================= */

const DRAMA_KEYWORDS = [
    'drama',
    'episode',
    'episode ',
    'ep ',
    'ep.',
    'season',
    'serial',
    'telefilm',
    'tv serial',
    'pakistani drama',
    'pakistan drama',
    'turkish drama',
    'korean drama',
    'indian drama',
    'web series',
    'official episode',
    'full episode',
    'complete episode',
    'part 1',
    'part 2',
    'part 3',
    'part 4',
    'ost episode'
];

const NON_DRAMA_KEYWORDS = [
    'song',
    'songs',
    'music',
    'official music video',
    'music video',
    'lyrics',
    'lyric',
    'remix',
    'mashup',
    'dj',
    'audio',
    'lofi',
    'cover',
    'slowed',
    'reverb',
    'status',
    'shorts',
    'short',
    'edit',
    'edits',
    'nasheed',
    'qawwali',
    'recitation'
];

function isDramaVideo(video) {
    if (!video?.title) return false;

    const text = `${video.title} ${video.description || ''}`.toLowerCase();

    for (const word of NON_DRAMA_KEYWORDS) {
        if (text.includes(word)) {
            return false;
        }
    }

    for (const word of DRAMA_KEYWORDS) {
        if (text.includes(word)) {
            return true;
        }
    }

    return false;
}

/* =========================
   DRAMA SEARCH
========================= */

async function searchDrama(query) {
    const results = await yts(query);

    if (!results?.videos?.length) {
        return null;
    }

    const dramaResults = results.videos.filter(isDramaVideo);

    if (!dramaResults.length) {
        return null;
    }

    return dramaResults[0];
}

/* =========================
   EXTRACT URL
========================= */

function extractDownloadUrl(data) {
    if (!data) return null;

    if (typeof data === 'string') {
        if (/^https?:\/\//i.test(data)) {
            return data;
        }

        return null;
    }

    if (Array.isArray(data)) {
        for (const item of data) {
            const found = extractDownloadUrl(item);
            if (found) return found;
        }

        return null;
    }

    const directKeys = [
        'mp4',
        'mp4_url',
        'download_url',
        'downloadUrl',
        'download',
        'url',
        'link',
        'video',
        'video_url',
        'videoUrl',
        'file',
        'file_url',
        'fileUrl'
    ];

    for (const key of directKeys) {
        const value = data?.[key];

        if (typeof value === 'string' && /^https?:\/\//i.test(value)) {
            return value;
        }

        if (value && typeof value === 'object') {
            const found = extractDownloadUrl(value);
            if (found) return found;
        }
    }

    const nestedKeys = [
        'result',
        'data',
        'response',
        'media',
        'download',
        'downloads'
    ];

    for (const key of nestedKeys) {
        if (data?.[key]) {
            const found = extractDownloadUrl(data[key]);

            if (found) {
                return found;
            }
        }
    }

    return null;
}

/* =========================
   TITLE EXTRACTOR
========================= */

function extractTitle(data, fallback = 'Drama Video') {
    if (!data) return fallback;

    const objects = [
        data,
        data.result,
        data.data,
        data.response
    ];

    for (const obj of objects) {
        if (!obj || typeof obj !== 'object') continue;

        const title =
            obj.title ||
            obj.name ||
            obj.filename ||
            obj.fileName;

        if (title && typeof title === 'string') {
            return title;
        }
    }

    return fallback;
}

/* =========================
   1. DARK SHAN
========================= */

async function darkShanAPI(url) {
    const apiUrl =
        `https://api-dark-shan-yt.koyeb.app/download/ytmp4?url=${encodeURIComponent(url)}&apikey=72209ca3742e5a36`;

    const response = await axios.get(apiUrl, AXIOS_CONFIG);
    const data = response.data;

    const videoUrl = extractDownloadUrl(data);

    if (!videoUrl) {
        throw new Error('Dark Shan returned no video URL');
    }

    return {
        video_url: videoUrl,
        title: extractTitle(data)
    };
}

/* =========================
   2. CYPHERX
========================= */

async function cypherXAPI(url) {
    const apiUrl =
        `https://media.cypherxbot.space/download/youtube/video?url=${encodeURIComponent(url)}`;

    const response = await axios.get(apiUrl, AXIOS_CONFIG);
    const data = response.data;

    const videoUrl = extractDownloadUrl(data);

    if (!videoUrl) {
        throw new Error('CypherX returned no video URL');
    }

    return {
        video_url: videoUrl,
        title: extractTitle(data)
    };
}

/* =========================
   3. PRINCE TECH
========================= */

async function princeTechAPI(url) {
    const apiUrl =
        `https://api.princetechn.com/api/download/ytvideo?url=${encodeURIComponent(url)}&apikey=prince`;

    const response = await axios.get(apiUrl, AXIOS_CONFIG);
    const data = response.data;

    const videoUrl = extractDownloadUrl(data);

    if (!videoUrl) {
        throw new Error('PrinceTech returned no video URL');
    }

    return {
        video_url: videoUrl,
        title: extractTitle(data)
    };
}

/* =========================
   4. KEITH / DAVID
========================= */

async function keithDavidAPI(url) {
    const apis = [
        `https://apiskeith.top/download/video?url=${encodeURIComponent(url)}`,

        `https://apiskeith.top/download/ytmp4?url=${encodeURIComponent(url)}`,

        `https://apis.davidcyril.name.ng/download/ytmp4?url=${encodeURIComponent(url)}`,

        `https://apis.davidcyril.name.ng/youtube/mp4?url=${encodeURIComponent(url)}`
    ];

    let lastError = null;

    for (const apiUrl of apis) {
        try {
            const response = await axios.get(
                apiUrl,
                AXIOS_CONFIG
            );

            const data = response.data;

            const videoUrl = extractDownloadUrl(data);

            if (!videoUrl) {
                continue;
            }

            return {
                video_url: videoUrl,
                title: extractTitle(data)
            };

        } catch (error) {
            lastError = error;
        }
    }

    throw lastError || new Error('Keith/David APIs failed');
}

/* =========================
   5. DIRECT YOUTUBE
========================= */

async function directYouTubeAPI(url) {
    if (!ytdl) {
        throw new Error(
            '@distube/ytdl-core or ytdl-core is not installed'
        );
    }

    const info = await ytdl.getInfo(url);

    let format = null;

    try {
        format = ytdl.chooseFormat(
            info.formats,
            {
                quality: 'highest',
                filter: 'audioandvideo'
            }
        );
    } catch {}

    if (!format) {
        try {
            format = ytdl.chooseFormat(
                info.formats,
                {
                    quality: 'highestvideo',
                    filter: 'videoandaudio'
                }
            );
        } catch {}
    }

    if (!format?.url) {
        throw new Error('No direct YouTube format found');
    }

    return {
        video_url: format.url,
        title: info.videoDetails?.title || 'Drama Video'
    };
}

/* =========================
   DOWNLOAD VIDEO
========================= */

async function downloadVideo(videoUrl) {
    if (!videoUrl) {
        throw new Error('Invalid video URL');
    }

    const response = await axios.get(videoUrl, {
        responseType: 'arraybuffer',
        timeout: 120000,
        maxContentLength: MAX_FILE_SIZE,
        maxBodyLength: MAX_FILE_SIZE,
        maxRedirects: 5,
        headers: {
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
            'Accept': '*/*'
        },
        validateStatus: status =>
            status >= 200 && status < 400
    });

    const buffer = Buffer.from(response.data);

    if (!buffer.length) {
        throw new Error('Empty video response');
    }

    if (buffer.length > MAX_FILE_SIZE) {
        throw new Error('Video file too large');
    }

    return buffer;
}

/* =========================
   API + DOWNLOAD FALLBACK
========================= */

async function fetchDownloadData(url) {

    const apis = [
        {
            name: 'Dark Shan',
            fn: () => darkShanAPI(url)
        },
        {
            name: 'CypherX',
            fn: () => cypherXAPI(url)
        },
        {
            name: 'PrinceTech',
            fn: () => princeTechAPI(url)
        },
        {
            name: 'Keith / David',
            fn: () => keithDavidAPI(url)
        },
        {
            name: 'Direct YouTube',
            fn: () => directYouTubeAPI(url)
        }
    ];

    let lastError = null;

    for (const api of apis) {

        try {

            console.log(
                `[DRAMA] 🔄 Trying ${api.name}...`
            );

            const data = await api.fn();

            if (!data?.video_url) {
                throw new Error(
                    `${api.name}: no video URL`
                );
            }

            console.log(
                `[DRAMA] 🔗 ${api.name} returned video URL`
            );

            try {

                const buffer = await downloadVideo(
                    data.video_url
                );

                if (!buffer?.length) {
                    throw new Error(
                        `${api.name}: empty video`
                    );
                }

                console.log(
                    `[DRAMA] ✅ ${api.name} download successful`
                );

                return {
                    buffer,
                    title: data.title || 'Drama Video'
                };

            } catch (downloadError) {

                console.log(
                    `[DRAMA] ❌ ${api.name} video download failed:`,
                    downloadError?.message || downloadError
                );

                lastError = downloadError;

                // Try next API
                continue;
            }

        } catch (error) {

            lastError = error;

            console.log(
                `[DRAMA] ❌ ${api.name} failed:`,
                error?.message || error
            );

            continue;
        }
    }

    throw lastError ||
        new Error('All drama download sources failed');
}

/* =========================
   MAIN COMMAND
========================= */

cmd(
    {
        pattern: "drama",
        alias: ["dramaep", "serial"],
        react: "🎬",
        desc: "Drama Video Downloader",
        category: "download",
        filename: __filename
    },

    async (
        conn,
        mek,
        m,
        {
            from,
            q,
            reply,
            prefix,
            command
        }
    ) => {

        try {

            if (!q) {
                return reply(
                    `🎬 *Usage:* ${prefix + command} drama name or episode\n\nExample:\n${prefix + command} Mere Humsafar Episode 1`
                );
            }

            await conn.sendMessage(from, {
                react: {
                    text: "🔍",
                    key: mek.key
                }
            });

            /* =========================
               FIND DRAMA
            ========================= */

            const normalizedUrl =
                normalizeYouTubeUrl(q);

            let ytdata;

            if (normalizedUrl) {

                const videoId =
                    normalizedUrl.split("v=")[1];

                try {

                    ytdata =
                        await yts({ videoId });

                } catch {

                    return reply(
                        "❌ This YouTube video could not be found."
                    );
                }

                if (
                    !ytdata ||
                    !isDramaVideo(ytdata)
                ) {
                    return reply(
                        "❌ Only drama/serial/episode videos are allowed in this command."
                    );
                }

            } else {

                try {

                    ytdata =
                        await searchDrama(q);

                } catch (error) {

                    console.log(
                        "[DRAMA SEARCH ERROR]:",
                        error?.message || error
                    );

                    return reply(
                        "❌ Drama search failed. Please try again."
                    );
                }

                if (!ytdata) {

                    return reply(
                        "❌ No drama found!\n\nPlease enter a drama name or episode, not a song/music video."
                    );
                }
            }

            /* =========================
               DRAMA CAPTION
            ========================= */

            const caption =
`🎬 *${ytdata.title}*

📺 *${ytdata.author?.name || 'Unknown'}*
⏱️ ${ytdata.timestamp || 'Unknown'}

📥 *Downloading Drama...*

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`;

            /* =========================
               SEND INFO
            ========================= */

            if (ytdata.thumbnail || ytdata.image) {

                await conn.sendMessage(
                    from,
                    {
                        image: {
                            url:
                                ytdata.thumbnail ||
                                ytdata.image
                        },
                        caption
                    },
                    {
                        quoted: mek
                    }
                );

            } else {

                await conn.sendMessage(
                    from,
                    {
                        text: caption
                    },
                    {
                        quoted: mek
                    }
                );
            }

            await conn.sendMessage(from, {
                react: {
                    text: "⏳",
                    key: mek.key
                }
            });

            /* =========================
               DOWNLOAD WITH FALLBACK
            ========================= */

            let dlData;

            try {

                dlData =
                    await fetchDownloadData(
                        normalizedUrl ||
                        ytdata.url
                    );

            } catch (error) {

                console.log(
                    "[DRAMA] ALL SOURCES FAILED:",
                    error?.message || error
                );

                if (
                    /large|size/i.test(
                        error?.message || ""
                    )
                ) {
                    return reply(
                        "📦 Drama video is too large to send on WhatsApp."
                    );
                }

                return reply(
                    "❌ Drama download sources are currently unavailable. Please try again later."
                );
            }

            if (!dlData?.buffer) {

                return reply(
                    "❌ Drama video could not be downloaded."
                );
            }

            /* =========================
               SEND AS DOCUMENT
            ========================= */

            const safeTitle =
                (dlData.title ||
                    ytdata.title ||
                    "Drama Video")
                    .replace(/[\\/:*?"<>|]/g, "")
                    .trim();

            await conn.sendMessage(
                from,
                {
                    document: dlData.buffer,
                    mimetype: "video/mp4",
                    fileName: `${safeTitle}.mp4`,
                    caption:
`🎬 *${dlData.title || ytdata.title}*

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`
                },
                {
                    quoted: mek
                }
            );

            await conn.sendMessage(from, {
                react: {
                    text: "✅",
                    key: mek.key
                }
            });

        } catch (e) {

            console.log(
                "DRAMA COMMAND ERROR:",
                e
            );

            await conn.sendMessage(from, {
                react: {
                    text: "❌",
                    key: mek.key
                }
            });

            return reply(
                "⚠️ Something went wrong while processing the drama."
            );
        }
    }
);
