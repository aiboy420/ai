// plugins/help.js - ESM Version
import { fileURLToPath } from 'url';
import { cmd, commands } from '../command.js';
import config from '../config.js';
import { runtime } from '../lib/functions.js';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cmd({
    pattern: "help",
    alias: ["listcmd", "list", "h", "commands"],
    desc: "Show all available commands with descriptions",
    category: "main",
    react: "📜",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // Convert commands to array if needed
        const commandsArray = Array.isArray(commands) ? commands : Object.values(commands);
        
        // Count total commands and aliases
        const totalCommands = commandsArray.length;
        let aliasCount = 0;
        commandsArray.forEach(cmd => {
            if (cmd.alias) aliasCount += cmd.alias.length;
        });

        // Get unique categories count
        const categories = [...new Set(commandsArray.map(c => c.category))];

        let menuText = `╭───『 *${config.BOT_NAME} COMMAND LIST* 』───⳹
│
│ *🛠️ BOT INFORMATION*
│ • 🤖 Bot Name: ${config.BOT_NAME}
│ • 👑 Owner: ${config.OWNER_NAME}
│ • ⚙️ Prefix: [${config.PREFIX}]
│ • 🌐 Platform: Heroku
│ • 📦 Version: 4.0.0
│ • 🕒 Runtime: ${runtime(process.uptime())}
│
│ *📊 COMMAND STATS*
│ • 📜 Total Commands: ${totalCommands}
│ • 🔄 Total Aliases: ${aliasCount}
│ • 🗂️ Categories: ${categories.length}
│
╰────────────────⳹\n`;

        // Organize commands by category
        const categorized = {};
        categories.forEach(cat => {
            categorized[cat] = commandsArray.filter(c => c.category === cat);
        });

        // Generate menu for each category
        for (const [category, cmds] of Object.entries(categorized)) {
            menuText += `╭───『 *${category.toUpperCase()}* 』───⳹
│ • 📂 Commands: ${cmds.length}
│ • 🔄 Aliases: ${cmds.reduce((a, c) => a + (c.alias ? c.alias.length : 0), 0)}
│
`;

            cmds.forEach(c => {
                menuText += `┃▸📄 COMMAND: .${c.pattern}\n`;
                menuText += `┃▸❕ ${c.desc || 'No description available'}\n`;
                if (c.alias && c.alias.length > 0) {
                    menuText += `┃▸🔹 Aliases: ${c.alias.map(a => `.${a}`).join(', ')}\n`;
                }
                if (c.use) {
                    menuText += `┃▸💡 Usage: ${c.use}\n`;
                }
                menuText += `│\n`;
            });
            
            menuText += `╰────────────────⳹\n`;
        }

        menuText += `\n📝 *Note*: Use ${config.PREFIX}help <command> for detailed help\n`;
        menuText += `> ${config.DESCRIPTION}`;

        // Check if local image exists
        const imagePath = path.join(__dirname, '../lib/jawadmd.jpg');
        
        if (fs.existsSync(imagePath)) {
            // Send message with local image
            await conn.sendMessage(
                from,
                {
                    image: fs.readFileSync(imagePath),
                    caption: menuText,
                    contextInfo: {
                        mentionedJid: [m.sender],
                        forwardingScore: 999,
                        isForwarded: true
                    }
                },
                { quoted: mek }
            );
        } else {
            // If image doesn't exist, send text only
            await conn.sendMessage(
                from,
                {
                    text: `*⚠️ Local image not found*\n\n${menuText}`,
                    contextInfo: {
                        mentionedJid: [m.sender],
                        forwardingScore: 999,
                        isForwarded: true
                    }
                },
                { quoted: mek }
            );
            console.log("Image file not found at:", imagePath);
        }

    } catch (e) {
        console.error('Command List Error:', e);
        reply(`❌ Error generating command list: ${e.message}`);
    }
});
