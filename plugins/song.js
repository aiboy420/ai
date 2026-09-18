import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const API_BASE = "https://xjawadtech.vercel.app";

const toSmallCaps = (text) => {
    const map = {
        'a':'ᴀ','b':'ʙ','c':'ᴄ','d':'ᴅ','e':'ᴇ','f':'ғ','g':'ɢ','h':'ʜ',
        'i':'ɪ','j':'ᴊ','k':'ᴋ','l':'ʟ','m':'ᴍ','n':'ɴ','o':'ᴏ','p':'ᴘ',
        'q':'ǫ','r':'ʀ','s':'s','t':'ᴛ','u':'ᴜ','v':'ᴠ','w':'ᴡ','x':'x',
        'y':'ʏ','z':'ᴢ'
    };

    return text.split('').map(c => map[c.toLowerCase()] || c).join('');
};

function getVideoId(url) {
    const match = url.match(
        /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    );
    return match ? match[1] : null;
}

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
            return reply("🎶 Please provide a YouTube video name or link.\n\nExample: .song Alone - Alan Walker");
        }

        const { default: yts } = await import('yt-search');

        let vid = null;

        if (text.startsWith('http://') || text.startsWith('https://')) {
            if (!text.includes("youtube.com") && !text.includes("youtu.be")) {
                return reply("❌ Please provide a valid YouTube URL!");
            }

            const videoId = getVideoId(text);
            if (!videoId) return reply("❌ Invalid YouTube URL!");

            vid = await yts({ videoId });
        } else {
            const search = await yts(text);

            if (!search?.videos?.length) {
                return reply("❌ No results found!");
            }

            vid = search.videos[0];
        }

        if (!vid) return reply("❌ No results found!");

        const caption = `*╭─❍══ ⃟ ⃟ ⃟   𝙽𝙰𝚆𝙰𝚉 𝙼𝙳   ⃟ ⃟ ⃟══⊷❍*
┇◆╭┉┉┉┉┉┉┉┉┉┉━┈᛭
┇◆┋🎧 *${toSmallCaps('YT Downloader')}*
┇◆┋
┇◆┋🎬 *Title:* ${vid.title}
┇◆┋📺 *Channel:* ${vid.author?.name || 'Unknown'}
┇◆┋⏰ *Duration:* ${vid.timestamp}
┇◆┋👀 *Views:* ${vid.views?.toLocaleString() || 'N/A'}
┇◆╰┉┉┉┉┉┉┉┉┉┉┉┉┉━┈⊷
╭───⬡ *${toSmallCaps('Select Format')}* ⬡───
┋ ⬡ 1 🎧 ${toSmallCaps('Audio (MP3)')}
┋ ⬡ 2 📹 ${toSmallCaps('Video (MP4)')}
┋ ⬡ 3 📄 ${toSmallCaps('Audio as Document')}
┋ ⬡ 4 📄 ${toSmallCaps('Video as Document')}
╰───────────────────⊷

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`;

        const sent = await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption
        }, { quoted: mek });

        const msgId = sent.key.id;

        const songListener = async (msgData) => {
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

            const cleanSelect = selected?.trim();

            if (!["1", "2", "3", "4"].includes(cleanSelect)) {
                return conn.sendMessage(from, {
                    text: `❌ *Invalid selection!*\nPlease reply with:\n1️⃣ Audio (MP3)\n2️⃣ Video (MP4)\n3️⃣ Audio as Document\n4️⃣ Video as Document`
                }, { quoted: received });
            }

            const type = ["1", "3"].includes(cleanSelect) ? "mp3" : "mp4";
            const asDocument = ["3", "4"].includes(cleanSelect);

            const apiList = type === "mp3"
                ? [
                    `${API_BASE}/ytx?url=${encodeURIComponent(vid.url)}`,
                    `${API_BASE}/yta6?url=${encodeURIComponent(vid.url)}`,
                    `${API_BASE}/yta7?url=${encodeURIComponent(vid.url)}`,
                    `${API_BASE}/yta1?url=${encodeURIComponent(vid.url)}`,
                    `${API_BASE}/yta2?url=${encodeURIComponent(vid.url)}`,
                    `${API_BASE}/yta3?url=${encodeURIComponent(vid.url)}`,
                    `${API_BASE}/yta4?url=${encodeURIComponent(vid.url)}`,
                    `${API_BASE}/yta5?url=${encodeURIComponent(vid.url)}`
                ]
                : [
                    `${API_BASE}/ytv1?url=${encodeURIComponent(vid.url)}`,
                    `${API_BASE}/ytv2?url=${encodeURIComponent(vid.url)}`,
                    `${API_BASE}/ytv3?url=${encodeURIComponent(vid.url)}`,
                    `${API_BASE}/ytv4?url=${encodeURIComponent(vid.url)}`
                ];

            let success = false;

            for (const apiUrl of apiList) {
                try {
                    const response = await axios.get(
                        apiUrl,
                        type === "mp3" ? { timeout: 15000 } : {}
                    );

                    const fileUrl = response.data?.status &&
                        response.data?.download?.url
                        ? response.data.download.url
                        : null;

                    if (!fileUrl) continue;

                    if (type === "mp3") {
                        if (asDocument) {
                            await conn.sendMessage(from, {
                                document: { url: fileUrl },
                                mimetype: "audio/mpeg",
                                fileName: `${vid.title}.mp3`,
                                caption: `📄 *${vid.title}*\n🎧 Audio Document\n\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`
                            }, { quoted: received });
                        } else {
                            await conn.sendMessage(from, {
                                audio: { url: fileUrl },
                                mimetype: "audio/mpeg",
                                fileName: `${vid.title}.mp3`,
                                ptt: false
                            }, { quoted: received });
                        }
                    } else {
                        if (asDocument) {
                            await conn.sendMessage(from, {
                                document: { url: fileUrl },
                                mimetype: "video/mp4",
                                fileName: `${vid.title}.mp4`,
                                caption: `📄 *${vid.title}*\n📹 Video Document\n\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`
                            }, { quoted: received });
                        } else {
                            await conn.sendMessage(from, {
                                video: { url: fileUrl },
                                caption: `🎬 *${vid.title}*\n\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`
                            }, { quoted: received });
                        }
                    }

                    success = true;
                    break;

                } catch (e) {
                    console.error(`⚠️ Download API failed:`, e.message);
                }
            }

            if (!success) {
                return conn.sendMessage(from, {
                    text: `❌ All ${type === "mp3" ? "audio" : "video"} sources failed! Try again later.`
                }, { quoted: received });
            }

            await conn.sendMessage(from, {
                react: { text: '✅', key: received.key }
            });
        };

        conn.ev.on("messages.upsert", songListener);

        setTimeout(() => {
            conn.ev.off("messages.upsert", songListener);
        }, 30000);

    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e.message}`);

        await conn.sendMessage(from, {
            react: { text: '❌', key: m.key }
        });
    }
});

