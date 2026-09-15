// ai-chat.js - NAWAZ MD AI Chat
// Powered By NAWAZ MD

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// =====================================================
//                    API KEYS
// =====================================================

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY || "";

const GROQ_API_KEY =
  process.env.GROQ_API_KEY || "";

const OPENROUTER_API_KEY =
  process.env.OPENROUTER_API_KEY || "";

const HUGGINGFACE_API_KEY =
  process.env.HUGGINGFACE_API_KEY || "";


// =====================================================
//                    AI CONFIG
// =====================================================

const SYSTEM_PROMPT =
  "You are a helpful WhatsApp assistant for NAWAZ MD. " +
  "Keep responses short, friendly and clear. " +
  "Use simple language.";

const MAX_HISTORY = 10;


// =====================================================
//                    AI STATUS
// =====================================================

// Default AI = OFF
// Owner must use .aion first

let aiEnabled = false;


// =====================================================
//                  CHAT HISTORY
// =====================================================

const chatHistory = new Map();


// =====================================================
//                  CHAT ID
// =====================================================

function getChatId(from) {
  return from;
}


// =====================================================
//                 AI STATUS CHECK
// =====================================================

function isAIEnabled() {
  return aiEnabled === true;
}


// =====================================================
//                 GET HISTORY
// =====================================================

function getHistory(chatId) {

  if (!chatHistory.has(chatId)) {
    chatHistory.set(chatId, []);
  }

  return chatHistory.get(chatId);
}


// =====================================================
//             OPENAI STYLE MESSAGES
// =====================================================

function getMessages(userMessage, history) {

  return [
    {
      role: "system",
      content: SYSTEM_PROMPT
    },

    ...history.slice(-MAX_HISTORY),

    {
      role: "user",
      content: userMessage
    }
  ];
}


// =====================================================
//                  GEMINI API
// =====================================================

async function callGemini(userMessage, history) {

  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key not configured");
  }

  const contents = [];

  // System instruction
  contents.push({
    role: "user",
    parts: [
      {
        text: SYSTEM_PROMPT
      }
    ]
  });

  contents.push({
    role: "model",
    parts: [
      {
        text: "Okay."
      }
    ]
  });


  // History
  for (const msg of history.slice(-MAX_HISTORY)) {

    contents.push({
      role: msg.role === "assistant"
        ? "model"
        : "user",

      parts: [
        {
          text: msg.content
        }
      ]
    });

  }


  // Current message
  contents.push({
    role: "user",
    parts: [
      {
        text: userMessage
      }
    ]
  });


  const response = await axios.post(

    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",

    {
      contents,

      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
        topP: 0.9
      }
    },

    {
      headers: {
        "x-goog-api-key": GEMINI_API_KEY,
        "Content-Type": "application/json"
      },

      timeout: 30000
    }

  );


  return response.data
    ?.candidates?.[0]
    ?.content?.parts?.[0]
    ?.text;
}


// =====================================================
//                    GROQ API
// =====================================================

async function callGroq(userMessage, history) {

  if (!GROQ_API_KEY) {
    throw new Error("Groq API key not configured");
  }


  const response = await axios.post(

    "https://api.groq.com/openai/v1/chat/completions",

    {
      model: "openai/gpt-oss-120b",

      messages: getMessages(
        userMessage,
        history
      ),

      temperature: 0.7,

      max_tokens: 1024
    },

    {
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },

      timeout: 30000
    }

  );


  return response.data
    ?.choices?.[0]
    ?.message?.content;
}


// =====================================================
//                 OPENROUTER API
// =====================================================

async function callOpenRouter(
  userMessage,
  history
) {

  if (!OPENROUTER_API_KEY) {
    throw new Error(
      "OpenRouter API key not configured"
    );
  }


  const response = await axios.post(

    "https://openrouter.ai/api/v1/chat/completions",

    {
      model: "openrouter/free",

      messages: getMessages(
        userMessage,
        history
      ),

      temperature: 0.7,

      max_tokens: 1024
    },

    {
      headers: {
        Authorization:
          `Bearer ${OPENROUTER_API_KEY}`,

        "Content-Type":
          "application/json",

        "HTTP-Referer":
          "https://nawazmd.vercel.app/",

        "X-Title":
          "NAWAZ MD AI"
      },

      timeout: 30000
    }

  );


  return response.data
    ?.choices?.[0]
    ?.message?.content;
}


// =====================================================
//                 HUGGINGFACE API
// =====================================================

async function callHuggingFace(
  userMessage,
  history
) {

  if (!HUGGINGFACE_API_KEY) {
    throw new Error(
      "HuggingFace API key not configured"
    );
  }


  const response = await axios.post(

    "https://router.huggingface.co/v1/chat/completions",

    {
      model: "openai/gpt-oss-120b:fastest",

      messages: getMessages(
        userMessage,
        history
      ),

      temperature: 0.7,

      max_tokens: 1024
    },

    {
      headers: {
        Authorization:
          `Bearer ${HUGGINGFACE_API_KEY}`,

        "Content-Type":
          "application/json"
      },

      timeout: 30000
    }

  );


  return response.data
    ?.choices?.[0]
    ?.message?.content;
}


// =====================================================
//                 AI PROVIDERS
// =====================================================

const AI_PROVIDERS = [

  {
    name: "Gemini",
    fn: callGemini
  },

  {
    name: "Groq",
    fn: callGroq
  },

  {
    name: "OpenRouter",
    fn: callOpenRouter
  },

  {
    name: "HuggingFace",
    fn: callHuggingFace
  }

];


// =====================================================
//                 AI FALLBACK
// =====================================================

async function askAI(
  userMessage,
  chatId
) {

  const history = getHistory(chatId);


  for (const provider of AI_PROVIDERS) {

    try {

      console.log(
        `[NAWAZ AI] Trying ${provider.name}...`
      );


      const response =
        await provider.fn(
          userMessage,
          history
        );


      if (
        !response ||
        typeof response !== "string" ||
        !response.trim()
      ) {

        throw new Error(
          "Empty AI response"
        );

      }


      console.log(
        `[NAWAZ AI] SUCCESS: ${provider.name}`
      );


      // Save user message
      history.push({
        role: "user",
        content: userMessage
      });


      // Save AI response
      history.push({
        role: "assistant",
        content: response
      });


      // Keep history limited
      while (
        history.length >
        MAX_HISTORY * 2
      ) {

        history.shift();

      }


      return response;


    } catch (error) {

      console.log(
        `[NAWAZ AI] FAILED: ${provider.name}`
      );

      console.log(
        error.response?.data ||
        error.message
      );


      // Try next API
      continue;

    }

  }


  console.log(
    "[NAWAZ AI] ALL PROVIDERS FAILED"
  );


  return null;
}


// =====================================================
//                    .AION
//                 OWNER ONLY
// =====================================================

cmd({

  pattern: "aion",

  alias: [
    "ai_on",
    "aistart"
  ],

  react: "🤖",

  desc: "Turn AI Chat ON",

  category: "ai",

  filename: __filename,

  use: ".aion"

},
async (
  conn,
  mek,
  m,
  {
    from,
    isCreator,
    reply
  }
) => {

  try {

    // OWNER ONLY
    if (!isCreator) {

      return reply(
        "❌ Only Owner can turn AI Chat ON."
      );

    }


    // Turn AI ON globally
    aiEnabled = true;


    await conn.sendMessage(
      from,
      {
        react: {
          text: "✅",
          key: mek.key
        }
      }
    );


    return reply(
`🤖 *NAWAZ MD AI CHAT*

✅ *AI CHAT ON*

📌 Use:
*.ai* [your message]

Example:
.ai Hello`
    );


  } catch (error) {

    console.log(
      "AI ON ERROR:",
      error.message
    );

    return reply(
      "❌ Failed to turn AI Chat ON."
    );

  }

});


// =====================================================
//                    .AIOFF
//                 OWNER ONLY
// =====================================================

cmd({

  pattern: "aioff",

  alias: [
    "ai_off",
    "aistop"
  ],

  react: "🔕",

  desc: "Turn AI Chat OFF",

  category: "ai",

  filename: __filename,

  use: ".aioff"

},
async (
  conn,
  mek,
  m,
  {
    from,
    isCreator,
    reply
  }
) => {

  try {

    // OWNER ONLY
    if (!isCreator) {

      return reply(
        "❌ Only Owner can turn AI Chat OFF."
      );

    }


    // Turn AI OFF globally
    aiEnabled = false;


    await conn.sendMessage(
      from,
      {
        react: {
          text: "🔕",
          key: mek.key
        }
      }
    );


    return reply(
`🔕 *NAWAZ MD AI CHAT*

❌ *AI CHAT OFF*`
    );


  } catch (error) {

    console.log(
      "AI OFF ERROR:",
      error.message
    );

    return reply(
      "❌ Failed to turn AI Chat OFF."
    );

  }

});


// =====================================================
//                       .AI
//                  ANYONE CAN USE
// =====================================================

cmd({

  pattern: "ai",

  alias: [
    "gpt",
    "ask",
    "chat",
    "bot"
  ],

  react: "🤖",

  desc: "Ask AI anything",

  category: "ai",

  filename: __filename,

  use: ".ai [question]"

},
async (
  conn,
  mek,
  m,
  {
    from,
    q,
    reply
  }
) => {

  try {

    // Check AI status
    if (!isAIEnabled()) {

      return reply(
`🔕 *NAWAZ MD AI CHAT*

❌ *AI CHAT IS OFF*

Owner must use *.aion* first.`
      );

    }


    // Empty question
    if (!q) {

      return reply(
`🤖 *NAWAZ MD AI CHAT*

📌 Use:
*.ai* [your message]

Example:
.ai Hello`
      );

    }


    // Loading reaction
    await conn.sendMessage(
      from,
      {
        react: {
          text: "⏳",
          key: mek.key
        }
      }
    );


    // Ask AI
    const response =
      await askAI(
        q,
        getChatId(from)
      );


    // All APIs failed
    if (!response) {

      await conn.sendMessage(
        from,
        {
          react: {
            text: "❌",
            key: mek.key
          }
        }
      );


      return reply(
        "❌ AI is not responding. Please try again later."
      );

    }


    // Send AI response
    await conn.sendMessage(

      from,

      {
        text:
`🤖 *NAWAZ MD AI CHAT*

${response}

━━━━━━━━━━━━━━━━
⚡ *Powered By NAWAZ MD*`
      },

      {
        quoted: mek
      }

    );


    // Success reaction
    await conn.sendMessage(
      from,
      {
        react: {
          text: "✅",
          key: mek.key
        }
      }
    );


  } catch (error) {

    console.log(
      "AI COMMAND ERROR:",
      error
    );


    await conn.sendMessage(
      from,
      {
        react: {
          text: "❌",
          key: mek.key
        }
      }
    );


    return reply(
      "❌ Something went wrong. Please try again."
    );

  }

});
