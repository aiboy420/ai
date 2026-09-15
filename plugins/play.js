import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);

function getVideoId(url) {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
}

// ============================================
// AUDIO API
// ============================================
const AUDIO_API = "https://arslan-apis-v2.vercel.app/download/ytmp4";

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

        // 🎧 ARSLAN AUDIO API
        const apiUrl =
            `${AUDIO_API}?url=${encodeURIComponent(url)}`;

        const response = await axios.get(apiUrl, {
            timeout: 60000
        });

        const data = response.data;

        const audioUrl =
            data?.result?.download?.url;

        if (!audioUrl) {
            console.log("AUDIO API RESPONSE:", JSON.stringify(data, null, 2));
            return reply("❌ Audio Not Generated");
        }

        const title =
            data?.result?.metadata?.title ||
            vid.title ||
            "song";

        await conn.sendMessage(from, {
            audio: { url: audioUrl },
            mimetype: "audio/mpeg",
            fileName: `${title}.mp3`,
            ptt: false
        }, { quoted: mek });

        await conn.sendMessage(from, {
            react: { text: '✅', key: m.key }
        });

    } catch (err) {

        console.error("❌ PLAY ERROR:", err.response?.data || err.message);

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
                // AUDIO
                // ============================================
                if (selected === "1") {

                    try {

                        const apiUrl =
                            `${AUDIO_API}?url=${encodeURIComponent(vid.url)}`;

                        const response = await axios.get(apiUrl, {
                            timeout: 60000
                        });

                        const data = response.data;

                        const audioUrl =
                            data?.result?.download?.url;

                        if (!audioUrl) {
                            console.log(
                                "SONG AUDIO API RESPONSE:",
                                JSON.stringify(data, null, 2)
                            );

                            return await conn.sendMessage(from, {
                                text: "❌ Audio Not Generated"
                            }, { quoted: received });
                        }

                        const title =
                            data?.result?.metadata?.title ||
                            vid.title ||
                            "song";

                        await conn.sendMessage(from, {
                            audio: { url: audioUrl },
                            mimetype: "audio/mpeg",
                            fileName: `${title}.mp3`,
                            ptt: false
                        }, { quoted: received });

                        await conn.sendMessage(from, {
                            react: { text: '✅', key: received.key }
                        });

                    } catch (e) {

                        console.error(
                            "❌ SONG AUDIO ERROR:",
                            e.response?.data || e.message
                        );

                        return await conn.sendMessage(from, {
                            text: "❌ Audio Download Failed! Try again later."
                        }, { quoted: received });
                    }

                    return;
                }

                // ============================================
                // VIDEO - SAME OLD XJAWADTECH API
                // ============================================
                if (selected === "2") {

                    let videoUrl = null;
                    let success = false;

                    const videoAPIs = [
                        `https://xjawadtech.vercel.app/ytv1?url=${encodeURIComponent(vid.url)}`,
                        `https://xjawadtech.vercel.app/ytv2?url=${encodeURIComponent(vid.url)}`,
                        `https://xjawadtech.vercel.app/ytv3?url=${encodeURIComponent(vid.url)}`,
                        `https://xjawadtech.vercel.app/ytv4?url=${encodeURIComponent(vid.url)}`
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
