//---------------------------------------------------------------------------
//           KHAN-MD - YOUTUBE DOWNLOADER
//---------------------------------------------------------------------------
//  🚀 DOWNLOAD VIDEOS AND AUDIO USING JAWADTECH APIs
//---------------------------------------------------------------------------

import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const API_BASE = "https://xjawadtech.vercel.app";

// Small caps font helper
const toSmallCaps = (text) => {
    const map = {
        'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ', 'j': 'ᴊ',
        'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ', 's': 's', 't': 'ᴛ',
        'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ'
    };
    return text.split('').map(c => map[c.toLowerCase()] || c).join('');
};

// Helper to extract YouTube video ID
function getVideoId(url) {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
}

// ============================================
// COMMAND: play (Audio Only) - With Fallback
// ============================================
cmd({
    pattern: "play",
    alias: ["song", "music", "audio"],
    desc: "Download YouTube audio",
    category: "download",
    react: "🎧",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) return reply("❌ Please provide song name\nExample: .play Shape of You");

        // YouTube search
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
                return reply("❌ No song found!");
            }
            vid = search.videos[0];
            url = vid.url;
        }

        if (!vid) return reply("❌ No results found!");

        await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption: `╭━━〔 *Play* 〕━━┈⊷
┃❖╭─────────────·๏
┃❖┃ Title: ${vid.title}
┃❖┃ Duration: ${vid.timestamp}
┃❖┃ Views: ${vid.views?.toLocaleString() || 'N/A'}
┃❖┃ Author: ${vid.author?.name || 'Unknown'}
┃❖┃ Status: Downloading...
┃❖└───────────┈⊷
╰──────────────┈⊷

> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳*`
        }, { quoted: mek });

        let audioUrl = null;
        let success = false;

        const audioAPIs = [
            `${API_BASE}/yta6?url=${encodeURIComponent(url)}`,
            `${API_BASE}/yta7?url=${encodeURIComponent(url)}`,
            `${API_BASE}/yta1?url=${encodeURIComponent(url)}`,
            `${API_BASE}/yta2?url=${encodeURIComponent(url)}`,
            `${API_BASE}/yta3?url=${encodeURIComponent(url)}`,
            `${API_BASE}/yta4?url=${encodeURIComponent(url)}`,
            `${API_BASE}/yta5?url=${encodeURIComponent(url)}`
        ];

        for (const apiUrl of audioAPIs) {
            if (!success) {
                try {
                    const response = await axios.get(apiUrl, { timeout: 15000 });
                    audioUrl = response.data?.status && response.data?.download?.url ? response.data.download.url : null;
                    if (audioUrl) {
                        await conn.sendMessage(from, {
                            audio: { url: audioUrl },
                            mimetype: "audio/mpeg",
                            fileName: `${vid.title}.mp3`,
                            ptt: false
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
            return reply("❌ All download sources failed! Try again later.");
        }

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error("❌ PLAY ERROR:", err);
        reply("❌ Error occurred! Please try again later.");
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});

// ============================================
// COMMAND: video (Video Download) - With Fallback
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
                    videoUrl = response.data?.status && response.data?.download?.url ? response.data.download.url : null;
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

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("Error in .video command:", e);
        reply("❌ Error occurred, please try again later!");
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});

// ============================================
// COMMAND: song (Interactive - Choose Audio/Video)
// ============================================
cmd({
    pattern: "song",
    alias: ["yt", "music", "ytdl"],
    desc: "Download YouTube song or video (interactive)",
    category: "download",
    react: "🎧",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) return reply("🎶 Please provide a YouTube video name or link.\n\nExample: `.song Alone - Alan Walker`");

        // YouTube search
        const { default: yts } = await import('yt-search');
        
        let vid = null;

        if (text.startsWith('http://') || text.startsWith('https://')) {
            if (!text.includes("youtube.com") && !text.includes("youtu.be")) {
                return reply("❌ Please provide a valid YouTube URL!");
            }
            const videoId = getVideoId(text);
            if (!videoId) return reply("❌ Invalid YouTube URL!");
            vid = await yts({ videoId: videoId });
        } else {
            const search = await yts(text);
            if (!search.videos || !search.videos.length) {
                return reply("❌ No results found!");
            }
            vid = search.videos[0];
        }

        if (!vid) return reply("❌ No results found!");

        const caption = `╭━━〔 *Song* 〕━━┈⊷
┃❖╭─────────────·๏
┃❖┃ Title: ${vid.title}
┃❖┃ Channel: ${vid.author?.name || 'Unknown'}
┃❖┃ Duration: ${vid.timestamp}
┃❖┃ Views: ${vid.views?.toLocaleString() || 'N/A'}
┃❖└───────────┈⊷
╰──────────────┈⊷

> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳*

╭━━〔 *Select Format* 〕━━┈⊷
┃❖╭─────────────·๏
┃❖┃ 1 🎧 Audio (MP3)
┃❖┃ 2 📹 Video (MP4)
┃❖└───────────┈⊷
╰──────────────┈⊷`;

        const sent = await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption
        }, { quoted: mek });

        const msgId = sent.key.id;
        
        const songListener = async (msgData) => {
            const received = msgData.messages[0];
            if (!received.message) return;

            const selected = received.message.conversation || received.message.extendedTextMessage?.text;
            const replyToBot = received.message.extendedTextMessage?.contextInfo?.stanzaId === msgId;

            if (replyToBot) {
                conn.ev.off("messages.upsert", songListener);
                await conn.sendMessage(from, { react: { text: '⬇️', key: received.key } });

                if (selected === "1" || selected === "2") {
                    const type = selected === "1" ? "mp3" : "mp4";

                    if (type === "mp3") {
                        let audioUrl = null;
                        let success = false;

                        const audioAPIs = [
                            `${API_BASE}/yta6?url=${encodeURIComponent(vid.url)}`,
                            `${API_BASE}/yta7?url=${encodeURIComponent(vid.url)}`,
                            `${API_BASE}/yta1?url=${encodeURIComponent(vid.url)}`,
                            `${API_BASE}/yta2?url=${encodeURIComponent(vid.url)}`,
                            `${API_BASE}/yta3?url=${encodeURIComponent(vid.url)}`,
                            `${API_BASE}/yta4?url=${encodeURIComponent(vid.url)}`,
                            `${API_BASE}/yta5?url=${encodeURIComponent(vid.url)}`
                        ];

                        for (const apiUrl of audioAPIs) {
                            if (!success) {
                                try {
                                    const response = await axios.get(apiUrl, { timeout: 15000 });
                                    audioUrl = response.data?.status && response.data?.download?.url ? response.data.download.url : null;
                                    if (audioUrl) {
                                        await conn.sendMessage(from, {
                                            audio: { url: audioUrl },
                                            mimetype: "audio/mpeg",
                                            fileName: `${vid.title}.mp3`,
                                            ptt: false
                                        }, { quoted: received });
                                        success = true;
                                        break;
                                    }
                                } catch (e) {
                                    continue;
                                }
                            }
                        }

                        if (!success) {
                            return await conn.sendMessage(from, { 
                                text: "❌ All audio sources failed! Try again later." 
                            }, { quoted: received });
                        }

                    } else {
                        let videoUrl = null;
                        let success = false;

                        const videoAPIs = [
                            `${API_BASE}/ytv1?url=${encodeURIComponent(vid.url)}`,
                            `${API_BASE}/ytv2?url=${encodeURIComponent(vid.url)}`,
                            `${API_BASE}/ytv3?url=${encodeURIComponent(vid.url)}`,
                            `${API_BASE}/ytv4?url=${encodeURIComponent(vid.url)}`
                        ];

                        for (const apiUrl of videoAPIs) {
                            if (!success) {
                                try {
                                    const response = await axios.get(apiUrl, { timeout: 15000 });
                                    videoUrl = response.data?.status && response.data?.download?.url ? response.data.download.url : null;
                                    if (videoUrl) {
                                        await conn.sendMessage(from, {
                                            video: { url: videoUrl },
                                            caption: `╭━━〔 *Video* 〕━━┈⊷
┃❖╭─────────────·๏
┃❖┃ Title: ${vid.title}
┃❖└───────────┈⊷
╰──────────────┈⊷

> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳*`
                                        }, { quoted: received });
                                        success = true;
                                        break;
                                    }
                                } catch (e) {
                                    continue;
                                }
                            }
                        }

                        if (!success) {
                            return await conn.sendMessage(from, { 
                                text: "❌ All video sources failed! Try again later." 
                            }, { quoted: received });
                        }
                    }

                    await conn.sendMessage(from, { react: { text: '✅', key: received.key } });
                } else {
                    await conn.sendMessage(from, {
                        text: `❌ *Invalid selection!*\nPlease reply with:\n1️⃣ for Audio (MP3)\n2️⃣ for Video (MP4)`
                    }, { quoted: received });
                }
            }
        };
        
        conn.ev.on("messages.upsert", songListener);
        
        setTimeout(() => {
            conn.ev.off("messages.upsert", songListener);
        }, 20000);

    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e.message}`);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});

// ============================================
// COMMAND: yts (Search)
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
        if (!text) return reply('*Please provide search words!*\n\nExample: .yts Alan Walker Faded');

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
┃❖└───────────┈⊷
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
        
        await conn.sendMessage(from, { text: mesaj.trim() }, { quoted: mek });

    } catch (e) {
        console.error('Error in yts command:', e);
        reply(`*Error occurred while searching!*\n\`\`\`${e.message}\`\`\``);
    }
});
