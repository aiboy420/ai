import { cmd } from "../command.js";
import yts from "yt-search";
import axios from "axios";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const API_CONFIG = {
    VIDEO_API: Buffer.from("aHR0cHM6Ly9hcGkubmV4cmF5LmV1LmNjL2Rvd25sb2FkZXIvdjEveXRtcDQ/dXJsPQ==", "base64").toString()
};

/**
 * Normalizes YouTube URLs to a standard format
 */
function normalizeYouTubeUrl(url) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/.*[?&]v=)([a-zA-Z0-9_-]{11})/);
  return match ? `https://youtube.com/watch?v=${match[1]}` : null;
}

/**
 * Fetch Video Download
 */
async function fetchVideoData(url, quality = '360', retries = 2) {
  try {
    const apiUrl = `${API_CONFIG.VIDEO_API}${encodeURIComponent(url)}&resolusi=${quality}`;
    const { data } = await axios.get(apiUrl, { timeout: 20000 });
    
    if (data?.status && data?.result?.url) {
      return {
        video_url: data.result.url,
        title: data.result.title || "YouTube Video",
        quality: quality
      };
    }
    throw new Error("API failed to return download link.");
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return fetchVideoData(url, quality, retries - 1);
    }
    return null;
  }
}

// --- VIDEO COMMAND ---

cmd(
  {
    pattern: "video",
    alias: ["ytmp4", "vdl"],
    react: "🎥",
    desc: "Search and download high-quality videos from YouTube.",
    category: "download",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, reply, prefix, command }) => {
    try {
      if (!q) return reply(`🎥 *Video Downloader*\n\nUsage: \`${prefix + command} <name or link>\`\nExample: \`${prefix + command} perfect ed sheeran\``);

      await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });

      // Step 1: Search for the video
      const url = normalizeYouTubeUrl(q);
      let ytdata;

      if (url) {
        const searchResults = await yts({ videoId: q.split('v=')[1]?.split('&')[0] || q.split('/').pop() });
        ytdata = searchResults;
      } else {
        const searchResults = await yts(q);
        if (!searchResults.videos.length) return reply("❌ No videos found for your query!");
        ytdata = searchResults.videos[0];
      }

      // Step 2: Send info message
      const infoText = `
🎥 *YT VIDEO DOWNLOADER* 🎥

📌 *Title:* ${ytdata.title}
🎬 *Channel:* ${ytdata.author?.name || 'Unknown'}
⏱️ *Duration:* ${ytdata.timestamp}
👁️ *Views:* ${ytdata.views.toLocaleString()}

_📥 Processing your video file, please wait..._

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ AAQIL MD`;

      await conn.sendMessage(from, { image: { url: ytdata.thumbnail || ytdata.image }, caption: infoText }, { quoted: mek });
      await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

      // Step 3: Fetch download link from API (try different qualities)
      let qualities = ['720', '480', '360', '144'];
      let dlData = null;
      
      for (const quality of qualities) {
        dlData = await fetchVideoData(ytdata.url, quality);
        if (dlData) break;
      }

      if (!dlData || !dlData.video_url) {
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        return reply("❌ Download link could not be generated. Please try again later.");
      }

      // Step 4: Send the Video file
      await conn.sendMessage(
        from,
        {
          video: { url: dlData.video_url },
          mimetype: "video/mp4",
          caption: `✅ *${dlData.title}*\n📹 Quality: ${dlData.quality}p\n\n*🚀 Powered by AAQIL MD*`
        },
        { quoted: mek }
      );

      await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
      console.error("Video DL Error:", e);
      await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
      reply(`⚠️ *Error:* ${e.message || "Something went wrong."}\n\n*_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀᴀQɪʟ ᴍᴅ_*`);
    }
  }
);