// autoGreeting.js
// NAWAZ MD - Private Inbox Auto Greeting

import { cmd } from '../command.js';

const greetings = [
    'hi',
    'hii',
    'hiii',
    'hello',
    'helloo',
    'helo',
    'heloo',
    'hey',
    'hy',
    'salam',
    'salaam',
    'aoa',
    'assalamualaikum',
    'assalamu alaikum',
    'assalam o alaikum',

    'hi bro',
    'hii bro',
    'hello bro',
    'hey bro',

    'hi brother',
    'hello brother',
    'hey brother',

    'hi sir',
    'hello sir',
    'hey sir',

    'hi maam',
    'hello maam',
    'hey maam',

    "hi ma'am",
    "hello ma'am",
    "hey ma'am",

    'hi madam',
    'hello madam',
    'hey madam'
];

cmd(
{
    on: 'body',
    fromMe: false,
    dontAddCommandList: true,
    filename: __filename
},

async (
    conn,
    mek,
    m,
    {
        from,
        body,
        isGroup
    }
) => {

    try {

        // Only Private Inbox
        if (isGroup) return;

        // Ignore empty messages
        if (!body || typeof body !== 'string') return;

        // Clean incoming message
        const text = body
            .trim()
            .toLowerCase()
            .replace(/\s+/g, ' ');

        // Check greeting
        if (!greetings.includes(text)) return;

        // Auto Reply
        await conn.sendMessage(
            from,
            {
                text: 'Yes Brother! How can I help you? 😊'
            },
            {
                quoted: mek
            }
        );

    } catch (error) {

        console.error(
            '❌ Auto Greeting Error:',
            error
        );

    }

});
