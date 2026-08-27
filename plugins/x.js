// y.js - ESM Version (Hidden from Menu)
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import axios from 'axios';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

cmd({
    pattern: "rai",
    alias: ["jav", "javidl"],
    desc: "Search and download random xnxx style videos",
    category: "download",
    react: "🔞",
    dontAddCommandList: true,  // 👈 یہ کمانڈ کو مینیو سے ہائیڈ کر دے گا
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        // Default search queries array
        const defaultQueries = [
            "hot",
            "girl", 
            "boy",
            "russian",
            "american",
            "asian",
            "european",
            "model",
            "actress",
            "celebrity",
            "Russian",
            "dance",
            "music",
            "fashion",
            "beauty",
            "fitness"
        ];

        // Use provided query or pick random default
        let searchQuery = q;
        if (!searchQuery) {
            searchQuery = defaultQueries[Math.floor(Math.random() * defaultQueries.length)];
            await reply(`🎯 No query provided! Searching random: *${searchQuery}*`);
        }

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        // Search for videos
        const searchUrl = `https://api.deline.web.id/search/xnxx?q=${encodeURIComponent(searchQuery)}`;
        const searchRes = await axios.get(searchUrl);
        const searchData = searchRes.data;

        if (!searchData?.status || !searchData?.result?.length) {
            return await reply(`❌ No videos found for "${searchQuery}"! Try another query.`);
        }

        // Select random video from results
        const videos = searchData.result;
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];
        
        // Get the video link from results
        const videoLink = randomVideo.link;
        
        // Download the video using the link
        const downloadUrl = `https://api.deline.web.id/downloader/xnxx?url=${encodeURIComponent(videoLink)}`;
        const downloadRes = await axios.get(downloadUrl);
        const downloadData = downloadRes.data;

        if (!downloadData?.status || !downloadData?.result) {
            return await reply("❌ Failed to download video!");
        }

        const result = downloadData.result;
        
        // Get high quality video URL
        const videoUrl = result.files.high || result.files.low;
        if (!videoUrl) {
            return await reply("❌ No video URL found!");
        }

        // Send video with information
        const caption = `
🎬 *Title:* ${result.title || randomVideo.title || 'Unknown'}
⏱️ *Duration:* ${result.duration || randomVideo.info?.split('\n')[0] || 'Unknown'}
📺 *Quality:* ${result.videoHeight ? `${result.videoHeight}p` : 'HD'}
👁️ *Views:* ${result.info?.split('\n')[2]?.trim() || 'Unknown'}
🔍 *Searched:* ${searchQuery}

> * 🤣😜🤗🤭*
        `.trim();

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            mimetype: 'video/mp4',
            caption: caption,
            thumbnail: result.files?.thumb ? { url: result.files.thumb } : null
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("Error in .xnxx:", e);
        
        if (e.response?.status === 404) {
            await reply("❌ API endpoint not found! The service might be temporarily unavailable.");
        } else {
            await reply("❌ Error occurred while processing your request!\n\n" + e.message);
        }
        
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});
