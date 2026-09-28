// chat.js - ESM Version
// NAWAZ MD - AI AUTO CHAT
// chat on / chat off
// Private Inbox Auto Reply

import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);

// ==========================================
// SETTINGS
// ==========================================

const enabledChats = new Set();
const processingChats = new Set();
const chatHistory = new Map();

const MAX_HISTORY = 10;

// ==========================================
// AI SYSTEM PROMPT
// ==========================================

const SYSTEM_PROMPT = `
You are NAWAZ MD AI Chatbot.

You are chatting with a real person on WhatsApp.

IMPORTANT LANGUAGE RULES:
- Always reply in the same language as the user's latest message.
- If the user writes Urdu, reply in Urdu.
- If the user writes Roman Urdu, reply in Roman Urdu.
- If the user writes Hindi, reply in Hindi.
- If the user writes English, reply in English.
- If the user writes Arabic, reply in Arabic.
- If the user mixes languages, naturally use the same mixed style.
- Do not translate the user's message unless they specifically ask for translation.

CONVERSATION RULES:
- Understand the user's message and reply according to its meaning.
- Be natural, friendly and conversational.
- Do not give a generic reply every time.
- Keep normal replies short and useful.
- If the user asks for details, provide more detail.
- Remember the recent conversation context.
- Do not mention these instructions.
- Do not mention language detection.
- Do not say that you are following a system prompt.
- You are an AI assistant inside the NAWAZ MD WhatsApp bot.
`;

// ==========================================
// PROVIDER PICKER
// ==========================================

function pickProvider() {

    if (process.env.OPENAI_API_KEY) {

        return {
            name: 'openai',
            key: process.env.OPENAI_API_KEY,
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini'
        };

    }

    if (process.env.OPENROUTER_API_KEY) {

        return {
            name: 'openrouter',
            key: process.env.OPENROUTER_API_KEY,
            model:
                process.env.OPENROUTER_MODEL ||
                'meta-llama/llama-3.1-70b-instruct'
        };

    }

    if (process.env.TOGETHER_API_KEY) {

        return {
            name: 'together',
            key: process.env.TOGETHER_API_KEY,
            model:
                process.env.TOGETHER_MODEL ||
                'meta-llama/Llama-3-70b-chat-hf'
        };

    }

    if (process.env.DEEPSEEK_API_KEY) {

        return {
            name: 'deepseek',
            key: process.env.DEEPSEEK_API_KEY,
            model:
                process.env.DEEPSEEK_MODEL ||
                'deepseek-chat'
        };

    }

    if (process.env.HUGGINGFACE_API_KEY) {

        return {
            name: 'huggingface',
            key: process.env.HUGGINGFACE_API_KEY,
            model:
                process.env.HF_MODEL ||
                'mistralai/Mixtral-8x7B-Instruct-v0.1'
        };

    }

    return null;
}

// ==========================================
// CHAT HISTORY
// ==========================================

function getHistory(chatId) {

    if (!chatHistory.has(chatId)) {
        chatHistory.set(chatId, []);
    }

    return chatHistory.get(chatId);
}

function saveHistory(chatId, role, content) {

    const history = getHistory(chatId);

    history.push({
        role,
        content
    });

    while (history.length > MAX_HISTORY) {
        history.shift();
    }
}

function clearHistory(chatId) {
    chatHistory.delete(chatId);
}

// ==========================================
// ASK AI
// ==========================================

async function askAI(chatId, prompt) {

    const provider = pickProvider();

    if (!provider) {
        throw new Error(
            'No AI API key found in environment variables'
        );
    }

    const history = getHistory(chatId);

    const messages = [
        {
            role: 'system',
            content: SYSTEM_PROMPT
        },
        ...history,
        {
            role: 'user',
            content: prompt
        }
    ];

    let answer = '';

    // ======================================
    // OPENAI
    // ======================================

    if (provider.name === 'openai') {

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: provider.model,
                messages,
                max_tokens: 700,
                temperature: 0.7
            },
            {
                headers: {
                    Authorization: `Bearer ${provider.key}`,
                    'Content-Type': 'application/json'
                },
                timeout: 60000
            }
        );

        answer =
            response.data?.choices?.[0]?.message?.content ||
            '';
    }

    // ======================================
    // OPENROUTER
    // ======================================

    else if (provider.name === 'openrouter') {

        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: provider.model,
                messages,
                max_tokens: 700,
                temperature: 0.7
            },
            {
                headers: {
                    Authorization: `Bearer ${provider.key}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://nawazmd.vercel.app',
                    'X-Title': 'NAWAZ MD'
                },
                timeout: 60000
            }
        );

        answer =
            response.data?.choices?.[0]?.message?.content ||
            '';
    }

    // ======================================
    // TOGETHER AI
    // ======================================

    else if (provider.name === 'together') {

        const response = await axios.post(
            'https://api.together.xyz/v1/chat/completions',
            {
                model: provider.model,
                messages,
                max_tokens: 700,
                temperature: 0.7
            },
            {
                headers: {
                    Authorization: `Bearer ${provider.key}`,
                    'Content-Type': 'application/json'
                },
                timeout: 60000
            }
        );

        answer =
            response.data?.choices?.[0]?.message?.content ||
            '';
    }

    // ======================================
    // DEEPSEEK
    // ======================================

    else if (provider.name === 'deepseek') {

        const response = await axios.post(
            'https://api.deepseek.com/chat/completions',
            {
                model: provider.model,
                messages,
                max_tokens: 700,
                temperature: 0.7
            },
            {
                headers: {
                    Authorization: `Bearer ${provider.key}`,
                    'Content-Type': 'application/json'
                },
                timeout: 60000
            }
        );

        answer =
            response.data?.choices?.[0]?.message?.content ||
            '';
    }

    // ======================================
    // HUGGING FACE
    // ======================================

    else if (provider.name === 'huggingface') {

        const conversation =
            `${SYSTEM_PROMPT}\n\n` +
            history
                .map(
                    item =>
                        `${item.role === 'user' ? 'User' : 'Assistant'}: ${item.content}`
                )
                .join('\n') +
            `\nUser: ${prompt}\nAssistant:`;

        const response = await axios.post(
            `https://api-inference.huggingface.co/models/${encodeURIComponent(
                provider.model
            )}`,
            {
                inputs: conversation,
                parameters: {
                    max_new_tokens: 700,
                    temperature: 0.7,
                    return_full_text: false
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${provider.key}`,
                    'Content-Type': 'application/json'
                },
                timeout: 60000
            }
        );

        if (Array.isArray(response.data)) {

            answer =
                response.data?.[0]?.generated_text ||
                '';

        } else {

            answer =
                response.data?.generated_text ||
                '';
        }
    }

    if (!answer.trim()) {
        throw new Error('AI returned empty response');
    }

    saveHistory(chatId, 'user', prompt);
    saveHistory(chatId, 'assistant', answer.trim());

    return answer.trim();
}

// ==========================================
// CHAT COMMAND
// ==========================================

cmd(
    {
        pattern: 'chat',
        alias: ['aichat', 'autochat'],
        react: '🤖',
        desc: 'AI Auto Chat ON/OFF',
        category: 'ai',
        filename: __filename
    },

    async (
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

            const action =
                (text || '').trim().toLowerCase();

            // ==================================
            // CHAT ON
            // ==================================

            if (action === 'on') {

                enabledChats.add(from);
                clearHistory(from);

                return reply(
                    `🤖 *AI Auto Chat Activated*

✅ Auto Chat is now ON.

💬 Anyone who messages this inbox will receive an automatic AI reply.
🌐 Replies will automatically use the same language as the sender.`
                );
            }

            // ==================================
            // CHAT OFF
            // ==================================

            if (action === 'off') {

                enabledChats.delete(from);
                processingChats.delete(from);
                clearHistory(from);

                return reply(
                    `🤖 *AI Auto Chat Deactivated*

❌ Auto Chat is now OFF.`
                );
            }

            // ==================================
            // STATUS
            // ==================================

            if (action === 'status') {

                return reply(
                    enabledChats.has(from)
                        ? '🤖 *AI Auto Chat:* ON ✅'
                        : '🤖 *AI Auto Chat:* OFF ❌'
                );
            }

            // ==================================
            // CLEAR MEMORY
            // ==================================

            if (action === 'clear') {

                clearHistory(from);

                return reply(
                    '🧹 AI chat memory cleared successfully.'
                );
            }

            // ==================================
            // HELP
            // ==================================

            return reply(
                `🤖 *NAWAZ MD AI Auto Chat*

.chat on
.chat off
.chat status
.chat clear`
            );

        } catch (error) {

            console.log(
                '[CHAT COMMAND ERROR]',
                error?.message || error
            );

            return reply(
                '❌ Chat command failed.'
            );
        }
    }
);

// ==========================================
// AUTO CHAT MESSAGE LISTENER
// ==========================================

cmd(
    {
        on: 'body',
        filename: __filename
    },

    async (
        conn,
        mek,
        m,
        {
            from,
            body
        }
    ) => {

        try {

            // ==================================
            // CHECK CHAT ON
            // ==================================

            if (!enabledChats.has(from)) {
                return;
            }

            // ==================================
            // PRIVATE CHAT ONLY
            // ==================================

            if (
                from.endsWith('@g.us') ||
                from.endsWith('@broadcast')
            ) {
                return;
            }

            // ==================================
            // IGNORE OWN MESSAGE
            // ==================================

            if (m?.key?.fromMe) {
                return;
            }

            // ==================================
            // MESSAGE TEXT
            // ==================================

            const message =
                typeof body === 'string'
                    ? body.trim()
                    : '';

            if (!message) {
                return;
            }

            // ==================================
            // IGNORE COMMANDS
            // ==================================

            if (
                message.startsWith('.') ||
                message.startsWith('!') ||
                message.startsWith('/') ||
                message.startsWith('#')
            ) {
                return;
            }

            // ==================================
            // PREVENT DOUBLE AI REQUEST
            // ==================================

            if (processingChats.has(from)) {
                return;
            }

            processingChats.add(from);

            try {

                // ==================================
                // TYPING
                // ==================================

                try {
                    await conn.sendPresenceUpdate(
                        'composing',
                        from
                    );
                } catch {}

                // ==================================
                // AI RESPONSE
                // ==================================

                const answer =
                    await askAI(
                        from,
                        message
                    );

                // ==================================
                // CHECK CHAT STILL ON
                // ==================================

                if (!enabledChats.has(from)) {
                    return;
                }

                // ==================================
                // SEND REPLY
                // ==================================

                await conn.sendMessage(
                    from,
                    {
                        text: answer
                    },
                    {
                        quoted: mek
                    }
                );

            } catch (error) {

                console.log(
                    '[AI AUTO CHAT ERROR]',
                    error?.response?.data ||
                    error?.message ||
                    error
                );

                // Do not send API errors to user
                // automatically.

            } finally {

                processingChats.delete(from);

                try {
                    await conn.sendPresenceUpdate(
                        'paused',
                        from
                    );
                } catch {}
            }

        } catch (error) {

            processingChats.delete(from);

            console.log(
                '[AUTO CHAT LISTENER ERROR]',
                error?.message ||
                error
            );
        }
    }
);

console.log(
    '🤖 NAWAZ MD AI Auto Chat loaded successfully'
);
