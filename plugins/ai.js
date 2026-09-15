// ai.js - NAWAZ MD AI
// Fixed AI Response - No API Required

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

cmd(
    {
        pattern: 'ai',
        alias: ['ask', 'chatgpt'],
        react: '🤖',
        desc: 'NAWAZ MD AI',
        category: 'ai',
        filename: __filename
    },

    async (conn, mek, m, { from, q, reply }) => {

        try {

            const aiMessage =
`𝙽𝙰𝚆𝙰𝚉 𝙼𝙳 𝙰𝙸

👋 Hello! I'm NAWAZ MD AI.

𝗠𝗲𝗻𝘂 𝗳𝗼𝗿 𝗮𝗹𝗹 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀
Type .menu

🔗 𝗖𝗼𝗻𝗻𝗲𝗰𝘁 𝗬𝗼𝘂𝗿 𝗕𝗼𝘁
Tap below to connect your bot
https://nawazmd.vercel.app

𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗯𝘆 𝗡𝗮𝘄𝗮𝘇 𝗠𝗗`;

            await conn.sendMessage(from, {
                react: {
                    text: '🤖',
                    key: mek.key
                }
            });

            return reply(aiMessage);

        } catch (error) {

            console.error(
                '[NAWAZ AI ERROR]:',
                error.message
            );

            return reply(
                '⚠️ Something went wrong. Please try again.'
            );
        }
    }
);
