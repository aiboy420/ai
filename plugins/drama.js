// drama.js - ESM Version
// NAWAZ MD - DRAMA VIDEO DOWNLOADER

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
    headers: {
        'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
    }
};

/**
 * Normalize YouTube URL
 */
function normalizeYouTubeUrl(url) {
    const match = url.match(
        /(?:youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/.*[?&]v=)([a-zA-Z0-9_-]{11})/
    );

    return match
        ? `https://youtube.com/watch?v=${match[1]}`
        : null;
}

/**
 * Drama keywords
 */
const DRAMA_KEYWORDS = [
    'drama',
    'episode',
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
    'part 1',
    'ost episode'
];

/**
 * Words that should NOT be accepted as drama
 */
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

/**
 * Check whether a result looks like a drama
 */
function isDramaVideo(video) {
    if (!video?.title) return false;

    const text = `${video.title} ${video.description || ''}`.toLowerCase();

    // Reject obvious music/video content
    for (const word of NON_DRAMA_KEYWORDS) {
        if (text.includes(word)) {
            return false;
        }
    }

    // Accept drama indicators
    for (const word of DRAMA_KEYWORDS) {
        if (text.includes(word)) {
            return true;
        }
    }

    return false;
}

/**
 * Search only drama results
 */
async function searchDrama(query) {
    const results = await yts(query);

    if (!results?.videos?.length) {
        return null;
    }

    // First try strict drama filtering
    const dramaResults = results.videos.filter(isDramaVideo);

    if (!dramaResults.length) {
        return null;
    }

    return dramaResults[0];
}

/**
 * Extract download URL
 */
function extractDownloadUrl(data) {
    if (!data) return null;

    const result = data.result || data.data || data;

    if (typeof result === 'string' && result.startsWith('http')) {
        return result;
    }

    return (
        result?.mp4 ||
        result?.download_url ||
        result?.download ||
        result?.url ||
        result?.link ||
        result?.video ||
        result?.video_url ||
        data?.download_url ||
        data?.url ||
        null
    );
}

/**
 * 1. Dark Shan API
 */
async function darkShanAPI(url) {
    const apiUrl =
        `https://api-dark-shan-yt.koyeb.app/download/ytmp4?url=${encodeURIComponent(url)}&apikey=72209ca3742e5a36`;

    const response = await axios.get(apiUrl, AXIOS_CONFIG);
    const data = response.data;

    const videoUrl = extractDownloadUrl(data);

    if (!videoUrl) {
        throw new Error('Dark Shan: video URL not found');
    }

    const result = data.result || data.data || {};

    return {
        video_url: videoUrl,
        title: result?.title || data?.title || 'Drama Video'
    };
}

/**
 * 2. CypherX API
 */
async function cypherXAPI(url) {
    const apiUrl =
        `https://media.cypherxbot.space/download/youtube/video?url=${encodeURIComponent(url)}`;

    const response = await axios.get(apiUrl, AXIOS_CONFIG);
    const data = response.data;

    if (!data?.success || !data?.result?.download_url) {
        throw new Error('CypherX: video URL not found');
    }

    return {
        video_url: data.result.download_url,
        title: data.result.title || 'Drama Video'
    };
}

/**
 * 3. PrinceTech API
 */
async function princeTechAPI(url) {
    const apiUrl =
        `https://api.princetechn.com/api/download/ytvideo?url=${encodeURIComponent(url)}&apikey=prince`;

    const response = await axios.get(apiUrl, AXIOS_CONFIG);
    const data = response.data;

    if (!data?.success || !data?.result?.download_url) {
        throw new Error('PrinceTech: video URL not found');
    }

    return {
        video_url: data.result.download_url,
        title: data.result.title || 'Drama Video'
    };
}

/**
 * 4. Keith / David APIs
 */
async function keithAPI(url) {
    const apis = [
        `https://apiskeith.top/download/video?url=${encodeURIComponent(url)}`,
        `https://apiskeith.top/download/ytmp4?url=${encodeURIComponent(url)}`,
        `https://apis.davidcyril.name.ng/download/ytmp4?url=${encodeURIComponent(url)}`,
        `https://apis.davidcyril.name.ng/youtube/mp4?url=${encodeURIComponent(url)}`
    ];

    let lastError;

    for (const apiUrl of apis) {
        try {
            const response = await axios.get(apiUrl, AXIOS_CONFIG);
            const data = response.data;

            const videoUrl = extractDownloadUrl(data);

            if (!videoUrl) continue;

            const result = data.result || data.data || {};

            return {
                video_url: videoUrl,
                title: result?.title || data?.title || 'Drama Video'
            };

        } catch (error) {
            lastError = error;
        }
    }

    throw lastError || new Error('Keith/David APIs failed');
}

/**
 * 5. Direct YouTube fallback
 */
async function directYouTubeAPI(url) {
    if (!ytdl) {
        throw new Error('ytdl-core not installed');
    }

    const info = await ytdl.getInfo(url);

    const format =
        ytdl.chooseFormat(info.formats, {
            quality: 'highestvideo',
            filter: 'videoandaudio'
        }) ||
        ytdl.chooseFormat(info.formats, {
            quality: 'highest',
            filter: 'videoandaudio'
        });

    if (!format) {
        throw new Error('No YouTube video format found');
    }

    return {
        video_url: format.url,
        title: info.videoDetails?.title || 'Drama Video'
    };
}

/**
 * Download video
 */
async function downloadVideo(videoUrl) {
    const response = await axios.get(videoUrl, {
        responseType: 'arraybuffer',
        timeout: 120000,
        maxContentLength: MAX_FILE_SIZE,
        maxBodyLength: MAX_FILE_SIZE
    });

    const buffer = Buffer.from(response.data);

    if (!buffer.length) {
        throw new Error('Empty video file');
    }

    if (buffer.length > MAX_FILE_SIZE) {
        throw new Error('Video file too large');
    }

    return buffer;
}

/**
 * Multiple API fallback
 */
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
            fn: () => keithAPI(url)
        },
        {
            name: 'Direct YouTube',
            fn: () => directYouTubeAPI(url)
        }
    ];

    let lastError;

    for (const api of apis) {
        try {
            console.log(`[DRAMA] Trying ${api.name}...`);

            const data = await api.fn();

            if (data?.video_url) {
                console.log(`[DRAMA] ✅ ${api.name} resolved video`);
                return data;
            }

        } catch (error) {
            lastError = error;

            console.log(
                `[DRAMA] ❌ ${api.name} failed:`,
                error?.message || error
            );
        }
    }

    throw lastError || new Error('All drama download APIs failed');
}

// MAIN COMMAND
cmd(
    {
        pattern: "drama",
        alias: ["dramaep", "serial"],
        react: "🎬",
        desc: "Drama Video Downloader",
        category: "download",
        filename: __filename
    },

    async (conn, mek, m, { from, q, reply, prefix, command }) => {

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

            /**
             * If direct YouTube URL is provided,
             * verify that its title looks like a drama.
             */
            const normalizedUrl = normalizeYouTubeUrl(q);
            let ytdata;

            if (normalizedUrl) {

                const videoId = normalizedUrl.split("v=")[1];

                try {
                    ytdata = await yts({ videoId });
                } catch {
                    return reply(
                        "❌ This does not appear to be a drama video."
                    );
                }

                if (!ytdata || !isDramaVideo(ytdata)) {
                    return reply(
                        "❌ Only drama/serial/episode videos are allowed in this command."
                    );
                }

            } else {

                ytdata = await searchDrama(q);

                if (!ytdata) {
                    return reply(
                        "❌ No drama found!\n\nPlease enter a drama name or episode, not a song/music video."
                    );
                }
            }

            if (!ytdata) {
                return reply("❌ No drama found!");
            }

            // CLEAN DRAMA CAPTION
            const caption = `🎬 *${ytdata.title}*

📺 *${ytdata.author?.name || 'Unknown'}*
⏱️ ${ytdata.timestamp || 'Unknown'}

📥 *Downloading Drama...*

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`;

            // SEND DRAMA INFO
            if (ytdata.thumbnail || ytdata.image) {
                await conn.sendMessage(from, {
                    image: {
                        url: ytdata.thumbnail || ytdata.image
                    },
                    caption
                }, {
                    quoted: mek
                });
            } else {
                await conn.sendMessage(from, {
                    text: caption
                }, {
                    quoted: mek
                });
            }

            await conn.sendMessage(from, {
                react: {
                    text: "⏳",
                    key: mek.key
                }
            });

            // GET DOWNLOAD LINK
            let dlData;

            try {

                dlData = await fetchDownloadData(
                    normalizedUrl || ytdata.url
                );

            } catch (error) {

                console.log(
                    "[DRAMA] ALL APIs FAILED:",
                    error?.message || error
                );

                return reply(
                    "❌ All drama download sources are currently unavailable. Please try again."
                );
            }

            if (!dlData?.video_url) {
                return reply(
                    "❌ Drama video link not found or expired!"
                );
            }

            // DOWNLOAD VIDEO
            let videoBuffer;

            try {

                videoBuffer = await downloadVideo(
                    dlData.video_url
                );

            } catch (err) {

                console.log(
                    "DRAMA VIDEO DOWNLOAD ERROR:",
                    err?.message || err
                );

                if (/large|size/i.test(err?.message || "")) {
                    return reply(
                        "📦 Drama video is too large to send on WhatsApp."
                    );
                }

                return reply(
                    "❌ Drama video download failed. Please try again."
                );
            }

            // SEND DRAMA VIDEO
            await conn.sendMessage(from, {
                video: videoBuffer,
                mimetype: "video/mp4",
                caption: `🎬 *${dlData.title || ytdata.title}*

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`
            }, {
                quoted: mek
            });

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

            reply("⚠️ Something went wrong!");
        }
    }
);
