import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const API_BASE = "https://xjawadtech.vercel.app";

function getVideoId(url) {
    const match = url.match(
        /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    );
    return match ? match[1] : null;
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
                "🎥 Please provide a video name or link!\n\nExample: .video Alone Marshmello"
            );
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
                return reply("❌ No video results found!");
            }

            vid = search.videos[0];
            url = vid.url;
        }

        if (!vid) return reply("❌ No results found!");

        await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption: `*╭─❍══ ⃟ ⃟ ⃟   𝙽𝙰𝚆𝙰𝚉 𝙼𝙳   ⃟ ⃟ ⃟══⊷❍*
┇◆╭┉┉┉┉┉┉┉┉┉┉━┈᛭
┇◆┋📹 *𝐕𝐈𝐃𝐄𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑*
┇◆┋
┇◆┋🎬 *Title:* ${vid.title}
┇◆┋📺 *Channel:* ${vid.author?.name || 'Unknown'}
┇◆┋⏱️ *Duration:* ${vid.timestamp}
┇◆┋📥 *Status:* Downloading Video...
┇◆╰┉┉┉┉┉┉┉┉┉┉┉┉┉━┈⊷
╰═══════════════════⍟

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`
        }, { quoted: mek });

        const videoAPIs = [
            `${API_BASE}/ytv1?url=${encodeURIComponent(url)}`,
            `${API_BASE}/ytv2?url=${encodeURIComponent(url)}`,
            `${API_BASE}/ytv3?url=${encodeURIComponent(url)}`,
            `${API_BASE}/ytv4?url=${encodeURIComponent(url)}`
        ];

        let success = false;

        for (const apiUrl of videoAPIs) {
            try {
                const response = await axios.get(apiUrl);

                const videoUrl = response.data?.status &&
                    response.data?.download?.url
                    ? response.data.download.url
                    : null;

                if (!videoUrl) continue;

                await conn.sendMessage(from, {
                    video: { url: videoUrl },
                    caption: `🎬 *${vid.title}*\n\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`
                }, { quoted: mek });

                success = true;
                break;

            } catch (e) {
                console.error(`⚠️ Video API failed (${apiUrl}):`, e.message);
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

