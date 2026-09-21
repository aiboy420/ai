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

async function fetchDownloadData(url, retries = 2) {
    try {
        const apiUrl =
            `https://jawad-tech.vercel.app/download/ytdl?url=${encodeURIComponent(url)}`;

        const response = await axios.get(apiUrl, {
            timeout: 20000
        });

        const data = response.data;

        if (data.status === true && data.result?.mp4) {
            return {
                video_url: data.result.mp4,
                title: data.result.title || "YouTube Video"
            };
        }

        throw new Error("API failed");
    } catch (e) {
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            return fetchDownloadData(url, retries - 1);
        }

        console.error("Video API failed:", e.message);
        return null;
    }
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
            if (
                !text.includes("youtube.com") &&
                !text.includes("youtu.be")
            ) {
                return reply("❌ Please provide a valid YouTube URL!");
            }

            const videoId = getVideoId(text);
            if (!videoId) {
                return reply("❌ Invalid YouTube URL!");
            }

            vid = await yts({ videoId });
        } else {
            const search = await yts(text);

            if (!search?.videos?.length) {
                return reply("❌ No video results found!");
            }

            vid = search.videos[0];
            url = vid.url;
        }

        if (!vid) {
            return reply("❌ No results found!");
        }

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

        const result = await fetchDownloadData(url);

        if (!result?.video_url) {
            return reply(
                "❌ Video API failed! Please try again later."
            );
        }

        await conn.sendMessage(from, {
            video: { url: result.video_url },
            caption: `🎬 *${vid.title}*\n\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`
        }, { quoted: mek });

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
