import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);

// Copilot AI
cmd({
    pattern: "copilot",
    desc: "Chat with Microsoft Copilot AI",
    category: "ai",
    react: "✨",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .copilot Your question");
    try {
        const res = await axios.get(`https://eliteprotech-apis.zone.id/copilot?q=${encodeURIComponent(q)}`);
        if (res.data.success) reply(res.data.text);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// ChatGPT Elite
cmd({
    pattern: "chatgptelite",
    desc: "Chat with ChatGPT Elite AI",
    category: "ai",
    react: "🧠",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .chatgptelite Your question");
    try {
        const res = await axios.get(`https://eliteprotech-apis.zone.id/chatgpt?prompt=${encodeURIComponent(q)}`);
        if (res.data.success) reply(res.data.response);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Talk AI
cmd({
    pattern: "talkai",
    desc: "Chat with Talk AI",
    category: "ai",
    react: "💬",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .talkai Your question");
    try {
        const res = await axios.get(`https://eliteprotech-apis.zone.id/talk-ai?q=${encodeURIComponent(q)}`);
        if (res.data.success) reply(res.data.response);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Brain AI
cmd({
    pattern: "brain",
    desc: "Chat with Brain AI",
    category: "ai",
    react: "🧠",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .brain Your question");
    try {
        const res = await axios.get(`https://eliteprotech-apis.zone.id/chatgpt?prompt=${encodeURIComponent(q)}`);
        if (res.data.success) reply(res.data.response);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Elite AI
cmd({
    pattern: "elite",
    desc: "Chat with Elite AI Assistant",
    category: "ai",
    react: "👑",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .elite Your question");
    try {
        const res = await axios.get(`https://eliteprotech-apis.zone.id/talk-ai?q=${encodeURIComponent(q)}`);
        if (res.data.success) reply(res.data.response);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Microsoft Copilot
cmd({
    pattern: "mscopilot",
    desc: "Chat with Microsoft Copilot",
    category: "ai",
    react: "💙",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .mscopilot Your question");
    try {
        const res = await axios.get(`https://eliteprotech-apis.zone.id/copilot?q=${encodeURIComponent(q)}`);
        if (res.data.success) reply(res.data.text);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Elite ChatGPT
cmd({
    pattern: "elitegpt",
    desc: "Chat with Elite ChatGPT",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .elitegpt Your question");
    try {
        const res = await axios.get(`https://eliteprotech-apis.zone.id/chatgpt?prompt=${encodeURIComponent(q)}`);
        if (res.data.success) reply(res.data.response);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// AI Assistant
cmd({
    pattern: "assistant",
    desc: "Chat with AI Assistant",
    category: "ai",
    react: "🤵",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .assistant Your question");
    try {
        const res = await axios.get(`https://eliteprotech-apis.zone.id/talk-ai?q=${encodeURIComponent(q)}`);
        if (res.data.success) reply(res.data.response);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Smart AI
cmd({
    pattern: "smart",
    desc: "Chat with Smart AI",
    category: "ai",
    react: "🧠",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .smart Your question");
    try {
        const res = await axios.get(`https://eliteprotech-apis.zone.id/chatgpt?prompt=${encodeURIComponent(q)}`);
        if (res.data.success) reply(res.data.response);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Genius AI
cmd({
    pattern: "genius",
    desc: "Chat with Genius AI",
    category: "ai",
    react: "🌟",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .genius Your question");
    try {
        const res = await axios.get(`https://eliteprotech-apis.zone.id/copilot?q=${encodeURIComponent(q)}`);
        if (res.data.success) reply(res.data.text);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Pro AI
cmd({
    pattern: "proai",
    desc: "Chat with Pro AI",
    category: "ai",
    react: "⚡",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .proai Your question");
    try {
        const res = await axios.get(`https://eliteprotech-apis.zone.id/talk-ai?q=${encodeURIComponent(q)}`);
        if (res.data.success) reply(res.data.response);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Elite Copilot
cmd({
    pattern: "elitecopilot",
    desc: "Chat with Elite Copilot",
    category: "ai",
    react: "🎯",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .elitecopilot Your question");
    try {
        const res = await axios.get(`https://eliteprotech-apis.zone.id/copilot?q=${encodeURIComponent(q)}`);
        if (res.data.success) reply(res.data.text);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Ultra AI
cmd({
    pattern: "ultra",
    desc: "Chat with Ultra AI",
    category: "ai",
    react: "🔥",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .ultra Your question");
    try {
        const res = await axios.get(`https://eliteprotech-apis.zone.id/chatgpt?prompt=${encodeURIComponent(q)}`);
        if (res.data.success) reply(res.data.response);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Max AI
cmd({
    pattern: "maxai",
    desc: "Chat with Max AI",
    category: "ai",
    react: "💪",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .maxai Your question");
    try {
        const res = await axios.get(`https://eliteprotech-apis.zone.id/talk-ai?q=${encodeURIComponent(q)}`);
        if (res.data.success) reply(res.data.response);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Nova AI
cmd({
    pattern: "nova",
    desc: "Chat with Nova AI",
    category: "ai",
    react: "⭐",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .nova Your question");
    try {
        const res = await axios.get(`https://eliteprotech-apis.zone.id/chatgpt?prompt=${encodeURIComponent(q)}`);
        if (res.data.success) reply(res.data.response);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Zenith AI
cmd({
    pattern: "zenith",
    desc: "Chat with Zenith AI",
    category: "ai",
    react: "✨",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .zenith Your question");
    try {
        const res = await axios.get(`https://eliteprotech-apis.zone.id/copilot?q=${encodeURIComponent(q)}`);
        if (res.data.success) reply(res.data.text);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Apex AI
cmd({
    pattern: "apex",
    desc: "Chat with Apex AI",
    category: "ai",
    react: "🏆",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .apex Your question");
    try {
        const res = await axios.get(`https://eliteprotech-apis.zone.id/talk-ai?q=${encodeURIComponent(q)}`);
        if (res.data.success) reply(res.data.response);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Vertex AI
cmd({
    pattern: "vertex",
    desc: "Chat with Vertex AI",
    category: "ai",
    react: "🔷",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .vertex Your question");
    try {
        const res = await axios.get(`https://eliteprotech-apis.zone.id/chatgpt?prompt=${encodeURIComponent(q)}`);
        if (res.data.success) reply(res.data.response);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Pulse AI
cmd({
    pattern: "pulse",
    desc: "Chat with Pulse AI",
    category: "ai",
    react: "💓",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .pulse Your question");
    try {
        const res = await axios.get(`https://eliteprotech-apis.zone.id/copilot?q=${encodeURIComponent(q)}`);
        if (res.data.success) reply(res.data.text);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Quantum AI
cmd({
    pattern: "quantum",
    desc: "Chat with Quantum AI",
    category: "ai",
    react: "⚛️",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .quantum Your question");
    try {
        const res = await axios.get(`https://eliteprotech-apis.zone.id/talk-ai?q=${encodeURIComponent(q)}`);
        if (res.data.success) reply(res.data.response);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Neo AI
cmd({
    pattern: "neo",
    desc: "Chat with Neo AI",
    category: "ai",
    react: "💚",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .neo Your question");
    try {
        const res = await axios.get(`https://eliteprotech-apis.zone.id/chatgpt?prompt=${encodeURIComponent(q)}`);
        if (res.data.success) reply(res.data.response);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Omega AI
cmd({
    pattern: "omega",
    desc: "Chat with Omega AI",
    category: "ai",
    react: "🔱",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .omega Your question");
    try {
        const res = await axios.get(`https://eliteprotech-apis.zone.id/copilot?q=${encodeURIComponent(q)}`);
        if (res.data.success) reply(res.data.text);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// GPT-3.5 Turbo (Base Model)
cmd({
    pattern: "gpt",
    desc: "Chat with GPT-3.5 AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .gpt Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// GPT-4
cmd({
    pattern: "gpt4",
    desc: "Chat with GPT-4 AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .gpt4 Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// GPT-4o
cmd({
    pattern: "gpt4o",
    desc: "Chat with GPT-4o AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .gpt4o Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// ChatGPT
cmd({
    pattern: "chatgpt",
    desc: "Chat with ChatGPT AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .chatgpt Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Claude AI
cmd({
    pattern: "claude",
    desc: "Chat with Claude AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .claude Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Gemini AI
cmd({
    pattern: "gemini",
    desc: "Chat with Google Gemini AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .gemini Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gemini?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Kimi AI
cmd({
    pattern: "kimi",
    desc: "Chat with Kimi AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .kimi Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/kimi?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Perplexity AI
cmd({
    pattern: "perplexity",
    desc: "Chat with Perplexity AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .perplexity Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/perplexity?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Llama 2
cmd({
    pattern: "llama2",
    desc: "Chat with Llama 2 AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .llama2 Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Llama 3
cmd({
    pattern: "llama3",
    desc: "Chat with Llama 3 AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .llama3 Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Mistral AI
cmd({
    pattern: "mistral",
    desc: "Chat with Mistral AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .mistral Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Mixtral AI
cmd({
    pattern: "mixtral",
    desc: "Chat with Mixtral AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .mixtral Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Falcon AI
cmd({
    pattern: "falcon",
    desc: "Chat with Falcon AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .falcon Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Bloom AI
cmd({
    pattern: "bloom",
    desc: "Chat with Bloom AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .bloom Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Orca AI
cmd({
    pattern: "orca",
    desc: "Chat with Orca AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .orca Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Vicuna AI
cmd({
    pattern: "vicuna",
    desc: "Chat with Vicuna AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .vicuna Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Alpaca AI
cmd({
    pattern: "alpaca",
    desc: "Chat with Alpaca AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .alpaca Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Phi-2
cmd({
    pattern: "phi2",
    desc: "Chat with Phi-2 AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .phi2 Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// WizardCoder
cmd({
    pattern: "wizard",
    desc: "Chat with WizardCoder AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .wizard Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// CodeT5
cmd({
    pattern: "codet5",
    desc: "Chat with CodeT5 AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .codet5 Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Starlin AI
cmd({
    pattern: "starlin",
    desc: "Chat with Starlin AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .starlin Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// DeepSeek
cmd({
    pattern: "deepseek",
    desc: "Chat with DeepSeek AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .deepseek Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// DeepSeek Coder
cmd({
    pattern: "deepseekcoder",
    desc: "Chat with DeepSeek Coder AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .deepseekcoder Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Yi AI
cmd({
    pattern: "yi",
    desc: "Chat with Yi AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .yi Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Yi-34B
cmd({
    pattern: "yi34b",
    desc: "Chat with Yi-34B AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .yi34b Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Qwen AI
cmd({
    pattern: "qwen",
    desc: "Chat with Qwen AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .qwen Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Command AI
cmd({
    pattern: "command",
    desc: "Chat with Command AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .command Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Jurassic AI
cmd({
    pattern: "jurassic",
    desc: "Chat with Jurassic AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .jurassic Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// AI21 Labs
cmd({
    pattern: "ai21",
    desc: "Chat with AI21 Labs AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .ai21 Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Solar AI
cmd({
    pattern: "solar",
    desc: "Chat with Solar AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .solar Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Lumin AI
cmd({
    pattern: "lumin",
    desc: "Chat with Lumin AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .lumin Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Grok Beta
cmd({
    pattern: "grokbeta",
    desc: "Chat with Grok Beta AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .grokbeta Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Bard AI
cmd({
    pattern: "bard",
    desc: "Chat with Google Bard AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .bard Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// RedPajama
cmd({
    pattern: "redpajama",
    desc: "Chat with RedPajama AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .redpajama Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Dolly AI
cmd({
    pattern: "dolly",
    desc: "Chat with Dolly AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .dolly Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Codex
cmd({
    pattern: "codex",
    desc: "Chat with Codex AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .codex Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Copilot
cmd({
    pattern: "copilot",
    desc: "Chat with Copilot AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .copilot Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// HuggingChat
cmd({
    pattern: "hugging",
    desc: "Chat with HuggingChat AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .hugging Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// OpenAssistant
cmd({
    pattern: "openassist",
    desc: "Chat with OpenAssistant AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .openassist Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// GPT-Neo
cmd({
    pattern: "gptneo",
    desc: "Chat with GPT-Neo AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .gptneo Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// GPT-J
cmd({
    pattern: "gptj",
    desc: "Chat with GPT-J AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .gptj Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// BLOOMZ
cmd({
    pattern: "bloomz",
    desc: "Chat with BLOOMZ AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .bloomz Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// FLAN-T5
cmd({
    pattern: "flant5",
    desc: "Chat with FLAN-T5 AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .flant5 Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// CodeGen
cmd({
    pattern: "codegen",
    desc: "Chat with CodeGen AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .codegen Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// StarCoder
cmd({
    pattern: "starcoder",
    desc: "Chat with StarCoder AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .starcoder Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// GPT-3 (Legacy)
cmd({
    pattern: "gpt3",
    desc: "Chat with GPT-3 AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .gpt3 Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// ChatGPT Plus
cmd({
    pattern: "chatgptplus",
    desc: "Chat with ChatGPT Plus AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .chatgptplus Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// GPT-4 Turbo
cmd({
    pattern: "gpt4turbo",
    desc: "Chat with GPT-4 Turbo AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .gpt4turbo Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Claude Instant
cmd({
    pattern: "claudeinstant",
    desc: "Chat with Claude Instant AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .claudeinstant Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Claude 2
cmd({
    pattern: "claude2",
    desc: "Chat with Claude 2 AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .claude2 Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// PaLM 2
cmd({
    pattern: "palm2",
    desc: "Chat with PaLM 2 AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .palm2 Your question");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// MathGPT (Special for math problems)
cmd({
    pattern: "mathgpt",
    desc: "Solve math problems with MathGPT",
    category: "ai",
    react: "🧮",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .mathgpt Your math problem");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});

// Grammar Checker
cmd({
    pattern: "grammar",
    desc: "Check grammar and spelling",
    category: "ai",
    react: "📝",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ *Usage:* .grammar Your text to check");
    try {
        const res = await axios.get(`https://api.nexray.eu.cc/ai/grammar?text=${encodeURIComponent(q)}`);
        if (res.data.status) reply(res.data.result);
        else reply("❌ API Error.");
    } catch (e) { reply("❌ Failed to connect to API."); }
});
