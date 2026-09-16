// aivideo.js - ESM Version
// NAWAZ MD - AI VIDEO GENERATOR

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
    // GENERATE VIDEO REQUEST
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
        text,
        quoted
    }
) => {

    try {

        // ==================================
        // GET MESSAGE / QUOTED IMAGE
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


        await reply(
            `🎬 *AI Video Generator*

📝 Prompt: ${prompt}

⏳ Requesting server...`
        );


        // ==================================
        // SEND GENERATION REQUEST
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
        // REQUEST ACCEPTED
        // ==================================

        await reply(
            `✅ *Request Accepted!*

🆔 ID: ${generateResult.request_id}

⏳ Processing...
Please wait.`
        );


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
        // SEND VIDEO
        // ==================================

        const caption =
            `🎬 *AI Video Generated Successfully!*

📝 *Prompt:* ${prompt}

© Powered By Nawaz MD`;


        await conn.sendMessage(

            from,

            {
                video: {
                    url:
                        pollResult.data.video_url
                },

                caption,

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

        reply(
            `❌ Error: ${err.message}`
        );

    }

});
