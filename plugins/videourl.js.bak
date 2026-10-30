// AAQIL MD - ESM Version
import { cmd } from '../command.js';
import axios from 'axios';
import FormData from 'form-data';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

cmd({
  pattern: "videourl",
  alias: ["vidtourl", "vidurl", "uploadvid", "getvurl"],
  react: '🎬',
  desc: "Upload video to Catbox and get URL",
  category: "utility",
  use: ".videourl [reply to video]",
  filename: __filename
}, async (conn, mek, m, { from, reply, quoted }) => {
  try {
    const quotedMsg = m.quoted || m;
    const mimeType = (quotedMsg.msg || quotedMsg).mimetype || '';

    if (!mimeType || !mimeType.includes('video')) {
      return reply("❌ Please reply to a video");
    }

    await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

    const mediaBuffer = await quotedMsg.download();

    // Determine file extension from mime type
    const ext = mimeType.split('/')[1]?.split(';')[0] || 'mp4';
    const fileName = `video_${Date.now()}.${ext}`;

    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', mediaBuffer, {
      filename: fileName,
      contentType: mimeType
    });

    const response = await axios.post("https://catbox.moe/user.php", form, {
      headers: form.getHeaders(),
      timeout: 120000 // 2 minutes timeout for large videos
    });

    const videoUrl = response.data?.trim();

    if (!videoUrl || !videoUrl.startsWith('https://')) throw "Upload failed";

    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    await reply(`✅ *Video Successfully Uploaded*\n\n🔗 URL: ${videoUrl}\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀᴀQɪʟ ᴍᴅ*`);

  } catch (error) {
    console.error("Videourl error:", error);
    await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    await reply(`❌ *Error:* ${error.message || error}\n\n*_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀᴀQɪʟ ᴍᴅ_*`);
  }
});