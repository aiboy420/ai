// Boy

import { fileURLToPath } from 'url';
import path from 'path';
import { cmd } from '../command.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Girl DP URLs object
const girlDpUrls = {
    url1: 'https://files.catbox.moe/yrv3t8.jpg',
    url2: 'https://files.catbox.moe/mgxcmh.jpg',
    url3: 'https://files.catbox.moe/57p7bs.jpg',
    url4: 'https://files.catbox.moe/ct3x5i.jpg',
    url5: 'https://files.catbox.moe/i32r8e.jpg',
    url6: 'https://files.catbox.moe/9vx3oh.jpg',
    url7: 'https://files.catbox.moe/tvy3fg.jpg',
    url8: 'https://files.catbox.moe/wt1017.jpg',
    url9: 'https://files.catbox.moe/3fklx4.jpg',
    url10: 'https://files.catbox.moe/blfy4i.jpg',
    url11: 'https://files.catbox.moe/kafz5k.jpg',
    url12: 'https://files.catbox.moe/rrb30k.jpg',
    url13: 'https://files.catbox.moe/5vb4n9.jpg',
    url14: 'https://files.catbox.moe/57p7bs.jpg',
    url15: 'https://files.catbox.moe/6f6qob.jpg',
    url16: 'https://files.catbox.moe/48itao.jpg',
    url17: 'https://files.catbox.moe/dsqk27.jpg',
    url18: 'https://files.catbox.moe/1uygix.jpg',
    url19: 'https://files.catbox.moe/80r3n0.jpg',
    url20: 'https://files.catbox.moe/ieyqak.jpg',
    url21: 'https://files.catbox.moe/c9bi22.webp',
    url22: 'https://files.catbox.moe/a0vrdt.jpg'
};

const caption = `*FOR YOU*`;

// Helper to get mimetype
function getMime(url) {
    return url.endsWith('.webp') ? 'image/webp' : 'image/jpeg';
}

// Girl DP Command 1
cmd({
    pattern: "girldp1",
    desc: "Send girl DP 1",
    category: "fun",
    react: "🌸",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, {
            image: { url: girlDpUrls.url1 },
            mimetype: getMime(girlDpUrls.url1),
            caption: caption
        }, { quoted: mek });
    } catch (e) {
        console.error("Error in girldp1 command:", e);
        await reply("Failed to send image. Please try again.");
    }
});

// Girl DP Command 2
cmd({
    pattern: "girldp2",
    desc: "Send girl DP 2",
    category: "fun",
    react: "🌸",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, {
            image: { url: girlDpUrls.url2 },
            mimetype: getMime(girlDpUrls.url2),
            caption: caption
        }, { quoted: mek });
    } catch (e) {
        console.error("Error in girldp2 command:", e);
        await reply("Failed to send image. Please try again.");
    }
});

// Girl DP Command 3
cmd({
    pattern: "girldp3",
    desc: "Send girl DP 3",
    category: "fun",
    react: "🌸",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, {
            image: { url: girlDpUrls.url3 },
            mimetype: getMime(girlDpUrls.url3),
            caption: caption
        }, { quoted: mek });
    } catch (e) {
        console.error("Error in girldp3 command:", e);
        await reply("Failed to send image. Please try again.");
    }
});

// Girl DP Command 4
cmd({
    pattern: "girldp4",
    desc: "Send girl DP 4",
    category: "fun",
    react: "🌸",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, {
            image: { url: girlDpUrls.url4 },
            mimetype: getMime(girlDpUrls.url4),
            caption: caption
        }, { quoted: mek });
    } catch (e) {
        console.error("Error in girldp4 command:", e);
        await reply("Failed to send image. Please try again.");
    }
});

// Girl DP Command 5
cmd({
    pattern: "girldp5",
    desc: "Send girl DP 5",
    category: "fun",
    react: "🌸",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, {
            image: { url: girlDpUrls.url5 },
            mimetype: getMime(girlDpUrls.url5),
            caption: caption
        }, { quoted: mek });
    } catch (e) {
        console.error("Error in girldp5 command:", e);
        await reply("Failed to send image. Please try again.");
    }
});

// Girl DP Command 6
cmd({
    pattern: "girldp6",
    desc: "Send girl DP 6",
    category: "fun",
    react: "🌸",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, {
            image: { url: girlDpUrls.url6 },
            mimetype: getMime(girlDpUrls.url6),
            caption: caption
        }, { quoted: mek });
    } catch (e) {
        console.error("Error in girldp6 command:", e);
        await reply("Failed to send image. Please try again.");
    }
});

// Girl DP Command 7
cmd({
    pattern: "girldp7",
    desc: "Send girl DP 7",
    category: "fun",
    react: "🌸",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, {
            image: { url: girlDpUrls.url7 },
            mimetype: getMime(girlDpUrls.url7),
            caption: caption
        }, { quoted: mek });
    } catch (e) {
        console.error("Error in girldp7 command:", e);
        await reply("Failed to send image. Please try again.");
    }
});

// Girl DP Command 8
cmd({
    pattern: "girldp8",
    desc: "Send girl DP 8",
    category: "fun",
    react: "🌸",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, {
            image: { url: girlDpUrls.url8 },
            mimetype: getMime(girlDpUrls.url8),
            caption: caption
        }, { quoted: mek });
    } catch (e) {
        console.error("Error in girldp8 command:", e);
        await reply("Failed to send image. Please try again.");
    }
});

// Girl DP Command 9
cmd({
    pattern: "girldp9",
    desc: "Send girl DP 9",
    category: "fun",
    react: "🌸",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, {
            image: { url: girlDpUrls.url9 },
            mimetype: getMime(girlDpUrls.url9),
            caption: caption
        }, { quoted: mek });
    } catch (e) {
        console.error("Error in girldp9 command:", e);
        await reply("Failed to send image. Please try again.");
    }
});

// Girl DP Command 10
cmd({
    pattern: "girldp10",
    desc: "Send girl DP 10",
    category: "fun",
    react: "🌸",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, {
            image: { url: girlDpUrls.url10 },
            mimetype: getMime(girlDpUrls.url10),
            caption: caption
        }, { quoted: mek });
    } catch (e) {
        console.error("Error in girldp10 command:", e);
        await reply("Failed to send image. Please try again.");
    }
});

// Girl DP Command 11
cmd({
    pattern: "girldp11",
    desc: "Send girl DP 11",
    category: "fun",
    react: "🌸",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, {
            image: { url: girlDpUrls.url11 },
            mimetype: getMime(girlDpUrls.url11),
            caption: caption
        }, { quoted: mek });
    } catch (e) {
        console.error("Error in girldp11 command:", e);
        await reply("Failed to send image. Please try again.");
    }
});

// Girl DP Command 12
cmd({
    pattern: "girldp12",
    desc: "Send girl DP 12",
    category: "fun",
    react: "🌸",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, {
            image: { url: girlDpUrls.url12 },
            mimetype: getMime(girlDpUrls.url12),
            caption: caption
        }, { quoted: mek });
    } catch (e) {
        console.error("Error in girldp12 command:", e);
        await reply("Failed to send image. Please try again.");
    }
});

// Girl DP Command 13
cmd({
    pattern: "girldp13",
    desc: "Send girl DP 13",
    category: "fun",
    react: "🌸",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, {
            image: { url: girlDpUrls.url13 },
            mimetype: getMime(girlDpUrls.url13),
            caption: caption
        }, { quoted: mek });
    } catch (e) {
        console.error("Error in girldp13 command:", e);
        await reply("Failed to send image. Please try again.");
    }
});

// Girl DP Command 14
cmd({
    pattern: "girldp14",
    desc: "Send girl DP 14",
    category: "fun",
    react: "🌸",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, {
            image: { url: girlDpUrls.url14 },
            mimetype: getMime(girlDpUrls.url14),
            caption: caption
        }, { quoted: mek });
    } catch (e) {
        console.error("Error in girldp14 command:", e);
        await reply("Failed to send image. Please try again.");
    }
});

// Girl DP Command 15
cmd({
    pattern: "girldp15",
    desc: "Send girl DP 15",
    category: "fun",
    react: "🌸",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, {
            image: { url: girlDpUrls.url15 },
            mimetype: getMime(girlDpUrls.url15),
            caption: caption
        }, { quoted: mek });
    } catch (e) {
        console.error("Error in girldp15 command:", e);
        await reply("Failed to send image. Please try again.");
    }
});

// Girl DP Command 16
cmd({
    pattern: "girldp16",
    desc: "Send girl DP 16",
    category: "fun",
    react: "🌸",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, {
            image: { url: girlDpUrls.url16 },
            mimetype: getMime(girlDpUrls.url16),
            caption: caption
        }, { quoted: mek });
    } catch (e) {
        console.error("Error in girldp16 command:", e);
        await reply("Failed to send image. Please try again.");
    }
});

// Girl DP Command 17
cmd({
    pattern: "girldp17",
    desc: "Send girl DP 17",
    category: "fun",
    react: "🌸",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, {
            image: { url: girlDpUrls.url17 },
            mimetype: getMime(girlDpUrls.url17),
            caption: caption
        }, { quoted: mek });
    } catch (e) {
        console.error("Error in girldp17 command:", e);
        await reply("Failed to send image. Please try again.");
    }
});

// Girl DP Command 18
cmd({
    pattern: "girldp18",
    desc: "Send girl DP 18",
    category: "fun",
    react: "🌸",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, {
            image: { url: girlDpUrls.url18 },
            mimetype: getMime(girlDpUrls.url18),
            caption: caption
        }, { quoted: mek });
    } catch (e) {
        console.error("Error in girldp18 command:", e);
        await reply("Failed to send image. Please try again.");
    }
});

// Girl DP Command 19
cmd({
    pattern: "girldp19",
    desc: "Send girl DP 19",
    category: "fun",
    react: "🌸",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, {
            image: { url: girlDpUrls.url19 },
            mimetype: getMime(girlDpUrls.url19),
            caption: caption
        }, { quoted: mek });
    } catch (e) {
        console.error("Error in girldp19 command:", e);
        await reply("Failed to send image. Please try again.");
    }
});

// Girl DP Command 20
cmd({
    pattern: "girldp20",
    desc: "Send girl DP 20",
    category: "fun",
    react: "🌸",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, {
            image: { url: girlDpUrls.url20 },
            mimetype: getMime(girlDpUrls.url20),
            caption: caption
        }, { quoted: mek });
    } catch (e) {
        console.error("Error in girldp20 command:", e);
        await reply("Failed to send image. Please try again.");
    }
});

// Girl DP Command 21
cmd({
    pattern: "girldp21",
    desc: "Send girl DP 21",
    category: "fun",
    react: "🌸",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, {
            image: { url: girlDpUrls.url21 },
            mimetype: getMime(girlDpUrls.url21),
            caption: caption
        }, { quoted: mek });
    } catch (e) {
        console.error("Error in girldp21 command:", e);
        await reply("Failed to send image. Please try again.");
    }
});

// Girl DP Command 22
cmd({
    pattern: "girldp22",
    desc: "Send girl DP 22",
    category: "fun",
    react: "🌸",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, {
            image: { url: girlDpUrls.url22 },
            mimetype: getMime(girlDpUrls.url22),
            caption: caption
        }, { quoted: mek });
    } catch (e) {
        console.error("Error in girldp22 command:", e);
        await reply("Failed to send image. Please try again.");
    }
});


