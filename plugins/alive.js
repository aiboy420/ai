import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import { runtime } from '../lib/functions.js';

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
        await conn.sendMessage(from, {
            react: {
                text: "💚",
                key: m.key
            }
        });

        const uptime = runtime(process.uptime());

        await conn.sendMessage(from, {
            text: `🤖 *Bot Is Alive Since ${uptime}*`,
            contextInfo: {
                isForwarded: true,
                forwardingScore: 999,
                mentionedJid: [m.sender]
            }
        }, {
            quoted: mek
        });

        await conn.sendMessage(from, {
            react: {
                text: "✅",
                key: m.key
            }
        });

    } catch (e) {
        console.error(e);
        await reply(`❌ Error: ${e.message}`);
    }
});
