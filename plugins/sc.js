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
   ⚙️ NAWAZ-MD 
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
                    newsletterJid: "120363412400560245@newsletter",
                    newsletterName: "> 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳",
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
