// gtdp.js - ESM Version
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

cmd({
    pattern: "gtdp",
    alias: ["getdp", "dp"],
    desc: "Get WhatsApp profile picture of any user",
    category: "tools",
    react: "🖼️",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {

        let jid;

        // Reply user
        if (m.quoted) {
            jid = m.quoted.sender;
        }

        // Mention user
        else if (m.mentionedJid && m.mentionedJid.length > 0) {
            jid = m.mentionedJid[0];
        }

        // Number input (global support)
        else if (q) {

            let num = q.replace(/[^0-9]/g, '');

            if (!num || num.length < 8) {
                return reply("❌ Invalid number format");
            }

            jid = num + "@s.whatsapp.net";
        }

        else {
            return reply(
`📌 *Usage:*

.gtdp 923001234567
Or reply to a message:
.gtdp`
            );
        }

        // Get profile picture
        let pp;

        try {
            pp = await conn.profilePictureUrl(jid, 'image');
        } catch (err) {
            return reply("❌ Profile picture is not available or is private");
        }

        if (!pp) return reply("❌ DP not found");

        // Send image
        await conn.sendMessage(from, {
            image: { url: pp },
            caption: `🖼️ *Profile Picture Retrieved Successfully*\n\n⚡ Powered By Nawaz MD`
        }, { quoted: mek });

    } catch (e) {
        console.log("gtdp error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
