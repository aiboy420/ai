// plugins/sticker.js - ESM Version
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import { Sticker, StickerTypes } from "wa-sticker-formatter";
import Config from '../config.js';
import StickerMaker from '../lib/sticker-maker.js';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);

// Mega Sticker Command
cmd({
    pattern: 'sticker',
    alias: ['s', 'take', 'stake', 'vsticker', 'gsticker', 'g2s', 'gs', 'v2s', 'vs'],
    desc: 'Create stickers from images, videos, GIFs with custom pack names',
    category: 'tools',
    react: "⚡",
    use: '<reply media> | <pack name>',
    filename: __filename,
}, async (conn, mek, m, { quoted, args, q, reply, from }) => {
    if (!mek.quoted) return reply(`*Reply to any Image, Video, GIF, or Sticker*`);
    
    let mime = mek.quoted.mtype;
    
    // Determine pack name: use provided text or default from config
    let pack = q ? q : (Config.STICKER_NAME || "Jawad TechX");
    
    try {
        let media, stickerBuffer;
        
        // Handle different media types
        if (mime === "imageMessage" || mime === "stickerMessage") {
            // For images and stickers - use wa-sticker-formatter directly
            media = await mek.quoted.download();
            
            let sticker = new Sticker(media, {
                pack: pack, 
                type: StickerTypes.FULL,
                categories: ["🤩", "🎉"],
                id: crypto.randomBytes(4).toString('hex'),
                quality: 75,
                background: 'transparent',
            });
            stickerBuffer = await sticker.toBuffer();
            
        } else if (mime === "videoMessage") {
            // For videos - convert to WebP first
            media = await mek.quoted.download();
            const webpBuffer = await StickerMaker.videoToWebp(media);
            
            let sticker = new Sticker(webpBuffer, {
                pack: pack,
                type: StickerTypes.FULL,
                categories: ["🤩", "🎉"],
                id: crypto.randomBytes(4).toString('hex'),
                quality: 75,
                background: 'transparent',
            });
            stickerBuffer = await sticker.toBuffer();
            
        } else {
            return reply("*Please reply to an image, video, GIF, or sticker*");
        }
        
        // Send the sticker
        return conn.sendMessage(mek.chat, { sticker: stickerBuffer }, { quoted: mek });
        
    } catch (error) {
        console.error("Sticker creation error:", error);
        return reply(`*Error creating sticker: ${error.message}*`);
    }
});

// attp command
cmd({
    pattern: "attp",
    desc: "Convert text to a GIF sticker.",
    react: "✨",
    category: "tools", 
    use: ".attp HI",
    filename: __filename,
}, async (conn, mek, m, { args, reply }) => {
    try {
        if (!args[0]) return reply("*Please provide text!*");

        const gifBuffer = await StickerMaker.fetchGif(`https://api-fix.onrender.com/api/maker/attp?text=${encodeURIComponent(args[0])}`);
        const stickerBuffer = await StickerMaker.gifToSticker(gifBuffer);

        await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: mek });
    } catch (error) {
        console.error("ATTP error:", error);
        reply(`❌ ${error.message}`);
    }
});
