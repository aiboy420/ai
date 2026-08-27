// plugins/converter.js - ESM Version
import { fileURLToPath } from 'url';
import converter from '../lib/converter.js';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

// Convert sticker to image
cmd({
    pattern: 'convert',
    alias: ['sticker2img', 'stoimg', 'stickertoimage', 's2i'],
    desc: 'Convert stickers to images',
    category: 'utility',
    react: '🖼️',
    filename: __filename
}, async (client, match, message, { from }) => {
    if (!message.quoted) {
        return await client.sendMessage(from, {
            text: "✨ *Sticker Converter*\n\nPlease reply to a sticker message\n\nExample: `.convert` (reply to sticker)"
        }, { quoted: message });
    }

    if (message.quoted.mtype !== 'stickerMessage') {
        return await client.sendMessage(from, {
            text: "❌ Only sticker messages can be converted"
        }, { quoted: message });
    }

    await client.sendMessage(from, { react: { text: '⏳', key: message.key } });

    try {
        const stickerBuffer = await message.quoted.download();
        const imageBuffer = await converter.stickerToImage(stickerBuffer);

        await client.sendMessage(from, {
            image: imageBuffer,
            mimetype: 'image/png'
        }, { quoted: message });

        await client.sendMessage(from, { react: { text: '✅', key: message.key } });

    } catch (error) {
        console.error('Conversion error:', error);
        await client.sendMessage(from, {
            text: "❌ Please try with a different sticker."
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '❌', key: message.key } });
    }
});

// Convert to MP3 (15 minutes limit, lowest quality)
cmd({
    pattern: 'tomp3',
    alias: ['mp3', 'audio'],
    desc: 'Convert media to audio (max 15 minutes)',
    category: 'audio',
    react: '🎵',
    filename: __filename
}, async (client, match, message, { from }) => {
    try {
        if (!match.quoted) {
            return await client.sendMessage(from, {
                text: "*🔊 Please reply to a video/audio message*"
            }, { quoted: message });
        }

        if (!['videoMessage', 'audioMessage'].includes(match.quoted.mtype)) {
            return await client.sendMessage(from, {
                text: "❌ Only video/audio messages can be converted"
            }, { quoted: message });
        }

        if (match.quoted.seconds > 900) {
            return await client.sendMessage(from, {
                text: "⏱️ Media too long (max 15 minutes)"
            }, { quoted: message });
        }

        await client.sendMessage(from, { react: { text: '⏳', key: message.key } });

        const buffer = await match.quoted.download();
        const ext = match.quoted.mtype === 'videoMessage' ? 'mp4' : 'm4a';
        const audio = await converter.toAudio(buffer, ext);

        await client.sendMessage(from, {
            audio: audio,
            mimetype: 'audio/mpeg'
        }, { quoted: message });
        
        await client.sendMessage(from, { react: { text: '✅', key: message.key } });

    } catch (e) {
        console.error('Conversion error:', e.message);
        await client.sendMessage(from, {
            text: "❌ Failed to process audio"
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '❌', key: message.key } });
    }
});

// Convert to PTT (15 minutes limit, optimized voice)
cmd({
    pattern: 'toptt',
    alias: ['voice', 'tovoice'],
    desc: 'Convert media to voice message (max 15 minutes)',
    category: 'audio',
    react: '🎙️',
    filename: __filename
}, async (client, match, message, { from }) => {
    if (!match.quoted) {
        return await client.sendMessage(from, {
            text: "*🗣️ Please reply to a video/audio message*"
        }, { quoted: message });
    }

    if (!['videoMessage', 'audioMessage'].includes(match.quoted.mtype)) {
        return await client.sendMessage(from, {
            text: "❌ Only video/audio messages can be converted"
        }, { quoted: message });
    }

    if (match.quoted.seconds > 900) {
        return await client.sendMessage(from, {
            text: "⏱️ Media too long for voice (max 15 minutes)"
        }, { quoted: message });
    }

    await client.sendMessage(from, { react: { text: '⏳', key: message.key } });

    try {
        const buffer = await match.quoted.download();
        const ext = match.quoted.mtype === 'videoMessage' ? 'mp4' : 'm4a';
        const ptt = await converter.toPTT(buffer, ext);

        await client.sendMessage(from, {
            audio: ptt,
            mimetype: 'audio/ogg; codecs=opus',
            ptt: true
        }, { quoted: message });

        await client.sendMessage(from, { react: { text: '✅', key: message.key } });

    } catch (e) {
        console.error('PTT conversion error:', e.message);
        await client.sendMessage(from, {
            text: "❌ Failed to create voice message"
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '❌', key: message.key } });
    }
});
