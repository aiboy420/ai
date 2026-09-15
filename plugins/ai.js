// ai-chat.js - NAWAZ MD AI Chat
// Powered By NAWAZ MD

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============ CONFIG ============
// Multiple AI APIs - Fallback System
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "YOUR_GEMINI_API_KEY";
const GROQ_API_KEY = process.env.GROQ_API_KEY || "YOUR_GROQ_API_KEY";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "YOUR_OPENROUTER_API_KEY";
const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY || "YOUR_TOGETHER_API_KEY";
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || "YOUR_HUGGINGFACE_API_KEY";

const SYSTEM_PROMPT =
  'You are a helpful WhatsApp assistant for NAWAZ MD bot. Keep responses short, friendly, and clear. Use simple language.';

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

// ============ API 1: GOOGLE GEMINI ============
async function callGemini(userMessage, history) {
  const contents = [
    {
      role: 'user',
      parts: [{ text: SYSTEM_PROMPT }]
    },
    {
      role: 'model',
      parts: [{ text: 'Okay, I will follow those instructions.' }]
    },
    ...history.slice(-MAX_HISTORY),
    {
      role: 'user',
      parts: [{ text: userMessage }]
    }
  ];

  const response = await axios({
    method: 'post',
    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
        topP: 0.9
      }
    },
    timeout: 30000
  });

  return response.data.candidates[0].content.parts[0].text;
}

// ============ API 2: GROQ ============
async function callGroq(userMessage, history) {
  const messages = [
    {
      role: 'system',
      content: SYSTEM_PROMPT
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
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 0.9
    },
    timeout: 30000
  });

  return response.data.choices[0].message.content;
}

// ============ API 3: OPENROUTER ============
async function callOpenRouter(userMessage, history) {
  const messages = [
    {
      role: 'system',
      content: SYSTEM_PROMPT
    },
    ...history.slice(-MAX_HISTORY),
    {
      role: 'user',
      content: userMessage
    }
  ];

  const response = await axios({
    method: 'post',
    url: 'https://openrouter.ai/api/v1/chat/completions',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://github.com/nawazmd',
      'X-Title': 'NAWAZ MD AI'
    },
    data: {
      model: 'meta-llama/llama-3.1-8b-instruct:free',
      messages,
      temperature: 0.7,
      max_tokens: 1024
    },
    timeout: 30000
  });

  return response.data.choices[0].message.content;
}

// ============ API 4: TOGETHER AI ============
async function callTogether(userMessage, history) {
  const messages = [
    {
      role: 'system',
      content: SYSTEM_PROMPT
    },
    ...history.slice(-MAX_HISTORY),
    {
      role: 'user',
      content: userMessage
    }
  ];

  const response = await axios({
    method: 'post',
    url: 'https://api.together.xyz/v1/chat/completions',
    headers: {
      'Authorization': `Bearer ${TOGETHER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    data: {
      model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
      messages,
      temperature: 0.7,
      max_tokens: 1024
    },
    timeout: 30000
  });

  return response.data.choices[0].message.content;
}

// ============ API 5: HUGGING FACE ============
async function callHuggingFace(userMessage, history) {
  const messages = [
    {
      role: 'system',
      content: SYSTEM_PROMPT
    },
    ...history.slice(-MAX_HISTORY),
    {
      role: 'user',
      content: userMessage
    }
  ];

  const response = await axios({
    method: 'post',
    url: 'https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct/v1/chat/completions',
    headers: {
      'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    data: {
      model: 'meta-llama/Llama-3.2-3B-Instruct',
      messages,
      temperature: 0.7,
      max_tokens: 1024
    },
    timeout: 30000
  });

  return response.data.choices[0].message.content;
}

// ============ FALLBACK SYSTEM ============
const AI_PROVIDERS = [
  {
    name: 'Gemini',
    fn: callGemini
  },
  {
    name: 'Groq',
    fn: callGroq
  },
  {
    name: 'OpenRouter',
    fn: callOpenRouter
  },
  {
    name: 'Together',
    fn: callTogether
  },
  {
    name: 'HuggingFace',
    fn: callHuggingFace
  }
];

// ============ HELPER: CALL AI WITH FALLBACK ============
async function askAI(userMessage, chatId) {
  if (!chatHistory.has(chatId)) {
    chatHistory.set(chatId, []);
  }

  const history = chatHistory.get(chatId);

  for (const provider of AI_PROVIDERS) {
    try {
      console.log(`[AI Chat] Trying provider: ${provider.name}`);

      const aiResponse = await provider.fn(userMessage, history);

      if (
        !aiResponse ||
        typeof aiResponse !== 'string' ||
        aiResponse.trim() === ''
      ) {
        throw new Error('Empty response');
      }

      console.log(`[AI Chat] Success with: ${provider.name}`);

      history.push({
        role: 'user',
        content: userMessage,
        parts: [{ text: userMessage }]
      });

      history.push({
        role: 'assistant',
        content: aiResponse,
        parts: [{ text: aiResponse }]
      });

      while (history.length > MAX_HISTORY * 2) {
        history.shift();
      }

      return aiResponse;

    } catch (error) {
      console.log(
        `[AI Chat] ${provider.name} failed:`,
        error.message
      );

      if (error.response) {
        console.log(
          `[AI Chat] ${provider.name} response:`,
          error.response.data
        );
      }

      // Try next provider
      continue;
    }
  }

  console.log('[AI Chat] All providers failed');
  return null;
}

// ============ COMMAND: .AION ============
// ONLY OWNER CAN TURN AI ON
cmd({
  pattern: "aion",
  alias: ["ai_on", "aistart"],
  react: "🤖",
  desc: "Turn AI Chat ON",
  category: "ai",
  filename: __filename,
  use: '.aion'
},
async (conn, mek, m, { from, isCreator, reply }) => {
  try {
    // Owner only
    if (!isCreator) {
      return reply("❌ Only Owner can turn AI Chat ON.");
    }

    const chatId = getChatId(from);

    aiStatus.set(chatId, true);

    await conn.sendMessage(from, {
      react: {
        text: "✅",
        key: mek.key
      }
    });

    return reply(
`🤖 *NAWAZ MD AI CHAT*

✅ *AI CHAT ON*

📌 Use:
*.ai* [your message]

Example:
.ai Hello`
    );

  } catch (error) {
    console.log("AI ON Error:", error.message);
    return reply("❌ Failed to turn AI Chat ON.");
  }
});

// ============ COMMAND: .AIOFF ============
// ONLY OWNER CAN TURN AI OFF
cmd({
  pattern: "aioff",
  alias: ["ai_off", "aistop"],
  react: "🔕",
  desc: "Turn AI Chat OFF",
  category: "ai",
  filename: __filename,
  use: '.aioff'
},
async (conn, mek, m, { from, isCreator, reply }) => {
  try {
    // Owner only
    if (!isCreator) {
      return reply("❌ Only Owner can turn AI Chat OFF.");
    }

    const chatId = getChatId(from);

    aiStatus.set(chatId, false);

    await conn.sendMessage(from, {
      react: {
        text: "🔕",
        key: mek.key
      }
    });

    return reply(
`🔕 *NAWAZ MD AI CHAT*

❌ *AI CHAT OFF*`
    );

  } catch (error) {
    console.log("AI OFF Error:", error.message);
    return reply("❌ Failed to turn AI Chat OFF.");
  }
});

// ============ COMMAND: .AI ============
// ANYONE CAN USE AI WHEN OWNER HAS TURNED IT ON
cmd({
  pattern: "ai",
  alias: ["gpt", "ask", "chat", "bot"],
  react: "🤖",
  desc: "Ask AI anything",
  category: "ai",
  filename: __filename,
  use: '.ai [question]'
},
async (conn, mek, m, { from, q, reply }) => {
  try {
    const chatId = getChatId(from);

    // AI must be ON
    if (!isAIEnabled(chatId)) {
      return reply(
`🔕 *NAWAZ MD AI CHAT*

❌ *AI CHAT IS OFF*

Owner must use *.aion* first.`
      );
    }

    // No question
    if (!q) {
      return reply(
`🤖 *NAWAZ MD AI CHAT*

📌 Use:
*.ai* [your message]

Example:
.ai Hello`
      );
    }

    // Loading
    await conn.sendMessage(from, {
      react: {
        text: "⏳",
        key: mek.key
      }
    });

    // Try all APIs
    const response = await askAI(q, chatId);

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
`🤖 *NAWAZ MD AI CHAT*

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

    // Success
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
