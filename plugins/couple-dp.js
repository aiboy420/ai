// plugins/couplepp.js - ESM Version (UPDATED)
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "cpp",
    alias: ["couplepp", "couplepic", "couple"],
    react: "💑",
    desc: "Get matching couples profile pictures.",
    category: "utility",
    use: ".cpp",
    filename: __filename
}, async (conn, m, store, { from, reply }) => {
    try {
        await reply("*💫 Fetching Couples Profile Pictures...*");
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        // ✅ UPDATED WORKING API
        const apiUrl = `https://api.deline.web.id/random/ppcouple`;
        const { data } = await axios.get(apiUrl);
        
        if (data.status && data.result) {
            // Send male picture
            await conn.sendMessage(from, { 
                image: { url: data.result.cowo },
                caption: "👦 *Male Profile Picture*"
            }, { quoted: m });

            // Send female picture
            await conn.sendMessage(from, { 
                image: { url: data.result.cewe },
                caption: "👩 *Female Profile Picture*"
            });

            await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
        } else {
            reply("❌ Failed to fetch couples pictures. Please try again.");
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        }
    } catch (error) {
        console.error("Couples PP Error:", error);
        reply("❌ An error occurred while fetching couples pictures.");
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});
