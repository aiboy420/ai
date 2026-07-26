
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';
import FormData from 'form-data';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ImgBB API Keys list
const IMGBB_API_KEYS = [
  'ebb2d6cad946fa45d7d9c4cc7dfa87e3',
  'b9b79efc2a2cf5380b57974bba4ce6d4',
  '9f47b49c2c1ea0bdb3f4acc4ebde2119',
  'a7c9712190de7a0d3c27e12ac5e4c3da',
  '55ec55ce1c92a23b47d958a1db63c486'
];

// Function to get random API key
function getRandomApiKey() {
  const randomIndex = Math.floor(Math.random() * IMGBB_API_KEYS.length);
  return IMGBB_API_KEYS[randomIndex];
}

cmd({
  pattern: "url",
  alias: ["imgtourl", "imgurl", "tourl", "geturl", "upload"],
  react: '🖇',
  desc: "Upload image to ImgBB and get URL",
  category: "utility",
  use: ".tourl [reply to image]",
  filename: __filename
}, async (conn, mek, m, { from, reply, quoted }) => {
  try {
    const quotedMsg = m.quoted || m;
    const mimeType = (quotedMsg.msg || quotedMsg).mimetype || '';
    
    if (!mimeType || !mimeType.includes('image')) {
      return reply("❌ Please reply to an image");
    }

    await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

    const mediaBuffer = await quotedMsg.download();

    // Get random API key
    const apiKey = getRandomApiKey();

    const form = new FormData();
    form.append('key', apiKey);
    form.append('image', mediaBuffer.toString('base64'));
    form.append('name', 'jawadmd');

    const response = await axios.post("https://api.imgbb.com/1/upload", form, {
      headers: form.getHeaders(),
      timeout: 60000
    });

    const imageUrl = response.data?.data?.url;

    if (!imageUrl) throw "Upload failed";

    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    // Simple response
    await reply(`✅ *Image Successfully Uploaded*\n\n- ${imageUrl}`);

  } catch (error) {
    console.error("Tourl error:", error);
    await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    await reply(`❌ Error: ${error.message || error}`);
  }
});
