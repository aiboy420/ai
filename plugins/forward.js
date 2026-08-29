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
    desc: "Forward replied message to all groups",
    category: "owner",
    use: ".forward",
    filename: __filename
}, async (conn, mek, m, {
    args,
    q,
    reply,
    from
}) => {

    try {

        // ==================== BOT NUMBER CHECK ====================
        const botJid = conn.user?.id?.split(':')[0] + '@s.whatsapp.net';
        const senderJid = mek.sender?.split(':')[0] + '@s.whatsapp.net';

        if (!botJid || senderJid !== botJid) {
            return reply("*📛 Only the bot owner number can use this command.*");
        }

        // ==================== REPLY CHECK ====================
        if (!mek.quoted) {
            return reply(
                "*📌 Reply to any message/media and use .forward*"
            );
        }

        // ==================== GET ALL GROUPS ====================
        const groups = await conn.groupFetchAllParticipating();
        const groupIds = Object.keys(groups);

        if (!groupIds.length) {
            return reply("*❌ No groups found.*");
        }

        let success = 0;
        let failed = 0;

        // ==================== FORWARD ====================
        for (const groupId of groupIds) {

            try {

                /*
                 * Use the original quoted message.
                 * copyNForward keeps the original message
                 * type/media instead of downloading it manually.
                 */
                await conn.copyNForward(
                    groupId,
                    mek.quoted,
                    true
                );

                success++;

            } catch (error) {

                failed++;

                console.error(
                    `❌ Forward failed in ${groupId}:`,
                    error?.message || error
                );
            }

            // Delay between groups
            await new Promise(resolve =>
                setTimeout(resolve, 1500)
            );
        }

        // ==================== FINAL RESULT ====================
        return reply(
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
            `\`\`\`${error?.message || error}\`\`\``
        );
    }
});
