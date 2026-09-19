
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

// TIMER SYSTEM
let forwardTimer = null;
let forwardCancelled = false;
let forwardRunning = false;
let forwardJobId = 0;

// FORWARD COMMAND
cmd({
    pattern: "forward",
    alias: ["fyd", "fod", "frd"],
    desc: "Forward replied message with optional group limit and repeating timer",
    category: "owner",
    react: "🏃",
    filename: __filename
},
async (conn, mek, m, { from, isCreator, reply }) => {
    try {
        if (!isCreator) {
            return reply("📛 This is an owner command.");
        }

        if (!m.quoted) {
            return reply(
                "🍁 Please reply to a Video, Image, Text or Link message.\n\n" +
                "Examples:\n" +
                ".forward\n" +
                ".fyd\n" +
                ".forward/3\n" +
                ".fyd/3 5M\n" +
                ".forward 5M\n\n" +
                "🛑 Stop: .forwardstop"
            );
        }

        const commandText = (m.body || m.text || "").trim();

        // GROUP LIMIT
        let count = null;
        const slashMatch = commandText.match(/\/(\d+)/);

        if (slashMatch) {
            count = parseInt(slashMatch[1], 10);

            if (!count || count < 1) {
                return reply("❌ Please enter a valid group number.");
            }
        }

        // TIMER
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

            timerMs = timerUnit === "M"
                ? timerValue * 60 * 1000
                : timerValue * 60 * 60 * 1000;

            timerText = `${timerValue} ${timerUnit}`;
        }

        // GET REPLIED MESSAGE
        const quoted = m.quoted;
        const msg = quoted.msg || {};

        let messageContent = null;

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

            messageContent = { text };
        }

        // UNSUPPORTED MESSAGE
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

        // GET GROUPS
        const groups = await conn.groupFetchAllParticipating();
        let groupIds = Object.keys(groups || {});

        if (!groupIds.length) {
            return reply("❌ No groups found.");
        }

        // APPLY GROUP LIMIT ONLY IF PROVIDED
        if (count !== null) {
            groupIds = groupIds.slice(0, count);
        }

        // CREATE A NEW JOB
        // A new forward command replaces the previous timer.
        if (forwardTimer) {
            clearTimeout(forwardTimer);
            forwardTimer = null;
        }

        forwardCancelled = true;
        const jobId = ++forwardJobId;

        // WAIT UNTIL PREVIOUS CYCLE FINISHES
        while (forwardRunning) {
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        if (jobId !== forwardJobId) {
            return;
        }

        forwardCancelled = false;

        // FORWARD FUNCTION
        const startForward = async () => {
            if (
                forwardCancelled ||
                jobId !== forwardJobId ||
                forwardRunning
            ) {
                return;
            }

            forwardRunning = true;

            let sent = 0;
            let failed = 0;

            try {
                for (const groupId of groupIds) {
                    if (
                        forwardCancelled ||
                        jobId !== forwardJobId
                    ) {
                        break;
                    }

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

                if (
                    !forwardCancelled &&
                    jobId === forwardJobId
                ) {
                    await conn.sendMessage(
                        from,
                        {
                            text:
                                `📤 *FORWARD CYCLE COMPLETED*\n\n` +
                                `✅ Sent: ${sent}\n` +
                                `❌ Failed: ${failed}\n` +
                                `👥 Groups: ${groupIds.length}` +
                                (timerMs > 0
                                    ? `\n\n🔁 Next forward in ${timerText}.`
                                    : "")
                        },
                        { quoted: mek }
                    );
                }

            } finally {
                forwardRunning = false;
            }
        };

        // REPEATING TIMER
        const scheduleNext = () => {
            if (
                forwardCancelled ||
                jobId !== forwardJobId
            ) {
                return;
            }

            forwardTimer = setTimeout(async () => {
                if (
                    forwardCancelled ||
                    jobId !== forwardJobId
                ) {
                    return;
                }

                await startForward();

                // SCHEDULE NEXT CYCLE
                if (
                    !forwardCancelled &&
                    jobId === forwardJobId
                ) {
                    scheduleNext();
                }
            }, timerMs);
        };

        // TIMER ENABLED
        if (timerMs > 0) {
            await reply(
                `⏰ *REPEATING FORWARD TIMER SET*\n\n` +
                `🕒 Interval: ${timerText}\n` +
                `👥 Groups: ${groupIds.length}\n\n` +
                `✅ First forward after ${timerText}.\n` +
                `🔁 Repeats automatically.\n\n` +
                `🛑 Stop: .forwardstop`
            );

            scheduleNext();
            return;
        }

        // NO TIMER: FORWARD IMMEDIATELY
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

// STOP COMMAND
cmd({
    pattern: "forwardstop",
    alias: ["stopforward", "fstop"],
    desc: "Stop repeating forward timer",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { isCreator, reply }) => {
    if (!isCreator) {
        return reply("📛 This is an owner command.");
    }

    if (forwardTimer) {
        clearTimeout(forwardTimer);
        forwardTimer = null;
    }

    forwardCancelled = true;
    forwardJobId++;

    return reply(
        "🛑 *FORWARD TIMER STOPPED*\n\n" +
        "✅ Automatic forwarding has been stopped."
    );
});
