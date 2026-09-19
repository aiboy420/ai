import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

// REPEATING FORWARD TIMER
let forwardTimer = null;
let forwardCancelled = false;
let forwardRunning = false;
let forwardJobId = 0;

// FORWARD COMMAND
cmd({
    pattern: "forward",
    alias: ["fyd", "fod", "frd"],
    desc: "Forward replied message to groups with repeating timer",
    category: "owner",
    react: "🏃",
    filename: __filename
},
async (conn, mek, m, { from, isCreator, reply }) => {
    try {
        // OWNER ONLY
        if (!isCreator) {
            return reply("📛 This is an owner command.");
        }

        // CHECK REPLY
        if (!m.quoted) {
            return reply(
                "🍁 Please reply to a Video, Image, Text or Link message.\n\n" +
                "Examples:\n" +
                ".forward\n" +
                ".forward/2\n" +
                ".fyd/2 5M\n" +
                ".fyd/2 5H\n" +
                ".forward 15M\n\n" +
                "🛑 Stop: .forwardstop"
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

            messageContent = { text };
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
        const startForward = async (jobId) => {
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
                                `👥 Groups: ${groupIds.length}\n\n` +
                                `🔁 Automatic forwarding is still active.`
                        },
                        { quoted: mek }
                    );
                }

            } finally {
                forwardRunning = false;
            }
        };

        // TIMER ENABLED - REPEAT
        if (timerMs > 0) {

            // CANCEL PREVIOUS TIMER
            if (forwardTimer) {
                clearTimeout(forwardTimer);
                forwardTimer = null;
            }

            // NEW JOB
            forwardCancelled = false;
            const jobId = ++forwardJobId;

            await reply(
                `⏰ *REPEATING FORWARD TIMER SET*\n\n` +
                `🕒 Interval: ${timerText}\n` +
                `👥 Groups: ${groupIds.length}\n\n` +
                `✅ First forward starts after ${timerText}.\n` +
                `🔁 The same post will repeat after every interval.\n\n` +
                `🛑 Stop: .forwardstop`
            );

            // REPEAT AFTER EACH COMPLETED CYCLE
            const scheduleNext = async () => {
                if (
                    forwardCancelled ||
                    jobId !== forwardJobId
                ) {
                    return;
                }

                await startForward(jobId);

                if (
                    !forwardCancelled &&
                    jobId === forwardJobId
                ) {
                    forwardTimer = setTimeout(
                        scheduleNext,
                        timerMs
                    );
                }
            };

            // FIRST RUN AFTER THE REQUESTED DELAY
            forwardTimer = setTimeout(
                scheduleNext,
                timerMs
            );

            return;
        }

        // NO TIMER - IMMEDIATE FORWARD
        await startForward(forwardJobId);

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

// STOP FORWARD COMMAND
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

    // CANCEL SCHEDULED TIMER
    if (forwardTimer) {
        clearTimeout(forwardTimer);
        forwardTimer = null;
    }

    // INVALIDATE THE CURRENT JOB
    forwardCancelled = true;
    forwardJobId++;

    return reply(
        "🛑 *FORWARD TIMER STOPPED*\n\n" +
        "✅ Automatic forwarding has been stopped."
    );
});
