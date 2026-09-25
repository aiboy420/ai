import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);

function getVideoId(url) {
    const match = url.match(
        /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    );

    return match ? match[1] : null;
}

async function fetchVideo(url) {
    const API_URL = 'https://api-dark-shan-yt.koyeb.app/download/ytmp4';
    const API_KEY = '96f1fd99744e5c39';

    const response = await axios.get(API_URL, {
        params: {
            url: url,
            apikey: API_KEY
        },
        timeout: 60000
    });

    const data = response.data;

    console.log('Dark Shan API Response:', data);

    const videoUrl =
        data?.result?.download_url ||
        data?.result?.url ||
        data?.result?.video_url ||
        data?.download_url ||
        data?.downloadUrl ||
        data?.video_url ||
        data?.url;

    const title =
        data?.result?.title ||
        data?.title ||
        'YouTube Video';

    if (!videoUrl) {
        throw new Error('Video URL not found in API response');
    }

    return {
        video_url: videoUrl,
        title: title
    };
}

cmd({
    pattern: "video",
    alias: ["ytv", "ytmp4", "vd"],
    desc: "Download YouTube video",
    category: "download",
    react: "📹",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {

    try {

        if (!text) {
            return reply(
                "🎥 *Please provide a YouTube video name or link!*\n\n" +
                "Example:\n" +
                "`.video Alone Marshmello`"
            );
        }

        const { default: yts } = await import('yt-search');

        let url = text.trim();
        let vid = null;

        // Direct YouTube URL
        if (
            url.startsWith('http://') ||
            url.startsWith('https://')
        ) {

            if (
                !url.includes('youtube.com') &&
                !url.includes('youtu.be')
            ) {
                return reply(
                    "❌ *Please provide a valid YouTube URL!*"
                );
            }

            const videoId = getVideoId(url);

            if (!videoId) {
                return reply(
                    "❌ *Invalid YouTube URL!*"
                );
            }

            vid = await yts({ videoId });

        } else {

            // Search YouTube
            const search = await yts(text);

            if (!search?.videos?.length) {
                return reply(
                    "❌ *No video results found!*"
                );
            }

            vid = search.videos[0];
            url = vid.url;
        }

        if (!vid) {
            return reply(
                "❌ *No video results found!*"
            );
        }

        // Sending download information
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
┇◆┋📥 *Status:* Downloading Video...
┇◆╰┉┉┉┉┉┉┉┉┉━┈⊷
╰═══════════════════⍟

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`
            },
            { quoted: mek }
        );

        // Download video
        const result = await fetchVideo(url);

        if (!result?.video_url) {
            return reply(
                "❌ *Video download failed!*\n\nPlease try again later."
            );
        }

        // Send video
        await conn.sendMessage(
            from,
            {
                video: {
                    url: result.video_url
                },
                mimetype: 'video/mp4',
                caption:
`🎬 *${vid.title}*

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`
            },
            { quoted: mek }
        );

        // Success reaction
        await conn.sendMessage(
            from,
            {
                react: {
                    text: '✅',
                    key: m.key
                }
            }
        );

    } catch (e) {

        console.error(
            'Dark Shan Video API Error:',
            e.response?.data || e.message
        );

        await reply(
            "❌ *Video Download Failed!*\n\n" +
            "The API could not download this video. Please try again."
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
