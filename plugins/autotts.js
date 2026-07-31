// autotts.js - Auto TTS Voice Note Plugin (Clean & Optimized)
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONFIGURATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const GREETINGS = ['hi','hello','hey','good morning','good afternoon','good evening','good night','bye','assalamualaikum','salam','allah hafiz','khuda hafiz'];
const COOLDOWN_TIME = 60000;
const TTS_LANGUAGES = ['ur', 'hi', 'en'];
const userCooldowns = new Map();
let cleanupInterval = null;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HELPER FUNCTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function isGreeting(text) {
    if (!text) return false;
    const lower = text.toLowerCase().trim();
    return GREETINGS.some(g => lower === g || lower.startsWith(g + ' '));
}

function getResponse(text, name) {
    const responses = {
        'hi': `Assalamu Alaikum ${name}!`,
        'hello': `Assalamu Alaikum ${name}!`,
        'hey': `Assalamu Alaikum ${name}!`,
        'good morning': `Subah Bakhair ${name}!`,
        'good afternoon': `Dopahar Bakhair ${name}!`,
        'good evening': `Sham Bakhair ${name}!`,
        'good night': `Shab Bakhair ${name}!`,
        'bye': `Allah Hafiz ${name}!`,
        'assalamualaikum': `Wa Alaikum Assalam ${name}!`,
        'salam': `Wa Alaikum Assalam ${name}!`,
        'allah hafiz': `Allah Hafiz ${name}!`,
        'khuda hafiz': `Allah Hafiz ${name}!`
    };
    const lower = text.toLowerCase().trim();
    for (const [key, val] of Object.entries(responses)) {
        if (lower.includes(key) || key.includes(lower)) return val;
    }
    return `Assalamu Alaikum ${name}!`;
}

async function generateTTS(text) {
    for (const lang of TTS_LANGUAGES) {
        try {
            const { default: googleTTS } = await import('google-tts-api');
            const url = googleTTS.getAudioUrl(text, { lang, slow: false, host: 'https://translate.google.com' });
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return Buffer.from(await res.arrayBuffer());
        } catch (e) {
            continue;
        }
    }
    return null;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN HANDLER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({ on: "body" }, async (conn, mek, m, { from, sender, body, pushname }) => {
    if (!body || !isGreeting(body)) return;
    
    const userId = sender || from;
    const now = Date.now();
    
    if (userCooldowns.has(userId) && (now - userCooldowns.get(userId)) < COOLDOWN_TIME) return;
    userCooldowns.set(userId, now);
    
    const name = pushname || userId.split('@')[0] || 'User';
    const text = getResponse(body, name);
    const audio = await generateTTS(text);
    
    if (audio) {
        await conn.sendMessage(from, { audio, mimetype: 'audio/mpeg', ptt: false }, { quoted: m });
        console.log(`🎤 TTS: ${userId} -> "${body}"`);
    }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COOLDOWN CLEANUP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, time] of userCooldowns) {
        if (now - time > 300000) userCooldowns.delete(key);
    }
}, 300000);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STATUS COMMAND (Hidden)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: "ttsstatus",
    desc: "TTS System Status",
    category: "owner",
    react: "📊",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, isCreator, reply }) => {
    if (!isCreator) return;
    reply(`📊 *TTS Status*\n• Active: ${userCooldowns.size}\n• Greetings: ${GREETINGS.length}\n• Languages: ${TTS_LANGUAGES.join(', ')}`);
});

console.log("✅ Auto TTS Loaded");
