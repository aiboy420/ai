// pair.js - ESM Version
import { fileURLToPath } from "url";
import { cmd } from "../command.js";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);

const API_BASE_URL = "https://nawazmd.vercel.app/api";

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
        await react("⏳");

        const phoneNumber = (q || senderNumber || "")
            .toString()
            .replace(/[^0-9]/g, "");

        if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 15) {
            await react("❌");
            return reply("❌ Invalid number!\nExample: .pair 923001234567");
        }

        const serversResponse = await axios.get(`${API_BASE_URL}/servers`, {
            timeout: 10000
        });

        const servers = serversResponse?.data?.servers;

        if (!Array.isArray(servers) || servers.length === 0) {
            await react("❌");
            return reply("❌ No servers available right now.");
        }

        const randomServer = servers[Math.floor(Math.random() * servers.length)];

        if (!randomServer?.url) {
            await react("❌");
            return reply("❌ Server error.");
        }

        const response = await axios.get(`${randomServer.url}/code`, {
            params: { number: phoneNumber },
            timeout: 20000
        });

        const pairingCode = response?.data?.code;

        if (!pairingCode) {
            await react("❌");
            return reply("❌ Failed to generate pairing code.");
        }

        await react("✅");

        // Server Name
        const serverName =
            randomServer.name ||
            randomServer.server ||
            randomServer.id ||
            randomServer.url
                .replace(/^https?:\/\//, "")
                .replace(/\/$/, "");

        // =========================
        // FIRST MESSAGE
        // =========================
        const caption = `
╭──────────────────╮
│  ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳
├──────────────────┤

│ 📱 Number : ${phoneNumber}

│ 🌐 Server : ${serverName}

│ 🔐 Status : Ready

│ ✅ Pair Generated

╰──────────────────╯
`.trim();

        await conn.sendMessage(
            m.chat,
            {
                text: caption
            },
            { quoted: mek }
        );

        // =========================
        // SECOND MESSAGE (ONLY CODE)
        // =========================
        await conn.sendMessage(
            m.chat,
            {
                text: pairingCode
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error("Pair command error:", error);
        await react("❌");
        return reply("❌ Server error! Please try again later.");
    }
});
