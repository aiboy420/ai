import { cmd } from '../command.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cmd({
    pattern: "kiss",
    react: "💋",
    desc: "Kiss someone in the group",
    category: "fun",
    use: ".kiss @user",
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

        // Get group metadata
        const groupMetadata = await conn.groupMetadata(from);
        const participants = groupMetadata.participants || [];

        // Command sender
        const sender =
            m.sender ||
            mek.key?.participant ||
            mek.participant;

        if (!sender) {
            return reply("❌ *Unable to detect command user.*");
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

        // Target user
        let target;

        // If someone is mentioned
        if (mentionedUsers.length > 0) {
            target = mentionedUsers[0];
        } else {

            // Pick random group user
            const availableUsers = participants
                .map(p => p.id)
                .filter(jid =>
                    jid &&
                    jid !== sender &&
                    jid !== conn.user?.id
                );

            if (!availableUsers.length) {
                return reply("❌ *No other user found in this group.*");
            }

            target =
                availableUsers[
                    Math.floor(Math.random() * availableUsers.length)
                ];
        }

        // Both users will be mentioned
        const mentions = [sender, target];

        const caption =
`💋 *Kissing For You* 💋

@${sender.split('@')[0]} 💋 @${target.split('@')[0]}

> ©ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`;

        // Send normal VIDEO — no gifPlayback
        await conn.sendMessage(
            from,
            {
                video: {
                    url: 'https://files.catbox.moe/9g3ebs.mp4'
                },
                caption: caption,
                mentions: mentions
            },
            {
                quoted: mek
            }
        );

    } catch (error) {
        console.error("❌ Error in .kiss command:", error);

        return reply(
            `❌ *Error in .kiss command:*\n\`\`\`${error.message}\`\`\``
        );
    }
});
