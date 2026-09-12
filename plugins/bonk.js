// fun-gifs.js - NAWAZ MD Fun GIF Commands
// Powered By NAWAZ MD
//
// Required:
// npm i axios ffmpeg-static
//
// Commands:
// .cuddle
// .smooch
// .bonk
// .groove
// .cheer
// .tear

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';
import { promisify } from 'util';
import { execFile } from 'child_process';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';
import { mkdir, writeFile, readFile, rm } from 'fs/promises';

import axios from 'axios';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const require = createRequire(import.meta.url);
const execFileAsync = promisify(execFile);

// =====================================================
// CONFIG
// =====================================================

const PRIMARY_API = 'https://nekos.best/api/v2';
const FALLBACK_API = 'https://api.waifu.pics/sfw';

const POWERED_BY = '⚡ 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝙱𝚢 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳';

// =====================================================
// FFMPEG
// =====================================================

let FFMPEG_PATH = null;

try {
    FFMPEG_PATH = require('ffmpeg-static');

    if (FFMPEG_PATH) {
        console.log('[NAWAZ GIF] ffmpeg-static loaded');
    }
} catch (e) {
    console.log('[NAWAZ GIF] ffmpeg-static not installed, trying system ffmpeg');
}

if (!FFMPEG_PATH) {
    FFMPEG_PATH = 'ffmpeg';
}

// =====================================================
// CATEGORY MAP
// =====================================================

const CATEGORY_MAP = {
    cuddle: {
        primary: 'cuddle',
        fallback: 'cuddle'
    },

    smooch: {
        primary: 'kiss',
        fallback: 'kiss'
    },

    bonk: {
        primary: 'bonk',
        fallback: 'slap'
    },

    groove: {
        primary: 'dance',
        fallback: 'dance'
    },

    cheer: {
        primary: 'happy',
        fallback: 'happy'
    },

    tear: {
        primary: 'cry',
        fallback: 'cry'
    }
};

// =====================================================
// CAPTIONS
// =====================================================

const CAPTIONS = {

    cuddle: (sender, target) =>
        `🤗 *${sender}* cuddled *${target}*!\n\n${POWERED_BY}`,

    smooch: (sender, target) =>
        `💋 *${sender}* kissed *${target}*!\n\n${POWERED_BY}`,

    bonk: (sender, target) =>
        `👋 *${sender}* bonked *${target}*!\n\n${POWERED_BY}`,

    groove: (sender, target) =>
        `💃 *${sender}* danced with *${target}*!\n\n${POWERED_BY}`,

    cheer: (sender, target) =>
        `🎉 *${sender}* cheered for *${target}*!\n\n${POWERED_BY}`,

    tear: (sender, target) =>
        `😢 *${sender}* is sad because of *${target}*...\n\n${POWERED_BY}`
};

// =====================================================
// UTILS
// =====================================================

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function cleanJid(jid) {
    if (!jid) return null;

    return jid
        .replace(/:[0-9]+(?=@)/, '')
        .trim();
}

function getNumber(jid) {
    if (!jid) return 'User';

    return jid
        .split('@')[0]
        .split(':')[0];
}

// =====================================================
// GET SENDER
// =====================================================

function getSender(mek, m, from) {

    const sender =
        m?.sender ||
        m?.participant ||
        mek?.key?.participant ||
        mek?.participant ||
        from;

    return cleanJid(sender);
}

// =====================================================
// GET MENTIONED USER
// =====================================================

function getMentionedUser(mek, m) {

    const possibleLists = [

        // Common wrapper
        m?.mentionedJid,

        // extendedTextMessage
        mek?.message?.extendedTextMessage?.contextInfo?.mentionedJid,

        // image message
        mek?.message?.imageMessage?.contextInfo?.mentionedJid,

        // video message
        mek?.message?.videoMessage?.contextInfo?.mentionedJid,

        // quoted message
        mek?.message?.extendedTextMessage?.contextInfo
            ?.quotedMessage?.extendedTextMessage?.contextInfo
            ?.mentionedJid
    ];

    for (const list of possibleLists) {

        if (Array.isArray(list) && list.length > 0) {

            const jid = cleanJid(list[0]);

            if (jid) {
                return jid;
            }
        }
    }

    return null;
}

// =====================================================
// RANDOM GROUP TARGET
// =====================================================

async function getRandomTarget(conn, from, sender, mek) {

    try {

        if (!from?.endsWith('@g.us')) {
            return null;
        }

        const metadata = await conn.groupMetadata(from);

        const participants = metadata?.participants || [];

        if (!participants.length) {
            return null;
        }

        const botJid = cleanJid(
            conn?.user?.id ||
            conn?.user?.jid
        );

        const possibleUsers = participants
            .map(p => cleanJid(p.id || p.jid))
            .filter(Boolean)
            .filter(jid => jid !== sender)
            .filter(jid => jid !== botJid);

        if (!possibleUsers.length) {
            return null;
        }

        return possibleUsers[
            Math.floor(Math.random() * possibleUsers.length)
        ];

    } catch (error) {

        console.log(
            '[NAWAZ GIF] Group metadata error:',
            error.message
        );

        return null;
    }
}

// =====================================================
// GET TARGET
// =====================================================

async function getTargetUser(conn, from, mek, m) {

    const sender = getSender(mek, m, from);

    // First priority = mentioned user
    const mentioned = getMentionedUser(mek, m);

    if (mentioned && mentioned !== sender) {
        return mentioned;
    }

    // Group = random member
    const randomUser = await getRandomTarget(
        conn,
        from,
        sender,
        mek
    );

    return randomUser;
}

// =====================================================
// PRIMARY API
// =====================================================

async function fetchFromPrimary(category) {

    try {

        const url = `${PRIMARY_API}/${category}`;

        const res = await axios.get(url, {
            timeout: 10000,
            validateStatus: () => true
        });

        // Rate limited
        if (res.status === 429) {

            console.log(
                `[NAWAZ GIF] Primary API 429: ${category}`
            );

            return {
                url: null,
                rateLimited: true
            };
        }

        if (res.status < 200 || res.status >= 300) {

            console.log(
                `[NAWAZ GIF] Primary API HTTP ${res.status}`
            );

            return {
                url: null,
                rateLimited: false
            };
        }

        const result =
            res?.data?.results?.[0]?.url;

        if (result) {

            return {
                url: result,
                rateLimited: false
            };
        }

    } catch (error) {

        console.log(
            `[NAWAZ GIF] Primary error: ${error.message}`
        );
    }

    return {
        url: null,
        rateLimited: false
    };
}

// =====================================================
// FALLBACK API
// =====================================================

async function fetchFromFallback(category) {

    try {

        const url = `${FALLBACK_API}/${category}`;

        const res = await axios.get(url, {
            timeout: 10000,
            validateStatus: () => true
        });

        if (res.status === 429) {

            console.log(
                `[NAWAZ GIF] Fallback API 429: ${category}`
            );

            return {
                url: null,
                rateLimited: true
            };
        }

        if (res.status < 200 || res.status >= 300) {

            console.log(
                `[NAWAZ GIF] Fallback HTTP ${res.status}`
            );

            return {
                url: null,
                rateLimited: false
            };
        }

        if (res?.data?.url) {

            return {
                url: res.data.url,
                rateLimited: false
            };
        }

    } catch (error) {

        console.log(
            `[NAWAZ GIF] Fallback error: ${error.message}`
        );
    }

    return {
        url: null,
        rateLimited: false
    };
}

// =====================================================
// GET GIF URL
// =====================================================

async function getGif(categoryKey) {

    const mapping = CATEGORY_MAP[categoryKey];

    if (!mapping) {
        return {
            url: null,
            rateLimited: false
        };
    }

    // Primary
    const primary = await fetchFromPrimary(
        mapping.primary
    );

    if (primary.url) {
        return primary;
    }

    // Small delay before fallback
    await sleep(500);

    // Fallback
    const fallback = await fetchFromFallback(
        mapping.fallback
    );

    return fallback;
}

// =====================================================
// DOWNLOAD MEDIA
// =====================================================

async function downloadMedia(url) {

    try {

        const res = await axios.get(url, {

            responseType: 'arraybuffer',

            timeout: 20000,

            maxContentLength: 25 * 1024 * 1024,

            maxBodyLength: 25 * 1024 * 1024,

            validateStatus: () => true
        });

        if (res.status === 429) {

            return {
                buffer: null,
                contentType: null,
                rateLimited: true
            };
        }

        if (res.status < 200 || res.status >= 300) {

            throw new Error(
                `Media download HTTP ${res.status}`
            );
        }

        const buffer = Buffer.from(res.data);

        const contentType =
            String(
                res.headers['content-type'] || ''
            ).toLowerCase();

        return {
            buffer,
            contentType,
            rateLimited: false
        };

    } catch (error) {

        console.log(
            '[NAWAZ GIF] Media download failed:',
            error.message
        );

        return {
            buffer: null,
            contentType: null,
            rateLimited: false
        };
    }
}

// =====================================================
// CONVERT TO MP4
// =====================================================

async function convertToMp4(buffer, contentType = '') {

    const workDir = `${tmpdir()}/nawaz-gif-${randomUUID()}`;

    const inputFile = `${workDir}/input.gif`;
    const outputFile = `${workDir}/output.mp4`;

    try {

        await mkdir(workDir, {
            recursive: true
        });

        await writeFile(
            inputFile,
            buffer
        );

        await execFileAsync(
            FFMPEG_PATH,
            [
                '-y',

                '-hide_banner',

                '-loglevel',
                'error',

                '-i',
                inputFile,

                '-movflags',
                '+faststart',

                '-pix_fmt',
                'yuv420p',

                '-vf',
                'scale=trunc(iw/2)*2:trunc(ih/2)*2,fps=15',

                '-c:v',
                'libx264',

                '-preset',
                'veryfast',

                '-crf',
                '28',

                '-an',

                outputFile
            ],
            {
                timeout: 45000,
                windowsHide: true
            }
        );

        const mp4Buffer = await readFile(
            outputFile
        );

        return mp4Buffer;

    } catch (error) {

        console.log(
            '[NAWAZ GIF] FFmpeg conversion failed:',
            error.message
        );

        return null;

    } finally {

        try {
            await rm(workDir, {
                recursive: true,
                force: true
            });
        } catch {}
    }
}

// =====================================================
// PREPARE PLAYABLE VIDEO
// =====================================================

async function prepareVideo(url) {

    const media = await downloadMedia(url);

    if (media.rateLimited) {

        return {
            buffer: null,
            rateLimited: true,
            conversionFailed: false
        };
    }

    if (!media.buffer) {

        return {
            buffer: null,
            rateLimited: false,
            conversionFailed: false
        };
    }

    const contentType =
        media.contentType || '';

    // MP4 already
    if (
        contentType.includes('video/mp4') ||
        /\.mp4(\?|$)/i.test(url)
    ) {

        return {
            buffer: media.buffer,
            rateLimited: false,
            conversionFailed: false
        };
    }

    // Convert GIF/WebM/other media to MP4
    const mp4Buffer = await convertToMp4(
        media.buffer,
        contentType
    );

    if (!mp4Buffer) {

        return {
            buffer: null,
            rateLimited: false,
            conversionFailed: true
        };
    }

    return {
        buffer: mp4Buffer,
        rateLimited: false,
        conversionFailed: false
    };
}

// =====================================================
// HANDLE GIF
// =====================================================

async function handleGif(
    conn,
    mek,
    m,
    { from, reply },
    commandName
) {

    let processingReaction = false;

    try {

        // Processing reaction
        try {

            await conn.sendMessage(
                from,
                {
                    react: {
                        text: '⏳',
                        key: mek.key
                    }
                }
            );

            processingReaction = true;

        } catch {}

        // Sender
        const sender = getSender(
            mek,
            m,
            from
        );

        if (!sender) {

            await reply(
                '❌ Could not detect your WhatsApp account.'
            );

            return;
        }

        // Target
        const targetUser =
            await getTargetUser(
                conn,
                from,
                mek,
                m
            );

        if (!targetUser) {

            try {
                await conn.sendMessage(
                    from,
                    {
                        react: {
                            text: '❌',
                            key: mek.key
                        }
                    }
                );
            } catch {}

            return reply(
                '❌ Please mention someone to use this command.\n\n' +
                'Example: `.cuddle @user`'
            );
        }

        const senderName =
            getNumber(sender);

        const targetName =
            getNumber(targetUser);

        // Get GIF
        const gifResult =
            await getGif(commandName);

        if (!gifResult.url) {

            try {
                await conn.sendMessage(
                    from,
                    {
                        react: {
                            text: '❌',
                            key: mek.key
                        }
                    }
                );
            } catch {}

            if (gifResult.rateLimited) {

                return reply(
                    '⚠️ *GIF API is busy right now (429).*\n\n' +
                    'Please try again after a few seconds.'
                );
            }

            return reply(
                '⚠️ GIF service is temporarily unavailable.\n\n' +
                'Please try again later.'
            );
        }

        // Download + convert
        const video =
            await prepareVideo(
                gifResult.url
            );

        if (video.rateLimited) {

            try {
                await conn.sendMessage(
                    from,
                    {
                        react: {
                            text: '❌',
                            key: mek.key
                        }
                    }
                );
            } catch {}

            return reply(
                '⚠️ Media server is busy right now (429).\n\n' +
                'Please try again in a few seconds.'
            );
        }

        if (!video.buffer) {

            try {
                await conn.sendMessage(
                    from,
                    {
                        react: {
                            text: '❌',
                            key: mek.key
                        }
                    }
                );
            } catch {}

            if (video.conversionFailed) {

                return reply(
                    '⚠️ Could not convert the GIF to a playable WhatsApp video.\n\n' +
                    'Install FFmpeg or run:\n' +
                    '`npm i ffmpeg-static`'
                );
            }

            return reply(
                '⚠️ Could not download the GIF media. Please try again.'
            );
        }

        // Caption
        const caption =
            CAPTIONS[commandName](
                senderName,
                targetName
            );

        // Send playable MP4 as GIF
        await conn.sendMessage(
            from,
            {
                video: video.buffer,

                gifPlayback: true,

                mimetype: 'video/mp4',

                caption,

                mentions: [
                    sender,
                    targetUser
                ]
            },
            {
                quoted: mek
            }
        );

        // Success reaction
        try {

            await conn.sendMessage(
                from,
                {
                    react: {
                        text: '✅',
                        key: mek.key
                    }
                }
            );

        } catch {}

    } catch (error) {

        console.error(
            `[NAWAZ GIF ${commandName}]`,
            error
        );

        try {

            await conn.sendMessage(
                from,
                {
                    react: {
                        text: '❌',
                        key: mek.key
                    }
                }
            );

        } catch {}

        try {

            await reply(
                '⚠️ Something went wrong while sending the GIF.\n\n' +
                'Please try again.'
            );

        } catch {}
    }
}

// =====================================================
// COMMAND REGISTER HELPER
// =====================================================

function registerGifCommand(pattern, description, reaction) {
    cmd(
        {
            pattern,
            desc: description,
            category: 'fun',
            react: reaction,
            filename: __filename
        },

        async (conn, mek, m, { from, reply }) => {
            await handleGif(
                conn,
                mek,
                m,
                { from, reply },
                pattern
            );
        }
    );
}

// GIF handler یہاں ہونا ضروری ہے
async function handleGif(conn, mek, m, { from, reply }, pattern) {
    try {
        // یہاں اصل GIF sending/downloading logic آئے گا
        await reply(`GIF command: ${pattern}`);
    } catch (error) {
        console.error('GIF Error:', error);
        await reply('❌ GIF send karte waqt error aa gaya.');
    }
}

// Commands
registerGifCommand('gif', 'Send GIF', '🎬');
