
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';
import FormData from 'form-data';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to upload to Uguu only
async function uploadToUguu(buffer, mimeType) {
    // Extension mapping
    let extension = '';
    if (mimeType.includes('image/jpeg')) extension = '.jpg';
    else if (mimeType.includes('image/png')) extension = '.png';
    else if (mimeType.includes('image/webp')) extension = '.webp';
    else extension = '.jpg';

    const fileName = `image${extension}`;

    const form = new FormData();
    form.append('files[]', buffer, fileName);

    const response = await axios.post("https://uguu.se/upload", form, {
        headers: {
            ...form.getHeaders(),
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; Mobile)"
        },
        timeout: 60000
    });

    let imageUrl = null;
    if (response.data && response.data.files && response.data.files[0]) {
        imageUrl = response.data.files[0].url;
    }

    if (!imageUrl) {
        throw new Error("Failed to upload image to Uguu");
    }

    return imageUrl;
}

// Helper function for upscale/enhance commands
async function processImageCommand(conn, mek, m, from, reply, resolusi, commandName) {
    try {
        const q = m.quoted ? m.quoted : m;
        const mime = (q.msg || q).mimetype || '';
        
        if (!/image/.test(mime)) return reply("📸 Please reply to an image");
        
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        
        const mediaBuffer = await q.download();
        const imageUrl = await uploadToUguu(mediaBuffer, mime);
        const encodedUrl = encodeURIComponent(imageUrl);
        
        const apiUrl = `https://api.nexray.web.id/tools/upscale?url=${encodedUrl}&resolusi=${resolusi}`;
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        
        await conn.sendMessage(from, { 
            image: Buffer.from(response.data), 
            caption: `*✅ Image ${commandName} (Resolution ${resolusi})*\n> *🚀 Powered by JAWAD-MD*`
        }, { quoted: mek });
        
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        console.error(`Error in ${commandName}:`, e);
        reply(`❌ Error: ${e.message}`);
    }
}

// ==================== UPSCALE COMMANDS (1-16) ====================

cmd({
    pattern: "upscale1",
    alias: ["hd1"],
    desc: "Upscale image with resolution 1",
    category: "tools",
    react: "🔼",
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    await processImageCommand(conn, mek, m, from, reply, 1, "Upscaled");
});

cmd({
    pattern: "upscale2",
    alias: ["hd2"],
    desc: "Upscale image with resolution 2",
    category: "tools",
    react: "🔼",
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    await processImageCommand(conn, mek, m, from, reply, 2, "Upscaled");
});

cmd({
    pattern: "upscale3",
    alias: ["hd3"],
    desc: "Upscale image with resolution 3",
    category: "tools",
    react: "🔼",
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    await processImageCommand(conn, mek, m, from, reply, 3, "Upscaled");
});

cmd({
    pattern: "upscale4",
    alias: ["hd4"],
    desc: "Upscale image with resolution 4",
    category: "tools",
    react: "🔼",
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    await processImageCommand(conn, mek, m, from, reply, 4, "Upscaled");
});

cmd({
    pattern: "upscale5",
    alias: ["hd5"],
    desc: "Upscale image with resolution 5",
    category: "tools",
    react: "🔼",
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    await processImageCommand(conn, mek, m, from, reply, 5, "Upscaled");
});

cmd({
    pattern: "upscale6",
    alias: ["hd6"],
    desc: "Upscale image with resolution 6",
    category: "tools",
    react: "🔼",
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    await processImageCommand(conn, mek, m, from, reply, 6, "Upscaled");
});

cmd({
    pattern: "upscale7",
    alias: ["hd7"],
    desc: "Upscale image with resolution 7",
    category: "tools",
    react: "🔼",
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    await processImageCommand(conn, mek, m, from, reply, 7, "Upscaled");
});

cmd({
    pattern: "upscale8",
    alias: ["hd8"],
    desc: "Upscale image with resolution 8",
    category: "tools",
    react: "🔼",
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    await processImageCommand(conn, mek, m, from, reply, 8, "Upscaled");
});

cmd({
    pattern: "upscale9",
    alias: ["hd9"],
    desc: "Upscale image with resolution 9",
    category: "tools",
    react: "🔼",
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    await processImageCommand(conn, mek, m, from, reply, 9, "Upscaled");
});

cmd({
    pattern: "upscale10",
    alias: ["hd10"],
    desc: "Upscale image with resolution 10",
    category: "tools",
    react: "🔼",
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    await processImageCommand(conn, mek, m, from, reply, 10, "Upscaled");
});

cmd({
    pattern: "upscale11",
    alias: ["hd11"],
    desc: "Upscale image with resolution 11",
    category: "tools",
    react: "🔼",
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    await processImageCommand(conn, mek, m, from, reply, 11, "Upscaled");
});

cmd({
    pattern: "upscale12",
    alias: ["hd12"],
    desc: "Upscale image with resolution 12",
    category: "tools",
    react: "🔼",
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    await processImageCommand(conn, mek, m, from, reply, 12, "Upscaled");
});

cmd({
    pattern: "upscale13",
    alias: ["hd13"],
    desc: "Upscale image with resolution 13",
    category: "tools",
    react: "🔼",
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    await processImageCommand(conn, mek, m, from, reply, 13, "Upscaled");
});

cmd({
    pattern: "upscale14",
    alias: ["hd14"],
    desc: "Upscale image with resolution 14",
    category: "tools",
    react: "🔼",
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    await processImageCommand(conn, mek, m, from, reply, 14, "Upscaled");
});

cmd({
    pattern: "upscale15",
    alias: ["hd15"],
    desc: "Upscale image with resolution 15",
    category: "tools",
    react: "🔼",
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    await processImageCommand(conn, mek, m, from, reply, 15, "Upscaled");
});

cmd({
    pattern: "upscale16",
    alias: ["hd16"],
    desc: "Upscale image with resolution 16",
    category: "tools",
    react: "🔼",
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    await processImageCommand(conn, mek, m, from, reply, 16, "Upscaled");
});

// ==================== UNBLUR COMMAND ====================
cmd({
    pattern: "unblur",
    alias: ["sharpen"],
    desc: "Remove blur from image",
    category: "tools",
    react: "✨",
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    try {
        const q = m.quoted ? m.quoted : m;
        const mime = (q.msg || q).mimetype || '';
        
        if (!/image/.test(mime)) return reply("📸 Please reply to an image");
        
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        
        const mediaBuffer = await q.download();
        const imageUrl = await uploadToUguu(mediaBuffer, mime);
        const encodedUrl = encodeURIComponent(imageUrl);
        
        const apiUrl = `https://api.nexray.web.id/tools/unblur?url=${encodedUrl}`;
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        
        await conn.sendMessage(from, { 
            image: Buffer.from(response.data), 
            caption: "*✅ Image Unblurred Successfully*\n> *🚀 Powered by NAWAZ-MD*"
        }, { quoted: mek });
        
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        console.error('Unblur Error:', e);
        reply(`❌ Error: ${e.message}`);
    }
});

// ==================== BLUR COMMAND ====================
cmd({
    pattern: "blurface",
    alias: ["blur"],
    desc: "Apply blur effect to image",
    category: "tools",
    react: "🌫️",
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    try {
        const q = m.quoted ? m.quoted : m;
        const mime = (q.msg || q).mimetype || '';
        
        if (!/image/.test(mime)) return reply("📸 Please reply to an image");
        
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        
        const mediaBuffer = await q.download();
        const imageUrl = await uploadToUguu(mediaBuffer, mime);
        const encodedUrl = encodeURIComponent(imageUrl);
        
        const apiUrl = `https://api.nexray.web.id/tools/blurface?url=${encodedUrl}`;
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        
        await conn.sendMessage(from, { 
            image: Buffer.from(response.data), 
            caption: "*✅ Blur Effect Applied*\n> *🚀 Powered by NAWAZ-MD*"
        }, { quoted: mek });
        
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        console.error('Blur Error:', e);
        reply(`❌ Error: ${e.message}`);
    }
});

// ==================== REMOVE BG COMMANDS ====================
cmd({
    pattern: "removebg",
    alias: ["nobg1", "rmbg1"],
    desc: "Remove background from image (v1)",
    category: "tools",
    react: "🎨",
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    try {
        const q = m.quoted ? m.quoted : m;
        const mime = (q.msg || q).mimetype || '';
        
        if (!/image/.test(mime)) return reply("📸 Please reply to an image");
        
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        
        const mediaBuffer = await q.download();
        const imageUrl = await uploadToUguu(mediaBuffer, mime);
        const encodedUrl = encodeURIComponent(imageUrl);
        
        const apiUrl = `https://api.nexray.web.id/tools/removebg?url=${encodedUrl}`;
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        
        await conn.sendMessage(from, { 
            image: Buffer.from(response.data), 
            caption: "*✅ Background Removed (v1)*\n> *🚀 Powered by NAWAZ-MD*"
        }, { quoted: mek });
        
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        console.error('RemoveBG Error:', e);
        reply(`❌ Error: ${e.message}`);
    }
});

cmd({
    pattern: "removebg2",
    alias: ["nobg2", "rmbg2"],
    desc: "Remove background from image (v2)",
    category: "tools",
    react: "🎨",
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    try {
        const q = m.quoted ? m.quoted : m;
        const mime = (q.msg || q).mimetype || '';
        
        if (!/image/.test(mime)) return reply("📸 Please reply to an image");
        
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        
        const mediaBuffer = await q.download();
        const imageUrl = await uploadToUguu(mediaBuffer, mime);
        const encodedUrl = encodeURIComponent(imageUrl);
        
        const apiUrl = `https://api.nexray.web.id/tools/v1/removebg?url=${encodedUrl}`;
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        
        await conn.sendMessage(from, { 
            image: Buffer.from(response.data), 
            caption: "*✅ Background Removed (v2)*\n> *🚀 Powered by NAWAZ-MD*"
        }, { quoted: mek });
        
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        console.error('RemoveBG2 Error:', e);
        reply(`❌ Error: ${e.message}`);
    }
});

// ==================== REMINI COMMAND ====================
cmd({
    pattern: "remini",
    alias: ["enhance2", "hd2"],
    desc: "Enhance image quality using Remini",
    category: "tools",
    react: "🌟",
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    try {
        const q = m.quoted ? m.quoted : m;
        const mime = (q.msg || q).mimetype || '';
        
        if (!/image/.test(mime)) return reply("📸 Please reply to an image");
        
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        
        const mediaBuffer = await q.download();
        const imageUrl = await uploadToUguu(mediaBuffer, mime);
        const encodedUrl = encodeURIComponent(imageUrl);
        
        const apiUrl = `https://api.nexray.web.id/tools/remini?url=${encodedUrl}`;
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        
        await conn.sendMessage(from, { 
            image: Buffer.from(response.data), 
            caption: "*✅ Image Enhanced with Remini*\n> *🚀 Powered by NAWAZ-MD*"
        }, { quoted: mek });
        
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        console.error('Remini Error:', e);
        reply(`❌ Error: ${e.message}`);
    }
});

// ==================== ENHANCE COMMANDS ====================
cmd({
    pattern: "enhance1",
    alias: ["enh1"],
    desc: "Enhance image with resolution 1",
    category: "tools",
    react: "🔆",
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    try {
        const q = m.quoted ? m.quoted : m;
        const mime = (q.msg || q).mimetype || '';
        
        if (!/image/.test(mime)) return reply("📸 Please reply to an image");
        
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        
        const mediaBuffer = await q.download();
        const imageUrl = await uploadToUguu(mediaBuffer, mime);
        const encodedUrl = encodeURIComponent(imageUrl);
        
        const apiUrl = `https://api.nexray.web.id/tools/enhancer?url=${encodedUrl}&resolusi=1`;
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        
        await conn.sendMessage(from, { 
            image: Buffer.from(response.data), 
            caption: "*✅ Image Enhanced (Resolution 1)*\n> *🚀 Powered by NAWAZ-MD*"
        }, { quoted: mek });
        
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        console.error('Enhance1 Error:', e);
        reply(`❌ Error: ${e.message}`);
    }
});

cmd({
    pattern: "enhance4",
    alias: ["enh4"],
    desc: "Enhance image with resolution 4",
    category: "tools",
    react: "🔆",
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    try {
        const q = m.quoted ? m.quoted : m;
        const mime = (q.msg || q).mimetype || '';
        
        if (!/image/.test(mime)) return reply("📸 Please reply to an image");
        
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        
        const mediaBuffer = await q.download();
        const imageUrl = await uploadToUguu(mediaBuffer, mime);
        const encodedUrl = encodeURIComponent(imageUrl);
        
        const apiUrl = `https://api.nexray.web.id/tools/enhancer?url=${encodedUrl}&resolusi=4`;
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        
        await conn.sendMessage(from, { 
            image: Buffer.from(response.data), 
            caption: "*✅ Image Enhanced (Resolution 4)*\n> *🚀 Powered by NAWAZ-MD*"
        }, { quoted: mek });
        
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        console.error('Enhance4 Error:', e);
        reply(`❌ Error: ${e.message}`);
    }
});

cmd({
    pattern: "enhance8",
    alias: ["enh8"],
    desc: "Enhance image with resolution 8",
    category: "tools",
    react: "🔆",
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    try {
        const q = m.quoted ? m.quoted : m;
        const mime = (q.msg || q).mimetype || '';
        
        if (!/image/.test(mime)) return reply("📸 Please reply to an image");
        
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        
        const mediaBuffer = await q.download();
        const imageUrl = await uploadToUguu(mediaBuffer, mime);
        const encodedUrl = encodeURIComponent(imageUrl);
        
        const apiUrl = `https://api.nexray.web.id/tools/enhancer?url=${encodedUrl}&resolusi=8`;
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        
        await conn.sendMessage(from, { 
            image: Buffer.from(response.data), 
            caption: "*✅ Image Enhanced (Resolution 8)*\n> *🚀 Powered by NAWAZ-MD*"
        }, { quoted: mek });
        
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        console.error('Enhance8 Error:', e);
        reply(`❌ Error: ${e.message}`);
    }
});

cmd({
    pattern: "enhance16",
    alias: ["enh16"],
    desc: "Enhance image with resolution 16",
    category: "tools",
    react: "🔆",
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    try {
        const q = m.quoted ? m.quoted : m;
        const mime = (q.msg || q).mimetype || '';
        
        if (!/image/.test(mime)) return reply("📸 Please reply to an image");
        
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        
        const mediaBuffer = await q.download();
        const imageUrl = await uploadToUguu(mediaBuffer, mime);
        const encodedUrl = encodeURIComponent(imageUrl);
        
        const apiUrl = `https://api.nexray.web.id/tools/enhancer?url=${encodedUrl}&resolusi=16`;
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        
        await conn.sendMessage(from, { 
            image: Buffer.from(response.data), 
            caption: "*✅ Image Enhanced (Resolution 16)*\n> *🚀 Powered by NAWAZ-MD*"
        }, { quoted: mek });
        
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        console.error('Enhance16 Error:', e);
        reply(`❌ Error: ${e.message}`);
    }
});

// ==================== COLORIZE COMMAND ====================
cmd({
    pattern: "colorize",
    alias: ["color", "addcolor"],
    desc: "Add color to black and white images",
    category: "tools",
    react: "🌈",
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    try {
        const q = m.quoted ? m.quoted : m;
        const mime = (q.msg || q).mimetype || '';
        
        if (!/image/.test(mime)) return reply("📸 Please reply to an image");
        
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        
        const mediaBuffer = await q.download();
        const imageUrl = await uploadToUguu(mediaBuffer, mime);
        const encodedUrl = encodeURIComponent(imageUrl);
        
        const apiUrl = `https://api.nexray.web.id/tools/colorize?url=${encodedUrl}`;
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        
        await conn.sendMessage(from, { 
            image: Buffer.from(response.data), 
            caption: "*✅ Image Colorized Successfully*\n> *🚀 Powered by NAWAZ-MD*"
        }, { quoted: mek });
        
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        console.error('Colorize Error:', e);
        reply(`❌ Error: ${e.message}`);
    }
});
