// antibot.js - ESM Version (Working)
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ==================== ANTIBOT SYSTEM ====================

let antibotEnabled = {}; // { groupId: true/false }
let antibotSettings = {}; // { groupId: { action: 'kick'|'warn'|'both' } }

// ─── MAIN ANTIBOT COMMAND ───
cmd({
    pattern: "antibot",
    alias: ["ab", "antibots"],
    desc: "Enable/Disable anti-bot protection in group",
    category: "group",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, {
    from,
    isGroup,
    isAdmins,
    isCreator,
    isBotAdmins,
    args,
    reply
}) => {
    try {
        if (!isGroup) return reply("⚠️ This command only works in groups.");
        if (!isBotAdmins) return reply("❌ I must be admin to use this command.");
        if (!isAdmins && !isCreator) return reply("🔐 Only admins can use this command.");

        const action = args[0]?.toLowerCase();
        const option = args[1]?.toLowerCase();

        if (!action || (action !== 'on' && action !== 'off' && action !== 'status')) {
            return reply(
                `🤖 *Anti-Bot Protection*\n\n` +
                `*Usage:*\n` +
                `• .antibot on        - Enable protection\n` +
                `• .antibot off       - Disable protection\n` +
                `• .antibot status    - Check status\n` +
                `• .antibot on kick   - Kick bots only\n` +
                `• .antibot on warn   - Warn bots only\n` +
                `• .antibot on both   - Warn & Kick bots\n\n` +
                `*Example:* .antibot on both`
            );
        }

        if (action === 'status') {
            const status = antibotEnabled[from] ? '✅ ENABLED' : '❌ DISABLED';
            const setting = antibotSettings[from]?.action || 'kick';
            
            let msg = `╭━━❰ 🤖 ANTI-BOT STATUS ❱━━⬣\n`;
            msg += `┃❖ Status: ${status}\n`;
            msg += `┃❖ Action: ${setting.toUpperCase()}\n`;
            msg += `╰━━━━━━━━━━━━━━⬣`;
            return reply(msg);
        }

        if (action === 'on') {
            antibotEnabled[from] = true;
            
            if (option === 'kick' || option === 'warn' || option === 'both') {
                antibotSettings[from] = { action: option };
            } else {
                antibotSettings[from] = { action: 'kick' };
            }
            
            return reply(
                `✅ *Anti-Bot Protection Enabled!*\n\n` +
                `• Action: ${antibotSettings[from].action.toUpperCase()}\n` +
                `• Any bot joining will be ${antibotSettings[from].action === 'warn' ? 'warned' : antibotSettings[from].action === 'both' ? 'warned & kicked' : 'kicked'}.`
            );
        } else if (action === 'off') {
            antibotEnabled[from] = false;
            delete antibotSettings[from];
            return reply("❌ *Anti-Bot Protection Disabled!*");
        }

    } catch (error) {
        console.error("Antibot error:", error);
        reply("❌ Failed to update anti-bot settings.");
    }
});

// ─── AUTO DETECT BOT ON JOIN ───
cmd({
    on: "group-participants-update"
}, async (conn, update, mek, m, { from }) => {
    try {
        // Check if anti-bot is enabled for this group
        if (!antibotEnabled[from]) return;

        const participants = update.participants || [];
        const action = update.action || '';

        if (action !== 'add') return;

        for (const participant of participants) {
            // Check if participant is a bot
            const isBot = 
                participant.includes('@lid') || 
                participant.includes('@newsletter') ||
                participant.includes('bot') ||
                participant.includes('whatsapp');

            if (isBot) {
                const setting = antibotSettings[from]?.action || 'kick';
                const botName = participant.split('@')[0];

                // WARN
                if (setting === 'warn' || setting === 'both') {
                    await conn.sendMessage(from, {
                        text: `🤖 *⚠️ BOT DETECTED!*\n\n` +
                              `• Bot ID: ${botName}\n` +
                              `• Action: Warning issued.\n` +
                              `• Next offense will result in removal.`
                    });
                }

                // KICK
                if (setting === 'kick' || setting === 'both') {
                    try {
                        await conn.groupParticipantsUpdate(from, [participant], "remove");
                        await conn.sendMessage(from, {
                            text: `🤖 *✅ BOT REMOVED!*\n\n` +
                                  `• Bot ID: ${botName}\n` +
                                  `• Action: Bot was automatically removed.\n` +
                                  `• Reason: Anti-bot protection is active.`
                        });
                    } catch (kickError) {
                        console.error("Failed to kick bot:", kickError);
                    }
                }

                console.log(`🤖 Anti-bot: ${setting} bot ${participant} from ${from}`);
            }
        }

    } catch (error) {
        console.error("Anti-bot auto-kick error:", error);
    }
});

// ─── BOT LIST COMMAND ───
cmd({
    pattern: "botlist",
    alias: ["bots", "listbots"],
    desc: "List all bot accounts in the group",
    category: "group",
    react: "📋",
    filename: __filename
}, async (conn, mek, m, {
    from,
    isGroup,
    isAdmins,
    isCreator,
    reply
}) => {
    try {
        if (!isGroup) return reply("⚠️ This command only works in groups.");
        if (!isAdmins && !isCreator) return reply("🔐 Only admins can use this command.");

        const groupData = await conn.groupMetadata(from);
        const participants = groupData.participants || [];

        const bots = participants.filter(p => 
            p.id.includes('@lid') || 
            p.id.includes('@newsletter') ||
            p.id.includes('bot') ||
            p.id.includes('whatsapp')
        );

        if (bots.length === 0) {
            return reply("✅ No bot accounts found in this group.");
        }

        let msg = `╭━━❰ 🤖 BOT LIST ❱━━⬣\n`;
        bots.forEach((bot, i) => {
            msg += `┃❖ ${i+1}. ${bot.id.split('@')[0]}\n`;
        });
        msg += `╰━━━━━━━━━━━━━━⬣\n\n`;
        msg += `Total Bots: ${bots.length}`;

        await reply(msg);

    } catch (error) {
        console.error("Bot list error:", error);
        reply("❌ Failed to fetch bot list.");
    }
});

// ─── KICK BOT COMMAND ───
cmd({
    pattern: "kickbot",
    alias: ["kb", "removebot"],
    desc: "Kick a specific bot from the group",
    category: "group",
    react: "👢",
    filename: __filename
}, async (conn, mek, m, {
    from,
    isGroup,
    isAdmins,
    isCreator,
    isBotAdmins,
    args,
    reply,
    quoted
}) => {
    try {
        if (!isGroup) return reply("⚠️ This command only works in groups.");
        if (!isBotAdmins) return reply("❌ I must be admin to kick bots.");
        if (!isAdmins && !isCreator) return reply("🔐 Only admins can use this command.");

        let botJid = null;

        // Check quoted message
        if (m.quoted) {
            botJid = m.quoted.sender;
        } 
        // Check mentioned user
        else if (m.mentionedJid && m.mentionedJid.length > 0) {
            botJid = m.mentionedJid[0];
        }
        // Check argument
        else if (args[0]) {
            const num = args[0].replace(/[^0-9]/g, '');
            if (num.length >= 10) {
                botJid = num + '@s.whatsapp.net';
            }
        }

        if (!botJid) {
            return reply("❌ Please mention, reply, or provide a number to kick.");
        }

        // Check if it's a bot
        const isBot = botJid.includes('@lid') || 
                      botJid.includes('@newsletter') ||
                      botJid.includes('bot') ||
                      botJid.includes('whatsapp');

        if (!isBot) {
            return reply("❌ This user is not identified as a bot.");
        }

        await conn.groupParticipantsUpdate(from, [botJid], "remove");
        await reply(`✅ *Bot Removed!*\n\n• Bot ID: ${botJid.split('@')[0]}\n• Action: Bot was kicked from the group.`);

    } catch (error) {
        console.error("Kick bot error:", error);
        reply("❌ Failed to kick bot.");
    }
});

// ─── ANTIBOT HELP COMMAND ───
cmd({
    pattern: "antibothelp",
    alias: ["abhelp", "abguide"],
    desc: "Show anti-bot help guide",
    category: "group",
    react: "📖",
    filename: __filename
}, async (conn, mek, m, {
    isGroup,
    reply
}) => {
    try {
        if (!isGroup) return reply("⚠️ This command only works in groups.");

        const help = `
╭━━❰ 🤖 ANTI-BOT GUIDE ❱━━⬣
┃❖ *Commands:*
┃❖ 
┃❖ .antibot on        - Enable
┃❖ .antibot off       - Disable
┃❖ .antibot status    - Check
┃❖ 
┃❖ *Options:*
┃❖ .antibot on kick   - Kick only
┃❖ .antibot on warn   - Warn only
┃❖ .antibot on both   - Warn + Kick
┃❖ 
┃❖ .botlist           - List bots
┃❖ .kickbot @user     - Kick specific bot
┃❖ .antibothelp       - This guide
╰━━━━━━━━━━━━━━⬣
        `;
        reply(help);

    } catch (error) {
        console.error("Antibot help error:", error);
        reply("❌ Failed to load help.");
    }
});
