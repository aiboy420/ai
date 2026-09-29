// chatgpt.js - ESM Version
// NAWAZ MD - AI / ChatGPT

import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);


// ==========================================
// AI COMMAND
// ==========================================

cmd({

    pattern: "chatgpt",

    alias: [
        "ai",
        "gpt",
        "chatgpt"
    ],

    react: "🤖",

    desc: "ChatGPT-like AI answers",

    category: "ai",

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

        let raw = (text || "").trim();

        // ==================================
        // CHECK QUESTION
        // ==================================

        if (!raw) {

            return reply(
                `🤖 *AI Assistant*

Use like ChatGPT.

*Examples:*
.ai What is quantum entanglement?
.gpt Write a poem about rain
.chatgpt Explain artificial intelligence`
            );

        }


        // ==================================
        // MAX OUTPUT OPTION
        // ==================================

        let maxOut = 1800;
        let maxTokens = 800;

        const maxMatch =
            raw.match(/-max:(\d+)/i);

        if (maxMatch) {

            maxOut = Math.max(
                500,
                Math.min(
                    4000,
                    parseInt(maxMatch[1], 10)
                )
            );

        }


        // Remove -max option from question

        const prompt =
            raw
                .replace(/-max:\d+/i, "")
                .trim();


        if (!prompt) {

            return reply(
                "❌ Please provide a question."
            );

        }


        // ==================================
        // SINGLE AI API
        // ==================================

        const answer =
            await askAI({
                prompt,
                maxTokens
            });


        // ==================================
        // CHECK RESPONSE
        // ==================================

        if (
            !answer ||
            !answer.trim()
        ) {

            return reply(
                "⚠️ I couldn't produce an answer right now. Please try again."
            );

        }


        // ==================================
        // SEND LONG RESPONSE IN PARTS
        // ==================================

        const chunks =
            chunkText(
                answer,
                maxOut
            );


        for (
            const [i, ch]
            of chunks.entries()
        ) {

            const tag =
                chunks.length > 1
                    ? `\n\n— part ${i + 1}/${chunks.length}`
                    : "";

            await conn.sendMessage(
                from,
                {
                    text: ch + tag
                },
                {
                    quoted: mek
                }
            );

        }


    } catch (err) {

        console.error(
            "❌ AI ERROR:",
            err
        );

        return reply(
            "⚠️ Error getting the answer. Try again later."
        );

    }

});


// ==========================================
// SINGLE AI API
// ==========================================

async function askAI({
    prompt,
    maxTokens = 800
}) {

    try {

        const { data } =
            await axios.get(
                "https://api.alyacore.xyz/ai/chatgpt",
                {
                    params: {
                        text: prompt,
                        key: "Duarte-zz12"
                    },

                    timeout: 60000
                }
            );


        if (
            !data ||
            !data.status ||
            !data.result
        ) {

            return "";

        }


        return String(
            data.result
        ).trim();


    } catch (err) {

        console.error(
            "❌ AI API ERROR:",
            err.message
        );

        return "";

    }

}


// ==========================================
// SPLIT LONG TEXT
// ==========================================

function chunkText(
    text,
    maxLen = 1800
) {

    const chunks = [];

    let remaining =
        String(text).trim();


    while (
        remaining.length >
        maxLen
    ) {

        const slice =
            remaining.slice(
                0,
                maxLen
            );


        const newlineCut =
            slice.lastIndexOf(
                "\n"
            );


        const spaceCut =
            slice.lastIndexOf(
                " "
            );


        const cut =
            newlineCut > 600
                ? newlineCut
                : spaceCut;


        const index =
            cut > 400
                ? cut
                : maxLen;


        chunks.push(
            remaining
                .slice(
                    0,
                    index
                )
                .trim()
        );


        remaining =
            remaining
                .slice(index)
                .trim();

    }


    if (remaining) {

        chunks.push(
            remaining
        );

    }


    return chunks;

                }
