// menu.js - Fixed Fetch Error
import { fileURLToPath } from 'url';
import path from 'path';
import config from '../config.js';
import { cmd, commands } from '../command.js';
import { runtime } from '../lib/functions.js';
import https from 'https';
import http from 'http';

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

    let body = `╭━━〔 *${category.toUpperCase()}* 〕━━┈⊷\n`;
    body += `┃❖╭─────────────·๏\n`;

    for (const c of validCmds) {
        body += `┃❖┃ ${toSmallCaps(c.pattern)}\n`;
    }

    body += `┃❖└───────────┈⊷\n`;
    body += `╰──────────────┈⊷\n`;

    return body;
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
    
    const sortedCategories = Array.from(categorySet).sort((a, b) => {
        const aIdx = PRIORITY_ORDER.indexOf(a);
        const bIdx = PRIORITY_ORDER.indexOf(b);
        if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
        if (aIdx !== -1) return -1;
        if (bIdx !== -1) return 1;
        return a.localeCompare(b);
    });
    
    const categorized = {};
    for (const cat of sortedCategories) {
        if (categoryMap[cat] && categoryMap[cat].length > 0) {
            categorized[cat] = categoryMap[cat];
        }
    }
    
    return { categorized, totalCommands };
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHECK IMAGE URL FUNCTION (Without fetch)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const checkImageUrl = (url) => {
    return new Promise((resolve) => {
        const protocol = url.startsWith('https') ? https : http;
        const request = protocol.get(url, (response) => {
            // Check if content-type is image
            const contentType = response.headers['content-type'] || '';
            if (contentType.startsWith('image/')) {
                resolve(true);
            } else {
                resolve(false);
            }
            response.destroy();
        });
        request.on('error', () => resolve(false));
        request.setTimeout(3000, () => {
            request.destroy();
            resolve(false);
        });
    });
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN COMMAND
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// 🖼️ FIXED IMAGE URL
const MENU_IMAGE_URL = "https://files.catbox.moe/72h800.png";

cmd({
    pattern: "menu",
    alias: ["m", "fullmenu"],
    use: ".menu",
    desc: "Show all bot commands",
    category: "main",
    react: "🧾",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply, userConfig }) => {
    try {
        // ─── Get config values ───
        const BOT_NAME = userConfig?.BOT_NAME || config.BOT_NAME || "NawazTechX";
        const OWNER_NAME = userConfig?.OWNER_NAME || config.OWNER_NAME || "Nawaz";
        const PREFIX = userConfig?.PREFIX || config.PREFIX || ".";
        const VERSION = userConfig?.VERSION || config.VERSION || "1.5.0";
        const MODE = userConfig?.MODE || config.MODE || "public";
        const DESCRIPTION = userConfig?.DESCRIPTION || config.DESCRIPTION || "";

        // ─── Check if image URL is valid ───
        const isValid = await checkImageUrl(MENU_IMAGE_URL);
        
        let imageUrl = MENU_IMAGE_URL;
        if (!isValid) {
            console.log("⚠️ Menu image URL not accessible, using fallback");
            // Fallback image - if main URL fails
            imageUrl = "https://i.ibb.co/HfQ5BpTg/jawadmd.png";
        }

        // ─── Get categorized commands ───
        const { categorized, totalCommands } = getCategorizedCommands();

        // ─── Build menu sections ───
        let menuSections = '';
        for (const [category, cmds] of Object.entries(categorized)) {
            if (cmds && cmds.length > 0) {
                menuSections += formatCategory(category, cmds);
            }
        }

        // ─── Build menu text ───
        const dec = `    〔 *${BOT_NAME}* 〕
┃★╭──────────────
┃★│ Owner : ${OWNER_NAME}
┃★│ Mode : ${MODE}
┃★│ Prefix : ${PREFIX}
┃★│ Version : ${VERSION}
┃★│ Runtime : ${runtime(process.uptime())}
┃★│ Total Commands : ${totalCommands}
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷

${menuSections}

╭━━〔 *Support* 〕━━┈⊷
┃❖╭─────────────·๏
┃❖┃ owner
┃❖┃ ping
┃❖┃ menu
┃❖└───────────┈⊷
╰──────────────┈⊷

> ${DESCRIPTION}`;

        // ─── Send menu with image ───
        await conn.sendMessage(
            from,
            {
                image: { url: imageUrl },
                caption: dec,
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363410129201712@newsletter",
                        newsletterName: BOT_NAME,
                        serverMessageId: 143
                    }
                }
            },
            { quoted: m }
        );

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});
