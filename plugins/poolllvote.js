// pollvote.js - Poll Vote with Custom Option Selection
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONFIGURATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const BLOCKED_NEWSLETTER = "120363426829681935@newsletter";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// POLL VOTE COMMAND
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: "poll",
    alias: ["vote", "poll"],
    desc: "Vote on a WhatsApp Channel poll",
    category: "owner",
    react: "🗳️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, isCreator, args, reply }) => {
    try {
        if (!isCreator) return reply("📛 This is an owner command.");

        // ─── Check arguments ───
        if (args.length < 2) {
            return reply(
                `📌 *Usage:* .pollvote <channel_url> <option>\n\n` +
                `*Examples:*\n` +
                `• .pollvote https://whatsapp.com/channel/0029VatOy2EAzNc2WcShQw1j/5300 A\n` +
                `• .pollvote https://whatsapp.com/channel/.../5300 B\n` +
                `• .pollvote https://whatsapp.com/channel/.../5300 1\n` +
                `• .pollvote https://whatsapp.com/channel/.../5300 2\n\n` +
                `*With poll key:* .pollvote <url> <option> <poll_key>`
            );
        }

        const url = args[0];
        const optionInput = args[1].toUpperCase();
        const pollKey = args[2] || null;

        // ─── Check blocked newsletter ───
        if (url.includes(BLOCKED_NEWSLETTER) || url.includes("120363426829681935")) {
            return reply("❌ Voting is disabled for this newsletter.");
        }

        // ─── Extract channel ID and post ID ───
        const match = url.match(/channel\/([\w-]+)\/(\d+)/);
        if (!match) {
            return reply("❌ Invalid channel URL format.\n\nMake sure it looks like:\nhttps://whatsapp.com/channel/0029VatOy2EAzNc2WcShQw1j/5300");
        }

        const channelId = match[1];
        const postId = match[2];
        const jid = `${channelId}@newsletter`;

        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        // ─── Convert option input to number ───
        let optionNumber;
        if (optionInput.match(/^[A-Z]$/)) {
            // Convert A, B, C to 1, 2, 3
            optionNumber = optionInput.charCodeAt(0) - 64;
        } else {
            optionNumber = parseInt(optionInput);
        }

        if (isNaN(optionNumber) || optionNumber < 1) {
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return reply("❌ Invalid option. Please provide A, B, C or 1, 2, 3");
        }

        // ─── If pollKey is provided, vote directly ───
        if (pollKey) {
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

                await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
                return reply(`✅ *Vote Cast Successfully!*\n\n📱 Option: ${optionInput}\n🔑 Poll Key: ${pollKey}`);
            } catch (error) {
                console.error('Vote error:', error);
                await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
                return reply(`❌ Failed to cast vote: ${error.message}`);
            }
        }

        // ─── Try to detect poll and vote ───
        try {
            // Get poll data
            const pollData = await conn.newsletterPoll(jid, postId);
            
            if (!pollData || !pollData.poll) {
                await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
                return reply("❌ No poll found in this post.");
            }

            const poll = pollData.poll;
            const options = poll.options || [];

            if (optionNumber > options.length) {
                await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
                return reply(`❌ Invalid option. This poll has ${options.length} options.\n\nAvailable options:\n${options.map((opt, i) => `  ${String.fromCharCode(65 + i)}. ${opt}`).join('\n')}`);
            }

            // Cast vote
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

            await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

            // Show poll results
            let resultMsg = `🗳️ *Poll Vote Cast Successfully!*\n\n`;
            resultMsg += `📝 *Question:* ${poll.question || 'Poll'}\n`;
            resultMsg += `✅ *Voted:* Option ${optionInput}: ${options[optionNumber - 1]}\n\n`;
            resultMsg += `📊 *Poll Results:*\n`;
            resultMsg += `─────────────────\n`;
            
            options.forEach((opt, index) => {
                const votes = poll.votes?.[index] || 0;
                const total = poll.totalVotes || 1;
                const percentage = Math.round((votes / total) * 100);
                const bar = '█'.repeat(Math.floor(percentage / 5)) + '░'.repeat(20 - Math.floor(percentage / 5));
                const label = String.fromCharCode(65 + index);
                resultMsg += `${label}. ${opt}\n`;
                resultMsg += `   ${bar} ${percentage}% (${votes} votes)\n\n`;
            });

            await reply(resultMsg);

        } catch (pollError) {
            console.error('Poll detection error:', pollError);
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return reply(
                `❌ Failed to detect poll.\n\n` +
                `Please provide the poll key manually:\n` +
                `.pollvote ${url} ${optionInput} <poll_key>\n\n` +
                `_Error: ${pollError.message}_`
            );
        }

    } catch (error) {
        console.error('Poll vote error:', error);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply(`❌ Error: ${error.message}`);
    }
});

console.log("✅ Poll Vote Plugin Loaded!");
console.log("📌 Usage: .pollvote <channel_url> <option>");
console.log("📌 Options: A, B, C or 1, 2, 3");
console.log("📌 With poll key: .pollvote <url> <option> <poll_key>");
