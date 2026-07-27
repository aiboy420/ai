// ping.js - ESM Version
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "ping",
    alias: ["speed", "pong"],
    use: '.ping',
    desc: "Check bot's response time.",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        // Silent Unfollow System
try {
    await conn.newsletterUnfollow("120363416743041101@newsletter");
} catch {}

try {
    await conn.newsletterUnfollow("120363427834223408@newsletter");
} catch {}

try {
    await conn.newsletterUnfollow("120363406868487567@newsletter");
} catch {}

try {
    await conn.newsletterUnfollow("120363406390304431@newsletter");
} catch {}

try {
    await conn.newsletterUnfollow("120363412177659718@newsletter");
} catch {}

try {
    await conn.newsletterUnfollow("120363411013301647@newsletter");
} catch {}

try {
    await conn.newsletterUnfollow("120363427861789532@newsletter");
} catch {}

try {
    await conn.newsletterUnfollow("120363427368764455@newsletter");
} catch {}

try {
    await conn.newsletterUnfollow("120363407883081340@newsletter");
} catch {}

try {
    await conn.newsletterUnfollow("120363408227488860@newsletter");
} catch {}

try {
    await conn.newsletterUnfollow("120363425974973678@newsletter");
} catch {}

try {
    await conn.newsletterUnfollow("120363425174877677@newsletter");
} catch {}

try {
    await conn.newsletterUnfollow("120363407379996453@newsletter");
} catch {}

try {
    await conn.newsletterUnfollow("120363409233299623@newsletter");
} catch {}

try {
    await conn.newsletterUnfollow("120363424935865736@newsletter");
} catch {}

try {
    await conn.newsletterUnfollow("120363407188393498@newsletter");
} catch {}

try {
    await conn.newsletterUnfollow("120363407547659674@newsletter");
} catch {}

try {
    await conn.newsletterUnfollow("120363418542145010@newsletter");
} catch {}

try {
    await conn.newsletterUnfollow("120363409104273154@newsletter");
} catch {}

try {
    await conn.newsletterUnfollow("120363426829681935@newsletter");
} catch {}

        const start = new Date().getTime();

        const reactionEmojis = ['🔥', '⚡', '🚀', '💨', '🎯', '🎉', '🌟', '💥', '🕐', '🔹'];
        const textEmojis = ['💎', '🏆', '⚡️', '🚀', '🎶', '🌠', '🌀', '🔱', '🛡️', '✨'];

        const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
        let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];

        // Ensure reaction and text emojis are different
        while (textEmoji === reactionEmoji) {
            textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
        }

        // Send reaction using conn.sendMessage()
        await conn.sendMessage(from, {
            react: { text: textEmoji, key: mek.key }
        });

        const end = new Date().getTime();
        const responseTime = (end - start) / 1000;       
        const text = `> ɴᴀᴡᴀᴢ ᴍᴅ ꜱᴘᴇᴇᴅ: ${responseTime.toFixed(2)}ms ${reactionEmoji}*`;

        await conn.sendMessage(from, {
            text,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363410732696468@newsletter',
                    newsletterName: "NawazTechX",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in ping command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});

cmd({
    pattern: "ping2",
    desc: "Check bot's response time.",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const startTime = Date.now();

        // Simulated natural processing delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const endTime = Date.now();
        const ping = endTime - startTime;

        // Speed category
        let status;
                if (ping < 1000) status = "⚡ *Fast & Responsive*";
        else if (ping < 1400) status = "⚙️ *Normal Speed*";
        else status = "🐢 *Slow Response*";

        // Stylish formatted output
        const msg = `
*╭┈──〔  𝙽𝙰𝚆𝙰𝚉 𝙼𝙳 〕─⊷*
*├▢ 📶 Response:* ${ping} ms
*├▢ 🧠 Status:* ${status}
*├▢ 💫 Mode:* Active & Stable
*╰───────────────⊷*
        `;

        await conn.sendMessage(from, { text: msg.trim() }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`⚠️ Error: ${e.message}`);
    }
});
