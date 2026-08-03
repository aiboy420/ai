import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import { runtime } from '../lib/functions.js';

const __filename = fileURLToPath(import.meta.url;

// Newsletter
const NEWSLETTER = {
    jid: "120363426829681935@newsletter",
    name: "Nawaz Tech",
    serverMessageId: 1
};

cmd({
    pattern: "alive",
    alias: ["n", "status"],
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
                mentionedJid: [m.sender],
                forwardedNewsletterMessageInfo: {
                    newsletterJid: NEWSLETTER.jid,
                    newsletterName: NEWSLETTER.name,
                    serverMessageId: NEWSLETTER.serverMessageId
                }
            }
        }, { quoted: mek });

        await conn.sendMessage(from, {
            react: {
                text: "✅",
                key: m.key
            }
        });

    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e.message}`);
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
        await conn.sendMessage(from, {
            react: {
                text: "⏳",
                key: m.key
            }
        });

        const uptime = runtime(process.uptime());

        await conn.sendMessage(from, {
            text: `⏱️ *Uptime:* ${uptime}`,
            contextInfo: {
                isForwarded: true,
                forwardingScore: 999,
                mentionedJid: [m.sender],
                forwardedNewsletterMessageInfo: {
                    newsletterJid: NEWSLETTER.jid,
                    newsletterName: NEWSLETTER.name,
                    serverMessageId: NEWSLETTER.serverMessageId
                }
            }
        }, { quoted: mek });

        await conn.sendMessage(from, {
            react: {
                text: "✅",
                key: m.key
            }
        });

    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e.message}`);
    }
});
