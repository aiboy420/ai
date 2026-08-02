// random.js - ESM Version
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getTarget(m, participants = []) {
    return (
        m.quoted?.sender ||
        m.mentionedJid?.[0] ||
        participants?.[Math.floor(Math.random() * participants.length)]?.id
    );
}

const commands = [
    {
        pattern: "fbi",
        emoji: "🚔",
        msg: "🚔 FBI REPORT 🚔\n\n@user ko FBI ne secret watchlist mein daal diya!"
    },
    {
        pattern: "jail",
        emoji: "🚨",
        msg: "🚨 BREAKING NEWS 🚨\n\n@user ko 25 saal ki jail ho gayi 😂"
    },
    {
        pattern: "wanted",
        emoji: "💰",
        msg: "💰 MOST WANTED 💰\n\n@user par $1,000,000 ka inaam rakha gaya!"
    },
    {
        pattern: "mafiamember",
        emoji: "😎",
        msg: "😎 Mafia Boss Alert!\n\n@user underground mafia ka member nikla!"
    },
    {
        pattern: "spy",
        emoji: "🕵️",
        msg: "🕵️ Secret Spy Found!\n\n@user sab ki chats observe kar raha hai!"
    },
    {
        pattern: "criminal",
        emoji: "☠️",
        msg: "☠️ Criminal Report ☠️\n\n@user ko group ka dangerous criminal declare kiya gaya!"
    },
    {
        pattern: "gf",
        emoji: "💖",
        msg: "💖 Love Scanner 💖\n\n@user ki girlfriend jaldi milne wali hai!"
    },
    {
        pattern: "bf",
        emoji: "💙",
        msg: "💙 Love Scanner 💙\n\n@user ka boyfriend jaldi milne wala hai!"
    },
    {
        pattern: "breakup",
        emoji: "💔",
        msg: "💔 Relationship Update 💔\n\n@user ka breakup hone wala hai 😭"
    },
    {
        pattern: "murder",
        emoji: "🔪",
        msg: "🔪 Crime Alert 🔪\n\n@user par murder ka shak hai 😂"
    },
    {
        pattern: "kidnap",
        emoji: "🚐",
        msg: "🚐 Kidnap Case 🚐\n\n@user ko aliens utha kar le gaye!"
    },
    {
        pattern: "arrest",
        emoji: "⛓️",
        msg: "⛓️ Police Action ⛓️\n\n@user ko foran giraftar kar liya gaya!"
    },
    {
        pattern: "hackercheck",
        emoji: "💻",
        msg: "💻 Hacker Scan 💻\n\n@user 99% hacker nikla 😎"
    },
    {
        pattern: "richest",
        emoji: "💸",
        msg: "💸 Rich List 💸\n\n@user group ka sab se ameer banda hai!"
    },
    {
        pattern: "poorest",
        emoji: "🥲",
        msg: "🥲 Poverty Report 🥲\n\n@user ka wallet ro raha hai 😂"
    },
    {
        pattern: "luckcheck",
        emoji: "🍀",
        msg: "🍀 Lucky Meter 🍀\n\n@user aaj bohat lucky hai!"
    },
    {
        pattern: "futurewife",
        emoji: "👰",
        msg: "👰 Future Wife Prediction 👰\n\n@user ki shaadi jaldi hone wali hai!"
    },
    {
        pattern: "futurehusband",
        emoji: "🤵",
        msg: "🤵 Future Husband Prediction 🤵\n\n@user ka rishta approve ho gaya!"
    },
    {
        pattern: "ghost",
        emoji: "👻",
        msg: "👻 Paranormal Activity 👻\n\n@user group ka bhoot hai!"
    },
    {
        pattern: "villain",
        emoji: "😈",
        msg: "😈 Villain Report 😈\n\n@user movie ka villain nikla!"
    },
    {
        pattern: "detective",
        emoji: "🕵️‍♂️",
        msg: "🕵️‍♂️ Detective Mode 🕵️‍♂️\n\n@user secretly case solve kar raha hai!"
    },
    {
        pattern: "king",
        emoji: "👑",
        msg: "👑 King Announcement 👑\n\n@user group ka asli king nikla!"
    },
    {
        pattern: "queen",
        emoji: "👑",
        msg: "👑 Queen Alert 👑\n\n@user group ki queen hai!"
    },
    {
        pattern: "loser",
        emoji: "😂",
        msg: "😂 Roast Report 😂\n\n@user official loser declare ho gaya!"
    },
    {
        pattern: "winner",
        emoji: "🏆",
        msg: "🏆 Winner Alert 🏆\n\n@user ne sab ko hara diya!"
    },
    {
        pattern: "attitude",
        emoji: "😎",
        msg: "😎 Attitude Check 😎\n\n@user ka attitude level 100% hai!"
    },
    {
        pattern: "single",
        emoji: "💔",
        msg: "💔 Relationship Status 💔\n\n@user proudly single hai!"
    },
    {
        pattern: "couple",
        emoji: "❤️",
        msg: "❤️ Love Alert ❤️\n\n@user perfect couple material hai!"
    },
    {
        pattern: "study",
        emoji: "📚",
        msg: "📚 Study Mode 📚\n\n@user ab serious student ban gaya!"
    },
    {
        pattern: "sleep",
        emoji: "😴",
        msg: "😴 Sleep Report 😴\n\n@user hamesha neend mein rehta hai!"
    },
    {
        pattern: "toxic",
        emoji: "☠️",
        msg: "☠️ Toxic Alert ☠️\n\n@user thora toxic behavior show kar raha hai!"
    },
    {
        pattern: "friendly",
        emoji: "🤝",
        msg: "🤝 Friendly Report 🤝\n\n@user sab se friendly banda hai!"
    },
    {
        pattern: "noob",
        emoji: "🎮",
        msg: "🎮 Gaming Report 🎮\n\n@user complete noob player hai 😂"
    },
    {
        pattern: "pro",
        emoji: "🔥",
        msg: "🔥 Pro Player 🔥\n\n@user legend level pro hai!"
    },
    {
        pattern: "angry",
        emoji: "😡",
        msg: "😡 Mood Alert 😡\n\n@user aaj bohat gusse mein hai!"
    }
];

commands.forEach(data => {
    cmd(
        {
            pattern: data.pattern,
            category: "random",
            react: data.emoji,
            filename: __filename
        },
        async (conn, mek, m, { from, participants }) => {

            const target = getTarget(m, participants || []);

            if (!target) {
                return conn.sendMessage(from, {
                    text: "❌ Target user nahi mila!"
                }, { quoted: mek });
            }

            await conn.sendMessage(from, {
                text: data.msg.replace(/@user/g, `@${target.split("@")[0]}`),
                mentions: [target],
                contextInfo: {
                    isForwarded: true,
                    forwardingScore: 999,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363426829681935@newsletter",
                        newsletterName: "NAWAZ-MD",
                        serverMessageId: Date.now()
                    }
                }
            }, { quoted: mek });

        }
    );
});
