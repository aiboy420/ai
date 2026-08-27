import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import { lidToPhone, cleanPN } from '../lib/functions.js';

const __filename = fileURLToPath(import.meta.url);

// EXISTING ID COMMAND
cmd({
    pattern: "id",
    alias: ["chatid", "jid", "gjid", "channelid", "newsletter", "cid"],  
    desc: "Get various IDs (chat, user, group, or channel)",
    react: "⚡",
    category: "utility",
    filename: __filename,
}, async (conn, mek, m, { 
    from, isGroup, reply, sender, fromMe, botNumber2, text
}) => {
    try {
        // Check if user is asking for channel ID
        if (text && text.includes('whatsapp.com/channel/')) {
            const match = text.match(/whatsapp\.com\/channel\/([\w-]+)/);
            if (!match) return reply("⚠️ *Invalid channel link format.*\n\nMake sure it looks like:\nhttps://whatsapp.com/channel/xxxxxxxxx");

            const inviteId = match[1];
            let metadata;
            
            try {
                metadata = await conn.newsletterMetadata("invite", inviteId);
            } catch (e) {
                return reply("❌ Failed to fetch channel metadata. Make sure the link is correct.");
            }

            if (!metadata || !metadata.id) return reply("❌ Channel not found or inaccessible.");

            return reply(`${metadata.id}`);
        }

        if (isGroup) {
            // Get group JID only (no LID)
            const groupJID = from.includes('@g.us') ? from : `${from}@g.us`;
            return reply(`${groupJID}`);
            
        } else {
            // Private chat (Inbox) - show s.whatsapp.net format
            if (fromMe) {
                // Owner in inbox - show bot's s.whatsapp.net
                const botPN = botNumber2.split('@')[0];
                return reply(`${botPN}@s.whatsapp.net`);
            } else {
                // Others in inbox - convert LID to s.whatsapp.net
                let senderPN = sender.split('@')[0];
                
                if (sender.includes('@lid')) {
                    senderPN = await lidToPhone(conn, sender);
                }
                
                // Format as s.whatsapp.net only
                return reply(`${senderPN}@s.whatsapp.net`);
            }
        }

    } catch (e) {
        console.error("ID Command Error:", e);
        return reply(`⚠️ Error: ${e.message}`);
    }
});

// NEW COMMAND: Get @lid directly without converting to phone number
cmd({
    pattern: "getlid",
    alias: ["lidonly", "rawlid", "mylid"],  
    desc: "Get your LID (@lid) directly without conversion",
    react: "🆔",
    category: "utility",
    filename: __filename,
}, async (conn, mek, m, { 
    from, isGroup, reply, sender, fromMe, botNumber2, mentionUser
}) => {
    try {
        // Check if mentioning someone to get their LID
        const mentionedUser = mentionUser ? mentionUser[0] : null;
        
        if (mentionedUser) {
            // Get mentioned user's LID
            if (mentionedUser.includes('@lid')) {
                return reply(`${mentionedUser}`);
            } else {
                return reply(`⚠️ Mentioned user is not in LID format.`);
            }
        }
        
        if (isGroup) {
            // In group - show sender's LID
            if (sender.includes('@lid')) {
                return reply(`${sender}`);
            } else {
                return reply(`⚠️ You don't have a LID format in this chat.`);
            }
        } else {
            // Private chat
            if (fromMe) {
                // Bot owner in private chat
                if (botNumber2.includes('@lid')) {
                    return reply(`${botNumber2}`);
                } else {
                    return reply(`${botNumber2}`);
                }
            } else {
                // Other user in private chat
                if (sender.includes('@lid')) {
                    return reply(`${sender}`);
                } else {
                    return reply(`${sender}`);
                }
            }
        }

    } catch (e) {
        console.error("GetLID Command Error:", e);
        return reply(`⚠️ Error: ${e.message}`);
    }
});
