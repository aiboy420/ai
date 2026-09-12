import { cmd } from '../command.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

// ===============================
// NAWAZ MD - NEW FUN GIF COMMANDS
// ===============================

const API_BASE = 'https://waifu.it/api/v1/interactions';

async function getGif(endpoint) {
    const res = await fetch(`${API_BASE}/${endpoint}`);

    if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
    }

    const data = await res.json();

    // Different API responses may use different fields
    return data.url || data.gif || data.image || data.link;
}

async function getTarget(conn, mek, m, from) {

    const sender =
        m.sender ||
        mek.key?.participant ||
        mek.participant;

    // Try normal mention data first
    let mentioned = [];

    if (m.mentionedJid?.length) {
        mentioned = m.mentionedJid;
    }

    // Try message contextInfo
    if (!mentioned.length && mek.message) {

        const msg =
            mek.message.extendedTextMessage ||
            mek.message.imageMessage ||
            mek.message.videoMessage ||
            mek.message.documentMessage;

        if (msg?.contextInfo?.mentionedJid) {
            mentioned = msg.contextInfo.mentionedJid;
        }
    }

    let target;

    // Mentioned user
    if (mentioned.length) {
        target = mentioned[0];
    } else {

        // Random group member
        const metadata = await conn.groupMetadata(from);
        const participants = metadata.participants || [];

        const users = participants
            .map(p => p.id)
            .filter(jid =>
                jid &&
                jid !== sender &&
                jid !== conn.user?.id
            );

        if (!users.length) {
            throw new Error('No other user found in this group.');
        }

        target = users[Math.floor(Math.random() * users.length)];
    }

    return {
        sender,
        target
    };
}

async function sendInteraction(
    conn,
    mek,
    m,
    from,
    reply,
    endpoint,
    title,
    emoji
) {

    if (!from.endsWith('@g.us')) {
        return reply(
            '❌ *This command can only be used in groups.*'
        );
    }

    try {

        const { sender, target } =
            await getTarget(conn, mek, m, from);

        const gif = await getGif(endpoint);

        if (!gif) {
            return reply(
                '❌ *GIF not found from API.*'
            );
        }

        const caption =
`${emoji} *${title}* ${emoji}

@${sender.split('@')[0]} ${emoji} @${target.split('@')[0]}

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`;

        await conn.sendMessage(
            from,
            {
                video: {
                    url: gif
                },
                gifPlayback: true,
                caption,
                mentions: [sender, target]
            },
            {
                quoted: mek
            }
        );

    } catch (error) {

        console.error(
            `❌ ${endpoint} command error:`,
            error
        );

        return reply(
            `❌ *Command Error*\n\n${error.message}`
        );
    }
}


// ===============================
// 1. CUDDLE
// API: hug
// ===============================

cmd({
    pattern: 'cuddle',
    react: '🤗',
    desc: 'Cuddle someone with a random GIF',
    category: 'fun',
    use: '.cuddle @user',
    filename: __filename
}, async (conn, mek, m, { reply, from }) => {

    await sendInteraction(
        conn,
        mek,
        m,
        from,
        reply,
        'hug',
        'CUDDLING FOR YOU',
        '🤗'
    );

});


// ===============================
// 2. SMOOCH
// API: kiss
// ===============================

cmd({
    pattern: 'smooch',
    react: '💋',
    desc: 'Send a random kiss GIF',
    category: 'fun',
    use: '.smooch @user',
    filename: __filename
}, async (conn, mek, m, { reply, from }) => {

    await sendInteraction(
        conn,
        mek,
        m,
        from,
        reply,
        'kiss',
        'SMOOCH FOR YOU',
        '💋'
    );

});


// ===============================
// 3. BONK
// API: slap
// ===============================

cmd({
    pattern: 'bonk',
    react: '👋',
    desc: 'Send a random bonk GIF',
    category: 'fun',
    use: '.bonk @user',
    filename: __filename
}, async (conn, mek, m, { reply, from }) => {

    await sendInteraction(
        conn,
        mek,
        m,
        from,
        reply,
        'slap',
        'BONK FOR YOU',
        '👋'
    );

});


// ===============================
// 4. GROOVE
// API: dance
// ===============================

cmd({
    pattern: 'groove',
    react: '💃',
    desc: 'Send a random dance GIF',
    category: 'fun',
    use: '.groove @user',
    filename: __filename
}, async (conn, mek, m, { reply, from }) => {

    await sendInteraction(
        conn,
        mek,
        m,
        from,
        reply,
        'dance',
        'DANCING FOR YOU',
        '💃'
    );

});


// ===============================
// 5. CHEER
// API: happy
// ===============================

cmd({
    pattern: 'cheer',
    react: '😊',
    desc: 'Send a random happy GIF',
    category: 'fun',
    use: '.cheer @user',
    filename: __filename
}, async (conn, mek, m, { reply, from }) => {

    await sendInteraction(
        conn,
        mek,
        m,
        from,
        reply,
        'happy',
        'HAPPY FOR YOU',
        '😊'
    );

});


// ===============================
// 6. TEAR
// API: sad
// ===============================

cmd({
    pattern: 'tear',
    react: '😢',
    desc: 'Send a random sad GIF',
    category: 'fun',
    use: '.tear @user',
    filename: __filename
}, async (conn, mek, m, { reply, from }) => {

    await sendInteraction(
        conn,
        mek,
        m,
        from,
        reply,
        'sad',
        'SAD FOR YOU',
        '😢'
    );

});
