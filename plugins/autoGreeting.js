// autoGreeting.js

import { cmd } from '../command.js';

const greetings = [
    'hello',
    'hi',
    'hey',
    'hello bro',
    'hello brother',
    'hi bro',
    'hi brother',
    'hey bro',
    'hey brother',
    'hello sir',
    'hi sir',
    'hey sir',
    'hello maam',
    "hello ma'am",
    'hi maam',
    "hi ma'am",
    'hey maam',
    "hey ma'am",
    'hello madam',
    'hi madam',
    'hey madam',
    'salam',
    'salaam',
    'assalamualaikum',
    'assalamu alaikum'
];

cmd({
    pattern: "autogreeting",
    alias: ["greet"],
    use: ".autogreeting",
    desc: "Auto reply to greetings in private chat",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, isGroup }) => {
    try {

        // Only work in private inbox
        if (isGroup) return;

        const text =
            mek.message?.conversation ||
            mek.message?.extendedTextMessage?.text ||
            mek.message?.imageMessage?.caption ||
            mek.message?.videoMessage?.caption ||
            "";

        const message = text.trim().toLowerCase();

        const isGreeting = greetings.some(greeting => {
            return message === greeting;
        });

        if (!isGreeting) return;

        await conn.sendMessage(
            from,
            {
                text: "Yes Brother! How can I help you? 😊"
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error("❌ Auto Greeting Error:", error);
    }
});
