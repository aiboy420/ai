// sim.js - ESM Version
// NAWAZ MD - SIM INFORMATION

import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "sim",
    alias: ["simdb", "simdata"],
    desc: "Find SIM info",
    category: "tools",
    react: "💎",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {

    try {

        if (!q) {
            return reply(
                "📱 Provide a number!\nExample: .sim 0303xxxxxxx"
            );
        }

        // Normalize number
        let raw = q.replace(/\D/g, '');

        if (raw.startsWith('92')) {
            raw = '0' + raw.slice(2);
        }

        if (raw.length < 10 || raw.length > 11) {
            return reply("❌ Invalid number format.");
        }

        const api =
            `https://fam-official.serv00.net/api/database.php?number=${raw}`;

        // Searching reaction
        await conn.sendMessage(from, {
            react: {
                text: "🔍",
                key: mek.key
            }
        });

        // API request
        const { data: resp } = await axios.get(api, {
            timeout: 20000
        });

        // No record
        if (
            !resp?.success ||
            !resp?.data?.records?.length
        ) {

            await conn.sendMessage(from, {
                react: {
                    text: "❌",
                    key: mek.key
                }
            });

            return reply("❌ No Record Found.");
        }

        const record = resp.data.records[0];

        const name =
            record.full_name || "N/A";

        const cnic =
            record.cnic || "N/A";

        const address =
            record.address || "N/A";

        const phone =
            record.phone || raw;

        // Result
        const result = `
⭐ 𝐒𝐈𝐌 𝐃𝐄𝐓𝐀𝐈𝐋𝐒 ⭐

👤 NAME: ${name}
🪪 CNIC: ${cnic}
📍 ADDR: ${address}
📞 NUM: ${phone}

✨ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɴᴀᴡᴀᴢ ᴍᴅ`;

        await reply(result);

        // Success reaction
        await conn.sendMessage(from, {
            react: {
                text: "✅",
                key: mek.key
            }
        });

    } catch (error) {

        console.error(
            "SIM CMD ERROR:",
            error
        );

        await conn.sendMessage(from, {
            react: {
                text: "❌",
                key: mek.key
            }
        });

        return reply("⚠️ Internal Error!");
    }

});
