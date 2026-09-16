// aivideo.js - ESM Version
// NAWAZ MD - AI VIDEO + GPT

import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';
import FormData from 'form-data';
import {
    downloadContentFromMessage
} from '@whiskeysockets/baileys';

const __filename = fileURLToPath(import.meta.url);


// ==========================================
// FREE AI VIDEO API
// ==========================================

const freevideo = {

    api: {
        base: "https://www.freeaivideos.org",

        endpoint: {
            generate: "/api/video_generation",

            request: (id) =>
                `/api/video_generation?request_id=${id}&prompt=`
        }
    },

    headers: {
        "user-agent": "NB Android/1.0.0",
        "origin": "https://www.freeaivideos.org",
        "referer": "https://www.freeaivideos.org/",
        "accept": "*/*"
    },


    // ======================================
    // GENERATE VIDEO
    // ======================================

    generate: async ({ prompt, imageBuffer = null } = {}) => {

        const form = new FormData();

        form.append(
            "prompt",
            prompt || "animate this image"
        );

        if (imageBuffer) {

            form.append(
                "initialFrame",
                imageBuffer,
                {
                    filename: "image.jpg",
                    contentType: "image/jpeg"
                }
            );

        }

        try {

            const res = await axios.post(
                `${freevideo.api.base}${freevideo.api.endpoint.generate}`,
                form,
                {
                    headers: {
                        ...freevideo.headers,
                        ...form.getHeaders()
                    },

                    timeout: 60000
                }
            );

            return {
                success: true,
                request_id: res.data?.request_id
            };

        } catch (err) {

            console.log(
                "AI VIDEO GENERATE ERROR:",
                err.response?.data || err.message
            );

            return {
                success: false,
                error:
                    err.response?.data?.error ||
                    err.message
            };

        }

    },


    // ======================================
    // CHECK VIDEO STATUS
    // ======================================

    poll: async (
        requestId,
        timeoutMs = 10 * 60 * 1000
    ) => {

        const url =
            `${freevideo.api.base}` +
            `${freevideo.api.endpoint.request(requestId)}`;

        const startTime = Date.now();

        return new Promise((resolve) => {

            const loop = async () => {

                if (
                    Date.now() - startTime >=
                    timeoutMs
                ) {

                    return resolve({
                        success: false,
                        error:
                            "Timeout: Generation took too long"
                    });

                }

                try {

                    const res = await axios.get(
                        url,
                        {
                            headers:
                                freevideo.headers,

                            timeout: 30000
                        }
                    );

                    if (res.data?.video_url) {

                        return resolve({
                            success: true,
                            data: res.data
                        });

                    }

                } catch (err) {

                    console.log(
                        "AI VIDEO STATUS ERROR:",
                        err.message
                    );

                }

                setTimeout(loop, 5000);

            };

            loop();

        });

    }

};


// ==========================================
// AI VIDEO COMMAND
// ==========================================

cmd({

    pattern: "aivideo",

    alias: [
        "genvideo",
        "freevideo"
    ],

    react: "🎬",

    desc: "Generate AI Video from prompt or image",

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

        // ==================================
        // GET QUOTED MESSAGE
        // ==================================

        const q = m.quoted ? m.quoted : m;

        const mime =
            (q.msg || q).mimetype || "";


        // ==================================
        // CHECK INPUT
        // ==================================

        if (
            !text &&
            !mime.includes("image")
        ) {

            return reply(
                `❌ *Usage:*

.aivideo a cat walking in rain

OR

Reply to an image with:
.aivideo`
            );

        }


        // ==================================
        // DOWNLOAD IMAGE
        // ==================================

        let imageBuffer = null;

        if (mime.includes("image")) {

            const messageType =
                mime.split("/")[0];

            const stream =
                await downloadContentFromMessage(
                    q.msg || q,
                    messageType
                );

            const chunks = [];

            for await (const chunk of stream) {

                chunks.push(chunk);

            }

            imageBuffer =
                Buffer.concat(chunks);

        }


        // ==================================
        // PROMPT
        // ==================================

        const prompt =
            text ||
            "animate this image";


        // ==================================
        // MESSAGE 1
        // ==================================

        await reply(
            `🎬 *𝘼𝙄 𝙑𝙞𝙙𝙚𝙤*

⏳ *𝙋𝙧𝙤𝙘𝙚𝙨𝙨𝙞𝙣𝙜, 𝙥𝙡𝙚𝙖𝙨𝙚 𝙬𝙖𝙞𝙩...*`
        );


        // ==================================
        // GENERATE
        // ==================================

        const generateResult =
            await freevideo.generate({
                prompt,
                imageBuffer
            });


        if (
            !generateResult.success ||
            !generateResult.request_id
        ) {

            return reply(
                `❌ Error: ${
                    generateResult.error ||
                    "Failed to get request ID"
                }`
            );

        }


        // ==================================
        // WAIT FOR VIDEO
        // ==================================

        const pollResult =
            await freevideo.poll(
                generateResult.request_id
            );


        if (!pollResult.success) {

            return reply(
                `❌ Error: ${pollResult.error}`
            );

        }


        // ==================================
        // VIDEO URL
        // ==================================

        const videoUrl =
            pollResult.data?.video_url;


        if (!videoUrl) {

            return reply(
                "❌ Video URL not found!"
            );

        }


        // ==================================
        // MESSAGE 2 - PLAYABLE VIDEO
        // ==================================

        await conn.sendMessage(
            from,
            {
                video: {
                    url: videoUrl
                },

                caption:
                    `🎬 *𝘼𝙄 𝙑𝙞𝙙𝙚𝙤 𝙂𝙚𝙣𝙚𝙧𝙖𝙩𝙚𝙙*

📝 *𝙋𝙧𝙤𝙢𝙥𝙩:* ${prompt}

© *𝙋𝙤𝙬𝙚𝙧𝙚𝙙 𝘽𝙮 𝙉𝙖𝙬𝙖𝙯 𝙈𝘿*`,

                mimetype: "video/mp4"
            },
            {
                quoted: mek
            }
        );


    } catch (err) {

        console.error(
            "AI VIDEO ERROR:",
            err
        );

        return reply(
            `❌ Error: ${err.message}`
        );

    }

});


// ==========================================
// GPT AI COMMAND
// ==========================================

cmd({

    pattern: "gpt",

    alias: [
        "gptai"
    ],

    react: "🤖",

    desc: "Chat with GPT AI",

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

        if (!text) {

            return reply(
                "🤖 Please provide a question."
            );

        }


        // ==================================
        // SAME LANGUAGE INSTRUCTION
        // ==================================

        const languagePrompt = `
You are a helpful AI assistant.

IMPORTANT LANGUAGE RULE:
Reply in exactly the same language that the user used in their question.

Examples:
- Urdu question → Urdu answer
- Pashto question → Pashto answer
- Hindi question → Hindi answer
- Punjabi question → Punjabi answer
- English question → English answer
- Arabic question → Arabic answer
- Persian question → Persian answer
- Bengali question → Bengali answer
- Any other language → Reply in that same language.

Do NOT automatically translate the user's question.
Do NOT switch to English.
Do NOT mention this language instruction.
Just answer naturally in the user's language.

USER QUESTION:
${text}
`;


        // ==================================
        // GPT API
        // ==================================

        const response =
            await axios.get(
                `https://api.yupra.my.id/api/ai/gpt5?text=${encodeURIComponent(languagePrompt)}`,
                {
                    timeout: 60000
                }
            );


        const result =
            response.data?.result ||
            response.data?.answer ||
            response.data?.response;


        if (!result) {

            return reply(
                "❌ AI response not found."
            );

        }


        // ==================================
        // SEND GPT RESPONSE
        // ==================================

        await reply(result);


    } catch (err) {

        console.error(
            "GPT ERROR:",
            err
        );

        return reply(
            "⚠️ AI is not responding. Please try again later."
        );

    }

});
