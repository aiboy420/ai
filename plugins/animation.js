// plugins/new-animations.js - ESM Version
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import { sleep } from '../lib/functions.js';

const __filename = fileURLToPath(import.meta.url);

// 1. EARTHQUAKE Animation
cmd({
    pattern: "earthquake",
    desc: "Earthquake shaking animation",
    category: "tools",
    react: "🌋",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🌍", "🌍💥", "🌎💥💥", "🌏💥💥💥", "🌋", "💀", "🏚️💔"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 2. TSUNAMI Animation
cmd({
    pattern: "tsunami",
    desc: "Tsunami wave animation",
    category: "tools",
    react: "🌊",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🌊", "🌊🌊", "🌊🌊🌊", "🏄", "🌊🌊🌊🌊", "💀"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 3. VOLCANO Animation
cmd({
    pattern: "volcano",
    desc: "Volcano eruption animation",
    category: "tools",
    react: "🌋",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🌋", "🌋💨", "🌋🔥", "🌋💥", "🌋🌋", "💀☠️"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 4. TORNADO Animation
cmd({
    pattern: "tornado",
    desc: "Tornado spinning animation",
    category: "tools",
    react: "🌪️",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["💨", "🌪️", "🌪️🌪️", "🌪️🌪️🌪️", "🏠💨", "💀"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(500);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 5. HURRICANE Animation
cmd({
    pattern: "hurricane",
    desc: "Hurricane storm animation",
    category: "tools",
    react: "🌀",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🌀", "🌀🌊", "🌀🌊💨", "🌀🌊💨⚡", "🌊🌊🌊", "💀"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 6. ALIEN Invasion
cmd({
    pattern: "alieninvasion",
    desc: "Alien invasion animation",
    category: "tools",
    react: "👽",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["👽", "👽🛸", "👽🛸🔫", "👽🛸🔫💥", "🏚️💥", "👽👑"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 7. ZOMBIE Apocalypse
cmd({
    pattern: "zombie",
    desc: "Zombie apocalypse animation",
    category: "tools",
    react: "🧟",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🧟", "🧟🧟", "🧟🧟🧟", "🏃💨", "🧟🧟🧟🧟", "💀☠️"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 8. VAMPIRE Animation
cmd({
    pattern: "vampire",
    desc: "Vampire transformation",
    category: "tools",
    react: "🧛",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🧛", "🧛🦷", "🧛🩸", "🧛🦇", "🧛🌙", "🧛👑"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 9. WEREWOLF Animation
cmd({
    pattern: "werewolf",
    desc: "Werewolf transformation",
    category: "tools",
    react: "🐺",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🐺", "🐺🌕", "🐺🌕💪", "🐺🌕👑", "🐺🌕🔥"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 10. WIZARD Magic
cmd({
    pattern: "wizardmagic",
    desc: "Wizard casting spell",
    category: "tools",
    react: "🧙",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🧙", "🧙✨", "🧙✨🌟", "🧙✨🌟⭐", "🐸", "✨🎩"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 11. FAIRY Animation
cmd({
    pattern: "fairy",
    desc: "Fairy dust animation",
    category: "tools",
    react: "🧚",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🧚", "🧚✨", "🧚✨🌟", "🧚✨🌟💫", "🦋", "🌸"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(500);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 12. MERMAID Animation
cmd({
    pattern: "mermaid",
    desc: "Mermaid swimming",
    category: "tools",
    react: "🧜",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🧜", "🧜🌊", "🧜🌊🐠", "🧜🌊🐠🐟", "🧜🌊👑"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 13. DRAGON Fire
cmd({
    pattern: "dragonfire",
    desc: "Dragon breathing fire",
    category: "tools",
    react: "🐉",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🐉", "🐉🔥", "🐉🔥🔥", "🐉🔥🔥🔥", "🏰💥", "💀"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 14. PHOENIX Rising
cmd({
    pattern: "phoenix",
    desc: "Phoenix rebirth animation",
    category: "tools",
    react: "🔥",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["💀", "🔥", "🔥🔥", "🐦‍🔥", "🐦‍🔥✨", "🐦‍🔥👑"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 15. PEGASUS Flight
cmd({
    pattern: "pegasus",
    desc: "Pegasus flying animation",
    category: "tools",
    react: "🦄",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🦄", "🦄☁️", "🦄☁️✨", "🦄☁️✨⭐", "🌈", "🌟"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(500);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 16. CENTAUR Charge
cmd({
    pattern: "centaur",
    desc: "Centaur running animation",
    category: "tools",
    react: "🏹",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🧜‍♂️", "🏇", "🏇💨", "🏇💨🏹", "🏇💨🏹🎯", "👑"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(500);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 17. GRIFFIN Attack
cmd({
    pattern: "griffin",
    desc: "Griffin flying attack",
    category: "tools",
    react: "🦅",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🦅", "🦅🦁", "🦅🦁⚡", "🦅🦁⚡💥", "🏆"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 18. CYBORG Transformation
cmd({
    pattern: "cyborg",
    desc: "Cyborg transformation",
    category: "tools",
    react: "🦾",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🧑", "🧑⚙️", "🧑⚙️🔧", "🤖", "🤖⚡", "🦾🦿"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 19. NINJA Attack
cmd({
    pattern: "ninja",
    desc: "Ninja stealth attack",
    category: "tools",
    react: "🥷",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🥷", "🥷💨", "🥷⚔️", "🥷⚔️💥", "🎯", "👑"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(500);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 20. SAMURAI Duel
cmd({
    pattern: "samurai",
    desc: "Samurai sword fight",
    category: "tools",
    react: "⚔️",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🗡️", "⚔️", "⚔️💥", "⚔️💥🔥", "🏆", "🎌"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 21. VIKING Raid
cmd({
    pattern: "viking",
    desc: "Viking raid animation",
    category: "tools",
    react: "🛡️",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🛡️", "⚔️🛡️", "⛵", "⛵⚔️", "🏰💥", "👑"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 22. PIRATE Ship
cmd({
    pattern: "pirate",
    desc: "Pirate ship battle",
    category: "tools",
    react: "🏴‍☠️",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🏴‍☠️", "⛵", "⛵⚔️", "⛵⚔️💥", "💰", "👑"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 23. KNIGHT Battle
cmd({
    pattern: "knight",
    desc: "Knight in shining armor",
    category: "tools",
    react: "🏇",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🏇", "🛡️", "⚔️🛡️", "⚔️🛡️💥", "👑", "🏆"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(500);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 24. GLADIATOR Fight
cmd({
    pattern: "gladiator",
    desc: "Gladiator arena fight",
    category: "tools",
    react: "🏟️",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🏟️", "⚔️", "⚔️🛡️", "⚔️🛡️💥", "👑", "🏆"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 25. SPARTAN Warrior
cmd({
    pattern: "spartan",
    desc: "Spartan warrior battle",
    category: "tools",
    react: "🛡️",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🛡️", "⚔️🛡️", "⚔️🛡️💥", "THIS IS SPARTA!", "💀", "👑"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 26. EGYPTIAN Pharaoh
cmd({
    pattern: "pharaoh",
    desc: "Egyptian pharaoh animation",
    category: "tools",
    react: "𓂀",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["👑", "🐪", "🕌", "𓂀", "🔺", "💀☠️"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 27. MAYAN Calendar
cmd({
    pattern: "mayan",
    desc: "Mayan calendar end",
    category: "tools",
    react: "🗿",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🗿", "📅", "☀️", "🌑", "💥", "🌍💀"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 28. ATLANTIS Sinking
cmd({
    pattern: "atlantis",
    desc: "Atlantis sinking animation",
    category: "tools",
    react: "🏛️",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🏛️", "🏛️🌊", "🌊🌊🌊", "🏛️💨", "💀", "🌊👑"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 29. OLYMPUS Gods
cmd({
    pattern: "olympus",
    desc: "Greek gods animation",
    category: "tools",
    react: "⚡",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["⚡", "👑", "🏛️", "⚡⚡⚡", "🌩️", "🏆"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 30. VALHALLA Entry
cmd({
    pattern: "valhalla",
    desc: "Viking afterlife entry",
    category: "tools",
    react: "⚔️",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["⚔️", "🛡️", "💀", "🌈", "🏛️", "👑⚡"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 31. SHAMAN Ritual
cmd({
    pattern: "shaman",
    desc: "Shaman spiritual ritual",
    category: "tools",
    react: "🪶",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🪶", "🔥", "🥁", "🌀", "✨", "🕯️"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 32. WITCH Spell
cmd({
    pattern: "witchspell",
    desc: "Witch casting spell",
    category: "tools",
    react: "🧙‍♀️",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🧙‍♀️", "🧪", "🔮", "✨", "🐸", "🌙"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(500);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 33. NECROMANCER Undead
cmd({
    pattern: "necromancer",
    desc: "Necromancer raising dead",
    category: "tools",
    react: "💀",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["💀", "🔮", "💀💀", "💀💀💀", "🧟🧟🧟", "👑💀"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 34. ALCHEMIST Gold
cmd({
    pattern: "alchemist",
    desc: "Alchemist turning lead to gold",
    category: "tools",
    react: "⚗️",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["⚗️", "🧪", "🔮", "✨", "💰", "👑"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 35. MONK Meditation
cmd({
    pattern: "monk",
    desc: "Monk meditation animation",
    category: "tools",
    react: "🧘",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🧘", "🧘‍♂️", "🧘‍♂️✨", "🧘‍♂️🕉️", "🧘‍♂️🌟", "☮️"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 36. YOGI Flexibility
cmd({
    pattern: "yogi",
    desc: "Yogi yoga poses",
    category: "tools",
    react: "🧘‍♀️",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🧘", "🧘‍♀️", "🧘‍♀️🌿", "🧘‍♀️🌸", "🧘‍♀️✨", "☮️"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 37. GURU Wisdom
cmd({
    pattern: "guru",
    desc: "Guru giving wisdom",
    category: "tools",
    react: "🧘",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🧘", "🔮", "✨", "📿", "🕉️", "💡"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 38. SAGE Advice
cmd({
    pattern: "sage",
    desc: "Sage giving advice",
    category: "tools",
    react: "🧙",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🧙", "📜", "✨", "🔮", "💡", "🙏"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 39. MYSTIC Vision
cmd({
    pattern: "mystic",
    desc: "Mystic vision animation",
    category: "tools",
    react: "🔮",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🔮", "✨", "🌙", "⭐", "💫", "🕯️"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(500);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 40. ORACLE Prophecy
cmd({
    pattern: "oracle",
    desc: "Oracle prophecy animation",
    category: "tools",
    react: "🔮",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🔮", "📜", "✨", "🌙", "🔮✨", "💫"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 41. SORCERER Magic
cmd({
    pattern: "sorcerer",
    desc: "Sorcerer casting magic",
    category: "tools",
    react: "✨",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["✨", "🔮", "⚡", "💫", "🌟", "👑"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(500);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 42. ENCHANTER Spell
cmd({
    pattern: "enchanter",
    desc: "Enchanter enchanting items",
    category: "tools",
    react: "📿",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["📿", "✨", "🔮", "💫", "🌟", "⚡"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 43. CONJURER Summon
cmd({
    pattern: "conjurer",
    desc: "Conjurer summoning creatures",
    category: "tools",
    react: "🪄",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🪄", "✨", "🐉", "🦄", "🐲", "🌟"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 44. ILLUSIONIST Trick
cmd({
    pattern: "illusionist",
    desc: "Illusionist magic trick",
    category: "tools",
    react: "🎩",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🎩", "🐇", "✨", "🎩✨", "🐦", "🌟"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 45. DIVINER Future
cmd({
    pattern: "diviner",
    desc: "Diviner reading future",
    category: "tools",
    react: "🔮",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🔮", "✨", "🌙", "⭐", "💫", "📜"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(500);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 46. SEER Vision
cmd({
    pattern: "seer",
    desc: "Seer prophetic vision",
    category: "tools",
    react: "👁️",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["👁️", "🔮", "✨", "🌙", "💫", "📜"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 47. PROPHET Message
cmd({
    pattern: "prophet",
    desc: "Prophet delivering message",
    category: "tools",
    react: "📜",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["📜", "✨", "🔮", "🌟", "💫", "🙏"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 48. ASTRAL Projection
cmd({
    pattern: "astral",
    desc: "Astral projection animation",
    category: "tools",
    react: "🌌",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🧘", "✨", "🌌", "💫", "🌟", "🌙"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 49. MEDIUM Spirit
cmd({
    pattern: "medium",
    desc: "Medium contacting spirits",
    category: "tools",
    react: "👻",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["👻", "🔮", "✨", "🌙", "💫", "🕯️"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// 50. TELEPATH Mind
cmd({
    pattern: "telepath",
    desc: "Telepath mind reading",
    category: "tools",
    react: "🧠",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*This is an owner command.*");
        const frames = ["🧠", "⚡", "✨", "💭", "🔮", "💫"];
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });
        for (const frame of frames) {
            currentText = frame;
            await sleep(600);
            await conn.relayMessage(from, { protocolMessage: { key: sentMessage.key, type: 0xe, editedMessage: { conversation: currentText } } }, {});
        }
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});


// 1. CHUMI Command
cmd({
    pattern: "chumi",
    desc: "Displays kissing emoji animation",
    category: "tools",
    react: "💋",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return await conn.sendMessage(from, { text: "*This is an owner command.*" }, { quoted: mek });
        }

        const emojiMessages = [
            "🥵", "❤️", "💋", "😫", "🤤", 
            "😋", "🥵", "🥶", "🙊", "😻", 
            "🙈", "💋", "🫂", "🫀", "👅", 
            "👄", "💋"
        ];

        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });

        for (const line of emojiMessages) {
            currentText = line;
            await sleep(1000);
            const protocolMsg = {
                key: sentMessage.key,
                type: 0xe,
                editedMessage: { conversation: currentText }
            };
            await conn.relayMessage(from, { protocolMessage: protocolMsg }, {});
        }
    } catch (e) {
        reply(`❌ *Error!* ${e.message}`);
    }
});

// 2. LOADING Command
cmd({
    pattern: "loading",
    alias: ["load", "progress"],
    desc: "Displays a loading animation",
    category: "tools",
    react: "🔄",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return await conn.sendMessage(from, { text: "*This is an owner command.*" }, { quoted: mek });
        }

        const loadingFrames = [
            "🔄 *Loading...* ```[▱▱▱▱▱▱▱▱▱▱] 0%```",
            "🔄 *Loading...* ```[▰▱▱▱▱▱▱▱▱▱] 10%```",
            "🔄 *Loading...* ```[▰▰▱▱▱▱▱▱▱▱] 20%```",
            "🔄 *Loading...* ```[▰▰▰▱▱▱▱▱▱▱] 30%```",
            "🔄 *Loading...* ```[▰▰▰▰▱▱▱▱▱▱] 40%```",
            "🔄 *Loading...* ```[▰▰▰▰▰▱▱▱▱▱] 50%```",
            "🔄 *Loading...* ```[▰▰▰▰▰▰▱▱▱▱] 60%```",
            "🔄 *Loading...* ```[▰▰▰▰▰▰▰▱▱▱] 70%```",
            "🔄 *Loading...* ```[▰▰▰▰▰▰▰▰▱▱] 80%```",
            "🔄 *Loading...* ```[▰▰▰▰▰▰▰▰▰▱] 90%```",
            "🔄 *Loading...* ```[▰▰▰▰▰▰▰▰▰▰] 100%```",
            "✅ *Loading Complete!*"
        ];

        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });

        for (const frame of loadingFrames) {
            currentText = frame;
            await sleep(1000);
            const protocolMsg = {
                key: sentMessage.key,
                type: 0xe,
                editedMessage: { conversation: currentText }
            };
            await conn.relayMessage(from, { protocolMessage: protocolMsg }, {});
        }
    } catch (e) {
        reply(`❌ *Error!* ${e.message}`);
    }
});

// 3. COUNTDOWN Command
cmd({
    pattern: "cd",
    alias: ["cd", "timer"],
    desc: "Starts a countdown from 10 to 1",
    category: "tools",
    react: "⏰",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return await conn.sendMessage(from, { text: "*This is an owner command.*" }, { quoted: mek });
        }

        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });

        for (let i = 10; i >= 1; i--) {
            currentText = `⏰ *Countdown* ⏰\n\n🚀 ${i}...`;
            await sleep(1000);
            const protocolMsg = {
                key: sentMessage.key,
                type: 0xe,
                editedMessage: { conversation: currentText }
            };
            await conn.relayMessage(from, { protocolMessage: protocolMsg }, {});
        }

        currentText = "🎉 *Countdown Complete!* 🎉\n\n*Blast Off!* 🚀";
        const finalMsg = {
            key: sentMessage.key,
            type: 0xe,
            editedMessage: { conversation: currentText }
        };
        await conn.relayMessage(from, { protocolMessage: finalMsg }, {});
    } catch (e) {
        reply(`❌ *Error!* ${e.message}`);
    }
});

// 4. WEATHER Command
cmd({
    pattern: "wthr",
    alias: ["forecast"],
    desc: "Simulates weather animation",
    category: "tools",
    react: "🌤️",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return await conn.sendMessage(from, { text: "*This is an owner command.*" }, { quoted: mek });
        }

        const weatherFrames = [
            "🌤️ *Weather Update*\n\n☀️ Sunny day...",
            "🌤️ *Weather Update*\n\n⛅ Partly cloudy...",
            "🌤️ *Weather Update*\n\n🌥️ Clouds forming...",
            "🌤️ *Weather Update*\n\n☁️ Mostly cloudy...",
            "🌤️ *Weather Update*\n\n🌦️ Light rain starting...",
            "🌤️ *Weather Update*\n\n🌧️ Rain falling...",
            "🌤️ *Weather Update*\n\n⛈️ Thunderstorm!",
            "🌤️ *Weather Update*\n\n🌧️ Rain stopping...",
            "🌤️ *Weather Update*\n\n🌥️ Clouds clearing...",
            "🌤️ *Weather Update*\n\n🌤️ Back to sunny!",
            "✅ *Weather Report Complete!*"
        ];

        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });

        for (const frame of weatherFrames) {
            currentText = frame;
            await sleep(1500);
            const protocolMsg = {
                key: sentMessage.key,
                type: 0xe,
                editedMessage: { conversation: currentText }
            };
            await conn.relayMessage(from, { protocolMessage: protocolMsg }, {});
        }
    } catch (e) {
        reply(`❌ *Error!* ${e.message}`);
    }
});

// 5. TYPING Command
cmd({
    pattern: "type",
    alias: ["type", "writer"],
    desc: "Simulates typing animation",
    category: "tools",
    react: "⌨️",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return await conn.sendMessage(from, { text: "*This is an owner command.*" }, { quoted: mek });
        }

        const text = "Hello! This is a typing simulation...";
        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });

        for (let i = 0; i <= text.length; i++) {
            currentText = text.substring(0, i) + (i < text.length ? "▊" : "");
            await sleep(100);
            const protocolMsg = {
                key: sentMessage.key,
                type: 0xe,
                editedMessage: { conversation: currentText }
            };
            await conn.relayMessage(from, { protocolMessage: protocolMsg }, {});
        }

        await sleep(500);
        currentText = text + "\n\n✅ *Typing complete!*";
        const finalMsg = {
            key: sentMessage.key,
            type: 0xe,
            editedMessage: { conversation: currentText }
        };
        await conn.relayMessage(from, { protocolMessage: finalMsg }, {});
    } catch (e) {
        reply(`❌ *Error!* ${e.message}`);
    }
});

// 6. SPINNER Command
cmd({
    pattern: "spinner",
    alias: ["spin", "rotate"],
    desc: "Displays a spinning animation",
    category: "tools",
    react: "🌀",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return await conn.sendMessage(from, { text: "*This is an owner command.*" }, { quoted: mek });
        }

        const spinnerFrames = [
            "🌀 *Spinning...* ⬆️",
            "🌀 *Spinning...* ↗️",
            "🌀 *Spinning...* ➡️",
            "🌀 *Spinning...* ↘️",
            "🌀 *Spinning...* ⬇️",
            "🌀 *Spinning...* ↙️",
            "🌀 *Spinning...* ⬅️",
            "🌀 *Spinning...* ↖️"
        ];

        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });

        // Repeat the spinner 3 times
        for (let round = 0; round < 3; round++) {
            for (const frame of spinnerFrames) {
                currentText = frame;
                await sleep(300);
                const protocolMsg = {
                    key: sentMessage.key,
                    type: 0xe,
                    editedMessage: { conversation: currentText }
                };
                await conn.relayMessage(from, { protocolMessage: protocolMsg }, {});
            }
        }

        currentText = "✅ *Spinning Complete!* 🎯";
        const finalMsg = {
            key: sentMessage.key,
            type: 0xe,
            editedMessage: { conversation: currentText }
        };
        await conn.relayMessage(from, { protocolMessage: finalMsg }, {});
    } catch (e) {
        reply(`❌ *Error!* ${e.message}`);
    }
});

// 7. ROCKET Command
cmd({
    pattern: "rocket",
    alias: ["launch", "blastoff"],
    desc: "Rocket launch animation",
    category: "tools",
    react: "🚀",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return await conn.sendMessage(from, { text: "*This is an owner command.*" }, { quoted: mek });
        }

        const rocketFrames = [
            "🚀 *Rocket Launch Sequence Initiated*\n\n🔧 Systems check...",
            "🚀 *Rocket Launch Sequence*\n\n⛽ Fuel loading... ```[▰▱▱▱▱] 20%```",
            "🚀 *Rocket Launch Sequence*\n\n⛽ Fuel loading... ```[▰▰▰▱▱] 60%```",
            "🚀 *Rocket Launch Sequence*\n\n⛽ Fuel loading... ```[▰▰▰▰▰] 100%```",
            "🚀 *Rocket Launch Sequence*\n\n🎯 Navigation systems online",
            "🚀 *Rocket Launch Sequence*\n\n🔬 Pre-launch diagnostics...",
            "🚀 *Launch Countdown*\n\n3...",
            "🚀 *Launch Countdown*\n\n2...",
            "🚀 *Launch Countdown*\n\n1...",
            "🚀 *LIFTOFF!* 🎉\n\n          ✨\n          ▲\n         / \\\n        /   \\\n       /🚀   \\\n      /       \\\n     /         \\",
            "🚀 *Ascending...*\n\n          ✨\n          ▲\n         / \\\n        /   \\\n       /     \\\n      / 🚀   \\\n     /        \\",
            "🚀 *Entering Orbit...*\n\n          ▲\n         / \\\n        /   \\\n       /     \\\n      /       \\\n     /   🚀   \\",
            "🚀 *Mission Successful!*\n\n🌍 Rocket has reached orbit!\n✨ Mission accomplished!"
        ];

        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });

        for (const frame of rocketFrames) {
            currentText = frame;
            await sleep(1500);
            const protocolMsg = {
                key: sentMessage.key,
                type: 0xe,
                editedMessage: { conversation: currentText }
            };
            await conn.relayMessage(from, { protocolMessage: protocolMsg }, {});
        }
    } catch (e) {
        reply(`❌ *Launch failed!* ${e.message}`);
    }
});

// 8. CLOCK Command
cmd({
    pattern: "clock",
    desc: "Analog clock animation showing time passing",
    category: "tools",
    react: "⏰",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return await conn.sendMessage(from, { text: "*This is an owner command.*" }, { quoted: mek });
        }

        const clockFrames = [
            "⏰ *3:00*\n\n     🕒\n   /    \\\n  /      \\\n |    •   |\n  \\      /\n   \\____/",
            "⏰ *3:15*\n\n     🕒\n   /    \\\n  /      \\\n |   ➚•  |\n  \\      /\n   \\____/",
            "⏰ *3:30*\n\n     🕒\n   /    \\\n  /      \\\n |    ➚  |\n  \\  •  /\n   \\____/",
            "⏰ *3:45*\n\n     🕒\n   /    \\\n  /      \\\n |  •➚   |\n  \\      /\n   \\____/",
            "⏰ *4:00*\n\n     🕓\n   /    \\\n  /      \\\n |    •   |\n  \\      /\n   \\____/",
            "⏰ *4:15*\n\n     🕓\n   /    \\\n  /      \\\n |   ➚•  |\n  \\      /\n   \\____/",
            "⏰ *4:30*\n\n     🕓\n   /    \\\n  /      \\\n |    ➚  |\n  \\  •  /\n   \\____/",
            "⏰ *4:45*\n\n     🕓\n   /    \\\n  /      \\\n |  •➚   |\n  \\      /\n   \\____/",
            "⏰ *5:00*\n\n     🕔\n   /    \\\n  /      \\\n |    •   |\n  \\      /\n   \\____/",
            "⏰ *Time Animation Complete!*\n\n⏳ 2 hours have passed in animation!"
        ];

        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });

        for (const frame of clockFrames) {
            currentText = frame;
            await sleep(1200);
            const protocolMsg = {
                key: sentMessage.key,
                type: 0xe,
                editedMessage: { conversation: currentText }
            };
            await conn.relayMessage(from, { protocolMessage: protocolMsg }, {});
        }
    } catch (e) {
        reply(`❌ *Clock stopped!* ${e.message}`);
    }
});

// 9. FING Command
cmd({
    pattern: "fing",
    alias: ['fingering', 'hath', 'ungli', 'touch', 'moan'],
    desc: "Funny girl animation (owner only)",
    category: "tools",
    react: "👅",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return await conn.sendMessage(from, { text: "*This is an owner command.*" }, { quoted: mek });
        }

        const animationFrames = [
            "👆🏻------🍑", 
            "👆🏻-----🍑", 
            "👆🏻----🍑", 
            "👆🏻---🍑", 
            "👆🏻--🍑", 
            "👆🏻-🍑", 
            "👆🏻🍑", 
            "👉🏻🍑", 
            "👉🏻💦🍑", 
            "👉🏻💦💦🍑", 
            "👉🏻💦💦💦🍑", 
            "💦🍑💦 *Awf 🥵👅*"
        ];

        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });

        for (const frame of animationFrames) {
            currentText = frame;
            await sleep(1000);
            const protocolMsg = {
                key: sentMessage.key,
                type: 0xe,
                editedMessage: { conversation: currentText }
            };
            await conn.relayMessage(from, { protocolMessage: protocolMsg }, {});
        }
    } catch (e) {
        reply(`❌ *Error!* ${e.message}`);
    }
});

// 10. MUTH Command
cmd({
    pattern: "muth",
    alias: ["handjob", "hand"],
    desc: "Displays a simple handjob animation (owner only)",
    category: "fun",
    react: "✊",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return await conn.sendMessage(from, { text: "*This is an owner command.*" }, { quoted: mek });
        }

        const animationFrames = [
            "✊ 🍌",
            "✊🍌",
            "✊🍌💦",
            "✊🍌💦💦",
            "😩💦💦💦",
            "😵‍💫 Done!"
        ];

        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });

        for (const frame of animationFrames) {
            currentText = frame;
            await sleep(800);
            const protocolMsg = {
                key: sentMessage.key,
                type: 0xe,
                editedMessage: { conversation: currentText }
            };
            await conn.relayMessage(from, { protocolMessage: protocolMsg }, {});
        }
    } catch (e) {
        reply(`❌ Error: ${e.message}`);
    }
});

// 11. HAPPY Command
cmd({
    pattern: "happy",
    desc: "Displays a dynamic edit msg for fun.",
    category: "tools",
    react: "😂",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return await conn.sendMessage(from, { text: "*This is an owner command.*" }, { quoted: mek });
        }

        const emojiMessages = [
            "😃", "😄", "😁", "😊", "😎", "🥳",
            "😸", "😹", "🌞", "🌈", "😃", "😄",
            "😁", "😊", "😎", "🥳", "😸", "😹",
            "🌞", "🌈", "😃", "😄", "😁", "😊"
        ];

        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });

        for (const line of emojiMessages) {
            currentText = line;
            await sleep(1000);
            const protocolMsg = {
                key: sentMessage.key,
                type: 0xe,
                editedMessage: { conversation: currentText }
            };
            await conn.relayMessage(from, { protocolMessage: protocolMsg }, {});
        }
    } catch (e) {
        reply(`❌ *Error!* ${e.message}`);
    }
});

// 12. HEART Command
cmd({
    pattern: "heart",
    desc: "Displays a dynamic edit msg for fun.",
    category: "tools",
    react: "❤️",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return await conn.sendMessage(from, { text: "*This is an owner command.*" }, { quoted: mek });
        }

        const emojiMessages = [
            "💖", "💗", "💕", "🩷", "💛", "💚",
            "🩵", "💙", "💜", "🖤", "🩶", "🤍",
            "🤎", "❤️‍🔥", "💞", "💓", "💘", "💝",
            "♥️", "💟", "❤️‍🩹", "❤️"
        ];

        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });

        for (const line of emojiMessages) {
            currentText = line;
            await sleep(1000);
            const protocolMsg = {
                key: sentMessage.key,
                type: 0xe,
                editedMessage: { conversation: currentText }
            };
            await conn.relayMessage(from, { protocolMessage: protocolMsg }, {});
        }
    } catch (e) {
        reply(`❌ *Error!* ${e.message}`);
    }
});

// 13. ANGRY Command
cmd({
    pattern: "angry",
    desc: "Displays a dynamic edit msg for fun.",
    category: "tools",
    react: "🤡",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return await conn.sendMessage(from, { text: "*This is an owner command.*" }, { quoted: mek });
        }

        const emojiMessages = [
            "😡", "😠", "🤬", "😤", "😾", "😡",
            "😠", "🤬", "😤", "😾"
        ];

        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });

        for (const line of emojiMessages) {
            currentText = line;
            await sleep(1000);
            const protocolMsg = {
                key: sentMessage.key,
                type: 0xe,
                editedMessage: { conversation: currentText }
            };
            await conn.relayMessage(from, { protocolMessage: protocolMsg }, {});
        }
    } catch (e) {
        reply(`❌ *Error!* ${e.message}`);
    }
});

// 14. SAD Command
cmd({
    pattern: "sad",
    desc: "Displays a dynamic edit msg for fun.",
    category: "tools",
    react: "😶",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return await conn.sendMessage(from, { text: "*This is an owner command.*" }, { quoted: mek });
        }

        const emojiMessages = [
            "🥺", "😟", "😕", "😖", "😫", "🙁",
            "😩", "😥", "😓", "😪", "😢", "😔",
            "😞", "😭", "💔", "😭", "😿"
        ];

        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });

        for (const line of emojiMessages) {
            currentText = line;
            await sleep(1000);
            const protocolMsg = {
                key: sentMessage.key,
                type: 0xe,
                editedMessage: { conversation: currentText }
            };
            await conn.relayMessage(from, { protocolMessage: protocolMsg }, {});
        }
    } catch (e) {
        reply(`❌ *Error!* ${e.message}`);
    }
});

// 15. SHY Command
cmd({
    pattern: "shy",
    desc: "Displays a dynamic edit msg for fun.",
    category: "tools",
    react: "🧐",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return await conn.sendMessage(from, { text: "*This is an owner command.*" }, { quoted: mek });
        }

        const emojiMessages = [
            "😳", "😊", "😶", "🙈", "🙊",
            "😳", "😊", "😶", "🙈", "🙊"
        ];

        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });

        for (const line of emojiMessages) {
            currentText = line;
            await sleep(1000);
            const protocolMsg = {
                key: sentMessage.key,
                type: 0xe,
                editedMessage: { conversation: currentText }
            };
            await conn.relayMessage(from, { protocolMessage: protocolMsg }, {});
        }
    } catch (e) {
        reply(`❌ *Error!* ${e.message}`);
    }
});

// 16. MOON Command
cmd({
    pattern: "moon",
    desc: "Displays a dynamic edit msg for fun.",
    category: "tools",
    react: "🌚",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return await conn.sendMessage(from, { text: "*This is an owner command.*" }, { quoted: mek });
        }

        const emojiMessages = [
            "🌗", "🌘", "🌑", "🌒", "🌓", "🌔",
            "🌕", "🌖", "🌗", "🌘", "🌑", "🌒",
            "🌓", "🌔", "🌕", "🌖", "🌗", "🌘",
            "🌑", "🌒", "🌓", "🌔", "🌕", "🌖",
            "🌗", "🌘", "🌑", "🌒", "🌓", "🌔",
            "🌕", "🌖", "🌝🌚"
        ];

        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });

        for (const line of emojiMessages) {
            currentText = line;
            await sleep(1000);
            const protocolMsg = {
                key: sentMessage.key,
                type: 0xe,
                editedMessage: { conversation: currentText }
            };
            await conn.relayMessage(from, { protocolMessage: protocolMsg }, {});
        }
    } catch (e) {
        reply(`❌ *Error!* ${e.message}`);
    }
});

// 17. CONFUSED Command
cmd({
    pattern: "confused",
    desc: "Displays a dynamic edit msg for fun.",
    category: "tools",
    react: "🤔",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return await conn.sendMessage(from, { text: "*This is an owner command.*" }, { quoted: mek });
        }

        const emojiMessages = [
            "😕", "😟", "😵", "🤔", "😖", 
            "😲", "😦", "🤷", "🤷‍♂️", "🤷‍♀️"
        ];

        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });

        for (const line of emojiMessages) {
            currentText = line;
            await sleep(1000);
            const protocolMsg = {
                key: sentMessage.key,
                type: 0xe,
                editedMessage: { conversation: currentText }
            };
            await conn.relayMessage(from, { protocolMessage: protocolMsg }, {});
        }
    } catch (e) {
        reply(`❌ *Error!* ${e.message}`);
    }
});

// 18. NIKAL Command
cmd({
    pattern: "nikal",
    desc: "Displays a dynamic edit msg for fun.",
    category: "tools",
    react: "🗿",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return await conn.sendMessage(from, { text: "*This is an owner command.*" }, { quoted: mek });
        }

        const asciiMessages = [
            "⠀⠀⠀⣠⣶⡾⠏⠉⠙⠳⢦⡀⠀⠀⠀⢠⠞⠉⠙⠲⡀⠀\n ⠀⣴⠿⠏⠀⠀⠀⠀⠀     ⢳⡀⠀⡏⠀⠀⠀   ⠀  ⢷\n⢠⣟⣋⡀⢀⣀⣀⡀⠀⣀⡀   ⣧⠀⢸⠀⠀⠀  ⠀    ⡇\n⢸⣯⡭⠁⠸⣛⣟⠆⡴⣻⡲     ⣿  ⣸   Nikal   ⡇\n ⣟⣿⡭⠀⠀⠀⠀⠀⢱⠀⠀      ⣿  ⢹⠀          ⡇\n  ⠙⢿⣯⠄⠀⠀__⠀   ⠀   ⡿ ⠀⡇⠀⠀⠀⠀    ⡼\n⠀⠀⠀⠹⣶⠆⠀⠀⠀⠀⠀⡴⠃⠀   ⠘⠤⣄⣠⠞⠀\n⠀⠀⠀⠀⢸⣷⡦⢤⡤⢤⣞⣁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⢀⣤⣴⣿⣏⠁⠀⠀⠸⣏⢯⣷⣖⣦⡀⠀⠀⠀⠀⠀⠀\n⢀⣾⣽⣿⣿⣿⣿⠛⢲⣶⣾⢉⡷⣿⣿⠵⣿⠀⠀⠀⠀⠀⠀\n⣼⣿⠍⠉⣿⡭⠉⠙⢺⣇⣼⡏⠀⠀ ⠀⣄⢸⠀⠀⠀⠀⠀⠀",
            "⠀⠀⠀⣠⣶⡾⠏⠉⠙⠳⢦⡀⠀⠀⠀⢠⠞⠉⠙⠲⡀⠀\n ⠀⣴⠿⠏⠀⠀⠀⠀⠀  ⠀  ⢳⡀⠀⡏⠀⠀⠀   ⠀  ⢷\n⢠⣟⣋⡀⢀⣀⣀⡀⠀⣀⡀   ⣧⠀⢸⠀⠀⠀       ⡇\n⢸⣯⡭⠁⠸⣛⣟⠆⡴⣻⡲     ⣿  ⣸   Lavde   ⡇\n ⣟⣿⡭⠀⠀⠀⠀⠀⢱⠀⠀      ⣿  ⢹⠀          ⡇\n  ⠙⢿⣯⠄⠀⠀|__|⠀⠀   ⡿ ⠀⡇⠀⠀⠀⠀    ⡼\n⠀⠀⠀⠹⣶⠆⠀⠀⠀⠀⠀⡴⠃⠀   ⠘⠤⣄⣠⠞⠀\n⠀⠀⠀⠀⢸⣷⡦⢤⡤⢤⣞⣁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⢀⣤⣴⣿⣏⠁⠀⠀⠸⣏⢯⣷⣖⣦⡀⠀⠀⠀⠀⠀⠀\n⢀⣾⣽⣿⣿⣿⣿⠛⢲⣶⣾⢉⡷⣿⣿⠵⣿⠀⠀⠀⠀⠀⠀\n⣼⣿⠍⠉⣿⡭⠉⠙⢺⣇⣼⡏⠀⠀ ⠀⣄⢸⠀⠀⠀⠀⠀⠀",
            "⠀⠀⠀⣠⣶⡾⠏⠉⠙⠳⢦⡀⠀⠀⠀⢠⠞⠉⠙⠲⡀⠀\n ⠀⣴⠿⠏⠀⠀     ⠀   ⢳⡀⠀⡏⠀⠀    ⠀  ⢷\n⢠⣟⣋⡀⢀⣀⣀⡀⠀⣀⡀   ⣧⠀⢸⠀⠀⠀⠀      ⡇\n⢸⣯⡭⠁⠸⣛⣟⠆⡴⣻⡲    ⣿  ⣸   Pehli   ⡇\n ⣟⣿⡭⠀⠀⠀⠀⠀⢱⠀⠀     ⣿  ⢹⠀           ⡇\n  ⠙⢿⣯⠄⠀⠀(P)⠀⠀     ⡿ ⠀⡇⠀⠀⠀⠀    ⡼\n⠀⠀⠀⠹⣶⠆⠀⠀⠀⠀⠀⡴⠃⠀   ⠘⠤⣄⣠⠞⠀\n⠀⠀⠀⠀⢸⣷⡦⢤⡤⢤⣞⣁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⢀⣤⣴⣿⣏⠁⠀⠀⠸⣏⢯⣷⣖⣦⡀⠀⠀⠀⠀⠀⠀\n⢀⣾⣽⣿⣿⣿⣿⠛⢲⣶⣾⢉⡷⣿⣿⠵⣿⠀⠀⠀⠀⠀⠀\n⣼⣿⠍⠉⣿⡭⠉⠙⢺⣇⣼⡏⠀⠀ ⠀⣄⢸⠀⠀⠀⠀⠀⠀",
            "⠀⠀⠀⣠⣶⡾⠏⠉⠙⠳⢦⡀⠀⠀⠀⢠⠞⠉⠙⠲⡀⠀\n ⠀⣴⠿⠏⠀⠀     ⠀   ⢳⡀⠀⡏⠀⠀    ⠀  ⢷\n⢠⣟⣋⡀⢀⣀⣀⡀⠀⣀⡀   ⣧⠀⢸⠀   ⠀     ⡇\n⢸⣯⡭⠁⠸⣛⣟⠆⡴⣻⡲    ⣿  ⣸  Fursat  ⡇\n ⣟⣿⡭⠀⠀⠀⠀⠀⢱⠀        ⣿  ⢹⠀          ⡇\n  ⠙⢿⣯⠄⠀⠀⠀__ ⠀  ⠀   ⡿ ⠀⡇⠀⠀⠀⠀    ⡼\n⠀⠀⠀⠹⣶⠆⠀⠀⠀⠀⠀⡴⠃⠀   ⠘⠤⣄⣠⠞⠀\n⠀⠀⠀⠀⢸⣷⡦⢤⡤⢤⣞⣁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⢀⣤⣴⣿⣏⠁⠀⠀⠸⣏⢯⣷⣖⣦⡀⠀⠀⠀⠀⠀⠀\n⢀⣾⣽⣿⣿⣿⣿⠛⢲⣶⣾⢉⡷⣿⣿⠵⣿⠀⠀⠀⠀⠀⠀\n⣼⣿⠍⠉⣿⡭⠉⠙⢺⣇⣼⡏⠀⠀ ⠀⣄⢸⠀⠀⠀⠀⠀⠀",
            "⠀⠀⠀⣠⣶⡾⠏⠉⠙⠳⢦⡀⠀⠀⠀⢠⠞⠉⠙⠲⡀⠀\n ⠀⣴⠿⠏⠀⠀⠀⠀⠀      ⢳⡀⠀⡏⠀⠀    ⠀  ⢷\n⢠⣟⣋⡀⢀⣀⣀⡀⠀⣀⡀   ⣧⠀⢸⠀⠀ ⠀      ⡇\n⢸⣯⡭⠁⠸⣛⣟⠆⡴⣻⡲    ⣿  ⣸  Meeee   ⡇\n ⣟⣿⡭⠀⠀⠀⠀⠀⢱⠀⠀       ⣿  ⢹⠀          ⡇\n  ⠙⢿⣯⠄⠀⠀|__| ⠀    ⡿ ⠀⡇⠀⠀⠀⠀    ⡼\n⠀⠀⠀⠹⣶⠆⠀⠀⠀⠀⠀⡴⠃⠀   ⠘⠤⣄⣠⠞⠀\n⠀⠀⠀⠀⢸⣷⡦⢤⡤⢤⣞⣁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⢀⣤⣴⣿⣏⠁⠀⠀⠸⣏⢯⣷⣖⣦⡀⠀⠀⠀⠀⠀⠀\n⢀⣾⣽⣿⣿⣿⣿⠛⢲⣶⣾⢉⡷⣿⣿⠵⣿⠀⠀⠀⠀⠀⠀\n⣼⣿⠍⠉⣿⡭⠉⠙⢺⣇⣼⡏⠀⠀ ⠀⣄⢸⠀⠀⠀⠀⠀⠀",
            "⠀⠀⠀⣠⣶⡾⠏⠉⠙⠳⢦⡀⠀⠀⠀⢠⠞⠉⠙⠲⡀⠀\n ⠀⣴⠿⠏⠀⠀⠀⠀   ⠀  ⠀⢳⡀⠀⡏⠀⠀       ⢷\n⢠⣟⣋⡀⢀⣀⣀⡀⠀⣀⡀   ⣧⠀⢸⠀  ⠀       ⡇\n⢸⣯⡭⠁⠸⣛⣟⠆⡴⣻⡲   ⣿  ⣸   Nikal   ⡇\n ⣟⣿⡭⠀⠀⠀⠀⠀⢱⠀       ⣿  ⢹⠀           ⡇\n  ⠙⢿⣯⠄⠀⠀lodu⠀⠀   ⡿ ⠀⡇⠀⠀⠀⠀   ⡼\n⠀⠀⠀⠹⣶⠆⠀⠀⠀⠀⠀  ⡴⠃⠀   ⠘⠤⣄⣠⠞⠀\n⠀⠀⠀⠀⢸⣷⡦⢤⡤⢤⣞⣁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⢀⣤⣴⣿⣏⠁⠀⠀⠸⣏⢯⣷⣖⣦⡀⠀⠀⠀⠀⠀⠀\n⢀⣾⣽⣿⣿⣿⣿⠛⢲⣶⣾⢉⡷⣿⣿⠵⣿⠀⠀⠀⠀⠀⠀\n⣼⣿⠍⠉⣿⡭⠉⠙⢺⣇⣼⡏⠀⠀ ⠀⣄⢸⠀"
        ];

        let currentText = '';
        const sentMessage = await conn.sendMessage(from, { text: currentText }, { quoted: mek });

        for (const asciiMessage of asciiMessages) {
            currentText = asciiMessage;
            await sleep(500);
            const protocolMsg = {
                key: sentMessage.key,
                type: 0xe,
                editedMessage: { conversation: currentText }
            };
            await conn.relayMessage(from, { protocolMessage: protocolMsg }, {});
        }
    } catch (e) {
        reply(`❌ *Error!* ${e.message}`);
    }
});
