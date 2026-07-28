// menu.js - Optimized Version (Faster Loading)
import { fileURLToPath } from 'url';
import path from 'path';
import config from '../config.js';
import { cmd, commands } from '../command.js';
import { runtime } from '../lib/functions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SMALL CAPS (Pre-cached for speed)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const SMALL_CAPS_MAP = {
    'a': 'ᴀ','b':'ʙ','c':'ᴄ','d':'ᴅ','e':'ᴇ','f':'ғ','g':'ɢ','h':'ʜ','i':'ɪ',
    'j':'ᴊ','k':'ᴋ','l':'ʟ','m':'ᴍ','n':'ɴ','o':'ᴏ','p':'ᴘ','q':'ǫ','r':'ʀ',
    's':'s','t':'ᴛ','u':'ᴜ','v':'ᴠ','w':'ᴡ','x':'x','y':'ʏ','z':'ᴢ',
    'A':'ᴀ','B':'ʙ','C':'ᴄ','D':'ᴅ','E':'ᴇ','F':'ғ','G':'ɢ','H':'ʜ','I':'ɪ',
    'J':'ᴊ','K':'ᴋ','L':'ʟ','M':'ᴍ','N':'ɴ','O':'ᴏ','P':'ᴘ','Q':'ǫ','R':'ʀ',
    'S':'s','T':'ᴛ','U':'ᴜ','V':'ᴠ','W':'ᴡ','X':'x','Y':'ʏ','Z':'ᴢ'
};

const toSmallCaps = (text) => {
    if (!text || typeof text !== 'string') return '';
    return text.split('').map(c => SMALL_CAPS_MAP[c] || c).join('');
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CATEGORY FORMAT (Optimized)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const formatCategory = (category, cmds) => {
    const validCmds = cmds.filter(cmd => cmd.pattern && !cmd.dontAddCommandList);
    if (validCmds.length === 0) return '';
    
    let body = '';
    for (const c of validCmds) {
        body += `┃❖ ${toSmallCaps(c.pattern)}\n`;
    }
    
    return `\n╭━━❰ ${category.toUpperCase()} ❱━━⬣\n${body}╰━━━━━━━━━━━━━━⬣`;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CATEGORY ORDER (Pre-defined for speed)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const PRIORITY_ORDER = ['islamic', 'download', 'group'];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GROUP COMMANDS (Optimized - Single Loop)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const getCategorizedCommands = () => {
    const commandsArray = Array.isArray(commands) ? commands : Object.values(commands);
    const totalCommands = commandsArray.length;
    
    // Single loop to categorize
    const categoryMap = {};
    const categorySet = new Set();
    
    for (const c of commandsArray) {
        const cat = c.category;
        if (!cat || cat === 'undefined' || !cat.trim()) continue;
        if (!c.pattern || c.pattern.trim() === '') continue;
        if (c.dontAddCommandList) continue;
        
        if (!categoryMap[cat]) categoryMap[cat] = [];
        categoryMap[cat].push(c);
        categorySet.add(cat);
    }
    
    // Sort categories with priority order
    const sortedCategories = Array.from(categorySet).sort((a, b) => {
        const aIdx = PRIORITY_ORDER.indexOf(a);
        const bIdx = PRIORITY_ORDER.indexOf(b);
        if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
        if (aIdx !== -1) return -1;
        if (bIdx !== -1) return 1;
        return a.localeCompare(b);
    });
    
    // Build categorized object in order
    const categorized = {};
    for (const cat of sortedCategories) {
        if (categoryMap[cat] && categoryMap[cat].length > 0) {
            categorized[cat] = categoryMap[cat];
        }
    }
    
    return { categorized, totalCommands };
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEDIA TYPE CHECK (Pre-cached)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.gif'];

const getMediaType = (url) => {
    if (!url || typeof url !== 'string' || url.trim() === '') return null;
    const urlLower = url.toLowerCase();
    if (IMAGE_EXTENSIONS.some(ext => urlLower.endsWith(ext))) return 'image';
    if (VIDEO_EXTENSIONS.some(ext => urlLower.endsWith(ext))) return 'video';
    return null;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN COMMAND
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const localImagePath = path.join(__dirname, '../lib/jawadmd.jpg');

cmd({
    pattern: "menu",
    alias: ["m", "fullmenu"],
    use: '.menu',
    desc: "Show all bot commands",
    category: "main",
    react: "🧾",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply, userConfig }) => {
    
    // ─── Get config values (fast) ───
    const BOT_NAME = userConfig?.BOT_NAME || config.BOT_NAME || "NawazTechX";
    const OWNER_NAME = userConfig?.OWNER_NAME || config.OWNER_NAME || "Nawaz";
    const PREFIX = userConfig?.PREFIX || config.PREFIX || ".";
    const VERSION = userConfig?.VERSION || config.VERSION || "1.5.0";
    const MODE = userConfig?.MODE || config.MODE || "public";
    const BOT_IMAGE = userConfig?.BOT_IMAGE || config.BOT_IMAGE || "";
    const DESCRIPTION = userConfig?.DESCRIPTION || config.DESCRIPTION || "";

    // ─── Get categorized commands (optimized) ───
    const { categorized, totalCommands } = getCategorizedCommands();

    // ─── Build menu sections (fast) ───
    let menuSections = '';
    for (const [category, cmds] of Object.entries(categorized)) {
        menuSections += formatCategory(category, cmds);
    }

    // ─── Build menu text ───
    const dec = `╭━━❰𝙽𝙰𝚆𝙰𝚉 𝙼𝙳❱━━⬣

┃❖ Owner   : ${OWNER_NAME}
┃❖ Mode    : ${MODE}
┃❖ Prefix  : ${PREFIX}
┃❖ Version : ${VERSION}
┃❖ Runtime : ${runtime(process.uptime())}
┃❖ Total Commands : ${totalCommands}
╰━━━━━━━━━━━━━━⬣

${menuSections}

╭━━❰ 🛠 SUPPORT ❱━━⬣
┃❖ ${PREFIX}owner
┃❖ ${PREFIX}ping
┃❖ ${PREFIX}menu
╰━━━━━━━━━━━━━━⬣

> ${DESCRIPTION}`;

    // ─── Determine media (fast - no axios check) ───
    let mediaData;
    const mediaType = getMediaType(BOT_IMAGE);
    
    if (mediaType === 'image' || mediaType === 'video') {
        mediaData = { [mediaType]: { url: BOT_IMAGE } };
    } else {
        mediaData = { image: { url: localImagePath } };
    }

    // ─── Send message ───
    await conn.sendMessage(from, {
        ...mediaData,
        caption: dec,
        contextInfo: {
            mentionedJid: [sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363410129201712@newsletter',
                newsletterName: BOT_NAME,
                serverMessageId: 143
            }
        }
    }, { quoted: m });

});
