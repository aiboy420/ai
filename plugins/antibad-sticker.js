// antibad-sticker.js - ESM Version
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ==================== ANTI-BAD STICKER SYSTEM ====================

// Bad sticker keywords to detect
const BAD_STICKER_KEYWORDS = [
    'nsfw', '18+', 'adult', 'xxx', 'porn', 'sex', 'nude',
    'pussy', 'dick', 'cock', 'ass', 'bitch', 'fuck',
    'gali', 'bad', 'explicit', 'mature', 'spam'
];

// Store enabled groups
let antiBadStickerEnabled = {};
let antiBadStickerAction = {}; // { groupId: 'delete' | 'warn' | 'kick' | 'both' }
let stickerWarnings = {}; // { userId: count }

// ─── MAIN ANTI-BAD STICKER COMMAND ───
cmd({
    pattern: "antibadsticker",
    alias: ["abs", "badsticker", "bsticker"],
    desc: "Enable/Disable anti-bad sticker protection",
    category: "group",
    react: "🚫",
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
                `🚫 *Anti-Bad Sticker Protection*\n\n` +
                `*Usage:*\n` +
                `• .antibadsticker on        - Enable\n` +
                `• .antibadsticker off       - Disable\n` +
                `• .antibadsticker status    - Check status\n` +
                `• .antibadsticker on delete - Delete only\n` +
                `• .antibadsticker on warn   - Warn users\n` +
                `• .antibadsticker on kick   - Kick users\n` +
                `• .antibadsticker on both   - Warn + Kick\n\n` +
                `*Example:* .antibadsticker on delete`
            );
        }

        if (action === 'status') {
            const status = antiBadStickerEnabled[from] ? '✅ ENABLED' : '❌ DISABLED';
            const setting = antiBadStickerAction[from] || 'delete';
            
            let msg = `╭━━❰ 🚫 ANTI-BAD STICKER STATUS ❱━━⬣\n`;
            msg += `┃❖ Status: ${status}\n`;
            msg += `┃❖ Action: ${setting.toUpperCase()}\n`;
            msg += `╰━━━━━━━━━━━━━━⬣`;
            return reply(msg);
        }

        if (action === 'on') {
            antiBadStickerEnabled[from] = true;
            
            if (option === 'delete' || option === 'warn' || option === 'kick' || option === 'both') {
                antiBadStickerAction[from] = option;
            } else {
                antiBadStickerAction[from] = 'delete';
            }
            
            return reply(
                `✅ *Anti-Bad Sticker Protection Enabled!*\n\n` +
                `• Action: ${antiBadStickerAction[from].toUpperCase()}\n` +
                `• Bad stickers will be ${antiBadStickerAction[from] === 'delete' ? 'deleted' : antiBadStickerAction[from] === 'warn' ? 'warned' : antiBadStickerAction[from] === 'kick' ? 'kicked' : 'warned & kicked'}`
            );
        } else if (action === 'off') {
            antiBadStickerEnabled[from] = false;
            delete antiBadStickerAction[from];
            delete stickerWarnings[from];
            return reply("❌ *Anti-Bad Sticker Protection Disabled!*");
        }

    } catch (error) {
        console.error("AntiBadSticker error:", error);
        reply("❌ Failed to update anti-bad sticker settings.");
    }
});

// ─── DETECT BAD STICKERS ───
cmd({
    on: "body"
}, async (conn, mek, m, { from, isGroup, sender, reply, quoted }) => {
    try {
        if (!isGroup) return;
        if (!antiBadStickerEnabled[from]) return;

        // Check if message is a sticker
        if (!m.quoted || m.quoted.mtype !== 'stickerMessage') return;

        const stickerMsg = m.quoted;
        const stickerText = stickerMsg.text || stickerMsg.caption || '';
        const stickerFileName = stickerMsg.fileName || '';

        // Check if sticker contains bad keywords
        let foundBad = false;
        let badWordFound = '';

        const checkText = (stickerText + ' ' + stickerFileName).toLowerCase();

        for (const keyword of BAD_STICKER_KEYWORDS) {
            if (checkText.includes(keyword.toLowerCase())) {
                foundBad = true;
                badWordFound = keyword;
                break;
            }
        }

        // Also check sticker metadata if available
        try {
            const stickerBuffer = await stickerMsg.download();
            // Additional check for sticker metadata if available
            // This is a simple check - you can add more complex detection
        } catch (e) {
            // If download fails, skip
        }

        if (!foundBad) return;

        const action = antiBadStickerAction[from] || 'delete';
        const user = sender.split('@')[0];

        // Initialize warnings for user
        if (!stickerWarnings[from]) stickerWarnings[from] = {};
        if (!stickerWarnings[from][sender]) stickerWarnings[from][sender] = 0;

        // DELETE
        if (action === 'delete' || action === 'both') {
            try {
                await conn.sendMessage(from, {
                    delete: {
                        remoteJid: from,
                        fromMe: false,
                        id: m.key.id,
                        participant: sender
                    }
                });
                console.log(`🚫 Deleted bad sticker from ${user}`);
            } catch (deleteError) {
                console.error("Failed to delete sticker:", deleteError);
            }
        }

        // WARN
        if (action === 'warn' || action === 'both') {
            stickerWarnings[from][sender] += 1;
            const warnCount = stickerWarnings[from][sender];

            await conn.sendMessage(from, {
                text: `⚠️ *WARNING!*\n\n` +
                      `• User: @${user}\n` +
                      `• Bad Sticker Detected: "${badWordFound}"\n` +
                      `• Warning: ${warnCount}/3\n` +
                      `• Action: ${warnCount >= 3 ? 'You will be kicked!' : 'Please avoid sending bad stickers.'}\n\n` +
                      `_Anti-Bad Sticker Protection is active._`,
                mentions: [sender]
            });

            // Kick if 3 warnings
            if (warnCount >= 3) {
                try {
                    await conn.groupParticipantsUpdate(from, [sender], "remove");
                    await conn.sendMessage(from, {
                        text: `👢 *User Kicked!*\n\n` +
                              `• User: @${user}\n` +
                              `• Reason: Repeated bad stickers (3 warnings)\n` +
                              `• Action: User has been removed from the group.`,
                        mentions: [sender]
                    });
                    delete stickerWarnings[from][sender];
                } catch (kickError) {
                    console.error("Failed to kick user:", kickError);
                }
            }
        }

        // KICK directly (without warning)
        if (action === 'kick') {
            try {
                await conn.groupParticipantsUpdate(from, [sender], "remove");
                await conn.sendMessage(from, {
                    text: `👢 *User Kicked!*\n\n` +
                          `• User: @${user}\n` +
                          `• Reason: Sending inappropriate stickers is not allowed.`,
                    mentions: [sender]
                });
            } catch (kickError) {
                console.error("Failed to kick user:", kickError);
            }
        }

    } catch (error) {
        console.error("AntiBadSticker detection error:", error);
    }
});

// ─── ADD BAD STICKER KEYWORD ───
cmd({
    pattern: "addbadsticker",
    alias: ["absadd", "addbsticker"],
    desc: "Add a new bad sticker keyword to the filter",
    category: "group",
    react: "➕",
    filename: __filename
}, async (conn, mek, m, {
    from,
    isGroup,
    isAdmins,
    isCreator,
    args,
    reply
}) => {
    try {
        if (!isGroup) return reply("⚠️ This command only works in groups.");
        if (!isAdmins && !isCreator) return reply("🔐 Only admins can use this command.");

        const keyword = args.join(' ');
        if (!keyword) {
            return reply("❌ Please provide a keyword to add.\n\nExample: .addbadsticker nsfw");
        }

        BAD_STICKER_KEYWORDS.push(keyword.toLowerCase());
        
        reply(`✅ *Bad Sticker Keyword Added!*\n\n• Keyword: "${keyword}"\n• Now ${BAD_STICKER_KEYWORDS.length} keywords in filter.`);

    } catch (error) {
        console.error("Add bad sticker error:", error);
        reply("❌ Failed to add keyword.");
    }
});

// ─── REMOVE BAD STICKER KEYWORD ───
cmd({
    pattern: "removebadsticker",
    alias: ["rbs", "delbsticker"],
    desc: "Remove a bad sticker keyword from the filter",
    category: "group",
    react: "➖",
    filename: __filename
}, async (conn, mek, m, {
    from,
    isGroup,
    isAdmins,
    isCreator,
    args,
    reply
}) => {
    try {
        if (!isGroup) return reply("⚠️ This command only works in groups.");
        if (!isAdmins && !isCreator) return reply("🔐 Only admins can use this command.");

        const keyword = args.join(' ');
        if (!keyword) {
            return reply("❌ Please provide a keyword to remove.\n\nExample: .removebadsticker nsfw");
        }

        const index = BAD_STICKER_KEYWORDS.indexOf(keyword.toLowerCase());
        if (index === -1) {
            return reply(`❌ Keyword "${keyword}" not found in filter.`);
        }

        BAD_STICKER_KEYWORDS.splice(index, 1);
        reply(`✅ *Bad Sticker Keyword Removed!*\n\n• Keyword: "${keyword}"\n• Now ${BAD_STICKER_KEYWORDS.length} keywords in filter.`);

    } catch (error) {
        console.error("Remove bad sticker error:", error);
        reply("❌ Failed to remove keyword.");
    }
});

// ─── LIST BAD STICKER KEYWORDS ───
cmd({
    pattern: "badstickerlist",
    alias: ["bslist", "bstickerlist"],
    desc: "List all bad sticker keywords in the filter",
    category: "group",
    react: "📋",
    filename: __filename
}, async (conn, mek, m, {
    isGroup,
    isAdmins,
    isCreator,
    reply
}) => {
    try {
        if (!isGroup) return reply("⚠️ This command only works in groups.");
        if (!isAdmins && !isCreator) return reply("🔐 Only admins can use this command.");

        if (BAD_STICKER_KEYWORDS.length === 0) {
            return reply("📋 No bad sticker keywords in filter.");
        }

        let msg = `╭━━❰ 📋 BAD STICKER KEYWORDS ❱━━⬣\n`;
        BAD_STICKER_KEYWORDS.forEach((word, i) => {
            msg += `┃❖ ${i+1}. ${word}\n`;
        });
        msg += `╰━━━━━━━━━━━━━━⬣\n\n`;
        msg += `Total: ${BAD_STICKER_KEYWORDS.length} keywords`;

        await reply(msg);

    } catch (error) {
        console.error("Bad sticker list error:", error);
        reply("❌ Failed to fetch keywords list.");
    }
});

// ─── ANTI-BAD STICKER HELP ───
cmd({
    pattern: "antibadstickerhelp",
    alias: ["abshelp", "bstickerhelp"],
    desc: "Show anti-bad sticker help guide",
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
╭━━❰ 🚫 ANTI-BAD STICKER GUIDE ❱━━⬣
┃❖ *Commands:*
┃❖ 
┃❖ .antibadsticker on        - Enable
┃❖ .antibadsticker off       - Disable
┃❖ .antibadsticker status    - Check
┃❖ 
┃❖ *Options:*
┃❖ .antibadsticker on delete - Delete only
┃❖ .antibadsticker on warn   - Warn users
┃❖ .antibadsticker on kick   - Kick users
┃❖ .antibadsticker on both   - Warn + Kick
┃❖ 
┃❖ .addbadsticker [word]     - Add keyword
┃❖ .removebadsticker [word]  - Remove keyword
┃❖ .badstickerlist           - List keywords
┃❖ .antibadstickerhelp       - This guide
┃❖ 
┃❖ *Note:* 3 warnings = auto kick
╰━━━━━━━━━━━━━━⬣
        `;
        reply(help);

    } catch (error) {
        console.error("AntiBadSticker help error:", error);
        reply("❌ Failed to load help.");
    }
});

console.log("✅ Anti-Bad Sticker System Loaded!");
