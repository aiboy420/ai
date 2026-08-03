// alive.js - ESM Version
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import { runtime } from '../lib/functions.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "alive",
    alias: ["status"],
    desc: "Check if bot is alive",
    category: "utility",
    react: "💚",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        await conn.sendMessage(from, {
            react: {
                text: "💚",
                key: mek.key
            }
        });

        const uptime = runtime(process.uptime());
        const aliveMsg = `🤖 *Bot Is Alive Since ${uptime}*`;

        await conn.sendMessage(from, {
            text: aliveMsg,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363426829681935@newsletter",
                    newsletterName: "NawazTechX",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        await conn.sendMessage(from, {
            react: {
                text: "✅",
                key: mek.key
            }
        });

    } catch (e) {
        console.error("Error in alive command:", e);

        await conn.sendMessage(from, {
            react: {
                text: "❌",
                key: mek.key
            }
        });

        reply(`❌ Error: ${e.message}`);
    }
});
