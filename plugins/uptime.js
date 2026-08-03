// uptime.js - ESM Version
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import { runtime } from '../lib/functions.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "uptime",
    alias: ["runtime", "up"],
    use: ".uptime",
    desc: "Check bot uptime.",
    category: "utility",
    react: "⏱️",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        await conn.sendMessage(from, {
            react: {
                text: "⏳",
                key: mek.key
            }
        });

        const up = runtime(process.uptime());

        await conn.sendMessage(from, {
            text: `⏱️ *Uptime:* ${up}`,
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
        console.error("Error in uptime command:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
