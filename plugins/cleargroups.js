// cleargroups.js - ESM Version
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ==================== CLEAR ALL GROUP CHATS ====================

cmd({
    pattern: "cleargroups",
    alias: ["cg", "deletegroups", "cleargc"],
    desc: "Delete all group chats (Owner Only)",
    category: "owner",
    react: "🗑️",
    filename: __filename
}, async (conn, mek, m, {
    from,
    isCreator,
    reply
}) => {
    try {
        if (!isCreator) return reply("📛 This is an owner command.");

        await reply("🔄 *Fetching group chats...*");

        // Get all chats
        const chats = await conn.chatRead();
        const chatKeys = Object.keys(chats);
        
        // Filter group chats only
        const groupChats = chatKeys.filter(jid => jid.endsWith('@g.us'));
        const totalGroups = groupChats.length;

        if (totalGroups === 0) {
            return reply("📭 No group chats found to delete.");
        }

        // Send confirmation
        await reply(
            `⚠️ *Are you sure you want to delete ALL ${totalGroups} group chats?*\n\n` +
            `Reply with *YES* to confirm or *NO* to cancel.`
        );

        // Wait for user response
        const response = await new Promise((resolve) => {
            const listener = async (msg) => {
                const text = msg.body?.toUpperCase() || '';
                if (text === 'YES' || text === 'NO') {
                    conn.ev.off('messages.upsert', listener);
                    resolve(text);
                }
            };
            conn.ev.on('messages.upsert', listener);
            setTimeout(() => {
                conn.ev.off('messages.upsert', listener);
                resolve('TIMEOUT');
            }, 30000);
        });

        if (response === 'TIMEOUT') {
            return reply("⏰ *Operation cancelled!* (No response received)");
        }

        if (response === 'NO') {
            return reply("❌ *Operation cancelled!*");
        }

        if (response === 'YES') {
            await reply(`🔄 *Deleting ${totalGroups} group chats...* Please wait.`);

            let deletedCount = 0;
            let failedCount = 0;

            for (const groupId of groupChats) {
                try {
                    await conn.modifyChat(groupId, 'delete');
                    deletedCount++;
                    console.log(`🗑️ Deleted group: ${groupId}`);
                } catch (error) {
                    failedCount++;
                    console.error(`Failed to delete group: ${groupId}`, error);
                }
            }

            return reply(
                `✅ *Group Chats Deleted!*\n\n` +
                `• Total Groups: ${totalGroups}\n` +
                `• Deleted: ${deletedCount}\n` +
                `• Failed: ${failedCount}\n` +
                `• Status: ${failedCount > 0 ? '⚠️ Some groups could not be deleted' : '✅ All groups deleted successfully'}`
            );
        }

    } catch (error) {
        console.error("Clear groups error:", error);
        reply(`❌ Failed to clear groups: ${error.message}`);
    }
});

console.log("✅ Clear Groups Chat System Loaded!");
