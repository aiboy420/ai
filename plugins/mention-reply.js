// plugins/mention.js - ESM Version
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import config from '../config.js';
import converter from '../lib/converter.js';

const __filename = fileURLToPath(import.meta.url);

// VoiceClip urls
const voiceClips = [
    'https://files.catbox.moe/pw4yuu.mp3',
    'https://files.catbox.moe/tuueyw.mp3',
    'https://files.catbox.moe/q56rza.mp3',
    'https://files.catbox.moe/ldrebe.mp3',
    'https://files.catbox.moe/cpjqjd.mp3',
    'https://files.catbox.moe/v5c4fd.mp3',
    'https://files.catbox.moe/naub62.mp3',
    'https://files.catbox.moe/ez7wvh.mp3',
    'https://files.catbox.moe/3ruryr.mp3',
    'https://files.catbox.moe/vxfry5.mp3',
    'https://files.catbox.moe/hk2fjw.mp3',
    'https://files.catbox.moe/pvymqf.mp3',
    'https://files.catbox.moe/md2jm5.mp3',
    'https://files.catbox.moe/ypx92a.mp3',
    'https://files.catbox.moe/7tv2do.mp3',
    'https://files.catbox.moe/sr8k3y.mp3'
];

// Fixed delay of 3 seconds
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 1. Auto reply when bot is mentioned in group
cmd({
    on: "body"
}, async (conn, m, store, { isGroup, botNumber2, userConfig }) => {
    try {
        const mek = m.mek || m;
        if (mek.key?.fromMe) return;

        // Get MENTION_REPLY from userConfig if available, otherwise use config.MENTION_REPLY
        const MENTION_REPLY = userConfig?.MENTION_REPLY || config.MENTION_REPLY || 'false';
        
        if (MENTION_REPLY !== 'true' || !isGroup || !botNumber2) return;

        const mentioned = m.mentionedJid || [];
        if (!mentioned.includes(botNumber2)) return;

        const chatId = m.chat;

        // Show recording animation
        await conn.sendPresenceUpdate('recording', chatId);

        // Select random clip
        const randomClip = voiceClips[Math.floor(Math.random() * voiceClips.length)];

        // Fetch audio
        const audioResponse = await fetch(randomClip);
        const arrayBuffer = await audioResponse.arrayBuffer();
        const audioBuffer = Buffer.from(arrayBuffer);

        // Fixed 3-second delay before converting
        await delay(3000);

        // Convert to PTT
        const pttAudio = await converter.toPTT(audioBuffer, 'mp3');

        // Send voice note
        await conn.sendMessage(chatId, {
            audio: pttAudio,
            mimetype: 'audio/ogg; codecs=opus',
            ptt: true
        }, { quoted: m });

    } catch (e) {
        console.error('Error in mention reply:', e);
    }
});

// 2. Command: .mee / .me
cmd({
    pattern: "mee",
    alias: ["me"],
    desc: "Send a random voice message",
    category: "other",
    react: "🎵",
    filename: __filename
}, async (conn, mek, m, { from, reply, userConfig }) => {
    try {
        const chatId = from;

        // Show recording animation
        await conn.sendPresenceUpdate('recording', chatId);

        // Select random clip
        const randomClip = voiceClips[Math.floor(Math.random() * voiceClips.length)];

        // Fetch audio
        const audioResponse = await fetch(randomClip);
        const arrayBuffer = await audioResponse.arrayBuffer();
        const audioBuffer = Buffer.from(arrayBuffer);

        // Fixed 3-second delay before converting
        await delay(3000);

        // Convert to PTT
        const pttAudio = await converter.toPTT(audioBuffer, 'mp3');

        // Send voice note
        await conn.sendMessage(chatId, {
            audio: pttAudio,
            mimetype: 'audio/ogg; codecs=opus',
            ptt: true
        }, { quoted: m });

    } catch (e) {
        console.error('Error in mention command:', e);
        await reply(`❌ Error: ${e.message}`);
    }
});