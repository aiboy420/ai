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

        if (!isGroup) {
            return reply("❌ *This command can only be used in groups.*");
        }

        // Group metadata
        const groupMetadata = await conn.groupMetadata(from);
        const participants = groupMetadata.participants || [];

        // Command sender
        const sender = m.sender || mek.key.participant || mek.participant;

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

        // If user is mentioned, use that user
        let target;

        if (mentionedUsers.length > 0) {
            target = mentionedUsers[0];
        } else {
            // Random group member
            const availableUsers = participants
                .map(p => p.id)
                .filter(jid =>
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

        const mentions = [sender, target];

        const caption =
`💋 *Kissing For You* 💋

@${sender.split('@')[0]} 💋 @${target.split('@')[0]}

> ©ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`;

        await conn.sendMessage(
            from,
            {
                video: {
                    url: 'https://files.catbox.moe/az510l.mp4'
                },
                caption: caption,
                gifPlayback: true,
                mentions: mentions
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
