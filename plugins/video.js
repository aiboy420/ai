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

async function downloadVideo(url) {
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

    console.log('DARK SHAN API RESPONSE:', JSON.stringify(data, null, 2));

    const videoUrl =
        data?.result?.download_url ||
        data?.result?.downloadUrl ||
        data?.result?.video_url ||
        data?.result?.videoUrl ||
        data?.result?.url ||
        data?.data?.download_url ||
        data?.data?.downloadUrl ||
        data?.data?.video_url ||
        data?.data?.videoUrl ||
        data?.data?.url ||
        data?.download_url ||
        data?.downloadUrl ||
        data?.video_url ||
        data?.videoUrl ||
        data?.url;

    if (!videoUrl) {
        throw new Error(
            'API response does not contain a video URL'
        );
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
                '🎥 *Please provide a YouTube video name or link!*\n\n' +
                'Example:\n' +
                '`.video Alone Marshmello`'
            );
        }

        const { default: yts } = await import('yt-search');

        let url = text.trim();
        let video = null;

        // =========================
        // DIRECT YOUTUBE URL
        // =========================

        if (
            url.startsWith('http://') ||
            url.startsWith('https://')
        ) {

            if (
                !url.includes('youtube.com') &&
                !url.includes('youtu.be')
            ) {
                return reply(
                    '❌ *Please provide a valid YouTube URL!*'
                );
            }

            const videoId = getVideoId(url);

            if (!videoId) {
                return reply(
                    '❌ *Invalid YouTube URL!*'
                );
            }

            video = await yts({
                videoId: videoId
            });

        } else {

            // =========================
            // YOUTUBE SEARCH
            // =========================

            const search = await yts(text);

            if (
                !search ||
                !search.videos ||
                !search.videos.length
            ) {
                return reply(
                    '❌ *No YouTube video found!*'
                );
            }

            video = search.videos[0];
            url = video.url;
        }

        if (!video) {
            return reply(
                '❌ *Video information not found!*'
            );
        }

        // =========================
        // DOWNLOAD MESSAGE
        // =========================

        await conn.sendMessage(
            from,
            {
                image: {
                    url: video.thumbnail
                },
                caption:
`*╭─❍══ ⃟ ⃟ ⃟   𝙽𝙰𝚆𝙰𝚉 𝙼𝙳   ⃟ ⃟ ⃟══⊷❍*
┇◆╭┉┉┉┉┉┉┉┉┉┉━┈᛭
┇◆┋📹 *𝐕𝐈𝐃𝐄𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑*
┇◆┋
┇◆┋🎬 *Title:* ${video.title}
┇◆┋📺 *Channel:* ${video.author?.name || 'Unknown'}
┇◆┋⏱️ *Duration:* ${video.timestamp || 'Unknown'}
┇◆┋📥 *Status:* Downloading...
┇◆╰┉┉┉┉┉┉┉┉┉━┈⊷
╰═══════════════════⍟

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`
            },
            {
                quoted: mek
            }
        );

        // =========================
        // CALL DARK SHAN API
        // =========================

        const result = await downloadVideo(url);

        if (!result?.url) {
            throw new Error(
                'No video URL received from API'
            );
        }

        // =========================
        // SEND VIDEO
        // =========================

        await conn.sendMessage(
            from,
            {
                video: {
                    url: result.url
                },
                mimetype: 'video/mp4',
                fileName: `${result.title}.mp4`,
                caption:
`🎬 *${video.title}*

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`
            },
            {
                quoted: mek
            }
        );

        // =========================
        // SUCCESS REACTION
        // =========================

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
            'The API could not download this video. Please try again.'
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
