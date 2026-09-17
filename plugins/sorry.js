import axios from 'axios';
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
  pattern: 'sorry',
  desc: 'Send multiple apology messages by mention, reply, or private chat',
  category: 'general',
  react: '🥺',
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const sender = m.sender || m.key?.participant;

    if (!sender) {
      return reply('❌ Could not identify who is apologizing.');
    }

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

    // Mentioned user gets first priority
    let target = mentioned.find(jid => jid && jid !== sender);

    // If no mention, check replied message
    if (!target && contextInfo.participant) {
      if (contextInfo.participant !== sender) {
        target = contextInfo.participant;
      }
    }

    // In private chat, use the other person as target
    if (!target && !isGroup) {
      target = from;
    }

    if (!target) {
      return reply(
        '🥺 Please mention someone or reply to their message.\n\n' +
        'Example: .sorry @user\n\n' +
        'Or reply to someone’s message with .sorry'
      );
    }

    const senderName = sender.split('@')[0];
    const targetName = target.split('@')[0];

    // Mention both sender and target
    const mentions = [...new Set([sender, target])];

    const cards = [
      `🥺 *𝗜'𝗠 𝗧𝗥𝗨𝗟𝗬 𝗦𝗢𝗥𝗥𝗬* 🥺\n\n` +
      `@${senderName} sincerely apologizes to @${targetName} from the bottom of their heart.\n\n` +
      `💌 *"Everyone makes mistakes. Please forgive me!"* 🙏\n\n` +
      `Please forgive me, my friend! ❤️`,

      `💔 *𝗣𝗟𝗘𝗔𝗦𝗘 𝗙𝗢𝗥𝗚𝗜𝗩𝗘 𝗠𝗘* 💔\n\n` +
      `@${senderName} regrets their mistake and sincerely apologizes to @${targetName}.\n\n` +
      `🥺 I am really sorry. Please forgive me.\n\n` +
      `🙏 Please give me another chance, my friend.`,

      `🥹 *𝗦𝗢𝗥𝗥𝗬 𝗙𝗥𝗢𝗠 𝗠𝗬 𝗛𝗘𝗔𝗥𝗧* 🥹\n\n` +
      `A heartfelt apology from @${senderName} to @${targetName}.\n\n` +
      `💌 I never wanted to hurt you.\n` +
      `Please accept my sincere apology. 🙏\n\n` +
      `❤️ Please forgive me, my friend!`,

      `🥺 *𝗢𝗡𝗖𝗘 𝗔𝗚𝗔𝗜𝗡, 𝗜'𝗠 𝗦𝗢𝗥𝗥𝗬* 🥺\n\n` +
      `@${senderName} sincerely apologizes to @${targetName}.\n\n` +
      `🙏 If I made a mistake, please forgive me.\n\n` +
      `💖 *"I'm truly sorry. Please forgive me!"*\n\n` +
      `— *PLEASE*`
    ];

    for (const text of cards) {
      await conn.sendMessage(
        from,
        {
          text,
          mentions
        },
        { quoted: mek }
      );
    }

  } catch (error) {
    console.error('[NAWAZ-MD SORRY] Error:', error);
    return reply('❌ Sorry command failed. Please try again.');
  }
});
