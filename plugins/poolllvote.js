// pollvote.js - Auto-Detect Poll (No Poll Key Needed)
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
        if (!isCreator) return reply("📛 Owner only.");

        if (args.length < 1) {
            return reply(
                `📌 *Usage:* .pollvote <channel_url> <option>\n\n` +
                `*Examples:*\n` +
                `• .pollvote https://whatsapp.com/channel/.../5300 A\n` +
                `• .pollvote https://whatsapp.com/channel/.../5300 B\n` +
                `• .pollvote https://whatsapp.com/channel/.../5300 random\n\n` +
                `*Options:* A, B, C, 1, 2, 3, random`
            );
        }

        const url = args[0];
        let optionInput = args[1]?.toUpperCase() || 'random';

        // ─── Blocked newsletter check ───
        if (url.includes("120363426829681935")) {
            return reply("❌ Voting disabled for this newsletter.");
        }

        // ─── Extract IDs ───
        const match = url.match(/channel\/([\w-]+)\/(\d+)/);
        if (!match) return reply("❌ Invalid channel URL.");
        
        const channelId = match[1];
        const postId = match[2];
        const jid = `${channelId}@newsletter`;

        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        // ─── Get poll data using message ID ───
        let options = [];
        let question = 'Poll';
        let pollKey = postId;

        try {
            // Try to get poll from message
            const msg = await conn.loadMessage(jid, postId);
            if (msg?.message?.pollCreationMessage) {
                const poll = msg.message.pollCreationMessage;
                options = poll.options.map(o => o.optionName);
                question = poll.name;
                pollKey = msg.key.id;
            }
        } catch (e) {
            console.log('Load message failed:', e.message);
        }

        // ─── If still no options, try alternative method ───
        if (!options || options.length === 0) {
            try {
                // Try to get from newsletter
                const newsData = await conn.newsletterMetadata("jid", jid);
                if (newsData?.messages) {
                    const msg = newsData.messages.find(m => m.id === postId);
                    if (msg?.poll) {
                        options = msg.poll.options;
                        question = msg.poll.question;
                    }
                }
            } catch (e) {
                console.log('Newsletter metadata failed:', e.message);
            }
        }

        // ─── If still no options, ask for manual input ───
        if (!options || options.length === 0) {
            return reply(
                `❌ Could not detect poll automatically.\n\n` +
                `Please provide the option manually:\n` +
                `.pollvote ${url} ${optionInput}\n\n` +
                `Make sure you have a valid poll URL.`
            );
        }

        // ─── Determine option number ───
        let optionNumber;
        
        if (optionInput === 'RANDOM') {
            optionNumber = Math.floor(Math.random() * options.length) + 1;
            optionInput = String.fromCharCode(64 + optionNumber);
        } else if (optionInput.match(/^[A-Z]$/)) {
            optionNumber = optionInput.charCodeAt(0) - 64;
        } else {
            optionNumber = parseInt(optionInput);
        }

        if (isNaN(optionNumber) || optionNumber < 1 || optionNumber > options.length) {
            return reply(`❌ Invalid option. Available: 1-${options.length} (A-${String.fromCharCode(64 + options.length)})`);
        }

        // ─── Cast vote ───
        try {
            await conn.sendMessage(jid, {
                pollUpdate: {
                    pollCreationMessageKey: {
                        remoteJid: jid,
                        id: postId,
                        participant: `${channelId}@s.whatsapp.net`
                    },
                    vote: {
                        selectedOption: optionNumber - 1,
                        selectedParticipants: []
                    }
                }
            });

            // ─── Show results ───
            let result = `🗳️ *Voted Option ${optionInput}*\n\n`;
            result += `📝 *Question:* ${question}\n\n`;
            result += `📊 *Poll Results:*\n`;
            result += `─────────────────\n`;
            options.forEach((opt, i) => {
                const label = String.fromCharCode(65 + i);
                const isVoted = i + 1 === optionNumber;
                result += `${label}. ${opt} ${isVoted ? '✅' : ''}\n`;
            });

            await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
            await reply(result);

        } catch (e) {
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            reply(`❌ Vote failed: ${e.message}`);
        }

    } catch (e) {
        console.error('Poll vote error:', e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply(`❌ Error: ${e.message}`);
    }
});

console.log("✅ Poll Vote System Loaded!");
console.log("📌 Usage: .pollvote <url> [A/B/C/1/2/3/random]");
