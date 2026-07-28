import { fileURLToPath } from 'url';
import path from 'path';
import config from '../config.js';
import { cmd, commands } from '../command.js';
import { runtime } from '../lib/functions.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function for small caps text
const toSmallCaps = (text) => {
    if (!text || typeof text !== 'string') return '';

    const smallCapsMap = {
        'a': 'ᴀ','b': 'ʙ','c': 'ᴄ','d': 'ᴅ','e': 'ᴇ','f': 'ғ','g': 'ɢ','h': 'ʜ','i': 'ɪ',
        'j': 'ᴊ','k': 'ᴋ','l': 'ʟ','m': 'ᴍ','n': 'ɴ','o': 'ᴏ','p': 'ᴘ','q': 'ǫ','r': 'ʀ',
        's': 's','t': 'ᴛ','u': 'ᴜ','v': 'ᴠ','w': 'ᴡ','x': 'x','y': 'ʏ','z': 'ᴢ',
        'A': 'ᴀ','B': 'ʙ','C': 'ᴄ','D': 'ᴅ','E': 'ᴇ','F': 'ғ','G': 'ɢ','H': 'ʜ','I': 'ɪ',
        'J': 'ᴊ','K': 'ᴋ','L': 'ʟ','M': 'ᴍ','N': 'ɴ','O': 'ᴏ','P': 'ᴘ','Q': 'ǫ','R': 'ʀ',
        'S': 's','T': 'ᴛ','U': 'ᴜ','V': 'ᴠ','W': 'ᴡ','X': 'x','Y': 'ʏ','Z': 'ᴢ'
    };

    return text.split('').map(char => smallCapsMap[char] || char).join('');
};

// Format category
const formatCategory = (category, cmds) => {
    const validCmds = cmds.filter(cmd => cmd.pattern && cmd.pattern.trim() !== '');
    if (validCmds.length === 0) return '';

    let title = `\n╭━━❰ ${category.toUpperCase()} ❱━━⬣\n`;
    let body = validCmds.map(cmd => {
        const commandName = cmd.pattern || '';
        return `┃❖ ${toSmallCaps(commandName)}`;
    }).join('\n');
    let footer = `\n╰━━━━━━━━━━━━━━⬣`;

    return `${title}${body}${footer}`;
};

// Media Type
const getMediaType = (url) => {
    if (!url || typeof url !== 'string' || url.trim() === '') return null;

    const urlLower = url.toLowerCase();

    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    if (imageExtensions.some(ext => urlLower.endsWith(ext))) return 'image';

    const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.gif'];
    if (videoExtensions.some(ext => urlLower.endsWith(ext))) return 'video';

    return null;
};

// Categories
const getCategorizedCommands = () => {
    const commandsArray = Array.isArray(commands)
        ? commands
        : Object.values(commands);

    let totalCommands = commandsArray.length;

    const categories = [...new Set(commandsArray.map(c => c.category))]
        .filter(cat => cat && cat.trim() !== '' && cat !== 'undefined');

    const priorityOrder = ['islamic', 'download', 'group'];

    const sortedCategories = categories.sort((a, b) => {
        const aIndex = priorityOrder.indexOf(a);
        const bIndex = priorityOrder.indexOf(b);

        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;

        return a.localeCompare(b);
    });

    const categorized = {};

    sortedCategories.forEach(cat => {
        const categoryCommands = commandsArray.filter(c => c.category === cat);
        const validCommands = categoryCommands.filter(cmd => cmd.pattern && cmd.pattern.trim() !== '');

        if (validCommands.length > 0)
            categorized[cat] = validCommands;
    });

    return { categorized, totalCommands };
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

        const { categorized, totalCommands } = getCategorizedCommands();

        let menuSections = "";

        for (const [category, cmds] of Object.entries(categorated)) {
            if (cmds?.length) {
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

        const mediaType = getMediaType(BOT_IMAGE);

        const mediaData = mediaType
            ? {
                [mediaType]: {
                    url: BOT_IMAGE
                }
            }
            : {};

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
        reply(`Error: ${e.message}`);
    }
});
