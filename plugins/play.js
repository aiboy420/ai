// play.js - ESM Version (FIXED SEARCH)
// NAWAZ MD - YOUTUBE MUSIC DOWNLOADER
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cmd } from '../command.js';
import yts from 'yt-search';
import axios from 'axios';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cache
const cache = new Map();

/**
 * Normalize YouTube URL
 */
function normalizeYouTubeUrl(url) {
  if (!url) return null;
  const match = url.match(
    /(?:youtu.be\/|youtube.com\/shorts\/|youtube.com\/.*[?&]v=)([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://youtube.com/watch?v=${match[1]}` : null;
}

/**
 * Search YouTube
 */
async function searchYouTube(query) {
  try {
    const search = await yts(query);
    
    if (!search || !search.videos || !search.videos.length) {
      // Try with modified query
      const modifiedQuery = query.replace(/\s*\([^)]*\)\s*/g, ' ').trim();
      if (modifiedQuery !== query) {
        const retry = await yts(modifiedQuery);
        if (retry && retry.videos && retry.videos.length) {
          return retry.videos[0];
        }
      }
      return null;
    }
    
    // Filter out very short videos (under 30 seconds)
    const filtered = search.videos.filter(v => v.duration > 30);
    return filtered.length > 0 ? filtered[0] : search.videos[0];
    
  } catch (err) {
    console.log("Search Error:", err.message);
    return null;
  }
}

/**
 * Get MP3 Download Link
 */
async function fetchAudio(url) {
  const apis = [
    {
      url: `https://api.nexray.web.id/downloader/v1/ytmp3?url=${encodeURIComponent(url)}`,
      parse: data => data.result?.url,
      title: data => data.result?.title || "Unknown Song"
    },
    {
      url: `https://api.deline.web.id/downloader/ytmp3?url=${encodeURIComponent(url)}`,
      parse: data => data.result?.dlink,
      title: data => data.result?.title || "Unknown Song"
    },
    {
      url: `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(url)}`,
      parse: data => data.result?.url || data.url,
      title: data => data.result?.title || data.title || "Unknown Song"
    }
  ];

  for (const api of apis) {
    try {
      const { data } = await axios.get(api.url, {
        timeout: 25000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const audio = api.parse(data);
      if (audio) {
        return {
          title: api.title(data),
          audio
        };
      }
    } catch (err) {
      console.log("API Failed:", api.url, err.message);
    }
  }

  return null;
}

/**
 * Fallback: Download via yt-dlp
 */
async function fetchAudioWithYtDlp(url) {
  return new Promise((resolve, reject) => {
    const process = spawn('yt-dlp', [
      '-f', 'bestaudio',
      '--extract-audio',
      '--audio-format', 'mp3',
      '--no-playlist',
      '-o', 'audio.%(ext)s',
      url
    ]);

    let error = '';
    process.stderr.on('data', (data) => {
      error += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve({ audio: 'audio.mp3', title: 'download' });
      } else {
        reject(new Error(error));
      }
    });
  });
}

cmd(
  {
    pattern: "play",
    alias: ["song", "music", "audio", "mp3"],
    react: "🎵",
    desc: "Download YouTube Audio",
    category: "download",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, reply, prefix, command }) => {
    try {
      if (!q) {
        return reply(`🎵 *Usage:* ${prefix + command} Faded`);
      }

      await conn.sendMessage(from, {
        react: {
          text: "🎵",
          key: mek.key
        }
      });

      // First check if it's a URL
      let url = normalizeYouTubeUrl(q);
      let ytdata = null;

      if (url) {
        // It's a URL, search with it
        const search = await yts(url);
        if (search && search.videos && search.videos.length) {
          ytdata = search.videos[0];
        }
      }

      // If no result, search with query
      if (!ytdata) {
        ytdata = await searchYouTube(q);
      }

      if (!ytdata) {
        return reply("❌ No results found! Try:\n\n" +
          "1. Exact song name\n" +
          "2. YouTube URL\n" +
          "3. Artist + song name\n\n" +
          `Example: ${prefix + command} Atif Aslam Tajdar-e-Haram`);
      }

      // NEW CAPTION STYLE
      const caption = `╔═══════════════╗
║🎵 𝗡𝗔𝗪𝗔𝗭 𝗧𝗘𝗖𝗛 𝗫 ║
╚═══════════════╝

╭─❍「 📀 SONG INFO 」
│
├ 🎵 Title    : ${ytdata.title || "Unknown"}
├ 👤 Channel  : ${ytdata.author?.name || "Unknown"}
├ ⏱ Duration : ${ytdata.timestamp || "Unknown"}
├ 👁 Views    : ${ytdata.views?.toLocaleString() || "Unknown"}
╰─────────────────

⏳ Please wait...
🎧 Audio is being prepared.

╔══════════════════╗
║ Powered By Nawaz MD ║
╚══════════════════╝`;

      // Send thumbnail
      await conn.sendMessage(from, {
        image: { url: ytdata.thumbnail || ytdata.image || 'https://i.ytimg.com/vi/default/hqdefault.jpg' },
        caption: caption
      }, { quoted: mek });

      await conn.sendMessage(from, {
        react: {
          text: "⏳",
          key: mek.key
        }
      });

      // Get audio
      let dlData = await fetchAudio(ytdata.url);

      if (!dlData || !dlData.audio) {
        await reply("⚠️ Trying alternative method...");
        try {
          const ytUrl = await fetchAudioWithYtDlp(ytdata.url);
          if (ytUrl) {
            dlData = ytUrl;
          }
        } catch (e) {
          console.log("yt-dlp failed:", e.message);
        }
      }

      if (!dlData || !dlData.audio) {
        return reply("❌ Could not get audio. Try:\n\n" +
          "1. Download manually from YouTube\n" +
          "2. Try a different song\n" +
          "3. Use .play [YouTube URL]");
      }

      // Get audio buffer
      let audioBuffer;
      try {
        const response = await axios.get(dlData.audio, {
          responseType: "arraybuffer",
          timeout: 120000,
          headers: {
            'User-Agent': 'Mozilla/5.0'
          }
        });
        audioBuffer = Buffer.from(response.data);
      } catch (err) {
        console.log("Download Error:", err.message);
        return reply("❌ Failed to download audio. Please try again.");
      }

      // Send audio
      await conn.sendMessage(from, {
        audio: audioBuffer,
        mimetype: "audio/mpeg",
        fileName: `${dlData.title || 'song'}.mp3`,
        ptt: false
      }, { quoted: mek });

      await conn.sendMessage(from, {
        react: {
          text: "✅",
          key: mek.key
        }
      });

    } catch (err) {
      console.log("PLAY ERROR:", err);

      await conn.sendMessage(from, {
        react: {
          text: "❌",
          key: mek.key
        }
      });

      reply("⚠️ Something went wrong!\n\n" +
        "Try:\n" +
        "1. Use .play [song name]\n" +
        "2. Use .play [YouTube URL]\n" +
        "3. Try exact spelling");
    }
  }
);
