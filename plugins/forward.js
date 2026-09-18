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
async (conn, mek, m, { from, isCreator, reply }) => {
    try {
        // OWNER ONLY - ORIGINAL
        if (!isCreator) {
            return reply("📛 This is an owner command.");
        }

        // CHECK REPLY - ORIGINAL
        if (!m.quoted) {
            return reply(
                "🍁 Please reply to a Video, Image, Text or Link message.\n\n" +
                "Example:\n" +
                ".forward\n" +
                ".forward/2\n" +
                ".fyd/3"
            );
        }

        // GROUP COUNT - ORIGINAL
        let count = null;

        const commandText = (m.body || m.text || "").trim();
        const slashMatch = commandText.match(/\/(\d+)$/);

        if (slashMatch) {
            count = parseInt(slashMatch[1], 10);

            if (!count || count < 1) {
                return reply("❌ Please enter a valid group number.");
            }
        }

        // GET ALL GROUPS - ORIGINAL
        const groups = await conn.groupFetchAllParticipating();
        let groupIds = Object.keys(groups || {});

        if (!groupIds.length) {
            return reply("❌ No groups found.");
        }

        if (count !== null) {
            groupIds = groupIds.slice(0, count);
        }

        // GET QUOTED MESSAGE
        const quoted = m.quoted;
        const msg = quoted.msg || {};

        let messageContent = null;

        // GET COMPLETE TEXT / CAPTION
        const caption =
            msg.caption ||
            quoted.caption ||
            quoted.text ||
            msg.text ||
            msg.conversation ||
            "";

        // VIDEO
        if (quoted.mtype === "videoMessage") {
            const buffer = await quoted.download();

            if (!buffer) {
                return reply("❌ Unable to download the replied video.");
            }

            messageContent = {
                video: buffer,
                mimetype: msg.mimetype || "video/mp4",
                caption: caption
            };
        }

        // IMAGE
        else if (quoted.mtype === "imageMessage") {
            const buffer = await quoted.download();

            if (!buffer) {
                return reply("❌ Unable to download the replied image.");
            }

            messageContent = {
                image: buffer,
                mimetype: msg.mimetype || "image/jpeg",
                caption: caption
            };
        }

        // AUDIO
        else if (quoted.mtype === "audioMessage") {
            const buffer = await quoted.download();

            if (!buffer) {
                return reply("❌ Unable to download the replied audio.");
            }

            messageContent = {
                audio: buffer,
                mimetype: msg.mimetype || "audio/mp4",
                ptt: msg.ptt || false
            };
        }

        // DOCUMENT
        else if (quoted.mtype === "documentMessage") {
            const buffer = await quoted.download();

            if (!buffer) {
                return reply("❌ Unable to download the replied document.");
            }

            messageContent = {
                document: buffer,
                mimetype: msg.mimetype || "application/octet-stream",
                fileName: msg.fileName || "file",
                caption: caption
            };
        }

        // TEXT / LINK
        else if (
            quoted.mtype === "conversation" ||
            quoted.mtype === "extendedTextMessage" ||
            quoted.mtype === "text"
        ) {
            const text =
                quoted.text ||
                msg.text ||
                msg.conversation ||
                "";

            if (!text.trim()) {
                return reply("❌ Empty text message.");
            }

            messageContent = {
                text: text
            };
        }

        // UNSUPPORTED
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

        // SEND TO GROUPS - ORIGINAL METHOD
        let sent = 0;
        let failed = 0;

        for (const groupId of groupIds) {
            try {
                await conn.sendMessage(
                    groupId,
                    messageContent
                );

                sent++;

                await new Promise(resolve =>
                    setTimeout(resolve, 500)
                );

            } catch (error) {
                failed++;

                console.error(
                    `Forward failed: ${groupId}`,
                    error
                );
            }
        }

        // RESULT - ORIGINAL
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
                
