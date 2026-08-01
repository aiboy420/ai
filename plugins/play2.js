// play.js - ESM Version (pablo-music)
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cmd } from '../command.js';
import { playMusic } from 'pablo-music';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

cmd({
    pattern: "song2",
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

        // 🎵 Search and download using pablo-music
        const music = await playMusic(q);

        if (!music || !music.mp3) {
            return reply("❌ Song not found or download failed!");
        }

        // 📤 Send audio
        await conn.sendMessage(from, {
            audio: { url: music.mp3 },
            mimetype: "audio/mpeg",
            fileName: `${music.title || 'song'}.mp3`,
            ptt: false
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (err) {
        console.log("PLAY ERROR:", err);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply("⚠️ Something went wrong! Try again later.");
    }
});
