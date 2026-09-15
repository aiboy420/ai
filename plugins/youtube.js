import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const API_BASE = "https://xjawadtech.vercel.app";

function getVideoId(url) {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
}

// ============================================
// COMMAND: video
// ============================================
cmd({
    pattern: "video",
    alias: ["ytv", "ytmp4", "vd"],
    desc: "Download YouTube video",
    category: "download",
    react: "📹",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) return reply("🎥 Please provide a video name or link!\n\nExample: `.video Alone Marshmello`");

        const { default: yts } = await import('yt-search');

        let url = text;
        let vid = null;

        if (text.startsWith('http://') || text.startsWith('https://')) {
            if (!text.includes("youtube.com") && !text.includes("youtu.be")) {
                return reply("❌ Please provide a valid YouTube URL!");
            }

            const videoId = getVideoId(text);
            if (!videoId) return reply("❌ Invalid YouTube URL!");

            const searchFromUrl = await yts({ videoId: videoId });
            vid = searchFromUrl;
        } else {
            const search = await yts(text);

            if (!search.videos || !search.videos.length) {
                return reply("❌ No video results found!");
            }

            vid = search.videos[0];
            url = vid.url;
        }

        if (!vid) return reply("❌ No results found!");

        await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption: `╭━━〔 *Video* 〕━━┈⊷
┃❖╭─────────────·๏
┃❖┃ Title: ${vid.title}
┃❖┃ Channel: ${vid.author?.name || 'Unknown'}
┃❖┃ Duration: ${vid.timestamp}
┃❖┃ Status: Downloading Video...
┃❖└───────────┈⊷
╰──────────────┈⊷

> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳*`
        }, { quoted: mek });

        let videoUrl = null;
        let success = false;

        const videoAPIs = [
            `${API_BASE}/ytv1?url=${encodeURIComponent(url)}`,
            `${API_BASE}/ytv2?url=${encodeURIComponent(url)}`,
            `${API_BASE}/ytv3?url=${encodeURIComponent(url)}`,
            `${API_BASE}/ytv4?url=${encodeURIComponent(url)}`
        ];

        for (const apiUrl of videoAPIs) {
            if (!success) {
                try {
                    const response = await axios.get(apiUrl, { timeout: 15000 });

                    videoUrl = response.data?.status &&
                        response.data?.download?.url
                        ? response.data.download.url
                        : null;

                    if (videoUrl) {
                        await conn.sendMessage(from, {
                            video: { url: videoUrl },
                            caption: `╭━━〔 *Video* 〕━━┈⊷
┃❖╭─────────────·๏
┃❖┃ Title: ${vid.title}
┃❖└───────────┈⊷
╰──────────────┈⊷

> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳*`
                        }, { quoted: mek });

                        success = true;
                        break;
                    }
                } catch (e) {
                    continue;
                }
            }
        }

        if (!success) {
            return reply("❌ All video sources failed! Try again later.");
        }

        await conn.sendMessage(from, {
            react: { text: '✅', key: m.key }
        });

    } catch (e) {
        console.error("Error in .video command:", e);

        reply("❌ Error occurred, please try again later!");

        await conn.sendMessage(from, {
            react: { text: '❌', key: m.key }
        });
    }
});

// ============================================
// COMMAND: yts
// ============================================
cmd({
    pattern: "yts",
    alias: ["ytsearch", "searchyt"],
    use: '.yts jawad',
    react: "🔎",
    desc: "Search YouTube and get video details",
    category: "search",
    filename: __filename
},
async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) {
            return reply('*Please provide search words!*\n\nExample: .yts Alan Walker Faded');
        }

        const { default: yts } = await import('yt-search');

        const search = await yts(text);

        if (!search.videos || !search.videos.length) {
            return reply('*No results found!*');
        }

        const results = search.videos.slice(0, 10);

        let mesaj = `╭━━〔 *YouTube Search* 〕━━┈⊷
┃❖╭─────────────·๏
┃❖┃ Query: ${text}
┃❖┃ Results: ${search.videos.length}
┃❖└─────────────·๏
╰──────────────┈⊷

`;

        results.forEach((video, i) => {
            mesaj += `╭━━〔 *${i + 1}* 〕━━┈⊷
┃❖╭─────────────·๏
┃❖┃ Title: ${video.title}
┃❖┃ URL: ${video.url}
┃❖┃ Duration: ${video.timestamp}
┃❖┃ Views: ${video.views?.toLocaleString() || 'N/A'}
┃❖┃ Channel: ${video.author?.name || 'Unknown'}
┃❖└───────────┈⊷
╰──────────────┈⊷

`;
        });

        mesaj += `> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳*`;

        await conn.sendMessage(
            from,
            { text: mesaj.trim() },
            { quoted: mek }
        );

    } catch (e) {
        console.error('Error in yts command:', e);

        reply(`*Error occurred while searching!*\n\`\`\`${e.message}\`\`\``);
    }
});
