// igdl.js - ESM Version
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import axios from 'axios';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

cmd({
    pattern: "igdl",
    alias: ["instagram", "insta", "ig"],
    react: "⬇️",
    desc: "Download Instagram videos/reels",
    category: "download",
    use: ".igdl <Instagram URL>",
    filename: __filename
}, async (conn, mek, m, { from, reply, args, q }) => {
    try {
        const url = q || m.quoted?.text;
        if (!url || !url.includes("instagram.com")) {
            return reply("❌ Please provide/reply to an Instagram link");
        }

        // Show processing reaction
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        // Fetch from API
        const apiUrl = `https://api-aswin-sparky.koyeb.app/api/downloader/igdl?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl);

        if (!response.data?.status || !response.data.data?.length) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("Failed to fetch media. Invalid link or private content.");
        }

        // Send all media items
        for (const item of response.data.data) {
            await conn.sendMessage(from, {
                [item.type === 'video' ? 'video' : 'image']: { url: item.url },
                caption: `📶 *Instagram Downloader*\n\n` +
        `- ❤‍🩹 *Quality*: HD\n\n` +
        `> *© Powered by n͟a͟w͟a͟z͟ m͟d͟*`
            }, { quoted: mek });
        }

        // Success reaction
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error('IGDL Error:', error);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply("❌ Download failed. Try again later.");
    }
});

cmd({
  pattern: "igdl2",
  alias: ["instagram2", "ig2", "instadl2"],
  react: '📥',
  desc: "Download videos from Instagram (API v5)",
  category: "download",
  use: ".igdl5 <Instagram video URL>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    const igUrl = args[0];
    if (!igUrl || !igUrl.includes("instagram.com")) {
      return reply('❌ Please provide a valid Instagram video URL.\n\nExample:\n.igdl5 https://instagram.com/reel/...');
    }

    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    const apiUrl = `https://jawad.vercel.app/downloader?url=${encodeURIComponent(igUrl)}`;
    const response = await axios.get(apiUrl);

    const data = response.data;

    if (!data.status || !data.result || !Array.isArray(data.result)) {
      return reply('❌ Unable to fetch the video. Please check the URL and try again.');
    }

    const videoUrl = data.result[0];
    if (!videoUrl) return reply("❌ No video found in the response.");

    const metadata = data.metadata || {};
    const author = metadata.author || "Unknown";
    const caption = metadata.caption ? metadata.caption.slice(0, 300) + "..." : "No caption provided.";
    const likes = metadata.like || 0;
    const comments = metadata.comment || 0;

    await reply('Downloading Instagram video...Please wait.📥');

    await conn.sendMessage(from, {
      video: { url: videoUrl },
      caption: `📥 *Instagram Reel Downloader*\n👤 *Author:* ${author}\n💬 *Caption:* ${caption}\n❤️ *Likes:* ${likes} | 💭 *Comments:* ${comments}\n\n> Powered By NAWAZ-MD 💜`
    }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error('IGDL5 Error:', error);
    reply('❌ Failed to download the Instagram video. Please try again later.');
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});

cmd({
    pattern: "igdl3",
    alias: ["instagram3", "insta3", "ig3"],
    react: "⬇️",
    desc: "Download Instagram posts, reels, and stories",
    category: "download",
    use: ".igdl <Instagram URL>",
    filename: __filename
}, async (conn, mek, m, { from, reply, args, q }) => {
    try {
        const url = q || m.quoted?.text;
        if (!url || !url.includes("instagram.com")) {
            return reply("❌ Please provide/reply to a valid Instagram link");
        }

        // Show processing reaction  
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });  

        // Fetch from your API  
        const apiUrl = `https://NAWAZ-MD.vercel.app/igdl?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl);

        if (!response.data?.status || !response.data.result?.length) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ Failed to fetch media. Invalid link or private content.");
        }

        const mediaData = response.data.result;

        // Send all media items
        for (const item of mediaData) {
            const isVideo = item.contentType?.includes('video') || item.format === 'mp4';
            
            if (isVideo) {
                await conn.sendMessage(from, {
                    video: { url: item.url },
                    caption: `📱 *Instagram Downloader*\n\n` +
                        `📹 *Type*: Video\n` +
                        `💾 *Size*: ${(item.size / 1024 / 1024).toFixed(2)} MB\n` +
                        `🎞️ *Format*: ${item.format}\n\n` +
                        `> *© Powered by JawadTechXD*`
                }, { quoted: mek });
            } else {
                await conn.sendMessage(from, {
                    image: { url: item.url },
                    caption: `📱 *Instagram Downloader*\n\n` +
                        `🖼️ *Type*: Image\n` +
                        `💾 *Size*: ${(item.size / 1024).toFixed(2)} KB\n` +
                        `🎨 *Format*: ${item.format}\n\n` +
                        `> *© Powered by NAWAZ-MD*`
                }, { quoted: mek });
            }
            
            // Small delay between sends to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Success reaction
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error('IGDL Error:', error);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply("❌ Download failed. Please check the link and try again.");
    }
});
