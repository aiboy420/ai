// ai.js - ESM Version

import { fileURLToPath } from 'url';
import axios from 'axios';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const AI_MODEL = "llama-3.3-70b-versatile";

async function askAI(query) {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'Answer naturally in the same language as the user. Support Urdu, English, Hindi, Pashto and other languages.'
          },
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    return response?.data?.choices?.[0]?.message?.content?.trim();
  } catch (error) {
    console.log('AI Error:', error.message);
    return null;
  }
}

// Menu میں AI شو کرنے کے لیے
cmd({
  pattern: 'Nawaz',
  alias: ['gpt', 'ask', 'chat', 'bot'],
  react: '🤖',
  desc: 'Ask AI anything',
  category: 'ai',
  filename: __filename,
  use: 'AI [question]'
},
async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return;

    const response = await askAI(q);

    if (!response) return;

    await conn.sendMessage(
      from,
      { text: response },
      { quoted: mek }
    );

  } catch (error) {
    console.log('AI Command Error:', error);
  }
});


// ===============================
// PREFIX کے بغیر AI AUTO REPLY
// ===============================

export async function handleAIMessage(conn, mek) {
  try {
    const message =
      mek?.message?.conversation ||
      mek?.message?.extendedTextMessage?.text ||
      mek?.message?.imageMessage?.caption ||
      mek?.message?.videoMessage?.caption ||
      '';

    if (!message) return;

    const text = message.trim();

    // صرف AI سے شروع ہونے والے messages پکڑے جائیں
    if (!/^ai(?:\s+|$)/i.test(text)) return;

    // AI ہٹا کر اصل سوال حاصل کریں
    const question = text.replace(/^ai\s*/i, '').trim();

    if (!question) return;

    const response = await askAI(question);

    if (!response) return;

    await conn.sendMessage(
      mek.key.remoteJid,
      { text: response },
      { quoted: mek }
    );

  } catch (error) {
    console.log('AI Auto Reply Error:', error.message);
  }
}
