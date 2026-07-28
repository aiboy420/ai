// menu.js - Part 1
import { fileURLToPath } from 'url';
import path from 'path';
import config from '../config.js';
import { cmd, commands } from '../command.js';
import { runtime } from '../lib/functions.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===============================
// SMALL CAPS
// ===============================

const SMALL_CAPS = {
'a':'ᴀ','b':'ʙ','c':'ᴄ','d':'ᴅ','e':'ᴇ','f':'ғ','g':'ɢ','h':'ʜ','i':'ɪ',
'j':'ᴊ','k':'ᴋ','l':'ʟ','m':'ᴍ','n':'ɴ','o':'ᴏ','p':'ᴘ','q':'ǫ','r':'ʀ',
's':'s','t':'ᴛ','u':'ᴜ','v':'ᴠ','w':'ᴡ','x':'x','y':'ʏ','z':'ᴢ',
'A':'ᴀ','B':'ʙ','C':'ᴄ','D':'ᴅ','E':'ᴇ','F':'ғ','G':'ɢ','H':'ʜ','I':'ɪ',
'J':'ᴊ','K':'ᴋ','L':'ʟ','M':'ᴍ','N':'ɴ','O':'ᴏ','P':'ᴘ','Q':'ǫ','R':'ʀ',
'S':'s','T':'ᴛ','U':'ᴜ','V':'ᴠ','W':'ᴡ','X':'x','Y':'ʏ','Z':'ᴢ'
};

const toSmallCaps = (text) => {
    if (!text || typeof text !== "string") return "";
    return text.split("").map(c => SMALL_CAPS[c] || c).join("");
};

// ===============================
// CATEGORY FORMAT
// ===============================

const formatCategory = (category, cmds) => {

    const validCmds = cmds.filter(
        cmd => cmd.pattern && cmd.pattern.trim() !== ""
    );

    if (!validCmds.length) return "";

    let body = "";

    for (const cmd of validCmds) {
        body += `┃❖ ${toSmallCaps(cmd.pattern)}\n`;
    }

    return `\n╭━━❰ ${category.toUpperCase()} ❱━━⬣
${body}╰━━━━━━━━━━━━━━⬣`;
};

// ===============================
// MEDIA TYPE
// ===============================

const getMediaType = (url) => {

    if (!url) return null;

    const lower = url.toLowerCase();

    if (
        lower.endsWith(".jpg") ||
        lower.endsWith(".jpeg") ||
        lower.endsWith(".png") ||
        lower.endsWith(".gif") ||
        lower.endsWith(".webp")
    ) return "image";

    if (
        lower.endsWith(".mp4") ||
        lower.endsWith(".mov") ||
        lower.endsWith(".avi") ||
        lower.endsWith(".mkv") ||
        lower.endsWith(".webm")
    ) return "video";

    return null;
};

// ===============================
// CATEGORY SORT
// ===============================

const getCategorizedCommands = () => {

    const commandsArray = Array.isArray(commands)
        ? commands
        : Object.values(commands);

    const totalCommands = commandsArray.length;

    const categories = [
        ...new Set(commandsArray.map(c => c.category))
    ].filter(Boolean);

    const priority = [
        "islamic",
        "download",
        "group"
    ];

    categories.sort((a, b) => {


        const ai = priority.indexOf(a);
        const bi = priority.indexOf(b);

        if (ai !== -1 && bi !== -1)
            return ai - bi;

        if (ai !== -1)
            return -1;

        if (bi !== -1)
            return 1;

        return a.localeCompare(b);
    });

    const categorized = {};

    for (const cat of categories) {

        const list = commandsArray.filter(
            x =>
                x.category === cat &&
                x.pattern &&
                x.pattern.trim()
        );

        if (list.length)
            categorized[cat] = list;
    }

    return {
        categorized,
        totalCommands
    };
};
// ===============================
// MENU COMMAND
// ===============================
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

        const BOT_NAME = userConfig?.BOT_NAME || config.BOT_NAME || "NawazTechX";
        const OWNER_NAME = userConfig?.OWNER_NAME || config.OWNER_NAME || "Nawaz";
        const PREFIX = userConfig?.PREFIX || config.PREFIX || ".";
        const VERSION = userConfig?.VERSION || config.VERSION || "1.5.0";
        const MODE = userConfig?.MODE || config.MODE || "public";
        const BOT_IMAGE = userConfig?.BOT_IMAGE || config.BOT_IMAGE || "";
        const DESCRIPTION = userConfig?.DESCRIPTION || config.DESCRIPTION || "";

        // Faster (typing status removed)
        const { categorized, totalCommands } = getCategorizedCommands();

        let menuSections = "";

        for (const [category, cmds] of Object.entries(categorized)) {
            if (cmds.length > 0) {
                menuSections += formatCategory(category, cmds);
            }
        }

        const dec = `╭━━❰ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳 ❱━━⬣
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

        // Media
        const mediaType = getMediaType(BOT_IMAGE);

        if (!mediaType) {
            return reply("❌ Invalid BOT_IMAGE");
        }

        const mediaData = {
            [mediaType]: {
                url: BOT_IMAGE
            }
        };
                await conn.sendMessage(
            from,
            {
                ...mediaData,
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
        return reply(`Error: ${e.message}`);
    }
});
