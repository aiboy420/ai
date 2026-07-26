// plugins/getpp.js - ESM Version
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import { lidToPhone, cleanPN } from '../lib/functions.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "getpp",
    alias: ["profile", "getdp"],
    react: "🚀",
    desc: "Sends the profile picture of a user by phone number, mention, or reply (now available to everyone)",
    category: "other",
    use: ".getpp <phone number> OR reply to a message OR mention someone",
    filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        let targetJid = null;

        // If no arguments, no mention, and no quoted message → show usage
        if ((!args || args.length === 0 || !args.join(" ").trim()) &&
            (!m.mentionedJid || m.mentionedJid.length === 0) &&
            !m.quoted) {
            return reply(`ℹ️ *Usage:*\n• .getpp <phone number> (e.g., .getpp 923427582273)\n• Reply to someone's message\n• Mention someone (@user) in a group`);
        }

        // 1. Phone number argument (any text that contains digits)
        const argText = args.join(" ").trim();
        if (argText && argText.match(/[0-9]/)) {
            let phone = argText.replace(/[^0-9]/g, "");
            if (phone.length >= 8 && phone.length <= 15) {
                targetJid = phone + "@s.whatsapp.net";
            } else {
                return reply("❌ Invalid phone number format. Please provide a valid number (8-15 digits).");
            }
        }
        // 2. Mentioned user (works in groups)
        else if (m.mentionedJid && m.mentionedJid.length > 0) {
            targetJid = m.mentionedJid[0];
        }
        // 3. Quoted/replied message sender (works in both groups and private chats)
        else if (m.quoted) {
            targetJid = m.quoted.sender;
        }

        // If still no target (e.g., invalid input), show usage again
        if (!targetJid) {
            return reply(`ℹ️ *Usage:*\n• .getpp <phone number> (e.g., .getpp 923427582273)\n• Reply to someone's message\n• Mention someone (@user) in a group`);
        }

        // Handle LID conversion if needed
        if (targetJid.includes('@lid')) {
            try {
                let phoneNumber = await lidToPhone(conn, targetJid);
                if (phoneNumber && phoneNumber !== targetJid.split("@")[0]) {
                    targetJid = phoneNumber + "@s.whatsapp.net";
                }
            } catch (lidError) {
                console.log("LID conversion error:", lidError);
                // Continue with original LID
            }
        }

        // Ensure proper JID format
        if (!targetJid.includes('@')) {
            targetJid = targetJid + "@s.whatsapp.net";
        }

        // Fetch profile picture
        let ppUrl;
        let userName = "User";
        
        try {
            ppUrl = await conn.profilePictureUrl(targetJid, "image");
            
            // Try to get contact name
            try {
                const contact = await conn.getContact?.(targetJid) || 
                               { notify: targetJid.split("@")[0], name: targetJid.split("@")[0] };
                userName = contact.notify || contact.vname || contact.name || targetJid.split("@")[0];
            } catch (contactError) {
                userName = targetJid.split("@")[0];
            }

            // Send the profile picture with caption
            await conn.sendMessage(from, { 
                image: { url: ppUrl }, 
                caption: `> *Profile Pic Downloaded Successfully* ✅\n*User:* ${userName}`
            });

            // Success reaction
            await conn.sendMessage(from, { 
                react: { text: "✅", key: mek.key } 
            });

        } catch (fetchError) {
            // Handle errors
            if (fetchError.message?.includes("404") || fetchError.message?.includes("not found")) {
                return reply(`❌ Profile picture not found for ${targetJid.split("@")[0]}\n\nPossible reasons:\n• No profile picture set\n• Privacy settings hide it from you\n• Number not on WhatsApp`);
            } else if (fetchError.message?.includes("401") || fetchError.message?.includes("unauthorized")) {
                return reply(`🔒 Profile picture is private for ${targetJid.split("@")[0]}\n(Their privacy settings don't allow you to see it)`);
            } else {
                console.error("getpp fetch error:", fetchError);
                return reply(`❌ Error fetching profile picture:\n${fetchError.message || "Unknown error"}`);
            }
        }

    } catch (e) {
        console.error("getpp command error:", e);
        reply("❌ An error occurred while processing the command. Please try again later.");
    }
});
