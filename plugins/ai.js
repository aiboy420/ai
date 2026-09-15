// ai-chat.js - NAWAZ MD AI Chat
// Powered By NAWAZ MD

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============ CONFIG ============
const GROQ_API_KEY = process.env.GROQ_API_KEY || "YOUR_GROQ_API_KEY";
const AI_MODEL = "llama-3.3-70b-versatile";
const MAX_HISTORY = 10;

// Conversation history
const chatHistory = new Map();

// AI status per chat
// Default = OFF
const aiStatus = new Map();

// ============ HELPER: GET CHAT ID ============
function getChatId(from) {
  return from;
}

// ============ HELPER: CHECK AI STATUS ============
function isAIEnabled(chatId) {
  return aiStatus.get(chatId) === true;
}

// ============ HELPER: CALL GROQ API ============
async function askAI(userMessage, chatId) {
  try {
    if (!chatHistory.has(chatId)) {
      chatHistory.set(chatId, []);
    }

    const history = chatHistory.get(chatId);

    const messages = [
      {
        role: 'system',
        content:
          'You are a helpful WhatsApp assistant for NAWAZ MD bot. Keep responses short, friendly, and clear. Use simple language.'
      },
      ...history.slice(-MAX_HISTORY),
      {
        role: 'user',
        content: userMessage
      }
    ];

    const response = await axios({
      method: 'post',
      url: 'https://api.groq.com/openai/v1/chat/completions',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      data: {
        model: AI_MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 0.9
      },
      timeout: 30000
    });

    const aiResponse = response.data.choices[0].message.content;

    // Save conversation
    history.push({
      role: 'user',
      content: userMessage
    });

    history.push({
      role: 'assistant',
      content: aiResponse
    });

    // Keep history limited
    while (history.length > MAX_HISTORY * 2) {
      history.shift();
    }

    return aiResponse;

  } catch (error) {
    console.log("[AI Chat] Error:", error.message);

    if (error.response) {
      console.log("[AI Chat] Response:", error.response.data);
    }

    return null;
  }
}

// ============ COMMAND: .AION ============
cmd({
  pattern: "aion",
  alias: ["ai_on", "aistart"],
  react: "🤖",
  desc: "Turn AI Chat ON",
  category: "ai",
  filename: __filename,
  use: '.aion'
},
async (conn, mek, m, { from, reply }) => {
  try {
    const chatId = getChatId(from);

    aiStatus.set(chatId, true);

    await conn.sendMessage(from, {
      react: {
        text: "✅",
        key: mek.key
      }
    });

    return reply(
`🤖 *NAWAZ MD AI CHATBOT*

✅ *AI CHATBOT IS NOW ON*

━━━━━━━━━━━━━━━━
📌 *HOW TO USE:*

Type:

*.ai* [your message]

Then send your question/message and
AI will reply to you.

*Example:*

.ai What is artificial intelligence?

.ai Write a poem for me

.ai Tell me a joke

.ai Explain JavaScript

━━━━━━━━━━━━━━━━
⚡ *Powered By NAWAZ MD*`
    );

  } catch (error) {
    console.log("AI ON Error:", error.message);
    return reply("❌ Failed to turn AI Chat ON.");
  }
});

// ============ COMMAND: .AIOFF ============
cmd({
  pattern: "aioff",
  alias: ["ai_off", "aistop"],
  react: "🔕",
  desc: "Turn AI Chat OFF",
  category: "ai",
  filename: __filename,
  use: '.aioff'
},
async (conn, mek, m, { from, reply }) => {
  try {
    const chatId = getChatId(from);

    aiStatus.set(chatId, false);

    await conn.sendMessage(from, {
      react: {
        text: "🔕",
        key: mek.key
      }
    });

    return reply(
`🔕 *NAWAZ MD AI CHATBOT*

❌ *AI CHATBOT IS NOW OFF*

━━━━━━━━━━━━━━━━
📌 AI Chat has been disabled.

Use *.aion* to turn AI Chat ON again.

━━━━━━━━━━━━━━━━
⚡ *Powered By NAWAZ MD*`
    );

  } catch (error) {
    console.log("AI OFF Error:", error.message);
    return reply("❌ Failed to turn AI Chat OFF.");
  }
});

// ============ COMMAND: .AI ============
cmd({
  pattern: "ai",
  alias: ["gpt", "ask", "chat", "bot"],
  react: "🤖",
  desc: "Ask AI anything",
  category: "ai",
  filename: __filename,
  use: '.ai [question]'
},
async (conn, mek, m, { from, q, reply, prefix, command }) => {
  try {
    const chatId = getChatId(from);

    // AI must be ON first
    if (!isAIEnabled(chatId)) {
      return reply(
`🔕 *NAWAZ MD AI CHATBOT*

❌ *AI CHAT IS OFF*

Use *.aion* to turn AI Chat ON.`
      );
    }

    // No question
    if (!q) {
      return reply(
`🤖 *NAWAZ MD AI CHATBOT*

📌 *HOW TO USE:*

*.ai* [your message]

*Example:*

.ai What is AI?

.ai Tell me a joke`
      );
    }

    // Loading reaction
    await conn.sendMessage(from, {
      react: {
        text: "⏳",
        key: mek.key
      }
    });

    const response = await askAI(q, chatId);

    // API error
    if (!response) {
      await conn.sendMessage(from, {
        react: {
          text: "❌",
          key: mek.key
        }
      });

      return reply(
        "❌ AI is not responding. Please try again later."
      );
    }

    // AI response
    const caption =
`🤖 *NAWAZ MD AI CHATBOT*

${response}

━━━━━━━━━━━━━━━━
⚡ *Powered By NAWAZ MD*`;

    await conn.sendMessage(
      from,
      {
        text: caption
      },
      {
        quoted: mek
      }
    );

    // Success reaction
    await conn.sendMessage(from, {
      react: {
        text: "✅",
        key: mek.key
      }
    });

  } catch (error) {
    console.log("AI COMMAND ERROR:", error);

    await conn.sendMessage(from, {
      react: {
        text: "❌",
        key: mek.key
      }
    });

    return reply(
      "❌ Something went wrong. Please try again."
    );
  }
});
