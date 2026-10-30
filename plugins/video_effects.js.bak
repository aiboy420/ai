import { cmd } from '../command.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

// Video URLs object
const videoUrls = {
    v1: 'https://files.catbox.moe/2b396g.mp4',
    v2: 'https://files.catbox.moe/h298mm.mp4',
    v3: 'https://files.catbox.moe/mkihb0.mp4',
    v4: 'https://files.catbox.moe/5hbs7z.mp4',
    v5: 'https://files.catbox.moe/8lata2.mp4',
    v6: 'https://files.catbox.moe/5l50bn.mp4',
    v7: 'https://files.catbox.moe/n2e57d.mp4',
    v8: 'https://files.catbox.moe/t5ggaz.mp4',
    v9: 'https://files.catbox.moe/8lata2.mp4',
    v10: 'https://files.catbox.moe/kean0p.mp4',
    v11: 'https://files.catbox.moe/wudh8i.mp4',
    v12: 'https://files.catbox.moe/w6ixrn.mp4',
    v13: 'https://files.catbox.moe/e4othm.mp4',
    v14: 'https://files.catbox.moe/9v1gou.mp4',
    v15: 'https://files.catbox.moe/hdinwe.mp4',
    v16: 'https://files.catbox.moe/nzttl2.mp4',
    v17: 'https://files.catbox.moe/3ghl7h.mp4',
    v18: 'https://files.catbox.moe/1759lx.mp4',
    v19: 'https://files.catbox.moe/pje2pl.mp4',
    v20: 'https://files.catbox.moe/t5ggaz.mp4',
    v21: 'https://files.catbox.moe/1rl736.mp4',
    v22: 'https://files.catbox.moe/4qtd4f.mp4',
    v23: 'https://files.catbox.moe/wkeed2.mp4',
    v24: 'https://files.catbox.moe/fbi3vl.mp4',
    v25: 'https://files.catbox.moe/2xpcb1.mp4'
};

const captionText = "*Powered by AAQIL MD🫠*";

// Commands 1 to 25
const videoKeys = Object.keys(videoUrls);

videoKeys.forEach((key, index) => {
    const cmdNum = index + 1;
    cmd({
        pattern: `video${cmdNum}`,
        desc: `Play video effect ${cmdNum}`,
        category: "video",
        react: "🎬",
        filename: __filename
    },
    async (conn, mek, m, { from, reply }) => {
        try {
            await conn.sendMessage(from, { 
                video: { url: videoUrls[key] },
                caption: captionText
            }, { quoted: mek });
        } catch (e) {
            console.error(`Error in video${cmdNum} command:`, e);
            await reply(`❌ Failed to play video ${cmdNum}.\n\n*_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀᴀQɪʟ ᴍᴅ_*`);
        }
    });
});

// Manual listing for reference (if needed in your command handler)
/*
   Patterns generated:
   .video1, .video2, .video3, ..., .video25
*/