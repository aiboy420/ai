import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);

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
        if (!text) return reply("❌ Please provide song name\nExample: .play Shape of You");

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

        // 🎧 NEW AUDIO API
        const apiUrl = `https://arslan-apis-v2.vercel.app/download/ytmp4?url=${encodeURIComponent(url)}`;

        const response = await axios.get(apiUrl, { timeout: 60000 });

        if (
            !response.data ||
            !response.data.status ||
            !response.data.result ||
            !response.data.result.download ||
            !response.data.result.download.url
        ) {
            return reply("❌ Audio Not Generated");
        }

        const audioUrl = response.data.result.download.url;
        const meta = response.data.result.metadata;
        const quality = response.data.result.download.quality || "128kbps";

        await conn.sendMessage(from, {
            audio: { url: audioUrl },
            mimetype: "audio/mpeg",
            fileName: `${meta?.title || vid.title || "song"}.mp3`,
            ptt: false
        }, { quoted: mek });

        await conn.sendMessage(from, {
            react: { text: '✅', key: m.key }
        });

    } catch (err) {
        console.error("❌ PLAY ERROR:", err);

        reply("❌ Error occurred! Please try again later.");

        await conn.sendMessage(from, {
            react: { text: '❌', key: m.key }
        });
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
        if (!text) return reply("🎶 Please provide a YouTube video name or link.\n\nExample: `.song Alone - Alan Walker`");

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
            const received = msgData.messages[0];
            if (!received.message) return;

            const selected =
                received.message.conversation ||
                received.message.extendedTextMessage?.text;

            const replyToBot =
                received.message.extendedTextMessage?.contextInfo?.stanzaId === msgId;

            if (replyToBot) {
                conn.ev.off("messages.upsert", songListener);

                await conn.sendMessage(from, {
                    react: { text: '⬇️', key: received.key }
                });

                if (selected === "1" || selected === "2") {

                    // ============================================
                    // AUDIO - NEW API
                    // ============================================
                    if (selected === "1") {

                        const apiUrl =
                            `https://arslan-apis-v2.vercel.app/download/ytmp4?url=${encodeURIComponent(vid.url)}`;

                        try {
                            const response = await axios.get(apiUrl, {
                                timeout: 60000
                            });

                            if (
                                !response.data ||
                                !response.data.status ||
                                !response.data.result ||
                                !response.data.result.download ||
                                !response.data.result.download.url
                            ) {
                                return await conn.sendMessage(from, {
                                    text: "❌ Audio Not Generated"
                                }, { quoted: received });
                            }

                            const audioUrl =
                                response.data.result.download.url;

                            const meta =
                                response.data.result.metadata;

                            await conn.sendMessage(from, {
                                audio: { url: audioUrl },
                                mimetype: "audio/mpeg",
                                fileName: `${meta?.title || vid.title || "song"}.mp3`,
                                ptt: false
                            }, { quoted: received });

                        } catch (e) {
                            return await conn.sendMessage(from, {
                                text: "❌ Audio Download Failed! Try again later."
                            }, { quoted: received });
                        }

                    // ============================================
                    // VIDEO - SAME OLD API
                    // ============================================
                    } else {

                        let videoUrl = null;
                        let success = false;

                        const videoAPIs = [
                            `https://xjawadtech.vercel.app/ytv1?url=${encodeURIComponent(vid.url)}`,
                            `https://xjawadtech.vercel.app/ytv2?url=${encodeURIComponent(vid.url)}`,
                            `https://xjawadtech.vercel.app/ytv3?url=${encodeURIComponent(vid.url)}`,
                            `https://xjawadtech.vercel.app/ytv4?url=${encodeURIComponent(vid.url)}`
                        ];

                        for (const apiUrl of videoAPIs) {
                            if (!success) {
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

                    await conn.sendMessage(from, {
                        react: { text: '✅', key: received.key }
                    });

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

        await conn.sendMessage(from, {
            react: { text: '❌', key: m.key }
        });
    }
});
