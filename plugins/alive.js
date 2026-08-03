// alive.js - ESM Version
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import { runtime } from '../lib/functions.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "alive",
    alias: ["status"],
    use: ".alive",
    desc: "Check if bot is alive.",
    category: "utility",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {

        // Start Reaction
        await conn.sendMessage(from, {
            react: {
                text: "🤖",
                key: mek.key
            }
        });

        const up = runtime(process.uptime());

        const text = `╭━━〔*NAWAZ MD*〕━━⬣
┃
┃ 💚 *Status:* Online
┃ ⚡ *Mode:* Active
┃ ⏱️ *Uptime:* ${up}
┃ 🚀 *Speed:* Stable
┃ 🟢 *Bot:* Working Perfectly
┃
╰━━━━━━━━━━━━━━⬣`;

        await conn.sendMessage(from, {
            text,
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
        }, {
            quoted: mek
        });

        // End Reaction
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
