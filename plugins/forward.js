// forward.js - ESM Version
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "forward",
    alias: ["fyd", "fod", "frd"],
    desc: "Forward replied message to groups",
    category: "owner",
    react: "📤",
    filename: __filename
},
async (conn, mek, m, { from, isCreator, reply, args }) => {
    try {
        // ==================== OWNER ONLY ====================
        if (!isCreator) {
            return reply("📛 This is an owner command.");
        }

        // ==================== CHECK REPLY ====================
        if (!m.quoted) {
            return reply(
                "🍁 Please reply to a Video, Image, Text or Link message.\n\n" +
                "Example:\n" +
                ".forward\n" +
                ".forward/2\n" +
                ".fyd/3"
            );
        }

        // ==================== GROUP COUNT ====================
        // .forward/2 or .fyd/3
        let count = null;

        const commandText = (m.body || m.text || "").trim();

        const slashMatch = commandText.match(/\/(\d+)$/);

        if (slashMatch) {
            count = parseInt(slashMatch[1]);

            if (!count || count < 1) {
                return reply("❌ Please enter a valid group number.");
            }
        }

        // ==================== GET ALL GROUPS ====================
        const groups = await conn.groupFetchAllParticipating();
        let groupIds = Object.keys(groups || {});

        if (!groupIds.length) {
            return reply("❌ No groups found.");
        }

        // If count is specified, limit groups
        if (count !== null) {
            groupIds = groupIds.slice(0, count);
        }

        // ==================== GET QUOTED MESSAGE ====================
        const quoted = m.quoted;

        let messageContent = null;

        // ==================== VIDEO ====================
        if (quoted.mtype === "videoMessage") {
            const buffer = await quoted.download();

            messageContent = {
                video: buffer,
                mimetype: quoted.msg?.mimetype || "video/mp4",
                caption: quoted.msg?.caption || ""
            };
        }

        // ==================== IMAGE ====================
        else if (quoted.mtype === "imageMessage") {
            const buffer = await quoted.download();

            messageContent = {
                image: buffer,
                mimetype: quoted.msg?.mimetype || "image/jpeg",
                caption: quoted.msg?.caption || ""
            };
        }

        // ==================== AUDIO ====================
        else if (quoted.mtype === "audioMessage") {
            const buffer = await quoted.download();

            messageContent = {
                audio: buffer,
                mimetype: quoted.msg?.mimetype || "audio/mp4",
                ptt: quoted.msg?.ptt || false
            };
        }

        // ==================== DOCUMENT ====================
        else if (quoted.mtype === "documentMessage") {
            const buffer = await quoted.download();

            messageContent = {
                document: buffer,
                mimetype: quoted.msg?.mimetype || "application/octet-stream",
                fileName: quoted.msg?.fileName || "file"
            };
        }

        // ==================== TEXT / LINK ====================
        else if (
            quoted.mtype === "conversation" ||
            quoted.mtype === "extendedTextMessage" ||
            quoted.mtype === "text"
        ) {
            const text =
                quoted.text ||
                quoted.msg?.text ||
                quoted.msg?.conversation ||
                "";

            if (!text.trim()) {
                return reply("❌ Empty text message.");
            }

            messageContent = {
                text: text
            };
        }

        // ==================== UNSUPPORTED ====================
        else {
            return reply(
                "❌ Supported messages:\n\n" +
                "🎥 Video\n" +
                "🖼️ Image\n" +
                "📝 Text\n" +
                "🔗 Link\n" +
                "🎵 Audio\n" +
                "📄 Document"
            );
        }

        if (!messageContent) {
            return reply("❌ Unable to read the replied message.");
        }

        // ==================== SEND TO GROUPS ====================
        let sent = 0;
        let failed = 0;

        for (const groupId of groupIds) {
            try {
                await conn.sendMessage(groupId, messageContent);

                sent++;

                // Small delay
                await new Promise(resolve => setTimeout(resolve, 500));

            } catch (error) {
                failed++;
                console.error(`Forward failed: ${groupId}`, error);
            }
        }

        // ==================== RESULT ====================
        await conn.sendMessage(
            from,
            {
                text:
                    `📤 *FORWARD COMPLETED*\n\n` +
                    `✅ Sent: ${sent}\n` +
                    `❌ Failed: ${failed}\n` +
                    `👥 Groups: ${groupIds.length}`
            },
            { quoted: mek }
        );

    } catch (e) {
        console.error("Error in forward command:", e);

        await conn.sendMessage(
            from,
            {
                text: `❌ Error: ${e.message}`
            },
            { quoted: mek }
        );
    }
});
