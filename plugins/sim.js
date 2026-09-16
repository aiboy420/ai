// sim.js - CommonJS Version
// NAWAZ MD - SIM INFORMATION

const { cmd } = require('../inconnuboy');
const axios = require('axios');

cmd({
    pattern: "sim",
    alias: ["simdb", "simdata"],
    desc: "Find SIM info",
    category: "tools",
    react: "💎",
    filename: __filename
}, async (conn, m, store, { from, q, reply }) => {

    try {

        if (!q) {
            return reply("📱 Provide a number!\n\nExample: .sim 0303xxxxxxx");
        }

        let raw = q.replace(/\D/g, '');

        if (raw.startsWith('92')) {
            raw = '0' + raw.slice(2);
        }

        if (raw.length < 10 || raw.length > 11) {
            return reply("❌ Invalid number format.");
        }

        const api =
            `https://fam-official.serv00.net/api/database.php?number=${raw}`;

        await conn.sendMessage(from, {
            react: {
                text: "🔍",
                key: m.key
            }
        });

        const { data: resp } = await axios.get(api, {
            timeout: 20000
        });

        if (
            !resp?.success ||
            !resp?.data?.records?.length
        ) {

            await conn.sendMessage(from, {
                react: {
                    text: "❌",
                    key: m.key
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

        const text = `
┏━━━━━━━━━━━━━━━━━━━┓
   ⭐ 𝐒𝐈𝐌 𝐃𝐄𝐓𝐀𝐈𝐋𝐒 ⭐
┗━━━━━━━━━━━━━━━━━━━┛

👤 NAME: ${name}
🪪 CNIC: ${cnic}
📍 ADDR: ${address}
📞 NUM: ${phone}

✨ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɴᴀᴡᴀᴢ ᴍᴅ`;

        await reply(text);

        await conn.sendMessage(from, {
            react: {
                text: "✅",
                key: m.key
            }
        });

    } catch (e) {

        console.error("SIM CMD ERROR:", e);

        await conn.sendMessage(from, {
            react: {
                text: "❌",
                key: m.key
            }
        });

        return reply("⚠️ Internal Error!");
    }

});
