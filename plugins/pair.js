// pair.js - ESM Version
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_BASE_URL = 'https://nawazmd.vercel.app/api';

// 👉 یہاں اپنی DP IMAGE URL لگا دینا
const DP_IMAGE = "https://files.catbox.moe/dww1rw.png";

cmd({
    pattern: "pair",
    alias: ["getpair", "clonebot"],
    react: "🔐",
    desc: "Get pairing code for NAWAZ-MD bot",
    category: "owner",
    use: ".pair 923XXXXXXXXX",
    filename: __filename
}, async (conn, mek, m, { senderNumber, reply, react, q }) => {

    try {
        await react('⏳');

        const phoneNumber = (q || senderNumber || "")
            .toString()
            .replace(/[^0-9]/g, '');

        if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 15) {
            await react('❌');
            return reply("❌ Invalid number!\nExample: .pair 923001234567");
        }

        const serversResponse = await axios.get(`${API_BASE_URL}/servers`, {
            timeout: 10000
        });

        const servers = serversResponse?.data?.servers;

        if (!Array.isArray(servers) || servers.length === 0) {
            await react('❌');
            return reply("❌ No servers available right now.");
        }

        const randomServer = servers[Math.floor(Math.random() * servers.length)];

        if (!randomServer?.url) {
            await react('❌');
            return reply("❌ Server error.");
        }

        const response = await axios.get(`${randomServer.url}/code`, {
            params: { number: phoneNumber },
            timeout: 20000
        });

        const pairingCode = response?.data?.code;

        if (!pairingCode) {
            await react('❌');
            return reply("❌ Failed to generate pairing code.");
        }

        await react('✅');

        // =========================
        // 🖼️ FIRST MESSAGE (IMAGE + DECORATION + NEWSLETTER)
        // =========================
        const caption = `
╔════════════════╗
║  🤖 NAWAZ MD   ║
╠════════════════╣
║ 📱 ${phoneNumber} ║
║ 🔐 READY       ║
╠════════════════╣
║ 🔑 ${pairingCode} ║
╚════════════════╝
        `.trim();

        await conn.sendMessage(m.chat, {
            image: { url: DP_IMAGE },
            caption,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363410732696468@newsletter',
                    newsletterName: "NawazTechX",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        // =========================
        // ❄️ SECOND MESSAGE (ONLY CODE)
        // =========================
        await conn.sendMessage(m.chat, {
            text: ` ${pairingCode}`
        }, { quoted: mek });

    } catch (error) {
        console.error("Pair command error:", error);
        await react('❌');
        return reply("❌ Server error! Please try again later.");
    }
});
