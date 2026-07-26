import { fileURLToPath } from 'url';
import path from 'path';
import config from '../config.js';
import { cmd, commands } from '../command.js';
import { runtime } from '../lib/functions.js';
import axios from 'axios';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function for small caps text
const toSmallCaps = (text) => {
    if (!text || typeof text !== 'string') return '';
    const smallCapsMap = {
        'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ',
        'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ',
        's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ',
        'A': 'ᴀ', 'B': 'ʙ', 'C': 'ᴄ', 'D': 'ᴅ', 'E': 'ᴇ', 'F': 'ғ', 'G': 'ɢ', 'H': 'ʜ', 'I': 'ɪ',
        'J': 'ᴊ', 'K': 'ᴋ', 'L': 'ʟ', 'M': 'ᴍ', 'N': 'ɴ', 'O': 'ᴏ', 'P': 'ᴘ', 'Q': 'ǫ', 'R': 'ʀ',
        'S': 's', 'T': 'ᴛ', 'U': 'ᴜ', 'V': 'ᴠ', 'W': 'ᴡ', 'X': 'x', 'Y': 'ʏ', 'Z': 'ᴢ'
    };
    return text.split('').map(char => smallCapsMap[char] || char).join('');
};

// Format category with new design
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

// Function to validate media URL and determine type
const getMediaType = (url) => {
    if (!url || typeof url !== 'string' || url.trim() === '') return null;
    const urlLower = url.toLowerCase();
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    if (imageExtensions.some(ext => urlLower.endsWith(ext))) return 'image';
    const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.gif'];
    if (videoExtensions.some(ext => urlLower.endsWith(ext))) return 'video';
    return null;
};

// Get all categories and organize them with custom order: Islamic > Download > Group > Others
const getCategorizedCommands = () => {
    const commandsArray = Array.isArray(commands) ? commands : Object.values(commands);
    let totalCommands = commandsArray.length;
    const categories = [...new Set(commandsArray.map(c => c.category))].filter(cat => 
        cat && cat.trim() !== '' && cat !== 'undefined'
    );
    
    // 🎯 CUSTOM ORDER: Islamic > Download > Group > Others
    const priorityOrder = ['islamic', 'download', 'group'];
    
    // Sort categories: priority first, then alphabetical
    const sortedCategories = categories.sort((a, b) => {
        const aIndex = priorityOrder.indexOf(a);
        const bIndex = priorityOrder.indexOf(b);
        
        // If both are in priority list, sort by priority order
        if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
        }
        // If only a is in priority list, a comes first
        if (aIndex !== -1) return -1;
        // If only b is in priority list, b comes first
        if (bIndex !== -1) return 1;
        // Otherwise sort alphabetically
        return a.localeCompare(b);
    });
    
    const categorized = {};
    sortedCategories.forEach(cat => {
        const categoryCommands = commandsArray.filter(c => c.category === cat);
        const validCommands = categoryCommands.filter(cmd => cmd.pattern && cmd.pattern.trim() !== '');
        if (validCommands.length > 0) categorized[cat] = validCommands;
    });
    return { categorized, totalCommands };
};

// ===============================
// MENU COMMAND
// ===============================
cmd({
    pattern: "menu",
    alias: ["m", "fullmenu"],
    use: '.menu',
    desc: "Show all bot commands",
    category: "main",
    react: "🧾",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply, userConfig }) => {
    try {
        // Using optional chaining like your play command
        const BOT_NAME = userConfig?.BOT_NAME || config.BOT_NAME || "NawazTechX";
        const OWNER_NAME = userConfig?.OWNER_NAME || config.OWNER_NAME || "Nawaz";
        const PREFIX = userConfig?.PREFIX || config.PREFIX || ".";
        const VERSION = userConfig?.VERSION || config.VERSION || "1.5.0";
        const MODE = userConfig?.MODE || config.MODE || "public";
        const BOT_IMAGE = userConfig?.BOT_IMAGE || config.BOT_IMAGE || "";
        const DESCRIPTION = userConfig?.DESCRIPTION || config.DESCRIPTION || "";

        // Show typing presence before processing
        await conn.sendPresenceUpdate('composing', from);
        
        // Get categorized commands with custom order
        const { categorized, totalCommands } = getCategorizedCommands();

        // Build menu sections - in custom order
        let menuSections = '';
        for (const [category, cmds] of Object.entries(categorized)) {
            if (cmds && cmds.length > 0) {
                const section = formatCategory(category, cmds);
                if (section !== '') {
                    menuSections += section;
                }
            }
        }

        // 🔥 NEW STYLE - Main menu text with Total Commands
        let dec = `╭━━❰ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳 ❱━━⬣
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

        // Determine which media to use
        let mediaData;
        const localImagePath = path.join(__dirname, '../lib/jawadmd.jpg');
        
        // First check if config has valid media URL
        const mediaType = getMediaType(BOT_IMAGE);
        
        if (mediaType === 'image' || mediaType === 'video') {
            try {
                // Check if server is accessible (timeout after 3 seconds)
                await axios.head(BOT_IMAGE, { timeout: 3000 });
                // Server is up, use the URL media
                mediaData = { 
                    [mediaType]: { url: BOT_IMAGE } 
                };
            } catch (serverError) {
                // Server is down or inaccessible, use local image
                console.log('Media server down, using local image:', serverError.message);
                mediaData = { image: { url: localImagePath } };
            }
        } else {
            // Invalid media URL format, use local image
            mediaData = { image: { url: localImagePath } };
        }

        await conn.sendMessage(from, { 
            ...mediaData,
            caption: dec, 
            contextInfo: { 
                mentionedJid: [sender], 
                forwardingScore: 999, 
                isForwarded: true, 
                forwardedNewsletterMessageInfo: { 
                    newsletterJid: '120363410732696468@newsletter', 
                    newsletterName: BOT_NAME, 
                    serverMessageId: 143 
                } 
            } 
        }, { quoted: m });

    } catch (e) { 
        console.log(e); 
        reply(`Error: ${e.message}`); 
    } 
});
