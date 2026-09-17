import axios from 'axios';
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

// Get target from mention, reply, or private chat
function getTarget(m, from, sender) {
    const contextInfo =
        m.message?.extendedTextMessage?.contextInfo ||
        m.message?.imageMessage?.contextInfo ||
        m.message?.videoMessage?.contextInfo ||
        m.message?.documentMessage?.contextInfo ||
        m.message?.stickerMessage?.contextInfo ||
        {};

    const mentioned = [
        ...(m.mentionedJid || []),
        ...(contextInfo.mentionedJid || [])
    ];

    const isGroup = from.endsWith('@g.us');

    // Mention gets first priority
    let target = mentioned.find(jid => jid && jid !== sender);

    // If no mention, use replied user
    if (!target && contextInfo.participant) {
        if (contextInfo.participant !== sender) {
            target = contextInfo.participant;
        }
    }

    // Private chat: target is the other person
    if (!target && !isGroup) {
        target = from;
    }

    return target;
}

// Different message for every command
const sorryMessages = {
    sorry1: `🥺 *𝗜'𝗠 𝗧𝗥𝗨𝗟𝗬 𝗦𝗢𝗥𝗥𝗬* 🥺\n\n@SENDER sincerely apologizes to @TARGET from the bottom of their heart.\n\n🙏 Please forgive me. I really didn't mean to hurt you. ❤️`,

    sorry2: `💔 *𝗣𝗟𝗘𝗔𝗦𝗘 𝗙𝗢𝗥𝗚𝗜𝗩𝗘 𝗠𝗘* 💔\n\n@SENDER is truly sorry to @TARGET.\n\n🥺 I regret my mistake and sincerely ask you to forgive me. 🙏`,

    sorry3: `🥹 *𝗦𝗢𝗥𝗥𝗬 𝗙𝗥𝗢𝗠 𝗠𝗬 𝗛𝗘𝗔𝗥𝗧* 🥹\n\n@SENDER wants to say sorry to @TARGET.\n\n💌 I never wanted to hurt you.\nPlease accept my sincere apology. 🙏❤️`,

    sorry4: `🥺 *𝗢𝗡𝗖𝗘 𝗔𝗚𝗔𝗜𝗡, 𝗜'𝗠 𝗦𝗢𝗥𝗥𝗬* 🥺\n\n@SENDER sincerely apologizes to @TARGET.\n\n🙏 Please forgive me and don't be angry with me. ❤️`,

    sorry5: `😔 *𝗣𝗟𝗘𝗔𝗦𝗘 𝗔𝗖𝗖𝗘𝗣𝗧 𝗠𝗬 𝗔𝗣𝗢𝗟𝗢𝗚𝗬* 😔\n\n@SENDER is saying sorry to @TARGET.\n\n🥺 I know I made a mistake. Please forgive me. 🙏`,

    sorry6: `🥺 *𝗜 𝗔𝗠 𝗥𝗘𝗔𝗟𝗟𝗬 𝗦𝗢𝗥𝗥𝗬* 🥺\n\n@SENDER apologizes sincerely to @TARGET.\n\n❤️ Please don't stay upset with me. Forgive me, please. 🙏`,

    sorry7: `💖 *𝗙𝗢𝗥𝗚𝗜𝗩𝗘 𝗠𝗘 𝗣𝗟𝗘𝗔𝗦𝗘* 💖\n\n@SENDER wants to apologize to @TARGET.\n\n🥹 Everyone makes mistakes. I'm genuinely sorry. 🙏`,

    sorry8: `😔 *𝗠𝗬 𝗦𝗜𝗡𝗖𝗘𝗥𝗘 𝗔𝗣𝗢𝗟𝗢𝗚𝗬* 😔\n\n@SENDER sincerely says sorry to @TARGET.\n\n🙏 I hope you can forgive me and give me another chance. ❤️`,

    sorry9: `🥹 *𝗜 𝗡𝗘𝗩𝗘𝗥 𝗪𝗔𝗡𝗧𝗘𝗗 𝗧𝗢 𝗛𝗨𝗥𝗧 𝗬𝗢𝗨* 🥹\n\n@SENDER apologizes to @TARGET.\n\n💌 I'm really sorry for my mistake. Please forgive me. 🙏`,

    sorry10: `🥺 *𝗧𝗥𝗨𝗟𝗬 𝗦𝗢𝗥𝗥𝗬* 🥺\n\n@SENDER is sincerely apologizing to @TARGET.\n\n❤️ Please forgive me and accept my heartfelt apology. 🙏`
};

// Register every command separately
for (const [pattern, template] of Object.entries(sorryMessages)) {

    cmd({
        pattern: pattern,
        desc: `Owner Only - ${pattern} apology command`,
        category: 'owner',
        react: '🥺',
        filename: __filename
    }, async (conn, mek, m, { from, reply, isCreator }) => {

        try {
            // Owner Only
            if (!isCreator) {
                return;
            }

            const sender = m.sender || m.key?.participant;

            if (!sender) {
                return reply('❌ Could not identify who is apologizing.');
            }

            const target = getTarget(m, from, sender);

            if (!target) {
                return reply(
                    '🥺 Please mention someone or reply to their message.\n\n' +
                    `Example: .${pattern} @user`
                );
            }

            const senderName = sender.split('@')[0];
            const targetName = target.split('@')[0];

            const text = template
                .replace(/@SENDER/g, `@${senderName}`)
                .replace(/@TARGET/g, `@${targetName}`);

            // Send only ONE message
            await conn.sendMessage(
                from,
                {
                    text: text,
                    mentions: [...new Set([sender, target])]
                },
                { quoted: mek }
            );

        } catch (error) {
            console.error(`[NAWAZ-MD ${pattern.toUpperCase()}] Error:`, error);
            return reply(
                `❌ ${pattern} command failed. Please try again.`
            );
        }
    });
  }
