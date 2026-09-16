// ai.js - ESM Version
// NAWAZ MD - AI CHAT

import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);

// ===============================
// COPILOT AI
// ===============================

cmd({
    pattern: "copilot",
    alias: ["copilotai"],
    react: "🤖",
    desc: "Chat with Copilot AI",
    category: "ai",
    filename: __filename
}, async (conn, mek, m, { from, reply, text }) => {

    try {

        if (!text) {
            return reply("🤖 Please provide a question.");
        }

        const res = await axios.get(
            `https://api.yupra.my.id/api/ai/copilot?text=${encodeURIComponent(text)}`,
            {
                timeout: 60000
            }
        );

        const data = res.data;

        if (!data?.status || !data?.result) {
            return reply("❌ Failed to get AI response.");
        }

        await reply(data.result);

    } catch (err) {

        console.error("COPILOT ERROR:", err);

        await reply("⚠️ AI error. Please try again later.");

    }

});


// ===============================
// GPT AI
// ===============================

cmd({
    pattern: "gpt",
    alias: ["gptai"],
    react: "🤖",
    desc: "Chat with GPT AI",
    category: "ai",
    filename: __filename
}, async (conn, mek, m, { from, reply, text }) => {

    try {

        if (!text) {
            return reply("🤖 Please provide a question.");
        }

        const res = await axios.get(
            `https://api.yupra.my.id/api/ai/gpt5?text=${encodeURIComponent(text)}`,
            {
                timeout: 60000
            }
        );

        const data = res.data;

        if (!data?.status || !data?.result) {
            return reply("❌ Failed to get AI response.");
        }

        await reply(data.result);

    } catch (err) {

        console.error("GPT ERROR:", err);

        await reply("⚠️ AI error. Please try again later.");

    }

});
