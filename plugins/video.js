// video.js - ESM Version
// NAWAZ MD - YOUTUBE VIDEO DOWNLOADER (FIXED)
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cmd } from '../command.js';
import yts from 'yt-search';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Simple In-memory cache
const cache = new Map();

/**
 * Normalize YouTube URL
 */
function normalizeYouTubeUrl(url) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/.*[?&]v=)([a-zA-Z0-9_-]{11})/);
  return match ? `https://youtube.com/watch?v=${match[1]}` : null;
}

/**
 * Get Download Link API
 */
async function fetchDownloadData(url, retries = 2) {
  try {
    const apiUrl = `https://jawad-tech.vercel.app/download/ytdl?url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl, { timeout: 20000 });
    const data = response.data;

    if (data.status === true && data.result) {
      return {
        video_url: data.result.mp4,
        title: data.result.title || "YouTube Video",
      };
    }

    throw new Error("API failed");
  } catch (e) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, 2000));
      return fetchDownloadData(url, retries - 1);
    }
    return null;
  }
}

// MAIN COMMAND
cmd(
  {
    pattern: "video",
    alias: ["ytmp4", "vdl"],
    react: "🎥",
    desc: "YouTube Video Downloader",
    category: "download",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, reply, prefix, command }) => {
    try {

      if (!q) {
        return reply(`🎥 *Usage:* ${prefix + command} video name or link`);
      }

      await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });

      // SEARCH
      const url = normalizeYouTubeUrl(q);
      let ytdata;

      if (url) {
        const searchResults = await yts(q);
        ytdata = searchResults.videos?.[0];
      } else {
        const searchResults = await yts(q);
        if (!searchResults.videos.length) {
          return reply("❌ No video found!");
        }
        ytdata = searchResults.videos[0];
      }

      // ✅ CLEAN PRO DECORATION STYLE (UPDATED ONLY)
      const infoText = `
╭───────────────🎥
│  *YOUTUBE DOWNLOADER*
╰───────────────

🎬 *Title:* ${ytdata.title}

🎥 *Channel:* ${ytdata.author?.name || "Unknown"}

⏱ *Duration:* ${ytdata.timestamp}

👁 *Views:* ${ytdata.views.toLocaleString()}

────────────────────
⬇️ Downloading please wait...

🚀 Powered by Nawaz MD
`;

      await conn.sendMessage(from, {
        image: { url: ytdata.thumbnail || ytdata.image },
        caption: infoText
      }, { quoted: mek });

      await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

      // GET DOWNLOAD LINK
      const dlData = await fetchDownloadData(ytdata.url);

      if (!dlData || !dlData.video_url) {
        return reply("❌ Video link not found or expired!");
      }

      // SEND VIDEO
      try {
        const videoBuffer = await axios.get(dlData.video_url, {
          responseType: "arraybuffer",
          timeout: 60000
        });

        await conn.sendMessage(from, {
          video: Buffer.from(videoBuffer.data),
          mimetype: "video/mp4",
          caption: `✅ *${dlData.title}*\n\n🚀 Powered by Nawaz MD`
        }, { quoted: mek });

      } catch (err) {
        console.log("VIDEO SEND ERROR:", err.message);
        return reply("❌ Video send failed (invalid link or large file).");
      }

      await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
      console.log("ERROR:", e);
      await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
      reply("⚠️ Something went wrong!");
    }
  }
);
