import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);

const API_URL = 'https://api-dark-shan-yt.koyeb.app/download/ytmp4';
const API_KEY = '96f1fd99744e5c39';

function getVideoId(url) {
    const match = url.match(
        /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    );
    return match ? match[1] : null;
}

function findVideoUrl(obj) {
    if (!obj || typeof obj !== 'object') return null;

    const keys = [
        'url',
        'download_url',
        'downloadUrl',
        'video_url',
        'videoUrl',
        'download',
        'video',
        'link'
    ];

    for (const key of keys) {
        if (typeof obj[key] === 'string' &&
            /^https?:\/\//i.test(obj[key])) {
            return obj[key];
        }
    }

    for (const key of Object.keys(obj)) {
        const value = obj[key];

        if (value && typeof value === 'object') {
            const result = findVideoUrl(value);

            if (result) return result;
        }
    }

    return null;
}

async function getVideo(url) {

    const response = await axios.get(API_URL, {
        params: {
            url: url,
            apikey: API_KEY
        },
        timeout: 60000,
        headers: {
            Accept: 'application/json'
        }
    });

    const data = response.data;

    console.log(
        'DARK SHAN RESPONSE:',
        JSON.stringify(data, null, 2)
    );

    const videoUrl = findVideoUrl(data);

    if (!videoUrl) {
        throw new Error('No video URL found in API response');
    }

    return {
        url: videoUrl,
        title:
            data?.result?.title ||
            data?.data?.title ||
            data?.title ||
            'YouTube Video'
    };
}

cmd({
    pattern: 'video',
    alias: ['ytv', 'ytmp4', 'vd'],
    desc: 'Download YouTube video',
    category: 'download',
    react: '📹',
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {

    try {

        if (!text) {
            return reply(
                '🎥 *Please provide YouTube video name or link!*\n\n' +
                'Example:\n' +
                '`.video Alone Marshmello`'
            );
        }

        const { default: yts } = await import('yt-search');

        let url = text.trim();
        let vid;

        if (
            url.startsWith('http://') ||
            url.startsWith('https://')
        ) {

            if (
                !url.includes('youtube.com') &&
                !url.includes('youtu.be')
            ) {
                return reply('❌ *Please provide a valid YouTube URL!*');
            }

            const videoId = getVideoId(url);

            if (!videoId) {
                return reply('❌ *Invalid YouTube URL!*');
            }

            vid = await yts({ videoId });

        } else {

            const search = await yts(text);

            if (!search?.videos?.length) {
                return reply('❌ *No video results found!*');
            }

            vid = search.videos[0];
            url = vid.url;
        }

        if (!vid) {
            return reply('❌ *Video not found!*');
        }

        await conn.sendMessage(
            from,
            {
                image: {
                    url: vid.thumbnail
                },
                caption:
`*╭─❍══ ⃟ ⃟ ⃟   𝙽𝙰𝚆𝙰𝚉 𝙼𝙳   ⃟ ⃟ ⃟══⊷❍*
┇◆╭┉┉┉┉┉┉┉┉┉┉━┈᛭
┇◆┋📹 *𝐕𝐈𝐃𝐄𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑*
┇◆┋
┇◆┋🎬 *Title:* ${vid.title}
┇◆┋📺 *Channel:* ${vid.author?.name || 'Unknown'}
┇◆┋⏱️ *Duration:* ${vid.timestamp || 'Unknown'}
┇◆┋📥 *Status:* Downloading...
┇◆╰┉┉┉┉┉┉┉┉┉━┈⊷
╰═══════════════════⍟

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`
            },
            { quoted: mek }
        );

        const result = await getVideo(url);

        await conn.sendMessage(
            from,
            {
                video: {
                    url: result.url
                },
                mimetype: 'video/mp4',
                fileName: `${result.title}.mp4`,
                caption:
`🎬 *${vid.title}*

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`
            },
            { quoted: mek }
        );

        await conn.sendMessage(
            from,
            {
                react: {
                    text: '✅',
                    key: m.key
                }
            }
        );

    } catch (error) {

        console.error(
            'DARK SHAN VIDEO ERROR:',
            error.response?.data || error.message
        );

        await reply(
            '❌ *Video Download Failed!*\n\n' +
            'API response does not contain a usable video link.'
        );

        await conn.sendMessage(
            from,
            {
                react: {
                    text: '❌',
                    key: m.key
                }
            }
        );
    }
});
