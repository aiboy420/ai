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
        // SELECT PROVIDER
        // ==================================

        const provider =
            pickProvider();


        let answer = "";


        // ==================================
        // AI API
        // ==================================

        if (provider) {

            answer =
                await askLLM({
                    provider,
                    prompt,
                    maxTokens
                });

        } else {

            // ==================================
            // FREE FALLBACK
            // ==================================

            answer =
                await freeFallback(
                    prompt
                );

        }


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
// PROVIDER PICKER
// ==========================================

function pickProvider() {

    if (
        process.env.OPENAI_API_KEY
    ) {

        return {

            name: "openai",

            key:
                process.env.OPENAI_API_KEY,

            model:
                process.env.OPENAI_MODEL ||
                "gpt-4o-mini"

        };

    }


    if (
        process.env.OPENROUTER_API_KEY
    ) {

        return {

            name: "openrouter",

            key:
                process.env.OPENROUTER_API_KEY,

            model:
                process.env.OPENROUTER_MODEL ||
                "meta-llama/llama-3.1-70b-instruct"

        };

    }


    if (
        process.env.TOGETHER_API_KEY
    ) {

        return {

            name: "together",

            key:
                process.env.TOGETHER_API_KEY,

            model:
                process.env.TOGETHER_MODEL ||
                "meta-llama/Llama-3-70b-chat-hf"

        };

    }


    if (
        process.env.DEEPSEEK_API_KEY
    ) {

        return {

            name: "deepseek",

            key:
                process.env.DEEPSEEK_API_KEY,

            model:
                process.env.DEEPSEEK_MODEL ||
                "deepseek-chat"

        };

    }


    if (
        process.env.HUGGINGFACE_API_KEY
    ) {

        return {

            name: "huggingface",

            key:
                process.env.HUGGINGFACE_API_KEY,

            model:
                process.env.HF_MODEL ||
                "mistralai/Mixtral-8x7B-Instruct-v0.1"

        };

    }


    return null;

}


// ==========================================
// ASK LLM
// ==========================================

async function askLLM({
    provider,
    prompt,
    maxTokens = 800
}) {

    const systemPrompt =
        "You are a helpful, concise assistant. " +
        "Write clear, well-structured answers. " +
        "Use bullet points when helpful. " +
        "Include examples where appropriate.";


    // ======================================
    // OPENAI
    // ======================================

    if (
        provider.name === "openai"
    ) {

        const response =
            await axios.post(

                "https://api.openai.com/v1/chat/completions",

                {

                    model:
                        provider.model,

                    messages: [

                        {
                            role: "system",
                            content:
                                systemPrompt
                        },

                        {
                            role: "user",
                            content:
                                prompt
                        }

                    ],

                    max_tokens:
                        maxTokens,

                    temperature:
                        0.7

                },

                {

                    headers: {

                        "Authorization":
                            `Bearer ${provider.key}`,

                        "Content-Type":
                            "application/json"

                    },

                    timeout:
                        60000

                }

            );


        return (
            response.data
                ?.choices?.[0]
                ?.message?.content ||
            ""
        );

    }


    // ======================================
    // OPENROUTER
    // ======================================

    if (
        provider.name === "openrouter"
    ) {

        const response =
            await axios.post(

                "https://openrouter.ai/api/v1/chat/completions",

                {

                    model:
                        provider.model,

                    messages: [

                        {
                            role: "system",
                            content:
                                systemPrompt
                        },

                        {
                            role: "user",
                            content:
                                prompt
                        }

                    ],

                    max_tokens:
                        maxTokens,

                    temperature:
                        0.7

                },

                {

                    headers: {

                        "Authorization":
                            `Bearer ${provider.key}`,

                        "Content-Type":
                            "application/json"

                    },

                    timeout:
                        60000

                }

            );


        return (
            response.data
                ?.choices?.[0]
                ?.message?.content ||
            ""
        );

    }


    // ======================================
    // TOGETHER AI
    // ======================================

    if (
        provider.name === "together"
    ) {

        const response =
            await axios.post(

                "https://api.together.xyz/v1/chat/completions",

                {

                    model:
                        provider.model,

                    messages: [

                        {
                            role: "system",
                            content:
                                systemPrompt
                        },

                        {
                            role: "user",
                            content:
                                prompt
                        }

                    ],

                    max_tokens:
                        maxTokens,

                    temperature:
                        0.7

                },

                {

                    headers: {

                        "Authorization":
                            `Bearer ${provider.key}`,

                        "Content-Type":
                            "application/json"

                    },

                    timeout:
                        60000

                }

            );


        return (
            response.data
                ?.choices?.[0]
                ?.message?.content ||
            ""
        );

    }


    // ======================================
    // DEEPSEEK
    // ======================================

    if (
        provider.name === "deepseek"
    ) {

        const response =
            await axios.post(

                "https://api.deepseek.com/chat/completions",

                {

                    model:
                        provider.model,

                    messages: [

                        {
                            role: "system",
                            content:
                                systemPrompt
                        },

                        {
                            role: "user",
                            content:
                                prompt
                        }

                    ],

                    max_tokens:
                        maxTokens,

                    temperature:
                        0.7

                },

                {

                    headers: {

                        "Authorization":
                            `Bearer ${provider.key}`,

                        "Content-Type":
                            "application/json"

                    },

                    timeout:
                        60000

                }

            );


        return (
            response.data
                ?.choices?.[0]
                ?.message?.content ||
            ""
        );

    }


    // ======================================
    // HUGGING FACE
    // ======================================

    if (
        provider.name === "huggingface"
    ) {

        const response =
            await axios.post(

                `https://api-inference.huggingface.co/models/${encodeURIComponent(provider.model)}`,

                {

                    inputs:
                        `System: ${systemPrompt}\n` +
                        `User: ${prompt}\n` +
                        `Assistant:`,

                    parameters: {

                        max_new_tokens:
                            maxTokens,

                        temperature:
                            0.7,

                        return_full_text:
                            false

                    }

                },

                {

                    headers: {

                        "Authorization":
                            `Bearer ${provider.key}`,

                        "Content-Type":
                            "application/json"

                    },

                    timeout:
                        60000

                }

            );


        const json =
            response.data;


        if (
            Array.isArray(json) &&
            json[0]?.generated_text
        ) {

            return json[0].generated_text;

        }


        if (
            json?.generated_text
        ) {

            return json.generated_text;

        }


        return "";

    }


    return "";

}


// ==========================================
// FREE FALLBACK
// ==========================================

async function freeFallback(query) {

    let output = "";


    // ======================================
    // WIKIPEDIA
    // ======================================

    const wiki =
        await wikipediaSummary(
            query
        );


    if (wiki) {

        output +=
            `📚 *Wikipedia Summary*\n${wiki}\n`;

    }


    // ======================================
    // GOOGLE NEWS
    // ======================================

    const news =
        await googleNewsTop(
            query
        );


    if (
        news &&
        news.length
    ) {

        output +=
            `\n📰 *Latest Headlines*\n` +

            news
                .slice(0, 6)
                .map(
                    (item, index) =>
                        ` ${index + 1}. ${item.title}\n    ${item.link}`
                )
                .join("\n");

    }


    if (!output) {

        output =
            "I couldn't find enough information without an AI provider key. " +
            "Please try a different query or add an AI API key.";

    }


    return output.trim();

}


// ==========================================
// WIKIPEDIA SUMMARY
// ==========================================

async function wikipediaSummary(
    query,
    lang = "en"
) {

    try {

        const searchURL =
            `https://${lang}.wikipedia.org/w/api.php` +
            `?action=query` +
            `&list=search` +
            `&srlimit=1` +
            `&srsearch=${encodeURIComponent(query)}` +
            `&utf8=1` +
            `&format=json` +
            `&origin=*`;


        const searchResponse =
            await axios.get(
                searchURL,
                {
                    timeout: 10000
                }
            );


        const title =
            searchResponse.data
                ?.query
                ?.search?.[0]
                ?.title ||
            query;


        const summaryURL =
            `https://${lang}.wikipedia.org/api/rest_v1/page/summary/` +
            encodeURIComponent(title);


        const summaryResponse =
            await axios.get(
                summaryURL,
                {
                    timeout: 10000
                }
            );


        const data =
            summaryResponse.data;


        const extract =
            data?.extract ||
            "";


        if (!extract) {

            return "";

        }


        const pageURL =
            data?.content_urls
                ?.desktop
                ?.page ||
            `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(
                title.replace(/ /g, "_")
            )}`;


        return (
            `*${data.title}*\n` +
            `${extract}\n` +
            `🔗 ${pageURL}`
        );

    } catch (err) {

        console.error(
            "WIKIPEDIA ERROR:",
            err.message
        );

        return "";

    }

}


// ==========================================
// GOOGLE NEWS
// ==========================================

async function googleNewsTop(
    topic
) {

    try {

        const url =
            `https://news.google.com/rss/search?` +
            `q=${encodeURIComponent(topic)}` +
            `&hl=en-IN&gl=IN&ceid=IN:en`;


        const response =
            await axios.get(
                url,
                {
                    timeout: 10000,
                    responseType: "text"
                }
            );


        const xml =
            response.data;


        const items =
            [
                ...xml.matchAll(
                    /<item><title><!\[CDATA\[(.*?)\]\]><\/title><link>(.*?)<\/link>/g
                )
            ]
                .map(
                    match => ({

                        title:
                            decodeEntities(
                                match[1]
                            ),

                        link:
                            match[2]

                    })
                );


        return items;

    } catch (err) {

        console.error(
            "GOOGLE NEWS ERROR:",
            err.message
        );

        return [];

    }

}


// ==========================================
// DECODE HTML ENTITIES
// ==========================================

function decodeEntities(
    text = ""
) {

    return text

        .replace(
            /&amp;/g,
            "&"
        )

        .replace(
            /&lt;/g,
            "<"
        )

        .replace(
            /&gt;/g,
            ">"
        )

        .replace(
            /&quot;/g,
            '"'
        )

        .replace(
            /&#39;/g,
            "'"
        );

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
