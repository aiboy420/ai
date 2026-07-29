// play.js - Diamond Design Style
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cmd } from '../command.js';
import yts from 'yt-search';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Normalize YouTube URL
 */
function normalizeYouTubeUrl(url) {
    const match = url.match(
        /(?:youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/.*[?&]v=)([a-zA-Z0-9_-]{11})/
    );
    return match ? `https://youtube.com/watch?v=${match[1]}` : null;
}

/**
 * Get MP3 Download Link - 4 APIs
 */
async function fetchAudio(url) {
    const apis = [
        {
            url: `https://apis-keith.vercel.app/download/dlmp3?url=${encodeURIComponent(url)}`,
            parse: data => data?.result?.audio || data?.result?.url || data?.audio || data?.url,
            title: data => data?.result?.title || data?.title || "Unknown Song"
        },
        {
            url: `https://eliteprotech-apis.zone.id/ytdown?url=${encodeURIComponent(url)}&format=mp3`,
            parse: data => data?.result?.audio || data?.result?.url || data?.audio || data?.url,
            title: data => data?.result?.title || data?.title || "Unknown Song"
        },
        {
            url: `https://api.yupra.my.id/api/downloader/ytmp3?url=${encodeURIComponent(url)}`,
            parse: data => data?.result?.audio || data?.result?.url || data?.audio || data?.url,
            title: data => data?.result?.title || data?.title || "Unknown Song"
        },
        {
            url: `https://okatsu-rolezapiiz.vercel.app/downloader/ytmp3?url=${encodeURIComponent(url)}`,
            parse: data => data?.result?.audio || data?.result?.url || data?.audio || data?.url,
            title: data => data?.result?.title || data?.title || "Unknown Song"
        }
    ];

    for (const api of apis) {
        try {
            const { data } = await axios.get(api.url, { timeout: 20000 });
            const audio = api.parse(data);
            if (audio) {
                return {
                    title: api.title(data),
                    audio: audio
                };
            }
        } catch (err) {
            console.log("API Failed:", api.url);
        }
    }
    return null;
}

cmd({
    pattern: "play2",
    alias: ["song", "music", "audio", "mp3"],
    react: "🎵",
    desc: "Download YouTube Audio",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, prefix, command }) => {
    try {
        if (!q) {
            return reply(`🎵 *Usage:* ${prefix + command} Faded`);
        }

        await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });

        const url = normalizeYouTubeUrl(q);
        let ytdata;

        if (url) {
            const search = await yts(q);
            ytdata = search.videos?.[0];
        } else {
            const search = await yts(q);
            if (!search.videos.length) {
                return reply("❌ Song not found!");
            }
            ytdata = search.videos[0];
        }

        // 💎 DIAMOND DESIGN STYLE
        const caption = `
◆━━━━━━━━━━━━━━━━━━━━━━━━◆
        ✦ 𝗡𝗔𝗪𝗔𝗭 𝗧𝗘𝗖𝗛 𝗫 ✦
        🎵 𝗬𝗢𝗨𝗧𝗨𝗕𝗘 𝗠𝗨𝗦𝗜𝗖 🎵
◆━━━━━━━━━━━━━━━━━━━━━━━━◆

◇━━━━━━━━━━━━━━━━━━━━━━━━◇
  ◆ 📀 SONG INFO ◆
◇━━━━━━━━━━━━━━━━━━━━━━━━◇
  ◆ 🎵 Title    : ${ytdata.title}
  ◆ 👤 Channel  : ${ytdata.author?.name || "Unknown"}
  ◆ ⏱ Duration : ${ytdata.timestamp}
  ◆ 👁 Views    : ${ytdata.views?.toLocaleString() || "Unknown"}
◇━━━━━━━━━━━━━━━━━━━━━━━━◇

  ⏳ Please wait...
  🎧 Audio is being prepared.

◆━━━━━━━━━━━━━━━━━━━━━━━━◆
        💜 Powered By Nawaz MD
◆━━━━━━━━━━━━━━━━━━━━━━━━◆
`;

        await conn.sendMessage(from, {
            image: { url: ytdata.thumbnail || ytdata.image },
            caption
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        const dlData = await fetchAudio(ytdata.url);

        if (!dlData || !dlData.audio) {
            return reply("❌ Audio link not found!");
        }

        const audioBuffer = await axios.get(dlData.audio, {
            responseType: "arraybuffer",
            timeout: 60000
        });

        await conn.sendMessage(from, {
            audio: Buffer.from(audioBuffer.data),
            mimetype: "audio/mpeg",
            fileName: `${dlData.title}.mp3`,
            ptt: false
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (err) {
        console.log("PLAY ERROR:", err);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply("⚠️ Something went wrong!");
    }
});
