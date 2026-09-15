// forward.js - ESM Version
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "forward",
    alias: ["fyd", "fod", "frd"],
    desc: "Forward replied video to all groups",
    category: "owner",
    react: "🍻",
    filename: __filename
},
async (conn, mek, m, { from, isCreator, reply }) => {
    try {
        // Owner Only
        if (!isCreator) {
            return reply("📛 This is an owner command.");
        }

        // Check replied message
        if (!m.quoted) {
            return reply("🍁 Please reply to a video message with .forward");
        }

        // Check video
        if (m.quoted.mtype !== "videoMessage") {
            return reply("❌ Please reply to a video message.");
        }

        // Download video
        const video = await m.quoted.download();

        if (!video) {
            return reply("❌ Failed to download the video.");
        }

        // Get all groups
        const groups = await conn.groupFetchAllParticipating();
        const groupIds = Object.keys(groups || {});

        if (!groupIds.length) {
            return reply("❌ No groups found.");
        }

        let sent = 0;
        let failed = 0;

        // Send video to all groups
        for (const groupId of groupIds) {
            try {
                await conn.sendMessage(groupId, {
                    video: video,
                    mimetype: m.quoted.msg?.mimetype || "video/mp4",
                    caption: m.quoted.msg?.caption || ""
                });

                sent++;

                // Small delay
                await new Promise(resolve => setTimeout(resolve, 500));

            } catch (err) {
                failed++;
                console.error(`Forward failed: ${groupId}`, err);
            }
        }

        // Result
        await conn.sendMessage(from, {
            text:
                `📤 *FORWARD COMPLETED*\n\n` +
                `✅ Sent: ${sent}\n` +
                `❌ Failed: ${failed}\n` +
                `👥 Total Groups: ${groupIds.length}`
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in forward command:", e);

        await conn.sendMessage(from, {
            text: `❌ Error: ${e.message}`
        }, { quoted: mek });
    }
});
