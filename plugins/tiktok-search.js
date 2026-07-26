// plugins/tiktok.js - ESM Version
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "tiktoksearch",
    alias: ["ttsearch", "tiktoks", "tiks"],
    desc: "Search and download TikTok videos",
    category: "download",
    react: "🎵",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            return reply(`🎵 *TikTok Search* 🎵\n\nSearch and download TikTok videos!\n\n*Usage:* .tiktoksearch <query>\n*Example:* .tiktoksearch funny cat`);
        }

        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        const apiUrl = `https://api.deline.web.id/search/tiktok?query=${encodeURIComponent(q)}`;
        const response = await axios.get(apiUrl);

        if (!response.data.status || !response.data.result) {
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return reply(`❌ No results found for "${q}". Please try a different search term.`);
        }

        const result = response.data.result;
        const videoUrl = result.wm_play || result.play;
        
        if (videoUrl) {
            await conn.sendMessage(from, {
                video: { url: videoUrl },
                caption: `🎵 *${result.title || 'TikTok Video'}*\n\n> Powered by JawadTechX`,
                mimetype: "video/mp4"
            }, { quoted: mek });
            
            await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
        } else {
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            reply("❌ Failed to get video URL. Please try again.");
        }

    } catch (error) {
        console.error("TikTok Search Error:", error);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply("❌ An error occurred while searching. Please try again.");
    }
});
