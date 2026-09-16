// 8ball.js - ESM Version
// NAWAZ MD - Magic 8 Ball

import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({

    pattern: "8ball",

    alias: [
        "magic8",
        "m8"
    ],

    react: "🎱",

    desc: "Ask the Magic 8 Ball a question",

    category: "fun",

    filename: __filename

}, async (
    conn,
    mek,
    m,
    {
        from,
        reply,
        text
    }
) => {

    try {

        if (!text || !text.trim()) {

            return reply(
                `🎱 *Magic 8 Ball*

❌ Ask me something!

Example:
.8ball Am I lucky today?

.8ball Will I pass the exam?`
            );

        }

        const responses = [

            "✅ Yes, definitely!",
            "❌ No, never!",
            "🤔 Maybe, who knows?",
            "😎 Absolutely!",
            "🙅 Not at all!",
            "💯 For sure!",
            "☁️ The future is unclear...",
            "✨ Without a doubt!",
            "⚡ Yes, but be careful.",
            "🔥 No way!",
            "🌙 Ask again later...",
            "🌈 Signs point to YES!",
            "🌪 My reply is NO.",
            "☀️ Looks positive!",
            "🌊 Chances are low...",
            "🍀 Luck is with you!",
            "💔 Unfortunately not.",
            "🎯 Definitely yes!",
            "🚫 Don't count on it.",
            "⚖️ It's 50-50.",
            "👑 You already know the answer 😉",
            "😅 Better not to tell you now.",
            "🐉 Energy says YES!",
            "🕊 Peaceful vibes: NO.",
            "🚀 Success is coming!",
            "🌌 Stars say NO.",
            "🍎 Absolutely positive!",
            "🥀 It's doubtful.",
            "🎵 Music says YES!",
            "🎭 Drama ahead, maybe NO.",
            "🎁 Surprise YES!",
            "💎 Crystal clear: YES.",
            "🧩 Puzzle says NO.",
            "💤 Sleep on it...",
            "👻 Spirits whisper YES.",
            "🔥 The universe screams NO!",
            "💡 Yes, if you try.",
            "🛑 Stop! Answer is NO.",
            "🍫 Sweet YES!",
            "🥶 Cold NO.",
            "🌻 Bright YES!",
            "⚔️ Fight for it, then YES.",
            "🪞 Mirror says NO.",
            "🌍 The world agrees: YES.",
            "📿 Destiny says NO.",
            "🪐 Cosmic answer: YES.",
            "📌 Not likely.",
            "🖤 Sadly, NO.",
            "🤍 Pure YES!"

        ];

        const answer =
            responses[
                Math.floor(
                    Math.random() * responses.length
                )
            ];

        await reply(
            `🎱 *Question:* ${text.trim()}

✨ *Answer:* ${answer}

© *Powered By Nawaz MD*`
        );

    } catch (err) {

        console.error(
            "8BALL ERROR:",
            err
        );

        return reply(
            "❌ Error while executing 8ball."
        );

    }

});
