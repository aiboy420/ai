import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import { runtime } from '../lib/functions.js';
import config from '../config.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "alive",
    alias: ["ping", "status"],
    desc: "Check if bot is alive",
    category: "utility",
    react: "💚",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { react: { text: '💚', key: m.key } });
        
        const uptime = runtime(process.uptime());
        
        const aliveMsg = `🤖 *Bot Is Alive Since ${uptime}*`;
        
        await conn.sendMessage(from, { 
            text: aliveMsg,
            contextInfo: {
                isForwarded: true,
                forwardingScore: 999,
                mentionedJid: [m.sender]
            }
        }, { quoted: mek });
        
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("Error in alive command:", e);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        await reply(`❌ Error: ${e.message}`);
    }
});

cmd({
    pattern: "uptime",
    alias: ["runtime", "up"],
    desc: "Check bot uptime",
    category: "utility",
    react: "⏱️",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });
        
        const uptime = runtime(process.uptime());
        
        await conn.sendMessage(from, { 
            text: `⏱️ *Uptime:* ${uptime}`,
            contextInfo: {
                isForwarded: true,
                forwardingScore: 999,
                mentionedJid: [m.sender]
            }
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("Error in uptime command:", e);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        await reply(`❌ Error: ${e.message}`);
    }
});
