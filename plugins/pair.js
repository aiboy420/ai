// pair.js - ESM Version
import { fileURLToPath } from "url";
import { cmd } from "../command.js";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);

const API_BASE_URL = "https://nawaztech.vercel.app/api";

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

        // ==========================================
        // GET COMMAND SENDER'S REAL PHONE NUMBER
        // ==========================================

        const key = m?.key || {};

        const possibleJids = [
            // Group sender's actual phone number
            key.participantPn,

            // Baileys v7 alternate PN
            key.participantAlt,

            // Private chat alternate PN
            key.remoteJidAlt,

            // Normal PN participant
            key.participant,

            // Normal private chat PN
            key.remoteJid
        ];

        let senderPhone = "";

        for (const jid of possibleJids) {
            if (
                typeof jid === "string" &&
                jid.includes("@s.whatsapp.net")
            ) {
                const number = jid
                    .split("@")[0]
                    .replace(/[^0-9]/g, "");

                if (number.length >= 10 && number.length <= 15) {
                    senderPhone = number;
                    break;
                }
            }
        }

        // Last fallback only
        if (!senderPhone && senderNumber) {
            senderPhone = senderNumber
                .toString()
                .replace(/[^0-9]/g, "");
        }

        // ==========================================
        // NUMBER SELECTION
        // ==========================================

        // If user entered a number, use that number.
        // Otherwise use the command sender's number.
        const phoneNumber = (
            q?.trim() || senderPhone || ""
        )
            .toString()
            .replace(/[^0-9]/g, "");

        // ==========================================
        // VALIDATE NUMBER
        // ==========================================

        if (
            !phoneNumber ||
            phoneNumber.length < 10 ||
            phoneNumber.length > 15
        ) {
            await react("❌");

            return reply(
                "❌ Unable to detect your WhatsApp number.\n\n" +
                "Please use:\n" +
                ".pair 923001234567"
            );
        }

        // ==========================================
        // GET AVAILABLE SERVERS
        // ==========================================

        const serversResponse = await axios.get(
            `${API_BASE_URL}/servers`,
            {
                timeout: 10000
            }
        );

        const servers = serversResponse?.data?.servers;

        if (!Array.isArray(servers) || servers.length === 0) {
            await react("❌");
            return reply("❌ No servers available right now.");
        }

        // ==========================================
        // RANDOM SERVER
        // ==========================================

        const randomServer =
            servers[Math.floor(Math.random() * servers.length)];

        if (!randomServer?.url) {
            await react("❌");
            return reply("❌ Server error.");
        }

        // ==========================================
        // GET PAIRING CODE
        // ==========================================

        const response = await axios.get(
            `${randomServer.url}/code`,
            {
                params: {
                    number: phoneNumber
                },
                timeout: 20000
            }
        );

        const pairingCode = response?.data?.code;

        if (!pairingCode) {
            await react("❌");
            return reply("❌ Failed to generate pairing code.");
        }

        await react("✅");

        // ==========================================
        // SERVER NAME
        // ==========================================

        const serverName =
            randomServer.name ||
            randomServer.server ||
            randomServer.id ||
            randomServer.url
                .replace(/^https?:\/\//, "")
                .replace(/\/$/, "");

        // ==========================================
        // FIRST MESSAGE
        // ==========================================

        const caption = `
🔐 *NAWAZ-MD PAIR CODE*

*${serverName}*

📱 *Number:* ${phoneNumber}

📲 *How to use:*
1. Open WhatsApp on your phone
2. Go to Linked Devices
3. Tap on Link Device
4. Enter the pairing code below when prompted.
`.trim();

        await conn.sendMessage(
            m.chat,
            {
                text: caption
            },
            { quoted: mek }
        );

        // ==========================================
        // SECOND MESSAGE - ONLY CODE
        // ==========================================

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

        return reply(
            "❌ Server error! Please try again later."
        );
    }
});
