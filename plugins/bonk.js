// fun-gifs.js - NAWAZ MD Fun GIF Commands
// Powered By 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳

import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);

// ===============================
// CONFIG
// ===============================

const PRIMARY_API = 'https://nekos.best/api/v2';
const FALLBACK_API = 'https://api.waifu.pics/sfw';

const POWER_BY = '𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝙱𝚢 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳';

// ===============================
// CATEGORY MAP
// ===============================

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

// ===============================
// CAPTIONS
// ===============================

const CAPTIONS = {

    cuddle: (sender, target) =>
`🤗 *CUDDLING FOR YOU* 🤗

@${sender} 🤗 @${target}

> ${POWER_BY}`,

    smooch: (sender, target) =>
`💋 *SMOOCH FOR YOU* 💋

@${sender} 💋 @${target}

> ${POWER_BY}`,

    bonk: (sender, target) =>
`👋 *BONK FOR YOU* 👋

@${sender} 👋 @${target}

> ${POWER_BY}`,

    groove: (sender, target) =>
`💃 *DANCING FOR YOU* 💃

@${sender} 💃 @${target}

> ${POWER_BY}`,

    cheer: (sender, target) =>
`😊 *HAPPY FOR YOU* 😊

@${sender} 😊 @${target}

> ${POWER_BY}`,

    tear: (sender, target) =>
`😢 *SAD FOR YOU* 😢

@${sender} 😢 @${target}

> ${POWER_BY}`
};

// ===============================
// PRIMARY API
// ===============================

async function fetchPrimary(category) {

    try {

        const response = await axios.get(
            `${PRIMARY_API}/${category}`,
            {
                timeout: 10000,
                headers: {
                    'User-Agent': 'NAWAZ-MD'
                }
            }
        );

        const results = response?.data?.results;

        if (
            Array.isArray(results) &&
            results.length &&
            results[0]?.url
        ) {
            return results[0].url;
        }

        return null;

    } catch (error) {

        console.log(
            `[NAWAZ GIF] Primary ${category}:`,
            error.response?.status || error.message
        );

        return null;
    }
}

// ===============================
// FALLBACK API
// ===============================

async function fetchFallback(category) {

    try {

        const response = await axios.get(
            `${FALLBACK_API}/${category}`,
            {
                timeout: 10000,
                headers: {
                    'User-Agent': 'NAWAZ-MD'
                }
            }
        );

        if (response?.data?.url) {
            return response.data.url;
        }

        return null;

    } catch (error) {

        console.log(
            `[NAWAZ GIF] Fallback ${category}:`,
            error.response?.status || error.message
        );

        return null;
    }
}

// ===============================
// GET GIF
// ===============================

async function getGif(commandName) {

    const map = CATEGORY_MAP[commandName];

    if (!map) {
        return null;
    }

    // Primary
    let gif = await fetchPrimary(map.primary);

    if (gif) {
        return gif;
    }

    // Small delay
    await new Promise(resolve => setTimeout(resolve, 700));

    // Fallback
    gif = await fetchFallback(map.fallback);

    if (gif) {
        return gif;
    }

    return null;
}

// ===============================
// GET SENDER
// ===============================

function getSender(mek, m, from) {

    return (
        m?.sender ||
        mek?.key?.participant ||
        mek?.participant ||
        from
    );
}

// ===============================
// GET MENTIONED USER
// ===============================

function getMentionedUser(mek, m) {

    // First check m
    if (
        Array.isArray(m?.mentionedJid) &&
        m.mentionedJid.length
    ) {
        return m.mentionedJid[0];
    }

    // Then message context
    const message = mek?.message;

    const extended =
        message?.extendedTextMessage;

    const image =
        message?.imageMessage;

    const video =
        message?.videoMessage;

    const contextInfo =
        extended?.contextInfo ||
        image?.contextInfo ||
        video?.contextInfo;

    if (
        Array.isArray(contextInfo?.mentionedJid) &&
        contextInfo.mentionedJid.length
    ) {
        return contextInfo.mentionedJid[0];
    }

    return null;
}

// ===============================
// GET RANDOM GROUP USER
// ===============================

async function getRandomUser(conn, from, sender) {

    try {

        const metadata =
            await conn.groupMetadata(from);

        const participants =
            metadata?.participants || [];

        const users = participants
            .map(p => p.id)
            .filter(id =>
                id &&
                id !== sender &&
                id !== conn.user?.id
            );

        if (!users.length) {
            return null;
        }

        return users[
            Math.floor(Math.random() * users.length)
        ];

    } catch (error) {

        console.log(
            '[NAWAZ GIF] Group metadata error:',
            error.message
        );

        return null;
    }
}

// ===============================
// GET TARGET
// ===============================

async function getTarget(conn, mek, m, from, sender) {

    // Mention first
    const mentioned =
        getMentionedUser(mek, m);

    if (mentioned) {
        return mentioned;
    }

    // Random user if no mention
    return await getRandomUser(
        conn,
        from,
        sender
    );
}

// ===============================
// MAIN HANDLER
// ===============================

async function handleGif(
    conn,
    mek,
    m,
    { from, reply },
    commandName
) {

    try {

        // Group only
        if (!from?.endsWith('@g.us')) {

            return reply(
                '❌ *This command can only be used in groups.*'
            );
        }

        // Loading reaction
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

        } catch {}

        // Sender
        const sender =
            getSender(mek, m, from);

        if (!sender) {

            return reply(
                '❌ *Could not detect sender.*'
            );
        }

        // Target
        const target =
            await getTarget(
                conn,
                mek,
                m,
                from,
                sender
            );

        if (!target) {

            return reply(
                '❌ *Please mention someone or try again.*'
            );
        }

        // Get GIF
        const gifUrl =
            await getGif(commandName);

        if (!gifUrl) {

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
`⚠️ *GIF SERVICE TEMPORARILY UNAVAILABLE*

Please try the command again after a few seconds.

> ${POWER_BY}`
            );
        }

        // Numbers for mentions
        const senderNumber =
            sender.split('@')[0];

        const targetNumber =
            target.split('@')[0];

        // Caption
        const caption =
            CAPTIONS[commandName](
                senderNumber,
                targetNumber
            );

        // Send GIF
        await conn.sendMessage(
            from,
            {
                video: {
                    url: gifUrl
                },

                gifPlayback: true,

                caption,

                mentions: [
                    sender,
                    target
                ]
            },
            {
                quoted: mek
            }
        );

        // Success
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

        // Proper error handling
        let message =
            '⚠️ *Unable to send GIF right now.*';

        if (
            error?.response?.status === 429
        ) {

            message =
`⚠️ *GIF API RATE LIMIT*

The GIF service is busy right now.

Please try again after a few seconds.

> ${POWER_BY}`;

        } else if (
            error?.response?.status >= 500
        ) {

            message =
`⚠️ *GIF SERVER ERROR*

The GIF server is temporarily unavailable.

Please try again.

> ${POWER_BY}`;
        }

        return reply(message);
    }
}

// ===============================
// CUDDLE
// ===============================

cmd({
    pattern: 'cuddle',
    alias: ['hug'],
    desc: 'Cuddle / Hug GIF',
    category: 'fun',
    react: '🤗',
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {

    await handleGif(
        conn,
        mek,
        m,
        { from, reply },
        'cuddle'
    );

});

// ===============================
// SMOOCH
// ===============================

cmd({
    pattern: 'smooch',
    alias: ['kiss'],
    desc: 'Kiss GIF',
    category: 'fun',
    react: '💋',
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {

    await handleGif(
        conn,
        mek,
        m,
        { from, reply },
        'smooch'
    );

});

// ===============================
// BONK
// ===============================

cmd({
    pattern: 'bonk',
    alias: ['slap'],
    desc: 'Bonk / Slap GIF',
    category: 'fun',
    react: '👋',
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {

    await handleGif(
        conn,
        mek,
        m,
        { from, reply },
        'bonk'
    );

});

// ===============================
// GROOVE
// ===============================

cmd({
    pattern: 'groove',
    alias: ['dance'],
    desc: 'Dance GIF',
    category: 'fun',
    react: '💃',
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {

    await handleGif(
        conn,
        mek,
        m,
        { from, reply },
        'groove'
    );

});

// ===============================
// CHEER
// ===============================

cmd({
    pattern: 'cheer',
    alias: ['happy'],
    desc: 'Happy GIF',
    category: 'fun',
    react: '😊',
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {

    await handleGif(
        conn,
        mek,
        m,
        { from, reply },
        'cheer'
    );

});

// ===============================
// TEAR
// ===============================

cmd({
    pattern: 'tear',
    alias: ['cry', 'sad'],
    desc: 'Sad / Cry GIF',
    category: 'fun',
    react: '😢',
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {

    await handleGif(
        conn,
        mek,
        m,
        { from, reply },
        'tear'
    );

});
