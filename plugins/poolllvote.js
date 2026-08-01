// pollvote.js - Simple Poll Vote System
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
        const pollKey = args[2] || null;

        // ─── Blocked newsletter check ───
        if (url.includes("120363426829681935")) {
            return reply("❌ Voting disabled for this newsletter.");
        }

        // ─── Extract IDs ───
        const match = url.match(/channel\/([\w-]+)\/(\d+)/);
        if (!match) return reply("❌ Invalid channel URL.");
        
        const [_, channelId, postId] = match;
        const jid = `${channelId}@newsletter`;

        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        // ─── Get poll data ───
        let pollData, options;
        try {
            pollData = await conn.newsletterPoll(jid, postId);
            if (!pollData?.poll) return reply("❌ No poll found.");
            options = pollData.poll.options || [];
            if (options.length === 0) return reply("❌ Poll has no options.");
        } catch (e) {
            return reply(`❌ Failed to get poll: ${e.message}`);
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
            const voteKey = pollKey ? {
                remoteJid: jid,
                id: postId,
                participant: `${channelId}@s.whatsapp.net`
            } : {
                remoteJid: jid,
                id: postId,
                participant: `${channelId}@s.whatsapp.net`
            };

            await conn.sendMessage(jid, {
                pollUpdate: {
                    pollCreationMessageKey: voteKey,
                    vote: {
                        selectedOption: optionNumber - 1,
                        selectedParticipants: []
                    }
                }
            });

            // ─── Show results ───
            const total = pollData.poll.totalVotes || 1;
            let result = `🗳️ *Voted Option ${optionInput}*\n\n📊 Results:\n`;
            options.forEach((opt, i) => {
                const votes = pollData.poll.votes?.[i] || 0;
                const pct = Math.round((votes / total) * 100);
                const bar = '█'.repeat(Math.floor(pct / 5)) + '░'.repeat(20 - Math.floor(pct / 5));
                result += `${String.fromCharCode(65 + i)}. ${opt}\n   ${bar} ${pct}% (${votes})\n\n`;
            });

            await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
            await reply(result);

        } catch (e) {
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            reply(`❌ Vote failed: ${e.message}`);
        }

    } catch (e) {
        console.error('Poll vote error:', e);
        reply(`❌ Error: ${e.message}`);
    }
});

console.log("✅ Poll Vote System Loaded!");
console.log("📌 Usage: .pollvote <url> [A/B/C/1/2/3/random]");
