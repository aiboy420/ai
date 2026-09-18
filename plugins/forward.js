import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "forward",
    alias: ["fyd", "fod", "frd"],
    desc: "Forward replied message to groups with timer",
    category: "owner",
    react: "🏃",
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
                "Examples:\n" +
                ".forward\n" +
                ".forward/2\n" +
                ".fyd/2 5M\n" +
                ".fyd/2 5H\n" +
                ".forward 15M"
            );
        }

        // COMMAND TEXT
        const commandText = (m.body || m.text || "").trim();

        // GROUP COUNT
        let count = null;

        const slashMatch = commandText.match(/\/(\d+)/);

        if (slashMatch) {
            count = parseInt(slashMatch[1], 10);

            if (!count || count < 1) {
                return reply("❌ Please enter a valid group number.");
            }
        }

        // TIMER SYSTEM
        let timerMs = 0;
        let timerText = "";

        const timerMatch = commandText.match(
            /(?:^|\s)(\d+)(M|H)\s*$/i
        );

        if (timerMatch) {
            const timerValue = parseInt(timerMatch[1], 10);
            const timerUnit = timerMatch[2].toUpperCase();

            if (!timerValue || timerValue < 1) {
                return reply("❌ Please enter a valid timer.");
            }

            if (timerUnit === "M") {
                timerMs = timerValue * 60 * 1000;
                timerText = `${timerValue} minute(s)`;
            } else {
                timerMs = timerValue * 60 * 60 * 1000;
                timerText = `${timerValue} hour(s)`;
            }
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
                caption
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
                caption
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
                caption
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
                text
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

        // GET ALL GROUPS
        const groups = await conn.groupFetchAllParticipating();
        let groupIds = Object.keys(groups || {});

        if (!groupIds.length) {
            return reply("❌ No groups found.");
        }

        if (count !== null) {
            groupIds = groupIds.slice(0, count);
        }

        // FORWARD FUNCTION
        const startForward = async () => {
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
        };

        // TIMER ENABLED
        if (timerMs > 0) {
            await reply(
                `⏰ *FORWARD TIMER SET*\n\n` +
                `🕒 Time: ${timerText}\n` +
                `👥 Groups: ${groupIds.length}\n\n` +
                `✅ Your message will be forwarded automatically after the timer.`
            );

            setTimeout(() => {
                startForward().catch(error => {
                    console.error("Scheduled forward error:", error);
                });
            }, timerMs);

            return;
        }

        // NO TIMER - ORIGINAL IMMEDIATE FORWARD
        await startForward();

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
                
