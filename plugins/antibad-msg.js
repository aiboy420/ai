// antibad-msg.js - ESM Version
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ==================== ANTI-BAD MESSAGE SYSTEM ====================

// Bad words list (add more as needed)
const BAD_WORDS = [
    // English
    'fuck', 'shit', 'ass', 'bitch', 'bastard', 'dick', 'pussy', 'cock',
    'whore', 'slut', 'cunt', 'motherfucker', 'faggot', 'retard',
    'asshole', 'bullshit', 'dumbass', 'dipshit', 'fucker',
    // Urdu
    'بھینچود', 'مادرچود', 'چود', 'کمینہ', 'حرامزادہ', 'بکواس',
    'گالی', 'کسی', 'بھاڑ', 'ٹٹو', 'لنڈ', 'چوت', 'گانڈ',
    'ہڑ', 'مادر', 'چوتیا', 'بہنود', 'بہنچود',
    // Common variations
    'fuk', 'fcuk', 'f*ck', 'f**k', 'b!tch', 'b*tch',
    'a**hole', 'fuking', 'fck', 'bsdk', 'bc', 'mc',
    'gandu', 'chutiya', 'bhosdi', 'bhosdike'
];

// Store enabled groups
let antiBadMsgEnabled = {};
let antiBadMsgAction = {}; // { groupId: 'delete' | 'warn' | 'kick' | 'both' }
let msgWarnings = {}; // { userId: count }

// ─── MAIN ANTI-BAD MESSAGE COMMAND ───
cmd({
    pattern: "antibadmsg",
    alias: ["abm", "badmsg", "badword"],
    desc: "Enable/Disable anti-bad message protection",
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
                `🚫 *Anti-Bad Message Protection*\n\n` +
                `*Usage:*\n` +
                `• .antibadmsg on          - Enable\n` +
                `• .antibadmsg off         - Disable\n` +
                `• .antibadmsg status      - Check status\n` +
                `• .antibadmsg on delete   - Delete only\n` +
                `• .antibadmsg on warn     - Warn users\n` +
                `• .antibadmsg on kick     - Kick users\n` +
                `• .antibadmsg on both     - Warn + Kick\n\n` +
                `*Example:* .antibadmsg on delete`
            );
        }

        if (action === 'status') {
            const status = antiBadMsgEnabled[from] ? '✅ ENABLED' : '❌ DISABLED';
            const setting = antiBadMsgAction[from] || 'delete';
            
            let msg = `╭━━❰ 🚫 ANTI-BAD MSG STATUS ❱━━⬣\n`;
            msg += `┃❖ Status: ${status}\n`;
            msg += `┃❖ Action: ${setting.toUpperCase()}\n`;
            msg += `╰━━━━━━━━━━━━━━⬣`;
            return reply(msg);
        }

        if (action === 'on') {
            antiBadMsgEnabled[from] = true;
            
            if (option === 'delete' || option === 'warn' || option === 'kick' || option === 'both') {
                antiBadMsgAction[from] = option;
            } else {
                antiBadMsgAction[from] = 'delete';
            }
            
            return reply(
                `✅ *Anti-Bad Message Protection Enabled!*\n\n` +
                `• Action: ${antiBadMsgAction[from].toUpperCase()}\n` +
                `• Bad words will be ${antiBadMsgAction[from] === 'delete' ? 'deleted' : antiBadMsgAction[from] === 'warn' ? 'warned' : antiBadMsgAction[from] === 'kick' ? 'kicked' : 'warned & kicked'}`
            );
        } else if (action === 'off') {
            antiBadMsgEnabled[from] = false;
            delete antiBadMsgAction[from];
            delete msgWarnings[from];
            return reply("❌ *Anti-Bad Message Protection Disabled!*");
        }

    } catch (error) {
        console.error("AntiBadMsg error:", error);
        reply("❌ Failed to update anti-bad settings.");
    }
});

// ─── DETECT BAD WORDS IN MESSAGES ───
cmd({
    on: "body"
}, async (conn, mek, m, { from, isGroup, sender, body, reply }) => {
    try {
        if (!isGroup) return;
        if (!antiBadMsgEnabled[from]) return;

        const messageText = body?.toLowerCase() || '';
        
        // Check if message contains any bad word
        let foundBadWord = false;
        let badWordFound = '';

        // Check each bad word
        for (const word of BAD_WORDS) {
            // Use regex to match whole words or partial matches
            const regex = new RegExp('\\b' + word.toLowerCase() + '\\b', 'i');
            if (regex.test(messageText) || messageText.includes(word.toLowerCase())) {
                foundBadWord = true;
                badWordFound = word;
                break;
            }
        }

        if (!foundBadWord) return;

        const action = antiBadMsgAction[from] || 'delete';
        const user = sender.split('@')[0];

        // Initialize warnings for user
        if (!msgWarnings[from]) msgWarnings[from] = {};
        if (!msgWarnings[from][sender]) msgWarnings[from][sender] = 0;

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
                console.log(`🚫 Deleted bad word: "${badWordFound}" from ${user}`);
            } catch (deleteError) {
                console.error("Failed to delete message:", deleteError);
            }
        }

        // WARN
        if (action === 'warn' || action === 'both') {
            msgWarnings[from][sender] += 1;
            const warnCount = msgWarnings[from][sender];

            await conn.sendMessage(from, {
                text: `⚠️ *WARNING!*\n\n` +
                      `• User: @${user}\n` +
                      `• Bad Word: "${badWordFound}"\n` +
                      `• Warning: ${warnCount}/3\n` +
                      `• Action: ${warnCount >= 3 ? '⚠️ You will be kicked!' : 'Please avoid using bad words.'}\n\n` +
                      `_Anti-Bad Message Protection is active._`,
                mentions: [sender]
            });

            // Kick if 3 warnings
            if (warnCount >= 3) {
                try {
                    await conn.groupParticipantsUpdate(from, [sender], "remove");
                    await conn.sendMessage(from, {
                        text: `👢 *User Kicked!*\n\n` +
                              `• User: @${user}\n` +
                              `• Reason: Repeated bad words (3 warnings)\n` +
                              `• Action: User has been removed from the group.`,
                        mentions: [sender]
                    });
                    delete msgWarnings[from][sender];
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
                          `• Bad Word: "${badWordFound}"\n` +
                          `• Reason: Using bad words is not allowed in this group.`,
                    mentions: [sender]
                });
            } catch (kickError) {
                console.error("Failed to kick user:", kickError);
            }
        }

    } catch (error) {
        console.error("AntiBadMsg detection error:", error);
    }
});

// ─── ADD BAD WORD ───
cmd({
    pattern: "addbadmsg",
    alias: ["abmadd", "addbadword"],
    desc: "Add a new bad word to the filter list",
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

        const word = args.join(' ');
        if (!word) {
            return reply("❌ Please provide a word to add.\n\nExample: .addbadmsg idiot");
        }

        // Check if word already exists
        if (BAD_WORDS.includes(word.toLowerCase())) {
            return reply(`⚠️ Word "${word}" already exists in filter list.`);
        }

        BAD_WORDS.push(word.toLowerCase());
        
        reply(`✅ *Bad Word Added!*\n\n• Word: "${word}"\n• Now ${BAD_WORDS.length} words in filter list.`);

    } catch (error) {
        console.error("Add bad word error:", error);
        reply("❌ Failed to add bad word.");
    }
});

// ─── REMOVE BAD WORD ───
cmd({
    pattern: "removebadmsg",
    alias: ["rbm", "delbadword"],
    desc: "Remove a bad word from the filter list",
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

        const word = args.join(' ');
        if (!word) {
            return reply("❌ Please provide a word to remove.\n\nExample: .removebadmsg idiot");
        }

        const index = BAD_WORDS.indexOf(word.toLowerCase());
        if (index === -1) {
            return reply(`❌ Word "${word}" not found in filter list.`);
        }

        BAD_WORDS.splice(index, 1);
        reply(`✅ *Bad Word Removed!*\n\n• Word: "${word}"\n• Now ${BAD_WORDS.length} words in filter list.`);

    } catch (error) {
        console.error("Remove bad word error:", error);
        reply("❌ Failed to remove bad word.");
    }
});

// ─── LIST BAD WORDS ───
cmd({
    pattern: "badmsglist",
    alias: ["bmlist", "wordlist"],
    desc: "List all bad words in the filter",
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

        if (BAD_WORDS.length === 0) {
            return reply("📋 No bad words in filter list.");
        }

        let msg = `╭━━❰ 📋 BAD WORDS LIST ❱━━⬣\n`;
        BAD_WORDS.forEach((word, i) => {
            msg += `┃❖ ${i+1}. ${word}\n`;
        });
        msg += `╰━━━━━━━━━━━━━━⬣\n\n`;
        msg += `Total: ${BAD_WORDS.length} words`;

        await reply(msg);

    } catch (error) {
        console.error("Bad words list error:", error);
        reply("❌ Failed to fetch bad words list.");
    }
});

// ─── CLEAR ALL BAD WORDS ───
cmd({
    pattern: "clearbadmsg",
    alias: ["cbm", "clearwords"],
    desc: "Clear all bad words from the filter list",
    category: "group",
    react: "🗑️",
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

        if (BAD_WORDS.length === 0) {
            return reply("📋 No bad words to clear.");
        }

        const count = BAD_WORDS.length;
        BAD_WORDS.length = 0;
        
        reply(`🗑️ *All Bad Words Cleared!*\n\n• Removed: ${count} words\n• Filter list is now empty.`);

    } catch (error) {
        console.error("Clear bad words error:", error);
        reply("❌ Failed to clear bad words.");
    }
});

// ─── ANTI-BAD MSG HELP ───
cmd({
    pattern: "antibadmsghelp",
    alias: ["abmhelp", "badhelp"],
    desc: "Show anti-bad message help guide",
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
╭━━❰ 🚫 ANTI-BAD MSG GUIDE ❱━━⬣
┃❖ *Commands:*
┃❖ 
┃❖ .antibadmsg on          - Enable
┃❖ .antibadmsg off         - Disable
┃❖ .antibadmsg status      - Check status
┃❖ 
┃❖ *Options:*
┃❖ .antibadmsg on delete   - Delete only
┃❖ .antibadmsg on warn     - Warn users
┃❖ .antibadmsg on kick     - Kick users
┃❖ .antibadmsg on both     - Warn + Kick
┃❖ 
┃❖ .addbadmsg [word]       - Add word
┃❖ .removebadmsg [word]    - Remove word
┃❖ .badmsglist             - List words
┃❖ .clearbadmsg            - Clear all words
┃❖ .antibadmsghelp         - This guide
┃❖ 
┃❖ *Note:* 3 warnings = auto kick
╰━━━━━━━━━━━━━━⬣
        `;
        reply(help);

    } catch (error) {
        console.error("AntiBadMsg help error:", error);
        reply("❌ Failed to load help.");
    }
});

console.log("✅ Anti-Bad Message System Loaded!");
