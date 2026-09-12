// fun-gifs.js - NAWAZ MD Fun GIF Commands
// Powered By NAWAZ MD

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============ CONFIG ============
const PRIMARY_API = 'https://nekos.best/api/v2';
const FALLBACK_API = 'https://api.waifu.pics/sfw';

// Category mapping: Nekos.best -> Waifu.pics fallback
const CATEGORY_MAP = {
  cuddle: { primary: 'cuddle', fallback: 'cuddle' },
  smooch: { primary: 'kiss', fallback: 'kiss' },
  bonk: { primary: 'bonk', fallback: 'slap' },
  groove: { primary: 'dance', fallback: 'dance' },
  cheer: { primary: 'happy', fallback: 'happy' },
  tear: { primary: 'cry', fallback: 'cry' }
};

// Caption templates
const CAPTIONS = {
  cuddle: (sender, target) => `🤗 *${sender}* cuddled *${target}*!\n\n⚡ Powered By NAWAZ MD`,
  smooch: (sender, target) => `💋 *${sender}* kissed *${target}*!\n\n⚡ Powered By NAWAZ MD`,
  bonk: (sender, target) => `👋 *${sender}* bonked *${target}*!\n\n⚡ Powered By NAWAZ MD`,
  groove: (sender, target) => `💃 *${sender}* danced with *${target}*!\n\n⚡ Powered By NAWAZ MD`,
  cheer: (sender, target) => `🎉 *${sender}* cheered for *${target}*!\n\n⚡ Powered By NAWAZ MD`,
  tear: (sender, target) => `😢 *${sender}* is sad because of *${target}*...\n\n⚡ Powered By NAWAZ MD`
};

// ============ HELPER FUNCTIONS ============

/**
 * Fetch GIF from primary API (Nekos.best)
 */
async function fetchFromPrimary(category) {
  try {
    const res = await axios.get(`${PRIMARY_API}/${category}`, { timeout: 8000 });
    
    // Nekos.best returns { results: [{ url: "..." }] }
    if (res.data && res.data.results && res.data.results[0] && res.data.results[0].url) {
      return res.data.results[0].url;
    }
    throw new Error('Invalid primary response structure');
  } catch (error) {
    console.log(`[GIF Primary] ${category} failed:`, error.message);
    return null;
  }
}

/**
 * Fetch GIF from fallback API (Waifu.pics)
 */
async function fetchFromFallback(category) {
  try {
    const res = await axios.get(`${FALLBACK_API}/${category}`, { timeout: 8000 });
    
    // Waifu.pics returns { url: "..." }
    if (res.data && res.data.url) {
      return res.data.url;
    }
    throw new Error('Invalid fallback response structure');
  } catch (error) {
    console.log(`[GIF Fallback] ${category} failed:`, error.message);
    return null;
  }
}

/**
 * Get GIF with automatic fallback and retry
 */
async function getGif(categoryKey) {
  const mapping = CATEGORY_MAP[categoryKey];
  if (!mapping) return null;

  // Try primary first (with one retry)
  for (let i = 0; i < 2; i++) {
    const url = await fetchFromPrimary(mapping.primary);
    if (url) return url;
    // Small delay before retry
    if (i === 0) await new Promise(r => setTimeout(r, 1000));
  }

  // Primary failed, try fallback (with one retry)
  for (let i = 0; i < 2; i++) {
    const url = await fetchFromFallback(mapping.fallback);
    if (url) return url;
    if (i === 0) await new Promise(r => setTimeout(r, 1000));
  }

  return null;
}

/**
 * Get target user (mentioned or random group member)
 */
async function getTargetUser(conn, from, mek) {
  // Check for mention
  const mentioned = mek.message?.extendedTextMessage?.contextInfo?.mentionedJid;
  if (mentioned && mentioned.length > 0) {
    return mentioned[0];
  }

  // No mention, get random member from group
  try {
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants;
    if (participants && participants.length > 0) {
      const randomUser = participants[Math.floor(Math.random() * participants.length)];
      return randomUser.id;
    }
  } catch (e) {
    console.log('[GIF] Could not get group metadata:', e.message);
  }

  return null;
}

/**
 * Main GIF handler
 */
async function handleGif(conn, mek, m, { from, reply }, commandName) {
  try {
    // React with loading
    await conn.sendMessage(from, {
      react: { text: '⏳', key: mek.key }
    });

    // Get target user
    const targetUser = await getTargetUser(conn, from, mek);
    
    if (!targetUser) {
      await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
      return reply('❌ Could not find a user to target. Please mention someone or use in a group.');
    }

    const sender = mek.key.participant || mek.key.remoteJid;
    const senderName = sender.split('@')[0];
    const targetName = targetUser.split('@')[0];

    // Fetch GIF
    const gifUrl = await getGif(commandName);

    if (!gifUrl) {
      await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
      return reply('⚠️ GIF service is temporarily unavailable. Please try again later.');
    }

    // Get caption
    const caption = CAPTIONS[commandName](senderName, targetName);

    // Send as GIF (video with gifPlayback)
    await conn.sendMessage(from, {
      video: { url: gifUrl },
      gifPlayback: true,
      caption: caption,
      mentions: [sender, targetUser]
    }, { quoted: mek });

    // Success reaction
    await conn.sendMessage(from, {
      react: { text: '✅', key: mek.key }
    });

  } catch (error) {
    console.error(`[GIF ${commandName}] Error:`, error.message);
    
    await conn.sendMessage(from, {
      react: { text: '❌', key: mek.key }
    });
    
    reply('⚠️ Something went wrong. Please try again.');
  }
}

// ============ COMMANDS ============

cmd({
  pattern: "cuddle",
  alias: ["hug"],
  desc: "Cuddle/Hug GIF",
  category: "fun",
  react: "🤗",
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {
  await handleGif(conn, mek, m, { from, reply }, 'cuddle');
});

cmd({
  pattern: "smooch",
  alias: ["kiss"],
  desc: "Kiss GIF",
  category: "fun",
  react: "💋",
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {
  await handleGif(conn, mek, m, { from, reply }, 'smooch');
});

cmd({
  pattern: "bonk",
  alias: ["slap"],
  desc: "Slap/Bonk GIF",
  category: "fun",
  react: "👋",
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {
  await handleGif(conn, mek, m, { from, reply }, 'bonk');
});

cmd({
  pattern: "groove",
  alias: ["dance"],
  desc: "Dance GIF",
  category: "fun",
  react: "💃",
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {
  await handleGif(conn, mek, m, { from, reply }, 'groove');
});

cmd({
  pattern: "cheer",
  alias: ["happy"],
  desc: "Happy/Cheer GIF",
  category: "fun",
  react: "🎉",
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {
  await handleGif(conn, mek, m, { from, reply }, 'cheer');
});

cmd({
  pattern: "tear",
  alias: ["cry", "sad"],
  desc: "Sad/Crying GIF",
  category: "fun",
  react: "😢",
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {
  await handleGif(conn, mek, m, { from, reply }, 'tear');
});
