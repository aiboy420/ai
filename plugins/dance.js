import { cmd } from '../command.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cmd({
    pattern: "dance",
    react: "💃",
    desc: "Send a dance video to someone in the group",
    category: "fun",
    use: ".dance @user",
    filename: __filename
}, async (conn, mek, m, {
    args,
    q,
    reply,
    from,
    isGroup
}) => {
    try {

        // Group only
        if (!isGroup) {
            return reply("❌ *This command can only be used in groups.*");
        }

        // Group metadata
        const groupMetadata = await conn.groupMetadata(from);
        const participants = groupMetadata.participants || [];

        // Command sender
        const sender =
            m.sender ||
            mek.key?.participant ||
            mek.participant;

        if (!sender) {
            return reply("❌ *Unable to identify the command user.*");
        }

        // Get mentioned users
        let mentionedUsers = [];

        if (mek.message) {
            const msg =
                mek.message.extendedTextMessage ||
                mek.message.imageMessage ||
                mek.message.videoMessage ||
                mek.message.documentMessage ||
                mek.message.buttonsResponseMessage ||
                mek.message.templateButtonReplyMessage;

            if (msg?.contextInfo?.mentionedJid) {
                mentionedUsers = msg.contextInfo.mentionedJid;
            }
        }

        // Select target
        let target;

        if (mentionedUsers.length > 0) {
            target = mentionedUsers[0];
        } else {

            // Random group member
            const availableUsers = participants
                .map(p => p.id)
                .filter(jid =>
                    jid &&
                    jid !== sender &&
                    jid !== conn.user.id
                );

            if (!availableUsers.length) {
                return reply("❌ *No other user found in this group.*");
            }

            target =
                availableUsers[
                    Math.floor(Math.random() * availableUsers.length)
                ];
        }

        // Two video URLs
        const videos = [
            'https://files.catbox.moe/c4l5mf.mp4',
            'https://files.catbox.moe/quxga4.mp4'
        ];

        // Randomly select one video
        const videoUrl =
            videos[Math.floor(Math.random() * videos.length)];

        // Mentions
        const mentions = [sender, target];

        // Caption
        const caption =
`💃 *Dancing For You* 🕺

@${sender.split('@')[0]} 💃 @${target.split('@')[0]}

> ©ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`;

        // Send normal video
        await conn.sendMessage(
            from,
            {
                video: {
                    url: videoUrl
                },
                caption: caption,
                mentions: mentions
            },
            {
                quoted: mek
            }
        );

    } catch (error) {
        console.error("❌ Error in .dance command:", error);

        reply(
            `❌ *Error in .dance command:*\n\`\`\`${error.message}\`\`\``
        );
    }
});
