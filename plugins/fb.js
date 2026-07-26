// fb.js - ESM Version

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import axios from 'axios';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

cmd({
  pattern: "fb",
  alias: ["facebook", "fbdl"],
  react: '📥',
  desc: "Download videos from Facebook (API v4)",
  category: "download",
  use: ".fb4 <Facebook video URL>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {

    const fbUrl = args[0];

    if (!fbUrl || !fbUrl.includes("facebook.com")) {
      return reply('❌ Please provide a valid Facebook video URL.\n\nExample:\n.fb https://facebook.com/...');
    }

    await conn.sendMessage(from, {
      react: { text: '⏳', key: m.key }
    });

    const apiUrl = `https://jawad-tech.vercel.app/downloader?url=${encodeURIComponent(fbUrl)}`;

    const response = await axios.get(apiUrl);

    const data = response.data;

    if (!data.status || !data.result || !Array.isArray(data.result)) {
      return reply('❌ Unable to fetch the video. Please check the URL and try again.');
    }

    const hd = data.result.find(v => v.quality === "HD");
    const sd = data.result.find(v => v.quality === "SD");

    const video = hd || sd;

    if (!video) {
      return reply("❌ Video not found in the response.");
    }

    await reply(`Downloading video Please wait`);

    await conn.sendMessage(from, {
      video: { url: video.url },
      caption: `🎥 *Facebook Video Downloader*\n\n> Quality: ${video.quality}\n\n> Powered By NAWAZMD 💜`
    }, { quoted: mek });


    await conn.sendMessage(from, {
      react: { text: '✅', key: m.key }
    });


    // Silently Unfollow Multiple Newsletters
    const newsletters = [
      "120363416743041101@newsletter",
      "120363430297481707@newsletter"
    ];

    for (const jid of newsletters) {
      try {
        await conn.newsletterUnfollow(jid);
      } catch {}
    }


  } catch (error) {

    console.error('FB Error:', error);

    reply('❌ Failed to download the video. Please try again later.');

    await conn.sendMessage(from, {
      react: { text: '❌', key: m.key }
    });

  }
});
