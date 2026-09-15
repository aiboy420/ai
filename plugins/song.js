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
// COMMAND: play
// ============================================
cmd({
    pattern: "play",
    alias: ["audio"],
    desc: "Download YouTube audio",
    category: "download",
    react: "🎧",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) {
            return reply("❌ Please provide song name\nExample: .play Shape of You");
        }

        const { default: yts } = await import('yt-search');

        let url = text;
        let vid = null;

        if (text.startsWith('http://') || text.startsWith('https://')) {

            if (!text.includes("youtube.com") && !text.includes("youtu.be")) {
                return reply("❌ Please provide a valid YouTube URL!");
            }

            const videoId = getVideoId(text);

            if (!videoId) {
                return reply("❌ Invalid YouTube URL!");
            }

            vid = await yts({ videoId });

        } else {

            const search = await yts(text);

            if (!search.videos || !search.videos.length) {
                return reply("❌ No song found!");
            }

            vid = search.videos[0];
            url = vid.url;
        }

        if (!vid) {
            return reply("❌ No results found!");
        }

        await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption: `╭━━〔 *Play* 〕━━┈⊷
┃❖╭─────────────·๏
┃❖┃ Title: ${vid.title}
┃❖┃ Duration: ${vid.timestamp}
┃❖┃ Views: ${vid.views?.toLocaleString() || 'N/A'}
┃❖┃ Author: ${vid.author?.name || 'Unknown'}
┃❖┃ Status: Downloading...
┃❖└─────────────·๏
╰──────────────┈⊷

> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳*`
        }, { quoted: mek });

        // ============================================
        // ORIGINAL XJAWADTECH AUDIO APIs
        // ============================================

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

            if (success) break;

            try {

                const response = await axios.get(apiUrl, {
                    timeout: 15000
                });

                audioUrl =
                    response.data?.status &&
                    response.data?.download?.url
                        ? response.data.download.url
                        : null;

                if (audioUrl) {

                    await conn.sendMessage(from, {
                        audio: { url: audioUrl },
                        mimetype: "audio/mpeg",
                        fileName: `${vid.title}.mp3`,
                        ptt: false
                    }, { quoted: mek });

                    success = true;
                }

            } catch (e) {
                continue;
            }
        }

        if (!success) {
            return reply("❌ All download sources failed! Try again later.");
        }

        await conn.sendMessage(from, {
            react: { text: '✅', key: m.key }
        });

    } catch (err) {

        console.error("❌ PLAY ERROR:", err);

        await conn.sendMessage(from, {
            react: { text: '❌', key: m.key }
        });

        return reply("❌ Error occurred! Please try again later.");
    }
});


// ============================================
// COMMAND: song
// ============================================
cmd({
    pattern: "song",
    alias: ["yt", "ytdl"],
    desc: "Download YouTube song or video (interactive)",
    category: "download",
    react: "🎧",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {

    try {

        if (!text) {
            return reply(
                "🎶 Please provide a YouTube video name or link.\n\nExample: `.song Alone - Alan Walker`"
            );
        }

        const { default: yts } = await import('yt-search');

        let vid = null;

        if (text.startsWith('http://') || text.startsWith('https://')) {

            if (!text.includes("youtube.com") && !text.includes("youtu.be")) {
                return reply("❌ Please provide a valid YouTube URL!");
            }

            const videoId = getVideoId(text);

            if (!videoId) {
                return reply("❌ Invalid YouTube URL!");
            }

            vid = await yts({ videoId });

        } else {

            const search = await yts(text);

            if (!search.videos || !search.videos.length) {
                return reply("❌ No results found!");
            }

            vid = search.videos[0];
        }

        if (!vid) {
            return reply("❌ No results found!");
        }

        const caption = `╭━━〔 *Song* 〕━━┈⊷
┃❖╭─────────────·๏
┃❖┃ Title: ${vid.title}
┃❖┃ Channel: ${vid.author?.name || 'Unknown'}
┃❖┃ Duration: ${vid.timestamp}
┃❖┃ Views: ${vid.views?.toLocaleString() || 'N/A'}
┃❖└─────────────·๏
╰──────────────┈⊷

> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳*

╭━━〔 *Select Format* 〕━━┈⊷
┃❖╭─────────────·๏
┃❖┃ 1 🎧 Audio (MP3)
┃❖┃ 2 📹 Video (MP4)
┃❖└─────────────┈⊷
╰──────────────┈⊷`;

        const sent = await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption
        }, { quoted: mek });

        const msgId = sent.key.id;

        const songListener = async (msgData) => {

            try {

                const received = msgData.messages[0];

                if (!received?.message) return;

                const selected =
                    received.message.conversation ||
                    received.message.extendedTextMessage?.text;

                const replyToBot =
                    received.message.extendedTextMessage?.contextInfo?.stanzaId === msgId;

                if (!replyToBot) return;

                conn.ev.off("messages.upsert", songListener);

                await conn.sendMessage(from, {
                    react: { text: '⬇️', key: received.key }
                });

                // ============================================
                // AUDIO - ORIGINAL XJAWADTECH APIs
                // ============================================
                if (selected === "1") {

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

                        if (success) break;

                        try {

                            const response = await axios.get(apiUrl, {
                                timeout: 15000
                            });

                            audioUrl =
                                response.data?.status &&
                                response.data?.download?.url
                                    ? response.data.download.url
                                    : null;

                            if (audioUrl) {

                                await conn.sendMessage(from, {
                                    audio: { url: audioUrl },
                                    mimetype: "audio/mpeg",
                                    fileName: `${vid.title}.mp3`,
                                    ptt: false
                                }, { quoted: received });

                                success = true;
                            }

                        } catch (e) {
                            continue;
                        }
                    }

                    if (!success) {
                        return await conn.sendMessage(from, {
                            text: "❌ All audio sources failed! Try again later."
                        }, { quoted: received });
                    }

                    await conn.sendMessage(from, {
                        react: { text: '✅', key: received.key }
                    });

                    return;
                }

                // ============================================
                // VIDEO - ORIGINAL XJAWADTECH APIs
                // ============================================
                if (selected === "2") {

                    let videoUrl = null;
                    let success = false;

                    const videoAPIs = [
                        `${API_BASE}/ytv1?url=${encodeURIComponent(vid.url)}`,
                        `${API_BASE}/ytv2?url=${encodeURIComponent(vid.url)}`,
                        `${API_BASE}/ytv3?url=${encodeURIComponent(vid.url)}`,
                        `${API_BASE}/ytv4?url=${encodeURIComponent(vid.url)}`
                    ];

                    for (const apiUrl of videoAPIs) {

                        if (success) break;

                        try {

                            const response = await axios.get(apiUrl, {
                                timeout: 15000
                            });

                            videoUrl =
                                response.data?.status &&
                                response.data?.download?.url
                                    ? response.data.download.url
                                    : null;

                            if (videoUrl) {

                                await conn.sendMessage(from, {
                                    video: { url: videoUrl },
                                    caption: `╭━━〔 *Video* 〕━━┈⊷
┃❖╭─────────────·๏
┃❖┃ Title: ${vid.title}
┃❖└─────────────·๏
╰──────────────┈⊷

> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳*`
                                }, { quoted: received });

                                success = true;
                            }

                        } catch (e) {
                            continue;
                        }
                    }

                    if (!success) {
                        return await conn.sendMessage(from, {
                            text: "❌ All video sources failed! Try again later."
                        }, { quoted: received });
                    }

                    await conn.sendMessage(from, {
                        react: { text: '✅', key: received.key }
                    });

                    return;
                }

                // ============================================
                // INVALID SELECTION
                // ============================================
                await conn.sendMessage(from, {
                    text: `❌ *Invalid selection!*

Please reply with:
1️⃣ for Audio (MP3)
2️⃣ for Video (MP4)`
                }, { quoted: received });

            } catch (listenerError) {

                console.error("SONG LISTENER ERROR:", listenerError);
            }
        };

        conn.ev.on("messages.upsert", songListener);

        setTimeout(() => {
            conn.ev.off("messages.upsert", songListener);
        }, 20000);

    } catch (e) {

        console.error("SONG ERROR:", e);

        await conn.sendMessage(from, {
            react: { text: '❌', key: m.key }
        });

        return reply("❌ Error: " + e.message);
    }
});
