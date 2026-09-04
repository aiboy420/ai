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
