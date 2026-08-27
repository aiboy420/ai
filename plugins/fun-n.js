// fun.js - Nawaz MD | 30 Fun Group Commands

import { fileURLToPath } from 'url';
import path from 'path';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RANDOM GROUP USER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function getRandomUser(conn, from, sender) {

    const metadata = await conn.groupMetadata(from);

    const users = metadata.participants.filter(
        p => p.id !== sender
    );

    if (!users.length) return null;

    return users[
        Math.floor(Math.random() * users.length)
    ];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SEND RANDOM MENTION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function sendFun(
    conn,
    from,
    m,
    title,
    message
) {

    try {

        if (!from.endsWith('@g.us')) {
            return conn.sendMessage(
                from,
                {
                    text: '❌ This command can only be used in a group'
                },
                { quoted: m }
            );
        }

        const sender = m.sender;

        const user = await getRandomUser(
            conn,
            from,
            sender
        );

        if (!user) {
            return conn.sendMessage(
                from,
                {
                    text: '❌ No other group member was found'
                },
                { quoted: m }
            );
        }

        const jid = user.id;
        const number = jid.split('@')[0];

        const text =
`╭━━━〔 ${title} 〕━━━┈⊷
┃ 👤 User : @${number}
┃
┃ ${message}
╰━━━━━━━━━━━━┈⊷

> 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`;

        await conn.sendMessage(
            from,
            {
                text,
                mentions: [jid]
            },
            { quoted: m }
        );

    } catch (error) {

        console.log(
            'Fun Command Error:',
            error
        );

        return conn.sendMessage(
            from,
            {
                text: `❌ Error: ${error.message}`
            },
            { quoted: m }
        );
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 01 - LUCK
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: 'luck',
    desc: 'Check random luck',
    category: 'fun',
    react: '🍀',
    filename: __filename
},
async (conn, mek, m, { from }) => {

    const percent =
        Math.floor(Math.random() * 101);

    await sendFun(
        conn,
        from,
        m,
        '🍀 𝐋𝐔𝐂𝐊',
        `🍀 Luck : *${percent}%*`
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 02 - SMART
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: 'smart',
    desc: 'Check smart level',
    category: 'fun',
    react: '🧠',
    filename: __filename
},
async (conn, mek, m, { from }) => {

    const percent =
        Math.floor(Math.random() * 101);

    await sendFun(
        conn,
        from,
        m,
        '🧠 𝐒𝐌𝐀𝐑𝐓',
        `🧠 Smart Level : *${percent}%*`
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 03 - FUNNY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: 'funny',
    desc: 'Check funny level',
    category: 'fun',
    react: '😂',
    filename: __filename
},
async (conn, mek, m, { from }) => {

    const percent =
        Math.floor(Math.random() * 101);

    await sendFun(
        conn,
        from,
        m,
        '😂 𝐅𝐔𝐍𝐍𝐘',
        `😂 Funny Level : *${percent}%*`
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 04 - HANDSOME
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: 'handsome',
    desc: 'Random handsome score',
    category: 'fun',
    react: '😎',
    filename: __filename
},
async (conn, mek, m, { from }) => {

    const percent =
        Math.floor(Math.random() * 101);

    await sendFun(
        conn,
        from,
        m,
        '😎 𝐇𝐀𝐍𝐃𝐒𝐎𝐌𝐄',
        `😎 Style Score : *${percent}%*`
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 05 - BEAUTY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: 'beauty',
    desc: 'Random beauty score',
    category: 'fun',
    react: '✨',
    filename: __filename
},
async (conn, mek, m, { from }) => {

    const percent =
        Math.floor(Math.random() * 101);

    await sendFun(
        conn,
        from,
        m,
        '✨ 𝐁𝐄𝐀𝐔𝐓𝐘',
        `✨ Beauty Score : *${percent}%*`
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 06 - ATTITUDE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: 'attitudex',
    desc: 'Check attitude level',
    category: 'fun',
    react: '😈',
    filename: __filename
},
async (conn, mek, m, { from }) => {

    const percent =
        Math.floor(Math.random() * 101);

    await sendFun(
        conn,
        from,
        m,
        '😈 𝐀𝐓𝐓𝐈𝐓𝐔𝐃𝐄',
        `😈 Attitude : *${percent}%*`
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 07 - CHAMP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: 'champ',
    desc: 'Random champion score',
    category: 'fun',
    react: '🏆',
    filename: __filename
},
async (conn, mek, m, { from }) => {

    const percent =
        Math.floor(Math.random() * 101);

    await sendFun(
        conn,
        from,
        m,
        '🏆 𝐂𝐇𝐀𝐌𝐏',
        `🏆 Champion Level : *${percent}%*`
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 08 - PRO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: 'pro',
    desc: 'Check pro level',
    category: 'fun',
    react: '🔥',
    filename: __filename
},
async (conn, mek, m, { from }) => {

    const percent =
        Math.floor(Math.random() * 101);

    await sendFun(
        conn,
        from,
        m,
        '🔥 𝐏𝐑𝐎',
        `🔥 Pro Level : *${percent}%*`
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 09 - NOOB
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: 'noobx',
    desc: 'Check noob level',
    category: 'fun',
    react: '😂',
    filename: __filename
},
async (conn, mek, m, { from }) => {

    const percent =
        Math.floor(Math.random() * 101);

    await sendFun(
        conn,
        from,
        m,
        '😂 𝐍𝐎𝐎𝐁',
        `😂 Noob Level : *${percent}%*`
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 10 - MOOD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: 'moodx',
    desc: 'Check random mood',
    category: 'fun',
    react: '😄',
    filename: __filename
},
async (conn, mek, m, { from }) => {

    const moods = [
        '😎 Cool',
        '😂 Funny',
        '🔥 Active',
        '😴 Sleepy',
        '🤩 Excited',
        '😇 Peaceful'
    ];

    const mood =
        moods[Math.floor(Math.random() * moods.length)];

    await sendFun(
        conn,
        from,
        m,
        '😄 𝐌𝐎𝐎𝐃',
        `😄 Current Mood : *${mood}*`
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 11 - ENERGY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: 'energy',
    desc: 'Check energy',
    category: 'fun',
    react: '⚡',
    filename: __filename
},
async (conn, mek, m, { from }) => {

    const percent =
        Math.floor(Math.random() * 101);

    await sendFun(
        conn,
        from,
        m,
        '⚡ 𝐄𝐍𝐄𝐑𝐆𝐘',
        `⚡ Energy : *${percent}%*`
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 12 - VIBE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: 'vibe',
    desc: 'Check vibe',
    category: 'fun',
    react: '🎶',
    filename: __filename
},
async (conn, mek, m, { from }) => {

    const percent =
        Math.floor(Math.random() * 101);

    await sendFun(
        conn,
        from,
        m,
        '🎶 𝐕𝐈𝐁𝐄',
        `🎶 Vibe Level : *${percent}%*`
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 13 - COOL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: 'cool',
    desc: 'Check cool level',
    category: 'fun',
    react: '😎',
    filename: __filename
},
async (conn, mek, m, { from }) => {

    const percent =
        Math.floor(Math.random() * 101);

    await sendFun(
        conn,
        from,
        m,
        '😎 𝐂𝐎𝐎𝐋',
        `😎 Cool Level : *${percent}%*`
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 14 - POPULAR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: 'popular',
    desc: 'Check popularity',
    category: 'fun',
    react: '⭐',
    filename: __filename
},
async (conn, mek, m, { from }) => {

    const percent =
        Math.floor(Math.random() * 101);

    await sendFun(
        conn,
        from,
        m,
        '⭐ 𝐏𝐎𝐏𝐔𝐋𝐀𝐑',
        `⭐ Popularity : *${percent}%*`
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 15 - FAMOUS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: 'famous',
    desc: 'Check fame level',
    category: 'fun',
    react: '🌟',
    filename: __filename
},
async (conn, mek, m, { from }) => {

    const percent =
        Math.floor(Math.random() * 101);

    await sendFun(
        conn,
        from,
        m,
        '🌟 𝐅𝐀𝐌𝐎𝐔𝐒',
        `🌟 Fame Level : *${percent}%*`
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 16 - BRAIN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: 'brain',
    desc: 'Check brain power',
    category: 'fun',
    react: '🧠',
    filename: __filename
},
async (conn, mek, m, { from }) => {

    const percent =
        Math.floor(Math.random() * 101);

    await sendFun(
        conn,
        from,
        m,
        '🧠 𝐁𝐑𝐀𝐈𝐍',
        `🧠 Brain Power : *${percent}%*`
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 17 - POWER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: 'power',
    desc: 'Check power',
    category: 'fun',
    react: '💪',
    filename: __filename
},
async (conn, mek, m, { from }) => {

    const percent =
        Math.floor(Math.random() * 101);

    await sendFun(
        conn,
        from,
        m,
        '💪 𝐏𝐎𝐖𝐄𝐑',
        `💪 Power : *${percent}%*`
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 18 - LUCKY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: 'lucky',
    desc: 'Check lucky level',
    category: 'fun',
    react: '🎯',
    filename: __filename
},
async (conn, mek, m, { from }) => {

    const percent =
        Math.floor(Math.random() * 101);

    await sendFun(
        conn,
        from,
        m,
        '🎯 𝐋𝐔𝐂𝐊𝐘',
        `🎯 Lucky Level : *${percent}%*`
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 19 - STAR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: 'star',
    desc: 'Check star level',
    category: 'fun',
    react: '⭐',
    filename: __filename
},
async (conn, mek, m, { from }) => {

    const stars =
        Math.floor(Math.random() * 6);

    await sendFun(
        conn,
        from,
        m,
        '⭐ 𝐒𝐓𝐀𝐑',
        `⭐ Stars : *${stars}/5*`
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 20 - HERO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: 'hero',
    desc: 'Random hero score',
    category: 'fun',
    react: '🦸',
    filename: __filename
},
async (conn, mek, m, { from }) => {

    const percent =
        Math.floor(Math.random() * 101);

    await sendFun(
        conn,
        from,
        m,
        '🦸 𝐇𝐄𝐑𝐎',
        `🦸 Hero Level : *${percent}%*`
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 21 - LEGEND
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: 'legend',
    desc: 'Check legend level',
    category: 'fun',
    react: '👑',
    filename: __filename
},
async (conn, mek, m, { from }) => {

    const percent =
        Math.floor(Math.random() * 101);

    await sendFun(
        conn,
        from,
        m,
        '👑 𝐋𝐄𝐆𝐄𝐍𝐃',
        `👑 Legend Level : *${percent}%*`
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 22 - KING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: 'kingx',
    desc: 'Random king score',
    category: 'fun',
    react: '👑',
    filename: __filename
},
async (conn, mek, m, { from }) => {

    const percent =
        Math.floor(Math.random() * 101);

    await sendFun(
        conn,
        from,
        m,
        '👑 𝐊𝐈𝐍𝐆',
        `👑 King Level : *${percent}%*`
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 23 - QUEEN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: 'queenx',
    desc: 'Random queen score',
    category: 'fun',
    react: '👑',
    filename: __filename
},
async (conn, mek, m, { from }) => {

    const percent =
        Math.floor(Math.random() * 101);

    await sendFun(
        conn,
        from,
        m,
        '👑 𝐐𝐔𝐄𝐄𝐍',
        `👑 Queen Level : *${percent}%*`
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 24 - PEACE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: 'peace',
    desc: 'Check peace level',
    category: 'fun',
    react: '☮️',
    filename: __filename
},
async (conn, mek, m, { from }) => {

    const percent =
        Math.floor(Math.random() * 101);

    await sendFun(
        conn,
        from,
        m,
        '☮️ 𝐏𝐄𝐀𝐂𝐄',
        `☮️ Peace Level : *${percent}%*`
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 25 - CHAOS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: 'chaos',
    desc: 'Check chaos level',
    category: 'fun',
    react: '🌪️',
    filename: __filename
},
async (conn, mek, m, { from }) => {

    const percent =
        Math.floor(Math.random() * 101);

    await sendFun(
        conn,
        from,
        m,
        '🌪️ 𝐂𝐇𝐀𝐎𝐒',
        `🌪️ Chaos Level : *${percent}%*`
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 26 - DANGER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: 'danger',
    desc: 'Check danger level',
    category: 'fun',
    react: '⚠️',
    filename: __filename
},
async (conn, mek, m, { from }) => {

    const percent =
        Math.floor(Math.random() * 101);

    await sendFun(
        conn,
        from,
        m,
        '⚠️ 𝐃𝐀𝐍𝐆𝐄𝐑',
        `⚠️ Danger Level : *${percent}%*`
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 27 - STYLE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: 'style',
    desc: 'Check style level',
    category: 'fun',
    react: '😎',
    filename: __filename
},
async (conn, mek, m, { from }) => {

    const percent =
        Math.floor(Math.random() * 101);

    await sendFun(
        conn,
        from,
        m,
        '😎 𝐒𝐓𝐘𝐋𝐄',
        `😎 Style Level : *${percent}%*`
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 28 - MAGIC
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: 'magic',
    desc: 'Random magic score',
    category: 'fun',
    react: '✨',
    filename: __filename
},
async (conn, mek, m, { from }) => {

    const percent =
        Math.floor(Math.random() * 101);

    await sendFun(
        conn,
        from,
        m,
        '✨ 𝐌𝐀𝐆𝐈𝐂',
        `✨ Magic Level : *${percent}%*`
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 29 - ROYAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: 'royal',
    desc: 'Check royal level',
    category: 'fun',
    react: '👑',
    filename: __filename
},
async (conn, mek, m, { from }) => {

    const percent =
        Math.floor(Math.random() * 101);

    await sendFun(
        conn,
        from,
        m,
        '👑 𝐑𝐎𝐘𝐀𝐋',
        `👑 Royal Level : *${percent}%*`
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 30 - VIP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: 'vip',
    desc: 'Check VIP level',
    category: 'fun',
    react: '💎',
    filename: __filename
},
async (conn, mek, m, { from }) => {

    const percent =
        Math.floor(Math.random() * 101);

    await sendFun(
        conn,
        from,
        m,
        '💎 𝐕𝐈𝐏',
        `💎 VIP Level : *${percent}%*`
    );
});
