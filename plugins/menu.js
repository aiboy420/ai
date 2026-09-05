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
// BOLD FONT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const BOLD_FONT_MAP = {
    a:'𝐚', b:'𝐛', c:'𝐜', d:'𝐝', e:'𝐞', f:'𝐟', g:'𝐠', h:'𝐡',
    i:'𝐢', j:'𝐣', k:'𝐤', l:'𝐥', m:'𝐦', n:'𝐧', o:'𝐨', p:'𝐩',
    q:'𝐪', r:'𝐫', s:'𝐬', t:'𝐭', u:'𝐮', v:'𝐯', w:'𝐰', x:'𝐱',
    y:'𝐲', z:'𝐳',

    A:'𝐀', B:'𝐁', C:'𝐂', D:'𝐃', E:'𝐄', F:'𝐅', G:'𝐆', H:'𝐇',
    I:'𝐈', J:'𝐉', K:'𝐊', L:'𝐋', M:'𝐌', N:'𝐍', O:'𝐎', P:'𝐏',
    Q:'𝐐', R:'𝐑', S:'𝐒', T:'𝐓', U:'𝐔', V:'𝐕', W:'𝐖', X:'𝐗',
    Y:'𝐘', Z:'𝐙'
};

const toBoldFont = (text) => {
    if (!text || typeof text !== 'string') return '';

    return text
        .split('')
        .map(char => BOLD_FONT_MAP[char] || char)
        .join('');
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CATEGORY FORMAT (Optimized)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const formatCategory = (category, cmds) => {
    const validCmds = cmds.filter(cmd => cmd.pattern && !cmd.dontAddCommandList);
    if (validCmds.length === 0) return '';

    let body = `╭━━〔 *${toBoldFont(category.toUpperCase())}* 〕━━┈⊷\n`;
    body += `┃❖╭─────────────·๏\n`;

    for (const c of validCmds) {
        body += `┃❖┃ ${toBoldFont(c.pattern)}\n`;
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

// 🖼️ MENU IMAGE URL
const MENU_IMAGE_URL = "https://i.ibb.co/XZPXRPLy/nawazmd.jpg";

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
            imageUrl = "https://i.ibb.co/XZPXRPLy/nawazmd.jpg";
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
        const dec = `    〔 *${toBoldFont(BOT_NAME)}* 〕
┃★╭──────────────
┃★│ ${toBoldFont("Owner")} : ${toBoldFont(OWNER_NAME)}
┃★│ ${toBoldFont("Mode")} : ${toBoldFont(MODE)}
┃★│ ${toBoldFont("Prefix")} : ${PREFIX}
┃★│ ${toBoldFont("Version")} : ${toBoldFont(VERSION)}
┃★│ ${toBoldFont("Runtime")} : ${runtime(process.uptime())}
┃★│ ${toBoldFont("Total Commands")} : ${totalCommands}
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷

${menuSections}

╭━━〔 *${toBoldFont("Support")}* 〕━━┈⊷
┃❖╭─────────────·๏
┃❖┃ ${toBoldFont("owner")}
┃❖┃ ${toBoldFont("ping")}
┃❖┃ ${toBoldFont("menu")}
┃❖└───────────┈⊷
╰──────────────┈⊷

> ${toBoldFont(DESCRIPTION)}`;

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
                        newsletterJid: "120363412400560245@newsletter",
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
