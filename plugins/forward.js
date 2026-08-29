import { cmd } from '../command.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==================== FORWARD TO ALL GROUPS ====================
cmd({
    pattern: "forward",
    alias: ["fwd"],
    react: "📤",
    desc: "Forward replied message to all groups (Owner only)",
    category: "owner",
    use: ".forward",
    filename: __filename
}, async (conn, mek, m, {
    args,
    q,
    reply,
    from,
    isCreator
}) => {

    try {

        // Owner check
        if (!isCreator) {
            return reply("*📛 This is an owner command.*");
        }

        // Quoted message check
        if (!mek.quoted) {
            return reply(
                "*📌 Reply to any message and use .forward*\n\n" +
                "Supported:\n" +
                "🎥 Video\n" +
                "🖼️ Image\n" +
                "🎵 Audio\n" +
                "📄 Document\n" +
                "🎭 Sticker\n" +
                "💬 Text"
            );
        }

        // Get all groups
        const groups = await conn.groupFetchAllParticipating();
        const groupIds = Object.keys(groups);

        if (groupIds.length === 0) {
            return reply("*❌ No groups found.*");
        }

        let success = 0;
        let failed = 0;

        // ==================== PREPARE ORIGINAL MESSAGE ====================
        const quotedMessage = mek.quoted?.fakeObj || mek.quoted;

        // Forward to all groups
        for (const groupId of groupIds) {

            try {

                // Use original WhatsApp message for forwarding
                await conn.copyNForward(
                    groupId,
                    quotedMessage,
                    true
                );

                success++;

                // Delay between groups
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (error) {

                failed++;

                console.error(
                    `❌ Forward failed in ${groupId}:`,
                    error.message
                );
            }
        }

        // Simple final result
        await reply(
            `✅ Successfully sent to ${success} groups.\n` +
            `❌ Failed: ${failed} groups.\n` +
            `👥 Total groups: ${groupIds.length}`
        );

    } catch (error) {

        console.error(
            "❌ Error in .forward command:",
            error
        );

        return reply(
            `❌ *Error in .forward command:*\n` +
            `\`\`\`${error.message}\`\`\``
        );
    }
});
