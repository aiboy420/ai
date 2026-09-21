import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

function getVideoId(url) {
    const match = url.match(
        /(?:youtube.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : null;
}

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
            if (!videoId) return reply("❌ Invalid YouTube URL!");

            vid = await yts({ videoId });
        } else {
            const search = await yts(text);

            if (!search?.videos?.length) {
                return reply("❌ No song found!");
            }

            vid = search.videos[0];
            url = vid.url;
        }

        if (!vid) return reply("❌ No results found!");

        await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption: `*╭─❍══ ⃟ ⃟ ⃟   𝙽𝙰𝚆𝙰𝚉 𝙼𝙳   ⃟ ⃟ ⃟══⊷❍*

┇◆╭┉┉┉┉┉┉┉┉┉┉━┈⊷
┇◆┋🎧 𝐀𝐔𝐃𝐈𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑
┇◆┋
┇◆┋🎵 Title: ${vid.title}
┇◆┋⏱️ Duration: ${vid.timestamp}
┇◆┋👀 Views: ${vid.views?.toLocaleString() || 'N/A'}
┇◆┋📺 Author: ${vid.author?.name || 'Unknown'}
┇◆┋📥 Status: Downloading...
┇◆╰┉┉┉┉┉┉┉┉┉┉┉┉┉━┈⊷
╰═══════════════════⍟

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`
        }, { quoted: mek });

        // ✅ نیا ڈاؤن لوڈر (بغیر API key)
        const { lmna } = await import('@lmna22/aio-downloader');
        
        // Quality 8 کا مطلب MP3 ہے
        const result = await lmna.youtube(url, 8);

        if (!result || !result.status || !result.data) {
            return reply("❌ All download sources failed! Try again later.");
        }

        // ✅ result.data.result ایک Buffer ہے — براہ راست بھیجیں
        await conn.sendMessage(from, {
            audio: result.data.result,
            mimetype: "audio/mpeg",
            fileName: `${vid.title}.mp3`,
            ptt: false
        }, { quoted: mek });

        await conn.sendMessage(from, {
            react: { text: '✅', key: m.key }
        });

    } catch (err) {
        console.error("❌ PLAY ERROR:", err.message);
        reply("❌ Error occurred! Please try again later.");

        await conn.sendMessage(from, {
            react: { text: '❌', key: m.key }
        });
    }
});
