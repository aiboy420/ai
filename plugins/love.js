// love.js - ESM Version
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "boom",
    alias: ["lov"],
    desc: "Send a love message",
    category: "owner",
    react: "💥",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const text = m.text?.split(/\s+/).slice(1).join(" ").trim();

        if (!text) {
            return reply("❤️ Example: .love I love you");
        }

        for (let i = 0; i < 30; i++) {
            await conn.sendMessage(
                from,
                { text: text },
                { quoted: mek }
            );
        }

        await conn.sendMessage(from, {
            react: {
                text: "💥",
                key: mek.key
            }
        });

    } catch (e) {
        console.error("Error in love command:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
