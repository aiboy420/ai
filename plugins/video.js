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

async function fetchDownloadData(url) {

    const API_URL =
        'https://api-dark-shan-yt.koyeb.app/download/ytmp4';

    const API_KEY =
        '96f1fd99744e5c39';

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

    function findVideoUrl(obj) {

        if (!obj || typeof obj !== 'object') {
            return null;
        }

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

            if (
                typeof obj[key] === 'string' &&
                /^https?:\/\//i.test(obj[key])
            ) {
                return obj[key];
            }
        }

        for (const key of Object.keys(obj)) {

            const value = obj[key];

            if (
                value &&
                typeof value === 'object'
            ) {
                const result = findVideoUrl(value);

                if (result) {
                    return result;
                }
            }
        }

        return null;
    }

    const videoUrl = findVideoUrl(data);

    if (!videoUrl) {
        throw new Error(
            'No video URL found in Dark Shan API response'
        );
    }

    return {
        video_url: videoUrl,
        title:
            data?.result?.title ||
            data?.data?.title ||
            data?.title ||
            'YouTube Video'
    };
}

cmd({
    pattern: "video",
    alias: ["ytv", "ytmp4", "vd"],
    desc: "Download YouTube video",
    category: "download",
    react: "📹",
    filename: __filename
},
async (conn, mek, m, { from, text, reply }) => {

    try {

        if (!text) {
            return reply(
                "🎥 Please provide a video name or link!\n\n" +
                "Example: .video Alone Marshmello"
            );
        }

        const { default: yts } =
            await import('yt-search');

        let url = text;
        let vid = null;

        // YouTube URL
        if (
            text.startsWith('http://') ||
            text.startsWith('https://')
        ) {

            if (
                !text.includes("youtube.com") &&
                !text.includes("youtu.be")
            ) {
                return reply(
                    "❌ Please provide a valid YouTube URL!"
                );
            }

            const videoId = getVideoId(text);

            if (!videoId) {
                return reply(
                    "❌ Invalid YouTube URL!"
                );
            }

            vid = await yts({
                videoId
            });

        } else {

            // YouTube Search
            const search = await yts(text);

            if (!search?.videos?.length) {
                return reply(
                    "❌ No video results found!"
                );
            }

            vid = search.videos[0];
            url = vid.url;
        }

        if (!vid) {
            return reply(
                "❌ No results found!"
            );
        }

        // Thumbnail + Compact Info
        await conn.sendMessage(
            from,
            {
                image: {
                    url: vid.thumbnail
                },
                caption:
`🎬 *${vid.title}*

📺 *${vid.author?.name || 'Unknown'}*
⏱️ ${vid.timestamp || 'Unknown'}

📥 *Downloading Video...*`
            },
            {
                quoted: mek
            }
        );

        // Dark Shan API
        const result =
            await fetchDownloadData(url);

        if (!result?.video_url) {
            return reply(
                "❌ Video API failed! Please try again later."
            );
        }

        // Send Video
        await conn.sendMessage(
            from,
            {
                video: {
                    url: result.video_url
                },
                mimetype: 'video/mp4',
                fileName: `${vid.title}.mp4`,
                caption:
`🎬 *${vid.title}*

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`
            },
            {
                quoted: mek
            }
        );

        // Success
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
            "Error in .video command:",
            e.response?.data || e.message
        );

        await reply(
            "❌ Error occurred, please try again later!"
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
