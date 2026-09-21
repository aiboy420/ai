
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);

const API_URL = 'https://eliteprotech-apis.zone.id/download/ytmp3';

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
    pattern: 'song',
    alias: ['yt', 'ytdl'],
    desc: 'Download YouTube song (MP3)',
    category: 'download',
    react: '🎧',
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) {
            return reply(
                '🎶 Please provide a YouTube video name or link.\n\nExample: .song Alone - Alan Walker'
            );
        }

        const { default: yts } = await import('yt-search');

        let vid = null;

        if (text.startsWith('http://') || text.startsWith('https://')) {
            if (!text.includes('youtube.com') && !text.includes('youtu.be')) {
                return reply('❌ Please provide a valid YouTube URL!');
            }

            const videoId = getVideoId(text);

            if (!videoId) {
                return reply('❌ Invalid YouTube URL!');
            }

            vid = await yts({ videoId });
        } else {
            const search = await yts(text);

            if (!search?.videos?.length) {
                return reply('❌ No results found!');
            }

            vid = search.videos[0];
        }

        if (!vid) {
            return reply('❌ No results found!');
        }

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
┋ ⬡ 2 📄 ${toSmallCaps('Audio as Document')}
╰───────────────────⊷

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`;

        const sent = await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption
        }, { quoted: mek });

        const msgId = sent.key.id;

        const songListener = async (msgData) => {
            try {
                const received = msgData.messages?.[0];

                if (!received?.message) return;

                const selected =
                    received.message.conversation ||
                    received.message.extendedTextMessage?.text;

                const replyToBot =
                    received.message.extendedTextMessage?.contextInfo?.stanzaId === msgId;

                if (!replyToBot) return;

                conn.ev.off('messages.upsert', songListener);

                const cleanSelect = selected?.trim();

                await conn.sendMessage(from, {
                    react: { text: '⬇️', key: received.key }
                });

                if (!['1', '2'].includes(cleanSelect)) {
                    return conn.sendMessage(from, {
                        text: `❌ *Invalid selection!*

Please reply with:
1️⃣ Audio (MP3)
2️⃣ Audio as Document`
                    }, { quoted: received });
                }

                const asDocument = cleanSelect === '2';

                const videoUrl = vid.url;

                if (!videoUrl) {
                    return conn.sendMessage(from, {
                        text: '❌ YouTube video URL not found!'
                    }, { quoted: received });
                }

                const response = await axios.get(API_URL, {
                    params: {
                        url: videoUrl
                    },
                    timeout: 60000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0'
                    }
                });

                const data = response.data;

                const fileUrl = data?.download?.downloadUrl;

                if (!fileUrl || typeof fileUrl !== 'string') {
                    console.error(
                        'ELITEPROTECH API RESPONSE:',
                        JSON.stringify(data, null, 2)
                    );

                    return conn.sendMessage(from, {
                        text: '❌ API did not return a valid audio link.'
                    }, { quoted: received });
                }

                if (asDocument) {
                    await conn.sendMessage(from, {
                        document: { url: fileUrl },
                        mimetype: 'audio/mpeg',
                        fileName: `${vid.title}.mp3`,
                        caption: `📄 *${vid.title}*
🎧 Audio Document

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`
                    }, { quoted: received });
                } else {
                    await conn.sendMessage(from, {
                        audio: { url: fileUrl },
                        mimetype: 'audio/mpeg',
                        fileName: `${vid.title}.mp3`,
                        ptt: false
                    }, { quoted: received });
                }

                await conn.sendMessage(from, {
                    react: { text: '✅', key: received.key }
                });

            } catch (e) {
                console.error(
                    '❌ SONG DOWNLOAD ERROR:',
                    e.response?.data || e.message
                );

                await conn.sendMessage(from, {
                    text: '❌ Song download failed! Please try again later.'
                }, { quoted: msgData.messages?.[0] });
            }
        };

        conn.ev.on('messages.upsert', songListener);

        setTimeout(() => {
            conn.ev.off('messages.upsert', songListener);
        }, 30000);

    } catch (e) {
        console.error('❌ SONG ERROR:', e);

        reply(`❌ Error: ${e.message}`);

        await conn.sendMessage(from, {
            react: { text: '❌', key: m.key }
        });
    }
});
            
