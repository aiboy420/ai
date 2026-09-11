import { cmd } from '../command.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cmd({
    pattern: "kiss",
    react: "💋",
    desc: "Send a kiss video to a user",
    category: "fun",
    use: ".kiss @user",
    filename: __filename
}, async (conn, mek, m, {
    reply,
    from
}) => {
    try {
        // Group only
        if (!from.endsWith('@g.us')) {
            return reply("❌ *This command can only be used in groups.*");
        }

        // Command user's JID
        const sender = m.sender || m.key?.participant || mek.key?.participant;

        // Get group metadata
        const groupMetadata = await conn.groupMetadata(from);
        const participants = groupMetadata.participants || [];

        // Check mentioned user
        let target = null;

        if (m.mentionedJid && m.mentionedJid.length > 0) {
            target = m.mentionedJid[0];
        }

        // If no mention, select random user
        if (!target) {
            const users = participants.filter(
                user => user.id && user.id !== sender
            );

            if (!users.length) {
                return reply("❌ *No user found to kiss.*");
            }

            target = users[Math.floor(Math.random() * users.length)].id;
        }

        const caption = `💋 *Kissing for you* 😘`;

        await conn.sendMessage(
            from,
            {
                video: {
                    url: 'https://files.catbox.moe/9g3ebs.mp4'
                },
                caption: caption,
                mentions: [sender, target]
            },
            {
                quoted: mek
            }
        );

    } catch (error) {
        console.error("❌ Error in .kiss command:", error);
        reply(
            `❌ *Error in .kiss command:*\n\`\`\`${error.message}\`\`\``
        );
    }
});
