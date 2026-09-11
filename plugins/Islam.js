import { cmd } from '../command.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==================== ISLAMIC COMMANDS ====================

// ==================== AYAT ====================
cmd({
    pattern: "ayat",
    react: "🕌",
    desc: "Send an Islamic reminder",
    category: "islamic",
    use: ".ayat",
    filename: __filename
}, async (conn, mek, m, {
    args,
    q,
    reply,
    from,
    isCreator
}) => {
    try {
        if (!isCreator) {
            return reply("*📛 This is an owner command.*");
        }

        const message = `🤲 *Islamic Reminder* 🕌\n\n> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳*`;

        await conn.sendMessage(
            mek.chat,
            {
                video: { url: 'https://files.catbox.moe/fhs7cc.mp4' },
                caption: message,
                gifPlayback: true
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error("❌ Error in .ayat command:", error);
        reply(`❌ *Error in .ayat command:*\n\`\`\`${error.message}\`\`\``);
    }
});


// ==================== SUNNAH ====================
cmd({
    pattern: "sunnah",
    react: "🕌",
    desc: "Send an Islamic reminder",
    category: "islamic",
    use: ".sunnah",
    filename: __filename
}, async (conn, mek, m, {
    args,
    q,
    reply,
    from,
    isCreator
}) => {
    try {
        if (!isCreator) {
            return reply("*📛 This is an owner command.*");
        }

        const message = `🌙 *Sunnah Reminder* 🤍\n\n> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳*`;

        await conn.sendMessage(
            mek.chat,
            {
                video: { url: 'https://files.catbox.moe/cd83i2.mp4' },
                caption: message,
                gifPlayback: true
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error("❌ Error in .sunnah command:", error);
        reply(`❌ *Error in .sunnah command:*\n\`\`\`${error.message}\`\`\``);
    }
});


// ==================== ZIKRVIDEO ====================
cmd({
    pattern: "zikrvideo",
    react: "📿",
    desc: "Send an Islamic reminder",
    category: "islamic",
    use: ".zikrvideo",
    filename: __filename
}, async (conn, mek, m, {
    args,
    q,
    reply,
    from,
    isCreator
}) => {
    try {
        if (!isCreator) {
            return reply("*📛 This is an owner command.*");
        }

        const message = `📿 *Remember Allah* 🤲\n\n> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳*`;

        await conn.sendMessage(
            mek.chat,
            {
                video: { url: 'https://files.catbox.moe/lltyfw.mp4' },
                caption: message,
                gifPlayback: true
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error("❌ Error in .zikrvideo command:", error);
        reply(`❌ *Error in .zikrvideo command:*\n\`\`\`${error.message}\`\`\``);
    }
});


// ==================== ISLAMICPIC ====================
cmd({
    pattern: "islamicpic",
    react: "🕋",
    desc: "Send an Islamic picture",
    category: "islamic",
    use: ".islamicpic",
    filename: __filename
}, async (conn, mek, m, {
    args,
    q,
    reply,
    from,
    isCreator
}) => {
    try {
        if (!isCreator) {
            return reply("*📛 This is an owner command.*");
        }

        const message = `🕋 *Islamic Reminder* 🤍\n\n> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳*`;

        await conn.sendMessage(
            mek.chat,
            {
                image: { url: 'https://files.catbox.moe/pyp7ip.png' },
                caption: message
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error("❌ Error in .islamicpic command:", error);
        reply(`❌ *Error in .islamicpic command:*\n\`\`\`${error.message}\`\`\``);
    }
});


// ==================== DEENVIDEO ====================
cmd({
    pattern: "deenvideo",
    react: "🌙",
    desc: "Send an Islamic reminder",
    category: "islamic",
    use: ".deenvideo",
    filename: __filename
}, async (conn, mek, m, {
    args,
    q,
    reply,
    from,
    isCreator
}) => {
    try {
        if (!isCreator) {
            return reply("*📛 This is an owner command.*");
        }

        const message = `🌙 *Beautiful Deen Reminder* 🤍\n\n> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳*`;

        await conn.sendMessage(
            mek.chat,
            {
                video: { url: 'https://files.catbox.moe/rz9caz.mp4' },
                caption: message,
                gifPlayback: true
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error("❌ Error in .deenvideo command:", error);
        reply(`❌ *Error in .deenvideo command:*\n\`\`\`${error.message}\`\`\``);
    }
});
