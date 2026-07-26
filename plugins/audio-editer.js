import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import audioEditor from '../lib/audioediter.js';

const __filename = fileURLToPath(import.meta.url);

// BASS EFFECT
cmd({
    pattern: 'bass',
    alias: ['bassboost'],
    desc: 'Add heavy bass boost to audio',
    category: 'audio',
    react: '🔊',
    filename: __filename
}, async (client, match, message, { from }) => {
    if (!message.quoted || !['audioMessage', 'videoMessage'].includes(message.quoted.mtype)) {
        return await client.sendMessage(from, {
            text: "*🔊 Reply to an audio/video message*"
        }, { quoted: message });
    }

    await client.sendMessage(from, { react: { text: '⏳', key: message.key } });
    
    try {
        const buffer = await message.quoted.download();
        const ext = message.quoted.mtype === 'videoMessage' ? 'mp4' : 'mp3';
        const audio = await audioEditor.bass(buffer, ext);

        await client.sendMessage(from, {
            audio: audio,
            mimetype: 'audio/mpeg'
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '✅', key: message.key } });
    } catch (e) {
        console.error('Error:', e);
        await client.sendMessage(from, {
            text: "❌ Failed to process audio"
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '❌', key: message.key } });
    }
});

// DEEP EFFECT
cmd({
    pattern: 'deep',
    desc: 'Make audio sound deeper',
    category: 'audio',
    react: '🗣️',
    filename: __filename
}, async (client, match, message, { from }) => {
    if (!message.quoted || !['audioMessage', 'videoMessage'].includes(message.quoted.mtype)) {
        return await client.sendMessage(from, {
            text: "*🔊 Reply to an audio/video message*"
        }, { quoted: message });
    }

    await client.sendMessage(from, { react: { text: '⏳', key: message.key } });
    
    try {
        const buffer = await message.quoted.download();
        const ext = message.quoted.mtype === 'videoMessage' ? 'mp4' : 'mp3';
        const audio = await audioEditor.deep(buffer, ext);

        await client.sendMessage(from, {
            audio: audio,
            mimetype: 'audio/mpeg'
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '✅', key: message.key } });
    } catch (e) {
        console.error('Error:', e);
        await client.sendMessage(from, {
            text: "❌ Failed to process audio"
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '❌', key: message.key } });
    }
});

// SMOOTH EFFECT
cmd({
    pattern: 'smooth',
    desc: 'Smooth out audio',
    category: 'audio',
    react: '🌀',
    filename: __filename
}, async (client, match, message, { from }) => {
    if (!message.quoted || !['audioMessage', 'videoMessage'].includes(message.quoted.mtype)) {
        return await client.sendMessage(from, {
            text: "*🔊 Reply to an audio/video message*"
        }, { quoted: message });
    }

    await client.sendMessage(from, { react: { text: '⏳', key: message.key } });
    
    try {
        const buffer = await message.quoted.download();
        const ext = message.quoted.mtype === 'videoMessage' ? 'mp4' : 'mp3';
        const audio = await audioEditor.smooth(buffer, ext);

        await client.sendMessage(from, {
            audio: audio,
            mimetype: 'audio/mpeg'
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '✅', key: message.key } });
    } catch (e) {
        console.error('Error:', e);
        await client.sendMessage(from, {
            text: "❌ Failed to process audio"
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '❌', key: message.key } });
    }
});

// FAT EFFECT
cmd({
    pattern: 'fat',
    desc: 'Make audio sound fat/bassy',
    category: 'audio',
    react: '🍔',
    filename: __filename
}, async (client, match, message, { from }) => {
    if (!message.quoted || !['audioMessage', 'videoMessage'].includes(message.quoted.mtype)) {
        return await client.sendMessage(from, {
            text: "*🔊 Reply to an audio/video message*"
        }, { quoted: message });
    }

    await client.sendMessage(from, { react: { text: '⏳', key: message.key } });
    
    try {
        const buffer = await message.quoted.download();
        const ext = message.quoted.mtype === 'videoMessage' ? 'mp4' : 'mp3';
        const audio = await audioEditor.fat(buffer, ext);

        await client.sendMessage(from, {
            audio: audio,
            mimetype: 'audio/mpeg'
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '✅', key: message.key } });
    } catch (e) {
        console.error('Error:', e);
        await client.sendMessage(from, {
            text: "❌ Failed to process audio"
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '❌', key: message.key } });
    }
});

// TUPAI EFFECT
cmd({
    pattern: 'tupai',
    desc: 'Special tupai effect',
    category: 'audio',
    react: '🐿️',
    filename: __filename
}, async (client, match, message, { from }) => {
    if (!message.quoted || !['audioMessage', 'videoMessage'].includes(message.quoted.mtype)) {
        return await client.sendMessage(from, {
            text: "*🔊 Reply to an audio/video message*"
        }, { quoted: message });
    }

    await client.sendMessage(from, { react: { text: '⏳', key: message.key } });
    
    try {
        const buffer = await message.quoted.download();
        const ext = message.quoted.mtype === 'videoMessage' ? 'mp4' : 'mp3';
        const audio = await audioEditor.tupai(buffer, ext);

        await client.sendMessage(from, {
            audio: audio,
            mimetype: 'audio/mpeg'
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '✅', key: message.key } });
    } catch (e) {
        console.error('Error:', e);
        await client.sendMessage(from, {
            text: "❌ Failed to process audio"
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '❌', key: message.key } });
    }
});

// BLOWN EFFECT
cmd({
    pattern: 'blown',
    desc: 'Make audio sound blown out',
    category: 'audio',
    react: '💥',
    filename: __filename
}, async (client, match, message, { from }) => {
    if (!message.quoted || !['audioMessage', 'videoMessage'].includes(message.quoted.mtype)) {
        return await client.sendMessage(from, {
            text: "*🔊 Reply to an audio/video message*"
        }, { quoted: message });
    }

    await client.sendMessage(from, { react: { text: '⏳', key: message.key } });
    
    try {
        const buffer = await message.quoted.download();
        const ext = message.quoted.mtype === 'videoMessage' ? 'mp4' : 'mp3';
        const audio = await audioEditor.blown(buffer, ext);

        await client.sendMessage(from, {
            audio: audio,
            mimetype: 'audio/mpeg'
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '✅', key: message.key } });
    } catch (e) {
        console.error('Error:', e);
        await client.sendMessage(from, {
            text: "❌ Failed to process audio"
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '❌', key: message.key } });
    }
});

// RADIO EFFECT
cmd({
    pattern: 'radio',
    desc: 'Make audio sound like old radio',
    category: 'audio',
    react: '📻',
    filename: __filename
}, async (client, match, message, { from }) => {
    if (!message.quoted || !['audioMessage', 'videoMessage'].includes(message.quoted.mtype)) {
        return await client.sendMessage(from, {
            text: "*🔊 Reply to an audio/video message*"
        }, { quoted: message });
    }

    await client.sendMessage(from, { react: { text: '⏳', key: message.key } });
    
    try {
        const buffer = await message.quoted.download();
        const ext = message.quoted.mtype === 'videoMessage' ? 'mp4' : 'mp3';
        const audio = await audioEditor.radio(buffer, ext);

        await client.sendMessage(from, {
            audio: audio,
            mimetype: 'audio/mpeg'
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '✅', key: message.key } });
    } catch (e) {
        console.error('Error:', e);
        await client.sendMessage(from, {
            text: "❌ Failed to process audio"
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '❌', key: message.key } });
    }
});

// ROBOT EFFECT
cmd({
    pattern: 'robot',
    desc: 'Make audio sound robotic',
    category: 'audio',
    react: '🤖',
    filename: __filename
}, async (client, match, message, { from }) => {
    if (!message.quoted || !['audioMessage', 'videoMessage'].includes(message.quoted.mtype)) {
        return await client.sendMessage(from, {
            text: "*🔊 Reply to an audio/video message*"
        }, { quoted: message });
    }

    await client.sendMessage(from, { react: { text: '⏳', key: message.key } });
    
    try {
        const buffer = await message.quoted.download();
        const ext = message.quoted.mtype === 'videoMessage' ? 'mp4' : 'mp3';
        const audio = await audioEditor.robot(buffer, ext);

        await client.sendMessage(from, {
            audio: audio,
            mimetype: 'audio/mpeg'
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '✅', key: message.key } });
    } catch (e) {
        console.error('Error:', e);
        await client.sendMessage(from, {
            text: "❌ Failed to process audio"
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '❌', key: message.key } });
    }
});

// CHIPMUNK EFFECT
cmd({
    pattern: 'chipmunk',
    desc: 'Make audio sound high-pitched like chipmunk',
    category: 'audio',
    react: '🐿️',
    filename: __filename
}, async (client, match, message, { from }) => {
    if (!message.quoted || !['audioMessage', 'videoMessage'].includes(message.quoted.mtype)) {
        return await client.sendMessage(from, {
            text: "*🔊 Reply to an audio/video message*"
        }, { quoted: message });
    }

    await client.sendMessage(from, { react: { text: '⏳', key: message.key } });
    
    try {
        const buffer = await message.quoted.download();
        const ext = message.quoted.mtype === 'videoMessage' ? 'mp4' : 'mp3';
        const audio = await audioEditor.chipmunk(buffer, ext);

        await client.sendMessage(from, {
            audio: audio,
            mimetype: 'audio/mpeg'
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '✅', key: message.key } });
    } catch (e) {
        console.error('Error:', e);
        await client.sendMessage(from, {
            text: "❌ Failed to process audio"
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '❌', key: message.key } });
    }
});

// NIGHTCORE EFFECT
cmd({
    pattern: 'nightcore',
    alias: ['nc'],
    desc: 'Apply nightcore effect (fast + high pitch)',
    category: 'audio',
    react: '🎶',
    filename: __filename
}, async (client, match, message, { from }) => {
    if (!message.quoted || !['audioMessage', 'videoMessage'].includes(message.quoted.mtype)) {
        return await client.sendMessage(from, {
            text: "*🔊 Reply to an audio/video message*"
        }, { quoted: message });
    }

    await client.sendMessage(from, { react: { text: '⏳', key: message.key } });
    
    try {
        const buffer = await message.quoted.download();
        const ext = message.quoted.mtype === 'videoMessage' ? 'mp4' : 'mp3';
        const audio = await audioEditor.nightcore(buffer, ext);

        await client.sendMessage(from, {
            audio: audio,
            mimetype: 'audio/mpeg'
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '✅', key: message.key } });
    } catch (e) {
        console.error('Error:', e);
        await client.sendMessage(from, {
            text: "❌ Failed to process audio"
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '❌', key: message.key } });
    }
});

// EARRAPE EFFECT
cmd({
    pattern: 'earrape',
    alias: ['maxvolume'],
    desc: 'Max volume (use with caution)',
    category: 'audio',
    react: '📢',
    filename: __filename
}, async (client, match, message, { from }) => {
    if (!message.quoted || !['audioMessage', 'videoMessage'].includes(message.quoted.mtype)) {
        return await client.sendMessage(from, {
            text: "*🔊 Reply to an audio/video message*"
        }, { quoted: message });
    }

    await client.sendMessage(from, { react: { text: '⏳', key: message.key } });
    
    try {
        const buffer = await message.quoted.download();
        const ext = message.quoted.mtype === 'videoMessage' ? 'mp4' : 'mp3';
        const audio = await audioEditor.earrape(buffer, ext);

        await client.sendMessage(from, {
            audio: audio,
            mimetype: 'audio/mpeg'
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '✅', key: message.key } });
    } catch (e) {
        console.error('Error:', e);
        await client.sendMessage(from, {
            text: "❌ Failed to process audio"
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '❌', key: message.key } });
    }
});

// REVERSE EFFECT
cmd({
    pattern: 'reverse',
    desc: 'Reverse audio playback',
    category: 'audio',
    react: '⏪',
    filename: __filename
}, async (client, match, message, { from }) => {
    if (!message.quoted || !['audioMessage', 'videoMessage'].includes(message.quoted.mtype)) {
        return await client.sendMessage(from, {
            text: "*🔊 Reply to an audio/video message*"
        }, { quoted: message });
    }

    await client.sendMessage(from, { react: { text: '⏳', key: message.key } });
    
    try {
        const buffer = await message.quoted.download();
        const ext = message.quoted.mtype === 'videoMessage' ? 'mp4' : 'mp3';
        const audio = await audioEditor.reverse(buffer, ext);

        await client.sendMessage(from, {
            audio: audio,
            mimetype: 'audio/mpeg'
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '✅', key: message.key } });
    } catch (e) {
        console.error('Error:', e);
        await client.sendMessage(from, {
            text: "❌ Failed to process audio"
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '❌', key: message.key } });
    }
});

// SLOW EFFECT
cmd({
    pattern: 'slow',
    desc: 'Slow down audio',
    category: 'audio',
    react: '🐌',
    filename: __filename
}, async (client, match, message, { from }) => {
    if (!message.quoted || !['audioMessage', 'videoMessage'].includes(message.quoted.mtype)) {
        return await client.sendMessage(from, {
            text: "*🔊 Reply to an audio/video message*"
        }, { quoted: message });
    }

    await client.sendMessage(from, { react: { text: '⏳', key: message.key } });
    
    try {
        const buffer = await message.quoted.download();
        const ext = message.quoted.mtype === 'videoMessage' ? 'mp4' : 'mp3';
        const audio = await audioEditor.slow(buffer, ext);

        await client.sendMessage(from, {
            audio: audio,
            mimetype: 'audio/mpeg'
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '✅', key: message.key } });
    } catch (e) {
        console.error('Error:', e);
        await client.sendMessage(from, {
            text: "❌ Failed to process audio"
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '❌', key: message.key } });
    }
});

// FAST EFFECT
cmd({
    pattern: 'fast',
    desc: 'Speed up audio',
    category: 'audio',
    react: '⚡',
    filename: __filename
}, async (client, match, message, { from }) => {
    if (!message.quoted || !['audioMessage', 'videoMessage'].includes(message.quoted.mtype)) {
        return await client.sendMessage(from, {
            text: "*🔊 Reply to an audio/video message*"
        }, { quoted: message });
    }

    await client.sendMessage(from, { react: { text: '⏳', key: message.key } });
    
    try {
        const buffer = await message.quoted.download();
        const ext = message.quoted.mtype === 'videoMessage' ? 'mp4' : 'mp3';
        const audio = await audioEditor.fast(buffer, ext);

        await client.sendMessage(from, {
            audio: audio,
            mimetype: 'audio/mpeg'
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '✅', key: message.key } });
    } catch (e) {
        console.error('Error:', e);
        await client.sendMessage(from, {
            text: "❌ Failed to process audio"
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '❌', key: message.key } });
    }
});

// BABY EFFECT
cmd({
    pattern: 'baby',
    desc: 'Make audio sound like a baby',
    category: 'audio',
    react: '👶',
    filename: __filename
}, async (client, match, message, { from }) => {
    if (!message.quoted || !['audioMessage', 'videoMessage'].includes(message.quoted.mtype)) {
        return await client.sendMessage(from, {
            text: "*🔊 Reply to an audio/video message*"
        }, { quoted: message });
    }

    await client.sendMessage(from, { react: { text: '⏳', key: message.key } });
    
    try {
        const buffer = await message.quoted.download();
        const ext = message.quoted.mtype === 'videoMessage' ? 'mp4' : 'mp3';
        const audio = await audioEditor.baby(buffer, ext);

        await client.sendMessage(from, {
            audio: audio,
            mimetype: 'audio/mpeg'
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '✅', key: message.key } });
    } catch (e) {
        console.error('Error:', e);
        await client.sendMessage(from, {
            text: "❌ Failed to process audio"
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '❌', key: message.key } });
    }
});

// DEMON EFFECT
cmd({
    pattern: 'demon',
    desc: 'Make audio sound demonic',
    category: 'audio',
    react: '👹',
    filename: __filename
}, async (client, match, message, { from }) => {
    if (!message.quoted || !['audioMessage', 'videoMessage'].includes(message.quoted.mtype)) {
        return await client.sendMessage(from, {
            text: "*🔊 Reply to an audio/video message*"
        }, { quoted: message });
    }

    await client.sendMessage(from, { react: { text: '⏳', key: message.key } });
    
    try {
        const buffer = await message.quoted.download();
        const ext = message.quoted.mtype === 'videoMessage' ? 'mp4' : 'mp3';
        const audio = await audioEditor.demon(buffer, ext);

        await client.sendMessage(from, {
            audio: audio,
            mimetype: 'audio/mpeg'
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '✅', key: message.key } });
    } catch (e) {
        console.error('Error:', e);
        await client.sendMessage(from, {
            text: "❌ Failed to process audio"
        }, { quoted: message });
        await client.sendMessage(from, { react: { text: '❌', key: message.key } });
    }
});
