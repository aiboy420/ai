
// plugins/group.js - ESM Version
import { fileURLToPath } from 'url';
import config from '../config.js';
import { cmd } from '../command.js';
import converter from '../lib/converter.js';
import crypto from 'crypto';
import { generateWAMessageContent, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const __filename = fileURLToPath(import.meta.url);

// ==================== V2 RELAY FUNCTION (PURE STATUS - NO CHAT MESSAGE FOR TEXT) ====================
async function relayGroupStatusV2(conn, jid, text) {
    const messageSecret = crypto.randomBytes(32);
    
    const mediaObject = { text: text };
    
    const inside = await generateWAMessageContent(mediaObject, { 
        upload: conn.waUploadToServer 
    });
    
    const messageStructure = {
        groupStatusMessageV2: {
            message: {
                ...inside,
                messageContextInfo: { messageSecret }
            }
        }
    };
    
    const msg = generateWAMessageFromContent(jid, messageStructure, { 
        userJid: conn.user.id 
    });
    
    await conn.relayMessage(jid, msg.message, { 
        messageId: msg.key.id 
    });
    
    return msg;
}

// ==================== MEDIA STATUS FUNCTION (SENDS TO ALL GROUPS WITH isGroupStatus) ====================
async function sendMediaStatusToAllGroups(conn, mediaBuffer, mimeType, caption, onProgress) {
    const groups = await conn.groupFetchAllParticipating();
    const groupIds = Object.keys(groups);
    const total = groupIds.length;
    
    if (!total) throw new Error("No groups found");
    
    let success = 0;
    let failed = 0;
    
    for (let i = 0; i < groupIds.length; i++) {
        try {
            const groupMetadata = await conn.groupMetadata(groupIds[i]);
            const participants = groupMetadata.participants;
            const mentionedJid = participants.map(p => p.id);
            const contextInfo = { isGroupStatus: true, mentionedJid: mentionedJid };
            
            let messageContent = {};
            
            if (mimeType.startsWith('image/')) {
                messageContent = { 
                    image: mediaBuffer, 
                    caption: caption || "", 
                    mimetype: mimeType, 
                    contextInfo: contextInfo 
                };
            } 
            else if (mimeType.startsWith('video/')) {
                messageContent = { 
                    video: mediaBuffer, 
                    caption: caption || "", 
                    mimetype: mimeType, 
                    contextInfo: contextInfo 
                };
            } 
            else if (mimeType.startsWith('audio/')) {
                const isPTT = true;
                messageContent = { 
                    audio: mediaBuffer, 
                    mimetype: 'audio/ogg; codecs=opus', 
                    ptt: isPTT, 
                    contextInfo: contextInfo 
                };
            }
            
            await conn.sendMessage(groupIds[i], messageContent);
            success++;
            
            if (onProgress && (i + 1) % 10 === 0) {
                onProgress(i + 1, total, success, failed);
            }
            
            // Anti-ban delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
        } catch (err) {
            failed++;
            console.error(`Failed to send to ${groupIds[i]}:`, err.message);
        }
    }
    
    return { total, success, failed };
}

// ==================== MAIN .gcstatus COMMAND ====================

// ==================== GROUPSTATUS COMMAND ====================
cmd({
    pattern: "gcstatus",
    desc: "Post group status with media or text (mentions all members)",
    category: "group",
    react: "📢",
    filename: __filename
}, async (conn, mek, m, { from, text, reply, isCreator, isGroup }) => {
    if (!isCreator) return reply("❌ This command is only for owners!");
    if (!isGroup) return reply("❌ This command can only be used in groups!");
    
    try {
        const quotedMsg = m.quoted;
        const mimeType = quotedMsg ? (quotedMsg.msg || quotedMsg).mimetype || '' : '';
        const caption = text?.trim() || "";
        
        if (!quotedMsg && !caption) {
            return reply(`⚠️ Reply to media or provide text!\n\nExamples:\n• .gcstatus Hello everyone\n• Reply to an image with: .gcstatus`);
        }
        
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        
        const groupMetadata = await conn.groupMetadata(from);
        const participants = groupMetadata.participants;
        const mentionedJid = participants.map(p => p.id);
        
        let messageContent = {};
        
        if (quotedMsg) {
            const mediaBuffer = await quotedMsg.download();
            if (!mediaBuffer) throw new Error("Failed to download media");
            
            const contextInfo = { isGroupStatus: true, mentionedJid: mentionedJid };
            
            if (mimeType.startsWith('image/')) {
                messageContent = { image: mediaBuffer, caption: caption || "", mimetype: mimeType, contextInfo: contextInfo };
            } else if (mimeType.startsWith('video/')) {
                messageContent = { video: mediaBuffer, caption: caption || "", mimetype: mimeType, contextInfo: contextInfo };
            } else if (mimeType.startsWith('audio/')) {
                const isPTT = quotedMsg.message?.audioMessage?.ptt || false;
                messageContent = { audio: mediaBuffer, mimetype: isPTT ? 'audio/ogg; codecs=opus' : 'audio/mp4', ptt: isPTT, contextInfo: contextInfo };
            } else {
                return reply("❌ Unsupported media type! Please reply to an image, video, or audio file.");
            }
        } else if (caption) {
            messageContent = { text: caption, contextInfo: { isGroupStatus: true, mentionedJid: mentionedJid } };
        }
        
        await conn.sendMessage(from, messageContent, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (error) {
        console.error("Group Status Error:", error);
        reply(`❌ Error: ${error.message}`);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});



cmd({
    pattern: "groupstatus",
    alias: ["statusgc", "swgc"],
    desc: "Text or Media → ALL groups (Text: pure status | Media: chat + status)",
    category: "group",
    react: "📢",
    filename: __filename
}, async (conn, mek, m, { from, text, reply, isCreator }) => {
    if (!isCreator) return reply("❌ Only for owners!");
    
    try {
        const quotedMsg = m.quoted;
        const mimeType = quotedMsg ? (quotedMsg.msg || quotedMsg).mimetype || '' : '';
        const caption = text?.trim() || "";
        
        // ==================== CASE 1: MEDIA (IMAGE/VIDEO/AUDIO) ====================
        // Send to ALL GROUPS using isGroupStatus: true (appears in chat + status)
        if (quotedMsg && mimeType) {
            if (!mimeType.startsWith('image/') && !mimeType.startsWith('video/') && !mimeType.startsWith('audio/')) {
                return reply("❌ Unsupported! Reply to image, video, or audio.");
            }
            
            await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
            
            const mediaBuffer = await quotedMsg.download();
            if (!mediaBuffer) throw new Error("Failed to download media");
            
            // Get all groups first to show count
            const groups = await conn.groupFetchAllParticipating();
            const totalGroups = Object.keys(groups).length;
            
            if (!totalGroups) return reply("❌ You are not in any groups!");
            
            await reply(`🚀 Sending ${mimeType.split('/')[0].toUpperCase()} to ${totalGroups} groups...`);
            
            let lastProgress = "";
            
            const result = await sendMediaStatusToAllGroups(conn, mediaBuffer, mimeType, caption, (current, total, success, failed) => {
                const progressMsg = `📊 ${current}/${total} | ✅ ${success} | ❌ ${failed}`;
                if (progressMsg !== lastProgress) {
                    reply(progressMsg).catch(() => {});
                    lastProgress = progressMsg;
                }
            });
            
            await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
            await reply(`🎉 Media Broadcast Complete!\n📊 Total: ${result.total}\n✅ Success: ${result.success}\n❌ Failed: ${result.failed}`);
            return;
        }
        
        // ==================== CASE 2: TEXT ONLY ====================
        // Send to ALL GROUPS using V2 (pure status, no chat message)
        const statusText = caption;
        
        if (!statusText) {
            return reply(`⚠️ Provide text or reply to media!\n\nExamples:\n• .gcstatus Hello everyone (text to ALL groups)\n• Reply to image/video with .gcstatus (media to ALL groups)`);
        }
        
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        
        // Get all groups
        const groups = await conn.groupFetchAllParticipating();
        const groupIds = Object.keys(groups);
        const total = groupIds.length;
        
        if (!total) return reply("❌ You are not in any groups!");
        
        await reply(`🚀 Broadcasting "${statusText}" to ${total} groups (pure status)...`);
        
        let success = 0;
        let failed = 0;
        let lastProgress = "";
        
        for (let i = 0; i < groupIds.length; i++) {
            try {
                await relayGroupStatusV2(conn, groupIds[i], statusText);
                success++;
                
                if ((i + 1) % 10 === 0) {
                    const progressMsg = `📊 ${i + 1}/${total} | ✅ ${success} | ❌ ${failed}`;
                    if (progressMsg !== lastProgress) {
                        await reply(progressMsg).catch(() => {});
                        lastProgress = progressMsg;
                    }
                }
                
                await new Promise(resolve => setTimeout(resolve, 800));
                
            } catch (err) {
                failed++;
                console.error(`Failed: ${groupIds[i]}`, err.message);
            }
        }
        
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        await reply(`🎉 Text Broadcast Complete!\n📊 Total: ${total}\n✅ Success: ${success}\n❌ Failed: ${failed}`);
        
    } catch (error) {
        console.error("Error:", error);
        await reply(`❌ Error: ${error.message}`);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } }).catch(() => {});
    }
});
