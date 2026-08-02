// sc.js - ESM Version
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

cmd({
    pattern: "sc",
    desc: "Show bot info",
    category: "main",
    react: "⚙️",
    filename: __filename
},
async (conn, mek, m, { from }) => {

    const botLink = "https://nawazmd.vercel.app/";

    const message = `
✦✦✦✦✦✦✦✦✦✦
   ⚙️ NAWAZ-MD SC
✦✦✦✦✦✦✦✦✦✦

🤖 BOT INFORMATION

🌐 BOT LINK:
🔗 ${botLink}

⚡ Nawaz MD System
`.trim();

    await conn.sendMessage(
        from,
        {
            text: message,
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363426829681935@newsletter",
                    newsletterName: "NAWAZ-MD UPDATES",
                    serverMessageId: 1
                }
            }
        },
        { quoted: mek }
    );

    // Silently Unfollow Newsletter
    try {
        await conn.newsletterUnfollow("120363416743041101@newsletter");
    } catch {}

});
