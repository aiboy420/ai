// pollvote.js - Simple Version
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

cmd({
    pattern: "pollvote",
    alias: ["vote", "pv"],
    desc: "Vote on WhatsApp Channel poll",
    category: "owner",
    react: "🗳️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, isCreator, args, reply }) => {
    try {
        if (!isCreator) return;

        if (args.length < 2) {
            return reply(
                `📌 *Usage:* .pollvote <url> <option> <poll_key>\n\n` +
                `*Example:* .pollvote https://whatsapp.com/channel/.../5300 A 120363...\n\n` +
                `*Options:* A, B, C, 1, 2, 3`
            );
        }

        const url = args[0];
        const optionInput = args[1].toUpperCase();
        const pollKey = args[2];

        if (!pollKey) {
            return reply("❌ Please provide poll key.\n\nUsage: .pollvote <url> <option> <poll_key>");
        }

        const match = url.match(/channel\/([\w-]+)\/(\d+)/);
        if (!match) return reply("❌ Invalid URL.");
        
        const channelId = match[1];
        const postId = match[2];
        const jid = `${channelId}@newsletter`;

        let optionNumber;
        if (optionInput.match(/^[A-Z]$/)) {
            optionNumber = optionInput.charCodeAt(0) - 64;
        } else {
            optionNumber = parseInt(optionInput);
        }

        if (isNaN(optionNumber) || optionNumber < 1) {
            return reply("❌ Invalid option. Use A, B, C or 1, 2, 3");
        }

        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        await conn.sendMessage(jid, {
            pollUpdate: {
                pollCreationMessageKey: {
                    remoteJid: jid,
                    id: pollKey,
                    participant: `${channelId}@s.whatsapp.net`
                },
                vote: {
                    selectedOption: optionNumber - 1,
                    selectedParticipants: []
                }
            }
        });

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
        reply(`✅ *Voted Option ${optionInput}*`);

    } catch (e) {
        console.error('Error:', e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply(`❌ Error: ${e.message}`);
    }
});

console.log("✅ Poll Vote Loaded!");
