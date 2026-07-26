// plugins/utility.js - ESM Version
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import config from '../config.js';
import axios from 'axios';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } from '../lib/functions.js';

const __filename = fileURLToPath(import.meta.url);

// ==================== GPASS COMMAND ====================
cmd({
    pattern: "gpass",
    desc: "Generate a strong password.",
    category: "other",
    react: "🔐",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        const length = args[0] ? parseInt(args[0]) : 12;
        if (isNaN(length) || length < 8) {
            return reply('Please provide a valid length for the password (Minimum 08 Characters).');
        }

        const generatePassword = (len) => {
            const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?';
            let password = '';
            for (let i = 0; i < len; i++) {
                const randomIndex = crypto.randomInt(0, charset.length);
                password += charset[randomIndex];
            }
            return password;
        };

        const password = generatePassword(length);
        const message = `🔐 *Your Strong Password* 🔐\n\nPlease find your generated password below`;

        await conn.sendMessage(from, { text: message }, { quoted: mek });
        await conn.sendMessage(from, { text: password }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`❌ Error generating password🤕: ${e.message}`);
    }
});

// ==================== GETIMAGE COMMAND ====================
cmd({
    pattern: "getimage",
    alias: ["tophoto", "url2image", "urltoimage", "imagefromurl", "fetchimage"],
    desc: "Convert image URL to WhatsApp image",
    category: "utility",
    react: "🖼️",
    filename: __filename
}, async (conn, mek, m, { from, reply, text }) => {
    try {
        if (!text) return reply('Please provide an image URL\nExample: !getimage https://example.com/image.jpg');

        const imageUrl = text.trim();

        if (!imageUrl.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i)) {
            return reply('❌ Invalid image URL! Must be direct link to image (jpg/png/gif/webp)');
        }

        try {
            const response = await axios.head(imageUrl);
            if (!response.headers['content-type']?.startsWith('image/')) {
                return reply('❌ URL does not point to a valid image');
            }
        } catch (e) {
            return reply('❌ Could not access image URL. Please check the link');
        }

        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: 'Here is your image from the URL'
        }, { quoted: mek });

    } catch (error) {
        console.error('GetImage Error:', error);
        reply('❌ Failed to process image. Error: ' + error.message);
    }
});

// ==================== OWNER COMMAND ====================
cmd({
    pattern: "owner",
    desc: "Get owner number",
    category: "main",
    react: "🎮",
    filename: __filename
}, async (sock, m, msg, { from }) => {
    try {
        await sock.sendMessage(from, { react: { text: "📇", key: m.key } });
        await sock.sendPresenceUpdate("composing", from);
        await new Promise(resolve => setTimeout(resolve, 1000));

        const vcard = 'BEGIN:VCARD\n' +
            'VERSION:3.0\n' +
            `FN:${config.OWNER_NAME}\n` +
            `ORG:${config.BOT_NAME} Team;\n` +
            `TEL;type=CELL;type=VOICE;waid=${config.OWNER_NUMBER}:${'+' + config.OWNER_NUMBER}\n` +
            'END:VCARD';

        await sock.sendMessage(from, {
            contacts: {
                displayName: config.OWNER_NAME,
                contacts: [{ vcard }]
            }
        });

        await sock.sendMessage(from, { react: { text: "✅", key: m.key } });

    } catch (e) {
        console.error("Error sending contact:", e);
        await sock.sendMessage(from, {
            text: `❌ Couldn't send contact:\n${e.message}`
        });
    }
});

// ==================== SHAYARI COMMAND ====================
cmd({
    pattern: "shayari",
    alias: ["shayar", "poetry"],
    desc: "Get a random romantic shayari",
    react: "💖",
    category: "fun",
    use: '.shayari',
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const apiUrl = 'https://shizoapi.onrender.com/api/texts/shayari?apikey=shizo';
        const { data } = await axios.get(apiUrl);
        if (!data.result) return reply("❌ Shayari dil mein nahi aayi, phir try karo!");
        const shayariMessage = `${data.result}`.trim();
        await reply(shayariMessage);
    } catch (error) {
        console.error('Shayari Error:', error);
        reply("❌ Aaj dil mein shayari nahi hai... Kal try karna!");
    }
});

// ==================== GITCLONE COMMAND ====================
cmd({
    pattern: "gitclone",
    alias: ["git"],
    desc: "Download any public GitHub repo as ZIP",
    category: "download",
    react: "⬇️",
    filename: __filename
}, async (conn, mek, m, { args, reply }) => {
    try {
        if (!args[0]) return reply("📌 *Usage:* .git <repo_link>");

        await conn.sendMessage(m.chat, { react: { text: '⬇️', key: mek.key } });

        const url = args[0];
        const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)(?:\/|$)/i);
        if (!match) {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: mek.key } });
            return reply("❌ Invalid GitHub link.");
        }

        const owner = match[1];
        const repo = match[2].replace(/\.git$/, '');

        const branches = ['main', 'master'];
        let zipData = null;
        for (const branch of branches) {
            const zipUrl = `https://github.com/${owner}/${repo}/archive/refs/heads/${branch}.zip`;
            try {
                const res = await axios.get(zipUrl, { responseType: 'arraybuffer' });
                zipData = res.data;
                break;
            } catch {}
        }

        if (!zipData) {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: mek.key } });
            return reply("❌ Failed to download. Branch not found.");
        }

        const filePath = path.join(process.cwd(), `${repo}.zip`);
        fs.writeFileSync(filePath, zipData);

        await conn.sendMessage(m.chat, {
            document: fs.readFileSync(filePath),
            fileName: `${repo}.zip`,
            mimetype: 'application/zip'
        }, { quoted: mek });

        fs.unlinkSync(filePath);
        await conn.sendMessage(m.chat, { react: { text: '✅', key: mek.key } });

    } catch (e) {
        console.error("Git Download Error:", e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: mek.key } });
        reply("❌ Failed to download repo.");
    }
});

// ==================== GITHUBSTALK COMMAND ====================
cmd({
    pattern: "githubstalk",
    desc: "Fetch detailed GitHub user profile including profile picture.",
    category: "main",
    react: "🖥️",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        const username = args[0];
        if (!username) return reply("Please provide a GitHub username.");
        
        const apiUrl = `https://api.github.com/users/${username}`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        let userInfo = `👤 *Username*: ${data.name || data.login}\n🔗 *Github Url*:(${data.html_url})\n📝 *Bio*: ${data.bio || 'Not available'}\n🏙️ *Location*: ${data.location || 'Unknown'}\n📊 *Public Repos*: ${data.public_repos}\n👥 *Followers*: ${data.followers} | Following: ${data.following}\n📅 *Created At*: ${new Date(data.created_at).toDateString()}\n🔭 *Public Gists*: ${data.public_gists}\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ Jᴀᴡᴀᴅ TᴇᴄʜX`;
        
        await conn.sendMessage(from, { image: { url: data.avatar_url }, caption: userInfo }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`error: ${e.response ? e.response.data.message : e.message}`);
    }
});

// ==================== GARL COMMAND ====================
cmd({
    pattern: "garl",
    alias: ["imgloli"],
    react: '😎',
    desc: "Download anime loli images.",
    category: "anime",
    use: '.loli',
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        let res = await axios.get('https://api.lolicon.app/setu/v2?num=1&r18=0&tag=lolicon');
        let wm = `😎 Random Garl image\n\n©ᴘᴏᴡᴇʀᴇᴅ ʙʏ Jᴀᴡᴀᴅ TᴇᴄʜX`;
        await conn.sendMessage(from, { image: { url: res.data.data[0].urls.original }, caption: wm }, { quoted: mek });
    } catch (e) {
        reply("I cant find this anime.");
        console.log(e);
    }
});

// ==================== WAIFU COMMAND ====================
cmd({
    pattern: "waifu",
    alias: ["imgwaifu"],
    react: '💫',
    desc: "Download anime waifu images.",
    category: "anime",
    use: '.waifu',
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        let res = await axios.get('https://api.waifu.pics/sfw/waifu');
        let wm = `🩵 Random Waifu image\n\n©ᴘᴏᴡᴇʀᴇᴅ ʙʏ Jᴀᴡᴀᴅ TᴇᴄʜX`;
        await conn.sendMessage(from, { image: { url: res.data.url }, caption: wm }, { quoted: mek });
    } catch (e) {
        reply("I cant find this anime.");
        console.log(e);
    }
});

// ==================== NEKO COMMAND ====================
cmd({
    pattern: "neko",
    alias: ["imgneko"],
    react: '💫',
    desc: "Download anime neko images.",
    category: "anime",
    use: '.neko',
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        let res = await axios.get('https://api.waifu.pics/sfw/neko');
        let wm = `🩷 Random neko image\n\n©ᴘᴏᴡᴇʀᴇᴅ ʙʏ Jᴀᴡᴀᴅ TᴇᴄʜX`;
        await conn.sendMessage(from, { image: { url: res.data.url }, caption: wm }, { quoted: mek });
    } catch (e) {
        reply("I cant find this anime.");
        console.log(e);
    }
});

// ==================== MEGUMIN COMMAND ====================
cmd({
    pattern: "megumin",
    alias: ["imgmegumin"],
    react: '💕',
    desc: "Download anime megumin images.",
    category: "anime",
    use: '.megumin',
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        let res = await axios.get('https://api.waifu.pics/sfw/megumin');
        let wm = `❤️‍🔥 Random megumin image\n\n©ᴘᴏᴡᴇʀᴇᴅ ʙʏ Jᴀᴡᴀᴅ TᴇᴄʜX`;
        await conn.sendMessage(from, { image: { url: res.data.url }, caption: wm }, { quoted: mek });
    } catch (e) {
        reply("I cant find this anime.");
        console.log(e);
    }
});

// ==================== MAID COMMAND ====================
cmd({
    pattern: "maid",
    alias: ["imgmaid"],
    react: '💫',
    desc: "Download anime maid images.",
    category: "anime",
    use: '.maid',
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        let res = await axios.get('https://api.waifu.im/search/?included_tags=maid');
        let wm = `😎 Random maid image\n\n©ᴘᴏᴡᴇʀᴇᴅ ʙʏ Jᴀᴡᴀᴅ TᴇᴄʜX`;
        await conn.sendMessage(from, { image: { url: res.data.images[0].url }, caption: wm }, { quoted: mek });
    } catch (e) {
        reply("I cant find this anime.");
        console.log(e);
    }
});

// ==================== AWOO COMMAND ====================
cmd({
    pattern: "awoo",
    alias: ["imgawoo"],
    react: '😎',
    desc: "Download anime awoo images.",
    category: "anime",
    use: '.awoo',
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        let res = await axios.get('https://api.waifu.pics/sfw/awoo');
        let wm = `😎 Random awoo image\n\n©ᴘᴏᴡᴇʀᴇᴅ ʙʏ Jᴀᴡᴀᴅ TᴇᴄʜX`;
        await conn.sendMessage(from, { image: { url: res.data.url }, caption: wm }, { quoted: mek });
    } catch (e) {
        reply("I cant find this anime.");
        console.log(e);
    }
});

// ==================== ANIMEGIRL COMMANDS ====================
cmd({
    pattern: "animegirl",
    desc: "Fetch a random anime girl image.",
    category: "fun",
    react: "🧚🏻",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const apiUrl = `https://api.waifu.pics/sfw/waifu`;
        const response = await axios.get(apiUrl);
        const data = response.data;
        await conn.sendMessage(from, { image: { url: data.url }, caption: '*ANIME GIRL IMAGE* 🥳\n\n\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ Jᴀᴡᴀᴅ TᴇᴄʜX' }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`*Error Fetching Anime Girl image*: ${e.message}`);
    }
});

cmd({
    pattern: "animegirl1",
    desc: "Fetch a random anime girl image.",
    category: "fun",
    react: "🧚🏻",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const apiUrl = `https://api.waifu.pics/sfw/waifu`;
        const response = await axios.get(apiUrl);
        const data = response.data;
        await conn.sendMessage(from, { image: { url: data.url }, caption: 'ANIME GIRL IMAGE 👾\n\n\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ Jᴀᴡᴀᴅ TᴇᴄʜX' }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`*Error Fetching Anime Girl image*: ${e.message}`);
    }
});

cmd({
    pattern: "animegirl2",
    desc: "Fetch a random anime girl image.",
    category: "fun",
    react: "🧚🏻",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const apiUrl = `https://api.waifu.pics/sfw/waifu`;
        const response = await axios.get(apiUrl);
        const data = response.data;
        await conn.sendMessage(from, { image: { url: data.url }, caption: 'ANIME GIRL IMAGE 👾\n\n\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ Jᴀᴡᴀᴅ TᴇᴄʜX' }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`*Error Fetching Anime Girl image*: ${e.message}`);
    }
});

cmd({
    pattern: "animegirl3",
    desc: "Fetch a random anime girl image.",
    category: "fun",
    react: "🧚🏻",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const apiUrl = `https://api.waifu.pics/sfw/waifu`;
        const response = await axios.get(apiUrl);
        const data = response.data;
        await conn.sendMessage(from, { image: { url: data.url }, caption: 'ANIME GIRL IMAGE 👾\n\n\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ Jᴀᴡᴀᴅ TᴇᴄʜX' }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`*Error Fetching Anime Girl image*: ${e.message}`);
    }
});

cmd({
    pattern: "animegirl4",
    desc: "Fetch a random anime girl image.",
    category: "fun",
    react: "🧚🏻",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const apiUrl = `https://api.waifu.pics/sfw/waifu`;
        const response = await axios.get(apiUrl);
        const data = response.data;
        await conn.sendMessage(from, { image: { url: data.url }, caption: 'ANIME GIRL IMAGE 👾\n\n\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ Jᴀᴡᴀᴅ TᴇᴄʜX' }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`*Error Fetching Anime Girl image*: ${e.message}`);
    }
});

cmd({
    pattern: "animegirl5",
    desc: "Fetch a random anime girl image.",
    category: "fun",
    react: "🧚🏻",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const apiUrl = `https://api.waifu.pics/sfw/waifu`;
        const response = await axios.get(apiUrl);
        const data = response.data;
        await conn.sendMessage(from, { image: { url: data.url }, caption: 'ANIME GIRL IMAGE 👾\n\n\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ Jᴀᴡᴀᴅ TᴇᴄʜX' }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`*Error Fetching Anime Girl image*: ${e.message}`);
    }
});

// ==================== ANIME COMMAND ====================
cmd({
    pattern: "anime",
    desc: "anime the bot",
    category: "main",
    react: "⛱️",
    filename: __filename
}, async (conn, mek, m, { from }) => {
    try {
        let dec = `> KHAN-MD ANIME IMGS*`;
        const images = [
            'https://telegra.ph/file/b26f27aa5daaada031b90.jpg',
            'https://telegra.ph/file/51b44e4b086667361061b.jpg',
            'https://telegra.ph/file/7d165d73f914985542537.jpg',
            'https://telegra.ph/file/3d9732d2657d2d72dc102.jpg',
            'https://telegra.ph/file/8daf7e432a646f3ebe7eb.jpg',
            'https://telegra.ph/file/7514b18ea89da924e7496.jpg',
            'https://telegra.ph/file/ce9cb5acd2cec7693d76b.jpg'
        ];
        for (const img of images) {
            await conn.sendMessage(from, { image: { url: img }, caption: dec }, { quoted: mek });
        }
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

// ==================== ANIME1 COMMAND ====================
cmd({
    pattern: "anime1",
    desc: "Animal image.",
    react: "🧚‍♀️",
    category: "other",
    filename: __filename
}, async (conn, mek, m, { from }) => {
    try {
        const images = [
            'https://i.waifu.pics/aD7t0Bc.jpg',
            'https://i.waifu.pics/PQO5wPN.jpg',
            'https://i.waifu.pics/5At1P4A.jpg',
            'https://i.waifu.pics/MjtH3Ha.jpg',
            'https://i.waifu.pics/QQW7VKy.jpg'
        ];
        for (const img of images) {
            await conn.sendMessage(from, { image: { url: img }, caption: '> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ Jᴀᴡᴀᴅ TᴇᴄʜX' }, { quoted: mek });
        }
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

// ==================== ANIME2 COMMAND ====================
cmd({
    pattern: "anime2",
    desc: "Animal image.",
    react: "🧚‍♀️",
    category: "other",
    filename: __filename
}, async (conn, mek, m, { from }) => {
    try {
        const images = [
            'https://i.waifu.pics/0r1Bn88.jpg',
            'https://i.waifu.pics/2Xdpuov.png',
            'https://i.waifu.pics/0hx-3AP.png',
            'https://i.waifu.pics/q054x0_.png',
            'https://i.waifu.pics/4lyqRvd.jpg'
        ];
        for (const img of images) {
            await conn.sendMessage(from, { image: { url: img }, caption: '> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ Jᴀᴡᴀᴅ TᴇᴄʜX' }, { quoted: mek });
        }
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

// ==================== ANIME3 COMMAND ====================
cmd({
    pattern: "anime3",
    desc: "Animal image.",
    react: "🧚‍♀️",
    category: "other",
    filename: __filename
}, async (conn, mek, m, { from }) => {
    try {
        const images = [
            'https://i.waifu.pics/gnpc_Lr.jpeg',
            'https://i.waifu.pics/P6X-ph6.jpg',
            'https://i.waifu.pics/~p5W9~k.png',
            'https://i.waifu.pics/7Apu5C9.jpg',
            'https://i.waifu.pics/OTRfON6.jpg'
        ];
        for (const img of images) {
            await conn.sendMessage(from, { image: { url: img }, caption: '> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ Jᴀᴡᴀᴅ TᴇᴄʜX' }, { quoted: mek });
        }
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

// ==================== ANIME4 COMMAND ====================
cmd({
    pattern: "anime4",
    desc: "Animal image.",
    react: "🧚‍♀️",
    category: "other",
    filename: __filename
}, async (conn, mek, m, { from }) => {
    try {
        const images = [
            'https://i.waifu.pics/aGgUm80.jpg',
            'https://i.waifu.pics/i~RQhRD.png',
            'https://i.waifu.pics/94LH-aU.jpg',
            'https://i.waifu.pics/V8hvqfK.jpg',
            'https://i.waifu.pics/lMiXE7j.png'
        ];
        for (const img of images) {
            await conn.sendMessage(from, { image: { url: img }, caption: '> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ Jᴀᴡᴀᴅ TᴇᴄʜX' }, { quoted: mek });
        }
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

// ==================== ANIME5 COMMAND ====================
cmd({
    pattern: "anime5",
    desc: "Animal image.",
    react: "🧚‍♀️",
    category: "other",
    filename: __filename
}, async (conn, mek, m, { from }) => {
    try {
        const images = [
            'https://i.waifu.pics/-ABlAvr.jpg',
            'https://i.waifu.pics/HNEg0-Q.png',
            'https://i.waifu.pics/3x~ovC6.jpg',
            'https://i.waifu.pics/brv-GJu.jpg',
            'https://i.waifu.pics/FWE8ggD.png'
        ];
        for (const img of images) {
            await conn.sendMessage(from, { image: { url: img }, caption: '> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ Jᴀᴡᴀᴅ TᴇᴄʜX' }, { quoted: mek });
        }
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

// ==================== DOG COMMAND ====================
cmd({
    pattern: "dog",
    desc: "Fetch a random dog image.",
    category: "fun",
    react: "🐶",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const apiUrl = `https://dog.ceo/api/breeds/image/random`;
        const response = await axios.get(apiUrl);
        const data = response.data;
        await conn.sendMessage(from, { image: { url: data.message }, caption: '> *© Powered By JAWADTECHX*' }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`Error fetching dog image: ${e.message}`);
    }
});
