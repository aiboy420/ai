import { fileURLToPath } from 'url';
import crypto from 'crypto';
import {
    generateWAMessageContent,
    generateWAMessageFromContent,
    areJidsSameUser
} from '@whiskeysockets/baileys';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

// ==================== NORMALIZE JID ====================
function normalizeJid(jid = '') {
    return String(jid).split(':')[0].trim().toLowerCase();
}

// ==================== CHECK BOT ADMIN ====================
function isBotAdmin(participants, botJid) {
    const botNumber = normalizeJid(botJid);

    const participant = participants.find(p => {
        const ids = [p.id, p.jid, p.phoneNumber].filter(Boolean);

        return ids.some(id =>
            normalizeJid(id) === botNumber ||
            areJidsSameUser(id, botJid)
        );
    });

    return Boolean(
        participant &&
        (
            participant.admin === 'admin' ||
            participant.admin === 'superadmin'
        )
    );
}

// ==================== GROUP STATUS RELAY ====================
async function relayGroupStatusV2(conn, jid, content) {
    const messageSecret = crypto.randomBytes(32);

    const inside = await generateWAMessageContent(
        content,
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
    desc: 'Send status only to groups where bot is admin',
    category: 'group',
    react: '📢',
    filename: __filename
}, async (conn, mek, m, { from, text, reply, isCreator }) => {

    if (!isCreator) {
        return reply('❌ This command is only for the bot owner!');
    }

    if (from.endsWith('@g.us')) {
        return reply('❌ Please use this command in your private inbox!');
    }

    try {
        const quotedMsg = m.quoted;

        const quotedMessage = quotedMsg?.message || {};
        const quotedContent = quotedMsg?.msg || quotedMsg || {};

        const mimeType = quotedContent.mimetype || '';

        // Use command text first; otherwise use quoted caption/text
        const caption =
            text?.trim() ||
            quotedContent.caption ||
            quotedMessage.imageMessage?.caption ||
            quotedMessage.videoMessage?.caption ||
            quotedMessage.conversation ||
            quotedMessage.extendedTextMessage?.text ||
            '';

        if (!quotedMsg && !caption) {
            return reply(
                '⚠️ Reply to a text, image, video, or audio with .gpstatus!'
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

        const botJid = conn.user.id;

        await conn.sendMessage(from, {
            react: { text: '⏳', key: mek.key }
        });

        const groups = await conn.groupFetchAllParticipating();
        const groupIds = Object.keys(groups);

        if (!groupIds.length) {
            return reply('❌ The bot is not in any groups!');
        }

        let mediaBuffer = null;

        if (quotedMsg && mimeType) {
            mediaBuffer = await quotedMsg.download();

            if (!mediaBuffer) {
                throw new Error('Media download failed');
            }
        }

        let success = 0;

        for (const groupId of groupIds) {
            try {
                const metadata = await conn.groupMetadata(groupId);
                const participants = metadata.participants || [];

                // Check ONLY the bot's own WhatsApp number
                if (!isBotAdmin(participants, botJid)) {
                    continue;
                }

                let messageContent;

                if (quotedMsg && mimeType) {
                    const contextInfo = {
                        isGroupStatus: true,
                        mentionedJid: participants.map(p => p.id)
                    };

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
                            quotedMessage.audioMessage?.ptt || false;

                        messageContent = {
                            audio: mediaBuffer,
                            mimetype: isPTT
                                ? 'audio/ogg; codecs=opus'
                                : 'audio/mp4',
                            ptt: isPTT,
                            contextInfo
                        };
                    }
                } else {
                    messageContent = { text: caption };
                }

                await relayGroupStatusV2(
                    conn,
                    groupId,
                    messageContent
                );

                success++;

            } catch (err) {
                console.error(
                    `GPSTATUS failed for ${groupId}:`,
                    err.message
                );
            }

            await new Promise(resolve => setTimeout(resolve, 800));
        }

        await conn.sendMessage(from, {
            react: { text: '✅', key: mek.key }
        });

        await reply(
            `✅ *GP STATUS SUCCESSFUL*\n` +
            `📊 Groups Status Posted: ${success}`
        );

    } catch (error) {
        console.error('GPSTATUS Error:', error);

        await reply(`❌ Error: ${error.message}`);

        await conn.sendMessage(from, {
            react: { text: '❌', key: mek.key }
        }).catch(() => {});
    }
});
