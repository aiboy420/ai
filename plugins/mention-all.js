// plugins/everyone.js - ESM Version
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "everyone",
    react: "🔊",
    alias: ["all"],
    desc: "To mention all group members with new @all format",
    category: "group",
    use: '.everyone [message]',
    filename: __filename
}, async (conn, mek, m, { from, reply, isGroup, isAdmins, isCreator, command, body }) => {
    try {
        // ✅ Show typing presence
        await conn.sendPresenceUpdate('composing', from);
        
        // ✅ Group check
        if (!isGroup) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ This command can only be used in groups.");
        }

        // ✅ Permission check (Admin OR Bot Owner)
        if (!isAdmins && !isCreator) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ Only group admins or the bot owner can use this command.");
        }

        // ✅ Extract message
        let message = body.slice(body.indexOf(command) + command.length).trim();
        if (!message) message = "Attention Everyone";

        // Create message with @all mention
        let teks = `@all ${message}`;

        // Send using new @all format
        await conn.sendMessage(from, { 
            text: teks,
            contextInfo: {
                nonJidMentions: 1,
                mentionedJid: [],
                groupMentions: []
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Everyone Command Error:", e);
        reply(`❌ *Error Occurred !!*\n\n${e.message || e}`);
    }
});
