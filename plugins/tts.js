// plugins/tts.js - ESM Version
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import googleTTS from 'google-tts-api';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "tts",
    desc: "Convert text to speech",
    category: "download",
    react: "💀",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("Need some text.");
        
        const url = googleTTS.getAudioUrl(q, {
            lang: 'hi-IN',
            slow: false,
            host: 'https://translate.google.com',
        });
        
        await conn.sendMessage(from, { 
            audio: { url: url }, 
            mimetype: 'audio/mpeg', 
            ptt: false 
        }, { quoted: mek });
        
    } catch (a) {
        reply(`${a}`);
    }
});
