
import { fileURLToPath } from 'url';
import path from 'path';
import { cmd } from '../command.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Boy DP URLs
const boyDpUrls = {
    url1: 'https://files.catbox.moe/y1l7ed.jpg',
    url2: 'https://files.catbox.moe/4kujce.jpg',
    url3: 'https://files.catbox.moe/vrrn72.jpg',
    url4: 'https://files.catbox.moe/7w87wk.jpg',
    url5: 'https://files.catbox.moe/jf7cwz.jpg',
    url6: 'https://files.catbox.moe/gc3c1g.jpg',
    url7: 'https://files.catbox.moe/nufhim.jpg',
    url8: 'https://files.catbox.moe/yfce44.jpg',
    url9: 'https://files.catbox.moe/gdhv0h.jpg',
    url10: 'https://files.catbox.moe/ptwcm0.jpg',
    url11: 'https://files.catbox.moe/3upyka.jpg',
    url12: 'https://files.catbox.moe/erj2f8.jpg',
    url13: 'https://files.catbox.moe/g50vs5.jpg',
    url14: 'https://files.catbox.moe/1jta5y.jpg',
    url15: 'https://files.catbox.moe/siph10.jpg',
    url16: 'https://files.catbox.moe/mxlbfq.jpg',
    url17: 'https://files.catbox.moe/3aqy6x.jpg',
    url18: 'https://files.catbox.moe/0qvy21.jpg',
    url19: 'https://files.catbox.moe/szdoa0.jpg',
    url20: 'https://files.catbox.moe/3upyka.jpg',
    url21: 'https://files.catbox.moe/jadoal.jpg',
    url22: 'https://files.catbox.moe/yfce44.jpg'
};

const caption = `* BOY DP*`;

// Boy DP 1
cmd({ pattern: "boydp1", desc: "Send boy DP 1", category: "fun", react: "👦", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { image: { url: boyDpUrls.url1 }, mimetype: 'image/jpeg', caption }, { quoted: mek });
    } catch (e) { console.error("Error in boydp1:", e); await reply("Failed to send image."); }
});

// Boy DP 2
cmd({ pattern: "boydp2", desc: "Send boy DP 2", category: "fun", react: "👦", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { image: { url: boyDpUrls.url2 }, mimetype: 'image/jpeg', caption }, { quoted: mek });
    } catch (e) { console.error("Error in boydp2:", e); await reply("Failed to send image."); }
});

// Boy DP 3
cmd({ pattern: "boydp3", desc: "Send boy DP 3", category: "fun", react: "👦", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { image: { url: boyDpUrls.url3 }, mimetype: 'image/jpeg', caption }, { quoted: mek });
    } catch (e) { console.error("Error in boydp3:", e); await reply("Failed to send image."); }
});

// Boy DP 4
cmd({ pattern: "boydp4", desc: "Send boy DP 4", category: "fun", react: "👦", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { image: { url: boyDpUrls.url4 }, mimetype: 'image/jpeg', caption }, { quoted: mek });
    } catch (e) { console.error("Error in boydp4:", e); await reply("Failed to send image."); }
});

// Boy DP 5
cmd({ pattern: "boydp5", desc: "Send boy DP 5", category: "fun", react: "👦", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { image: { url: boyDpUrls.url5 }, mimetype: 'image/jpeg', caption }, { quoted: mek });
    } catch (e) { console.error("Error in boydp5:", e); await reply("Failed to send image."); }
});

// Boy DP 6
cmd({ pattern: "boydp6", desc: "Send boy DP 6", category: "fun", react: "👦", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { image: { url: boyDpUrls.url6 }, mimetype: 'image/jpeg', caption }, { quoted: mek });
    } catch (e) { console.error("Error in boydp6:", e); await reply("Failed to send image."); }
});

// Boy DP 7
cmd({ pattern: "boydp7", desc: "Send boy DP 7", category: "fun", react: "👦", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { image: { url: boyDpUrls.url7 }, mimetype: 'image/jpeg', caption }, { quoted: mek });
    } catch (e) { console.error("Error in boydp7:", e); await reply("Failed to send image."); }
});

// Boy DP 8
cmd({ pattern: "boydp8", desc: "Send boy DP 8", category: "fun", react: "👦", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { image: { url: boyDpUrls.url8 }, mimetype: 'image/jpeg', caption }, { quoted: mek });
    } catch (e) { console.error("Error in boydp8:", e); await reply("Failed to send image."); }
});

// Boy DP 9
cmd({ pattern: "boydp9", desc: "Send boy DP 9", category: "fun", react: "👦", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { image: { url: boyDpUrls.url9 }, mimetype: 'image/jpeg', caption }, { quoted: mek });
    } catch (e) { console.error("Error in boydp9:", e); await reply("Failed to send image."); }
});

// Boy DP 10
cmd({ pattern: "boydp10", desc: "Send boy DP 10", category: "fun", react: "👦", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { image: { url: boyDpUrls.url10 }, mimetype: 'image/jpeg', caption }, { quoted: mek });
    } catch (e) { console.error("Error in boydp10:", e); await reply("Failed to send image."); }
});

// Boy DP 11
cmd({ pattern: "boydp11", desc: "Send boy DP 11", category: "fun", react: "👦", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { image: { url: boyDpUrls.url11 }, mimetype: 'image/jpeg', caption }, { quoted: mek });
    } catch (e) { console.error("Error in boydp11:", e); await reply("Failed to send image."); }
});

// Boy DP 12
cmd({ pattern: "boydp12", desc: "Send boy DP 12", category: "fun", react: "👦", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { image: { url: boyDpUrls.url12 }, mimetype: 'image/jpeg', caption }, { quoted: mek });
    } catch (e) { console.error("Error in boydp12:", e); await reply("Failed to send image."); }
});

// Boy DP 13
cmd({ pattern: "boydp13", desc: "Send boy DP 13", category: "fun", react: "👦", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { image: { url: boyDpUrls.url13 }, mimetype: 'image/jpeg', caption }, { quoted: mek });
    } catch (e) { console.error("Error in boydp13:", e); await reply("Failed to send image."); }
});

// Boy DP 14
cmd({ pattern: "boydp14", desc: "Send boy DP 14", category: "fun", react: "👦", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { image: { url: boyDpUrls.url14 }, mimetype: 'image/jpeg', caption }, { quoted: mek });
    } catch (e) { console.error("Error in boydp14:", e); await reply("Failed to send image."); }
});

// Boy DP 15
cmd({ pattern: "boydp15", desc: "Send boy DP 15", category: "fun", react: "👦", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { image: { url: boyDpUrls.url15 }, mimetype: 'image/jpeg', caption }, { quoted: mek });
    } catch (e) { console.error("Error in boydp15:", e); await reply("Failed to send image."); }
});

// Boy DP 16
cmd({ pattern: "boydp16", desc: "Send boy DP 16", category: "fun", react: "👦", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { image: { url: boyDpUrls.url16 }, mimetype: 'image/jpeg', caption }, { quoted: mek });
    } catch (e) { console.error("Error in boydp16:", e); await reply("Failed to send image."); }
});

// Boy DP 17
cmd({ pattern: "boydp17", desc: "Send boy DP 17", category: "fun", react: "👦", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { image: { url: boyDpUrls.url17 }, mimetype: 'image/jpeg', caption }, { quoted: mek });
    } catch (e) { console.error("Error in boydp17:", e); await reply("Failed to send image."); }
});

// Boy DP 18
cmd({ pattern: "boydp18", desc: "Send boy DP 18", category: "fun", react: "👦", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { image: { url: boyDpUrls.url18 }, mimetype: 'image/jpeg', caption }, { quoted: mek });
    } catch (e) { console.error("Error in boydp18:", e); await reply("Failed to send image."); }
});

// Boy DP 19
cmd({ pattern: "boydp19", desc: "Send boy DP 19", category: "fun", react: "👦", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { image: { url: boyDpUrls.url19 }, mimetype: 'image/jpeg', caption }, { quoted: mek });
    } catch (e) { console.error("Error in boydp19:", e); await reply("Failed to send image."); }
});

// Boy DP 20
cmd({ pattern: "boydp20", desc: "Send boy DP 20", category: "fun", react: "👦", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { image: { url: boyDpUrls.url20 }, mimetype: 'image/jpeg', caption }, { quoted: mek });
    } catch (e) { console.error("Error in boydp20:", e); await reply("Failed to send image."); }
});

// Boy DP 21
cmd({ pattern: "boydp21", desc: "Send boy DP 21", category: "fun", react: "👦", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { image: { url: boyDpUrls.url21 }, mimetype: 'image/jpeg', caption }, { quoted: mek });
    } catch (e) { console.error("Error in boydp21:", e); await reply("Failed to send image."); }
});

// Boy DP 22
cmd({ pattern: "boydp22", desc: "Send boy DP 22", category: "fun", react: "👦", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { image: { url: boyDpUrls.url22 }, mimetype: 'image/jpeg', caption }, { quoted: mek });
    } catch (e) { console.error("Error in boydp22:", e); await reply("Failed to send image."); }
});
