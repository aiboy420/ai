import { fileURLToPath } from 'url';
import crypto from 'crypto';
import {
    generateWAMessageContent,
    generateWAMessageFromContent,
    areJidsSameUser
} from '@whiskeysockets/baileys';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

// ==================== JID NORMALIZATION ====================
function normalizeJid(jid = '') {
    return String(jid)
        .split(':')[0]
        .trim()
        .toLowerCase();
}

// ==================== SENDER ADMIN CHECK ====================
function isSenderAdmin(participants, senderJid) {
    const sender = normalizeJid(senderJid);

    const participant = participants.find(p => {
        const ids = [
            p.id,
            p.jid,
            p.phoneNumber,
            p.lid
        ].filter(Boolean);

        return ids.some(id => {
            const normalized = normalizeJid(id);

            return (
                normalized === sender ||
                normalizeJid(id).split('@')[0] ===
                    sender.split('@')[0] ||
                areJidsSameUser(id, senderJid)
            );
        });
    });

    return Boolean(
        participant &&
        (
            participant.admin === 'admin' ||
            participant.admin === 'superadmin'
        )
    );
}

// ==================== TEXT STATUS RELAY ====================
async function relayGroupStatusV2(conn, jid, text) {
    const messageSecret = crypto.randomBytes(32);

    const inside = await generateWAMessageContent(
        { text },
        { upload: conn.waUploadToServer }
    );

    const messageStructure = {
        groupStatusMessageV2: {
            message: {
                ...inside,
                messageContextInfo: { messageSecret }
            }
        }
    };

    const msg = generateWAMessageFromContent(
        jid,
        messageStructure,
        { userJid: conn.user.id }
    );

    await conn.relayMessage(jid, msg.message, {
        messageId: msg.key.id
    });
}

// ==================== GPSTATUS COMMAND ====================
cmd({
    pattern: 'gpstatus',
    alias: ['gp', 'statusgp'],
    desc: 'Send status to groups where sender is admin',
    category: 'group',
    react: '📢',
    filename: __filename
}, async (conn, mek, m, {
    from,
    text,
    reply,
    isCreator
}) => {

    // Owner-only protection
    if (!isCreator) {
        return reply(
            '❌ This command is only for the bot owner!'
        );
    }

    // Private inbox only
    if (from.endsWith('@g.us')) {
        return reply(
            '❌ Please use this command in your private inbox!'
        );
    }

    try {
        const quotedMsg = m.quoted;

        const mimeType = quotedMsg
            ? (quotedMsg.msg || quotedMsg).mimetype || ''
            : '';

        const caption = text?.trim() || '';

        if (!quotedMsg && !caption) {
            return reply(
                '⚠️ Reply to a text, image, video, or audio post with .gpstatus!'
            );
        }

        if (
            quotedMsg &&
            mimeType &&
            !mimeType.startsWith('image/') &&
            !mimeType.startsWith('video/') &&
            !mimeType.startsWith('audio/')
        ) {
            return reply(
                '❌ Unsupported media! Reply to an image, video, or audio file.'
            );
        }

        // Identify the person who sent the command
        const senderJid =
            mek.key.participant ||
            mek.key.remoteJid;

        if (!senderJid) {
            return reply(
                '❌ Could not identify the command sender!'
            );
        }

        await conn.sendMessage(from, {
            react: {
                text: '⏳',
                key: mek.key
            }
        });

        const groups =
            await conn.groupFetchAllParticipating();

        const groupIds = Object.keys(groups);

        if (!groupIds.length) {
            return reply(
                '❌ The bot is not in any groups!'
            );
        }

        let mediaBuffer = null;

        if (quotedMsg && mimeType) {
            mediaBuffer = await quotedMsg.download();

            if (!mediaBuffer) {
                throw new Error('Media download failed');
            }
        }

        let checked = 0;
        let eligible = 0;
        let success = 0;
        let failed = 0;
        let skipped = 0;

        await reply(
            '🔍 Checking groups where you are an admin...'
        );

        for (const groupId of groupIds) {
            try {
                const metadata =
                    await conn.groupMetadata(groupId);

                const participants =
                    metadata.participants || [];

                checked++;

                // Check the command sender's admin status
                const senderAdmin = isSenderAdmin(
                    participants,
                    senderJid
                );

                if (!senderAdmin) {
                    skipped++;
                    continue;
                }

                eligible++;

                if (quotedMsg && mimeType) {
                    const mentionedJid =
                        participants.map(p => p.id);

                    const contextInfo = {
                        isGroupStatus: true,
                        mentionedJid
                    };

                    let messageContent;

                    if (mimeType.startsWith('image/')) {
                        messageContent = {
                            image: mediaBuffer,
                            caption,
                            mimetype: mimeType,
                            contextInfo
                        };
                    } else if (mimeType.startsWith('video/')) {
                        messageContent = {
                            video: mediaBuffer,
                            caption,
                            mimetype: mimeType,
                            contextInfo
                        };
                    } else {
                        const isPTT =
                            quotedMsg.message
                                ?.audioMessage?.ptt || false;

                        messageContent = {
                            audio: mediaBuffer,
                            mimetype: isPTT
                                ? 'audio/ogg; codecs=opus'
                                : 'audio/mp4',
                            ptt: isPTT,
                            contextInfo
                        };
                    }

                    await conn.sendMessage(
                        groupId,
                        messageContent
                    );

                } else {
                    await relayGroupStatusV2(
                        conn,
                        groupId,
                        caption
                    );
                }

                success++;

            } catch (err) {
                failed++;

                console.error(
                    `GPSTATUS failed for ${groupId}:`,
                    err.message
                );
            }

            await new Promise(resolve =>
                setTimeout(resolve, 800)
            );
        }

        await conn.sendMessage(from, {
            react: {
                text: '✅',
                key: mek.key
            }
        });

        await reply(
            `🎉 *GPSTATUS Completed!*\n\n` +
            `🔎 Groups Checked: ${checked}\n` +
            `👑 Groups Where You Are Admin: ${eligible}\n` +
            `✅ Successful: ${success}\n` +
            `❌ Failed: ${failed}\n` +
            `⏭️ Skipped: ${skipped}`
        );

    } catch (error) {
        console.error(
            'GPSTATUS Error:',
            error
        );

        await reply(
            `❌ Error: ${error.message}`
        );

        await conn.sendMessage(from, {
            react: {
                text: '❌',
                key: mek.key
            }
        }).catch(() => {});
    }
});
