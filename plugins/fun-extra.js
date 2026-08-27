// plugins/fun.js - ESM Version - All Fun Commands
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';
import converter from '../lib/converter.js';
import { lidToPhone, sleep } from '../lib/functions.js';
import { fetchGif, gifToVideo } from '../lib/fetchgif.js';

const __filename = fileURLToPath(import.meta.url);
const RUN_MUREED_AUDIO = "https://files.catbox.moe/wuikae.mp3";
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ==================== SHIP COMMAND ====================
cmd({
  pattern: "ship",
  alias: ["match"],
  desc: "Randomly pairs the command user with another group member.",
  react: "❤️",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");

    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to make a pair.");

    const randomPair = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const user1 = sender.split("@")[0];
    const user2 = randomPair.split("@")[0];
    const message = `💘 *Match Found!* 💘\n❤️ @${user1} + @${user2}\n💖 Congratulations! 🎉`;

    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [sender, randomPair] }
    }, { quoted: m });

  } catch (error) {
    console.error("❌ Error in ship command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== DAD COMMAND ====================
cmd({
  pattern: "dad",
  alias: ["father", "papa", "baap"],
  desc: "Assigns a random dad from group members.",
  react: "👨",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a dad.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `👨 *Dad Found!* 👨\n@${userName} is your dad!\n💖 Father figure alert!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in dad command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== MOM COMMAND ====================
cmd({
  pattern: "mom",
  alias: ["mother", "maa", "mummy"],
  desc: "Assigns a random mom from group members.",
  react: "👩",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a mom.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `👩 *Mom Found!* 👩\n@${userName} is your mom!\n💖 Mother figure alert!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in mom command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== SON COMMAND ====================
cmd({
  pattern: "son",
  alias: ["beta"],
  desc: "Assigns a random son from group members.",
  react: "👦",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a son.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `👦 *Son Found!* 👦\n@${userName} is your son!\n🧒 Take care of your child!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in son command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== DAUGHTER COMMAND ====================
cmd({
  pattern: "daughter",
  alias: ["beti"],
  desc: "Assigns a random daughter from group members.",
  react: "👧",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a daughter.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `👧 *Daughter Found!* 👧\n@${userName} is your daughter!\n👧 Love your little girl!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in daughter command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== BOYFRIEND COMMAND ====================
cmd({
  pattern: "boyfriend",
  alias: ["bfriend", "boyfrnd"],
  desc: "Assigns a random boyfriend from group members.",
  react: "👨‍❤️‍👨",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a boyfriend.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `👨‍❤️‍👨 *Boyfriend Found!* 👨‍❤️‍👨\n@${userName} is your boyfriend!\n💑 Go on a date!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in boyfriend command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== GIRLFRIEND COMMAND ====================
cmd({
  pattern: "girlfriend",
  alias: ["gfriend", "girlfrnd"],
  desc: "Assigns a random girlfriend from group members.",
  react: "👩‍❤️‍👩",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a girlfriend.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `👩‍❤️‍👩 *Girlfriend Found!* 👩‍❤️‍👩\n@${userName} is your girlfriend!\n💑 Go on a date!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in girlfriend command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== TWIN COMMAND ====================
cmd({
  pattern: "twin",
  alias: ["jodua"],
  desc: "Assigns a random twin from group members.",
  react: "👯",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a twin.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `👯 *Twin Found!* 👯\n@${userName} is your twin!\n🎭 You look exactly alike!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in twin command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== PARTNER COMMAND ====================
cmd({
  pattern: "partner",
  alias: ["jodi"],
  desc: "Assigns a random partner from group members.",
  react: "🤝",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a partner.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `🤝 *Partner Found!* 🤝\n@${userName} is your partner!\n🤝 Work together!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in partner command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== BODYGUARD COMMAND ====================
cmd({
  pattern: "bodyguard",
  alias: ["rakshak", "guard"],
  desc: "Assigns a random bodyguard from group members.",
  react: "💂",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a bodyguard.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `💂 *Bodyguard Found!* 💂\n@${userName} is your bodyguard!\n🛡️ They will protect you!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in bodyguard command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== BOSS COMMAND ====================
cmd({
  pattern: "boss",
  alias: ["maalik", "owner"],
  desc: "Assigns a random boss from group members.",
  react: "👔",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a boss.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `👔 *Boss Found!* 👔\n@${userName} is your boss!\n💼 Listen to them!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in boss command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== EMPLOYEE COMMAND ====================
cmd({
  pattern: "employee",
  alias: ["naukar", "worker"],
  desc: "Assigns a random employee from group members.",
  react: "👷",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find an employee.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `👷 *Employee Found!* 👷\n@${userName} is your employee!\n💼 Give them work!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in employee command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== PET COMMAND ====================
cmd({
  pattern: "pet",
  alias: ["janwar", "animal"],
  desc: "Assigns a random pet from group members.",
  react: "🐶",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a pet.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `🐶 *Pet Found!* 🐶\n@${userName} is your pet!\n🐕 Take good care of them!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in pet command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== SERVANT COMMAND ====================
cmd({
  pattern: "servant",
  alias: ["naukar", "chhakar"],
  desc: "Assigns a random servant from group members.",
  react: "🧹",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a servant.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `🧹 *Servant Found!* 🧹\n@${userName} is your servant!\n🧽 Make them work!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in servant command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== IDOL COMMAND ====================
cmd({
  pattern: "idol",
  alias: ["hero", "star"],
  desc: "Assigns a random idol from group members.",
  react: "🌟",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find an idol.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `🌟 *Idol Found!* 🌟\n@${userName} is your idol!\n⭐ Worship them!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in idol command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== FAN COMMAND ====================
cmd({
  pattern: "fan",
  alias: ["deewana"],
  desc: "Assigns a random fan from group members.",
  react: "🤩",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a fan.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `🤩 *Fan Found!* 🤩\n@${userName} is your fan!\n🙏 They admire you!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in fan command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== GHOST COMMAND ====================
cmd({
  pattern: "ghost",
  alias: ["bhoot", "pret"],
  desc: "Assigns a random ghost from group members.",
  react: "👻",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a ghost.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `👻 *Ghost Found!* 👻\n@${userName} is a ghost!\n👀 Watch out for them!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in ghost command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== ANGEL COMMAND ====================
cmd({
  pattern: "angel",
  desc: "Assigns a random angel from group members.",
  react: "😇",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find an angel.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `😇 *Angel Found!* 😇\n@${userName} is an angel!\n✨ They watch over you!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in angel command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== DEVIL COMMAND ====================
cmd({
  pattern: "devil",
  alias: ["shaitan", "rakshas"],
  desc: "Assigns a random devil from group members.",
  react: "😈",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a devil.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `😈 *Devil Found!* 😈\n@${userName} is a devil!\n🔥 Stay away from them!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in devil command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== KING COMMAND ====================
cmd({
  pattern: "king",
  alias: ["raja", "badshah"],
  desc: "Assigns a random king from group members.",
  react: "👑",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a king.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `👑 *King Found!* 👑\n@${userName} is the king!\n🏰 Bow before them!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in king command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== QUEEN COMMAND ====================
cmd({
  pattern: "queen",
  alias: ["rani", "malika"],
  desc: "Assigns a random queen from group members.",
  react: "👸",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a queen.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `👸 *Queen Found!* 👸\n@${userName} is the queen!\n🏰 Bow before her!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in queen command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== SLAVE COMMAND ====================
cmd({
  pattern: "slave",
  alias: ["gulam", "banda"],
  desc: "Assigns a random slave from group members.",
  react: "⛓️",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a slave.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `⛓️ *Slave Found!* ⛓️\n@${userName} is your slave!\n🔗 Make them obey!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in slave command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== MASTER COMMAND ====================
cmd({
  pattern: "master",
  alias: ["maalik", "swami"],
  desc: "Assigns a random master from group members.",
  react: "🎩",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a master.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `🎩 *Master Found!* 🎩\n@${userName} is your master!\n🎭 Obey them!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in master command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== GENIUS COMMAND ====================
cmd({
  pattern: "genius",
  alias: ["budhimaan", "smart"],
  desc: "Assigns a random genius from group members.",
  react: "🧠",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a genius.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `🧠 *Genius Found!* 🧠\n@${userName} is a genius!\n💡 Learn from them!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in genius command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== FOOL COMMAND ====================
cmd({
  pattern: "fool",
  alias: ["bewakoof", "stupid"],
  desc: "Assigns a random fool from group members.",
  react: "🤡",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a fool.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `🤡 *Fool Found!* 🤡\n@${userName} is a fool!\n🎭 Don't listen to them!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in fool command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== RICH COMMAND ====================
cmd({
  pattern: "rich",
  alias: ["amir", "crorepati"],
  desc: "Assigns a random rich person from group members.",
  react: "💰",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a rich person.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `💰 *Rich Person Found!* 💰\n@${userName} is rich!\n💵 Ask for money!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in rich command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== POOR COMMAND ====================
cmd({
  pattern: "poor",
  alias: ["garib", "bechara"],
  desc: "Assigns a random poor person from group members.",
  react: "🪙",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a poor person.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `🪙 *Poor Person Found!* 🪙\n@${userName} is poor!\n🙏 Help them!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in poor command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== BHAI COMMAND ====================
cmd({
  pattern: "bhai",
  alias: ["brother"],
  desc: "Assigns a random brother from group members.",
  react: "👨‍🦰",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a brother.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `👬 *Brother Found!* 👬\n@${userName} is your brother!\n💪 Take care of each other!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in bhai command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== BAHAN COMMAND ====================
cmd({
  pattern: "bahan",
  alias: ["sister", "behen"],
  desc: "Assigns a random sister from group members.",
  react: "👩",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a sister.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `👭 *Sister Found!* 👭\n@${userName} is your sister!\n💖 Love and protect each other!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in bahan command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== WIFE COMMAND ====================
cmd({
  pattern: "wife",
  alias: ["biwi"],
  desc: "Assigns a random wife from group members.",
  react: "👰",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a wife.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `💍 *Wife Found!* 💍\n@${userName} is your wife!\n💕 Treat her with love and respect!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in wife command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== HUSBAND COMMAND ====================
cmd({
  pattern: "husband",
  alias: ["shohar"],
  desc: "Assigns a random husband from group members.",
  react: "🤵",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a husband.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `💍 *Husband Found!* 💍\n@${userName} is your husband!\n💕 Take care of him!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in husband command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== CHACHA COMMAND ====================
cmd({
  pattern: "chacha",
  desc: "Assigns a random paternal uncle from group members.",
  react: "👨‍🦳",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a chacha.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `🧓 *Chacha Found!* 🧓\n@${userName} is your chacha (paternal uncle)!\n👴 Respect your elders!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in chacha command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== CHACHI COMMAND ====================
cmd({
  pattern: "chachi",
  desc: "Assigns a random paternal aunt from group members.",
  react: "👵",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a chachi.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `🧓 *Chachi Found!* 🧓\n@${userName} is your chachi (paternal aunt)!\n👵 Respect your elders!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in chachi command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== NANA COMMAND ====================
cmd({
  pattern: "nana",
  desc: "Assigns a random maternal grandfather from group members.",
  react: "👴",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a nana.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `👴 *Nana Found!* 👴\n@${userName} is your nana (maternal grandfather)!\n🌳 Your family tree grows!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in nana command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== NANI COMMAND ====================
cmd({
  pattern: "nani",
  desc: "Assigns a random maternal grandmother from group members.",
  react: "👵",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a nani.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `👵 *Nani Found!* 👵\n@${userName} is your nani (maternal grandmother)!\n🌳 Your family tree grows!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in nani command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== MAMA COMMAND ====================
cmd({
  pattern: "mama",
  desc: "Assigns a random maternal uncle from group members.",
  react: "🧔",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a mama.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `🧔 *Mama Found!* 🧔\n@${userName} is your mama (maternal uncle)!\n👨‍👦 Treat him with respect!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in mama command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== MAMI COMMAND ====================
cmd({
  pattern: "mami",
  desc: "Assigns a random maternal aunt from group members.",
  react: "👩‍🦰",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a mami.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `👩‍🦰 *Mami Found!* 👩‍🦰\n@${userName} is your mami (maternal aunt)!\n👩‍👧 Treat her with respect!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in mami command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== BESTFRIEND COMMAND ====================
cmd({
  pattern: "bestfriend",
  alias: ["bf", "bestie"],
  desc: "Assigns a random best friend from group members.",
  react: "🤝",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a best friend.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `🤝 *Best Friend Found!* 🤝\n@${userName} is your best friend!\n👫 Friends forever!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in bestfriend command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== ENEMY COMMAND ====================
cmd({
  pattern: "enemy",
  alias: ["dushman"],
  desc: "Assigns a random enemy from group members.",
  react: "😠",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find an enemy.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `😠 *Enemy Found!* 😠\n@${userName} is your enemy!\n⚔️ Watch your back!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in enemy command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== CRUSH COMMAND ====================
cmd({
  pattern: "crush",
  alias: ["pyaar"],
  desc: "Assigns a random crush from group members.",
  react: "😍",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a crush.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `😍 *Crush Found!* 😍\n@${userName} is your crush!\n💘 You have feelings for them!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in crush command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== TEACHER COMMAND ====================
cmd({
  pattern: "teacher",
  alias: ["sir", "guru"],
  desc: "Assigns a random teacher from group members.",
  react: "👨‍🏫",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a teacher.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `👨‍🏫 *Teacher Found!* 👨‍🏫\n@${userName} is your teacher!\n📚 Learn from them!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in teacher command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== STUDENT COMMAND ====================
cmd({
  pattern: "student",
  alias: ["chela"],
  desc: "Assigns a random student from group members.",
  react: "🧑‍🎓",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a student.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `🧑‍🎓 *Student Found!* 🧑‍🎓\n@${userName} is your student!\n📖 Teach them well!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in student command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== RIVAL COMMAND ====================
cmd({
  pattern: "rival",
  alias: ["competitor"],
  desc: "Assigns a random rival from group members.",
  react: "⚔️",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants.map(user => user.id);
    const otherParticipants = participants.filter(id => id !== sender);
    if (otherParticipants.length === 0) return reply("❌ Not enough participants to find a rival.");
    const randomPerson = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    const userName = randomPerson.split("@")[0];
    const message = `⚔️ *Rival Found!* ⚔️\n@${userName} is your rival!\n🏆 Compete fairly!`;
    await conn.sendMessage(from, {
      text: message,
      contextInfo: { mentionedJid: [randomPerson] }
    }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in rival command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});

// ==================== RUNMUREED COMMAND ====================
cmd({
    pattern: "runmureed",
    desc: "Run Mureed Audio",
    category: "fun",
    react: "🎧",
    filename: __filename
}, async (conn, mek, m, { from, reply, react }) => {
    try {
        await conn.sendMessage(from, {
            audio: { url: RUN_MUREED_AUDIO },
            mimetype: "audio/mpeg",
            ptt: false
        }, { quoted: mek });
        await react("✅");
    } catch (e) {
        console.error("Error in runmureed command:", e);
        await react("❌");
        reply("❌ Audio play nahi ho saki");
    }
});

// ==================== FLIRT COMMAND ====================
cmd({
    pattern: "flirt",
    alias: ["line"],
    desc: "Get a random flirty message",
    react: "😘",
    category: "fun",
    use: '.flirt',
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const apiUrl = 'https://shizoapi.onrender.com/api/texts/flirt?apikey=shizo';
        const { data } = await axios.get(apiUrl);
        if (!data.result) return reply("❌ Couldn't fetch a flirty message. Try again later!");
        const flirtMessage = `${data.result}`.trim();
        await reply(flirtMessage);
    } catch (error) {
        console.error('Flirt Error:', error);
        reply("❌ Failed to fetch a flirty message. Maybe try being romantic yourself?");
    }
});

// ==================== QUOTE COMMAND ====================
cmd({
  pattern: "quote",
  desc: "Get a random inspiring quote.",
  category: "fun",
  react: "💬",
  filename: __filename
}, async (conn, m, store, { from, reply }) => {
  try {
    const response = await axios.get("https://api.quotable.io/random");
    const { content, author } = response.data;
    const message = `💬 *"${content}"*\n- ${author}\n\n> *QUOTES BY KHAN MD*`;
    reply(message);
  } catch (error) {
    console.error("Error fetching quote:", error);
    reply("⚠️ API issue or coding error, please check the logs!");
  }
});

// ==================== MARIGE COMMAND ====================
cmd({
  pattern: "marige",
  alias: ["shadi", "marriage", "wedding"],
  desc: "Randomly pairs two users for marriage with a wedding GIF",
  react: "💍",
  category: "fun",
  filename: __filename
}, async (conn, mek, store, { isGroup, groupMetadata, reply, sender }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups!");
    const participants = groupMetadata.participants.map(user => user.id);
    const eligibleParticipants = participants.filter(id => id !== sender && !id.includes(conn.user.id.split('@')[0]));
    if (eligibleParticipants.length < 1) return reply("❌ Not enough participants to perform a marriage!");
    const randomIndex = Math.floor(Math.random() * eligibleParticipants.length);
    const randomPair = eligibleParticipants[randomIndex];
    const apiUrl = "https://api.waifu.pics/sfw/hug";
    let res = await axios.get(apiUrl);
    let gifUrl = res.data.url;
    let gifBuffer = await fetchGif(gifUrl);
    let videoBuffer = await gifToVideo(gifBuffer);
    const message = `💍 *Shadi Mubarak!* 💒\n\n👰 @${sender.split("@")[0]} + 🤵 @${randomPair.split("@")[0]}\n\nMay you both live happily ever after! 💖`;
    await conn.sendMessage(mek.chat, { video: videoBuffer, caption: message, gifPlayback: true, mentions: [sender, randomPair] }, { quoted: mek });
  } catch (error) {
    console.error("❌ Error in .marige command:", error);
    reply(`❌ *Error in .marige command:*\n\`\`\`${error.message}\`\`\``);
  }
});

// ==================== COSPLAY COMMAND ====================
cmd({
  pattern: "cosplay",
  alias: ["cosplayimg", "cos"],
  react: '📸',
  desc: "Get random cosplay image",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });
    const apiUrl = "https://rynekoo-api.hf.space/random/cosplay";
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const imageBuffer = await response.buffer();
    if (!imageBuffer || imageBuffer.length === 0) throw new Error("No image data received");
    await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
    await conn.sendMessage(from, { image: imageBuffer, caption: `*📸 Random Cosplay Image*\n\n> Powered by Rynekoo API`, mimetype: "image/jpeg" }, { quoted: mek });
  } catch (error) {
    console.error("Cosplay Error:", error);
    await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
    await reply(`❌ Error fetching cosplay image:\n${error.message}`);
  }
});

// ==================== JOKE COMMAND ====================
cmd({
  pattern: "joke",
  desc: "😂 Get a random joke",
  react: "🤣",
  category: "fun",
  filename: __filename
}, async (conn, m, store, { reply }) => {
  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    const joke = response.data;
    if (!joke || !joke.setup || !joke.punchline) return reply("❌ Failed to fetch a joke. Please try again.");
    const jokeMessage = `🤣 *Here's a random joke for you!* 🤣\n\n*${joke.setup}*\n\n${joke.punchline} 😆\n\n> *© Powered by JawadTechX*`;
    return reply(jokeMessage);
  } catch (error) {
    console.error("❌ Error in joke command:", error);
    return reply("⚠️ An error occurred while fetching the joke. Please try again.");
  }
});

// ==================== BACHA COMMAND ====================
cmd({
  pattern: "bacha",
  alias: ["larka"],
  desc: "Randomly selects a boy from the group",
  react: "👦",
  category: "fun",
  filename: __filename
}, async (conn, mek, store, { isGroup, groupMetadata, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups!");
    if (!groupMetadata?.participants) return reply("⚠️ Couldn't fetch group members.");
    const botNumber = conn.user.id;
    const participants = groupMetadata.participants.filter(p => p.id !== botNumber);
    if (participants.length < 1) return reply("❌ No eligible participants found!");
    const randomUser = participants[Math.floor(Math.random() * participants.length)];
    await conn.sendMessage(mek.chat, { text: `👦 *Yeh lo tumhara Bacha!*\n\n@${randomUser.id.split('@')[0]} is your handsome boy! 😎`, mentions: [randomUser.id] }, { quoted: mek });
  } catch (error) {
    console.error("Error in .bacha command:", error);
    reply("❌ An error occurred while selecting a boy.");
  }
});

// ==================== BACHI COMMAND ====================
cmd({
  pattern: "bachi",
  alias: ["kuri", "larki"],
  desc: "Randomly selects a girl from the group",
  react: "👧",
  category: "fun",
  filename: __filename
}, async (conn, mek, store, { isGroup, groupMetadata, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups!");
    if (!groupMetadata?.participants) return reply("⚠️ Couldn't fetch group members.");
    const botNumber = conn.user.id;
    const participants = groupMetadata.participants.filter(p => p.id !== botNumber);
    if (participants.length < 1) return reply("❌ No eligible participants found!");
    const randomUser = participants[Math.floor(Math.random() * participants.length)];
    await conn.sendMessage(mek.chat, { text: `👧 *Yeh lo tumhari Bachi!*\n\n@${randomUser.id.split('@')[0]} is your beautiful girl! 💖`, mentions: [randomUser.id] }, { quoted: mek });
  } catch (error) {
    console.error("Error in .bachi command:", error);
    reply("❌ An error occurred while selecting a girl.");
  }
});

// ==================== TECHNOLOGIA COMMAND ====================
cmd({
    pattern: "technologia",
    alias: ["tech", "technologyia"],
    desc: "Send the Technologia meme audio",
    category: "fun",
    react: "😂",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, {
            audio: { url: "https://files.catbox.moe/fac856.mp3" },
            mimetype: "audio/mpeg",
            ptt: false
        }, { quoted: mek });
    } catch (e) {
        console.error(e);
        reply("*❌ Technologia Failed!*\n_Blyat! Error: " + e.message + "_");
    }
});

// ==================== TAROUN COMMAND ====================
cmd({
    pattern: "taroun",
    alias: ["tadao", "tung"],
    desc: "Send the Taroun meme audio",
    category: "fun",
    react: "🎵",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const audioUrl = "https://files.catbox.moe/tkawe4.mp3";
        await conn.sendPresenceUpdate('recording', from);
        const audioResponse = await fetch(audioUrl);
        const arrayBuffer = await audioResponse.arrayBuffer();
        const audioBuffer = Buffer.from(arrayBuffer);
        await delay(3000);
        const pttAudio = await converter.toPTT(audioBuffer, 'mp3');
        await conn.sendMessage(from, {
            audio: pttAudio,
            mimetype: 'audio/ogg; codecs=opus',
            ptt: true
        }, { quoted: mek });
    } catch (e) {
        console.error(e);
        reply(`*❌ Taroun Failed!*\n_Error: ${e.message}_`);
    }
});

// ==================== CAKE COMMAND ====================
cmd({
    pattern: "cake",
    desc: "Roast Cake (Qamar) with cake-themed insults",
    category: "fun",
    react: "🎂",
    filename: __filename,
    use: "@tag"
}, async (conn, mek, m, { reply }) => {
    const cakeRoasts = [
        "Abe Cake, tu toh wahi hai jo oven mein 2 ghante mein bhi rise nahi hota!",
        "Bhai Cake, teri personality expired sponge cake jaisi hai - dry aur tasteless!",
        "Abe Cake, tera dimaag frosting ki tarah hai - zyada meetha par koi depth nahi!",
        "Tu toh wahi burnt cupcake hai jo koi kharidne nahi aata!",
        "Abe Cake, teri soch cake mix jaisi hai - just add water aur kuch bhi nahi!",
        "Bhai tu toh stale cake hai, fridge mein 1 mahine se pada hua!",
        "Abe Cake, teri zindagi eggless cake jaisi hai - missing the main ingredient!",
        "Tu toh wahi dry fruit cake hai jo sab avoid karte hain!",
        "Abe Cake, tera IQ cake tin se bhi chhota hai!",
        "Bhai tu toh melted ice cream cake hai, shapeless aur messy!",
        "Abe Cake, teri baatein fondant jaisi hain - dikhti achi hain par taste kharab!",
        "Tu toh wahi cake hai jismein candle jalaane se pehle hi bujh jaati hai!",
        "Abe Cake, tera style layered cake jaisa hai - zyada layers, zero substance!",
        "Bhai tu toh microwave cake hai - jaldi bana par koi nahi khata!",
        "Abe Cake, teri soch cake batter jaisi hai - ghulti nahi aur lumpy hai!",
        "Tu toh wahi wedding cake hai jo display ke baad kachre mein jaata hai!",
        "Abe Cake, tera dimaag cake server jaisa hai - bas pieces kaat ta hai!",
        "Bhai tu toh gluten-free cake hai - sab avoid karte hain samajh ke!",
        "Abe Cake, teri personality fruit cake jaisi hai - koi nahi chunta voluntarily!",
        "Tu toh wahi cake hai jo delivery mein damage ho gaya ho!",
        "Abe Cake, tera zindagi ka recipe hi galat hai!",
        "Bhai tu toh cake pop hai - chhota aur insignificant!",
        "Abe Cake, teri baatein cake crumbs jaisi hain - har jagah bikhri hain!",
        "Tu toh wahi cake hai jismein salt sugar ki jagah daal diya ho!",
        "Abe Cake, tera style cheesecake jaisa hai - thoda sa bhi zyada ho toh kharab!",
        "Bhai tu toh store-bought cake hai - generic aur forgettable!",
        "Abe Cake, teri soch cake decorating jaisi hai - bas upar se sahi!",
        "Tu toh wahi cake hai jo 'happy birthday' ke bina adhura lagta hai!",
        "Abe Cake, tera dimaag cake box jaisa hai - khali aur cardboard!",
        "Bhai tu toh lava cake hai - andar se bhi khaali hai!",
        "Abe Cake, teri zindagi cake walk nahi, cake fall hai!",
        "Tu toh wahi red velvet cake hai jo actually brown hai - fake!",
        "Abe Cake, tera personality cake slice jaisa hai - sabko chhota hissa chahiye!",
        "Bhai tu toh birthday cake hai - saal mein ek baar yaad aata hai!",
        "Abe Cake, teri baatein cake tester jaisi hain - chhote aur annoying!",
        "Tu toh wahi cake hai jo oven se nikaalne se pehle hi khaaya gaya - incomplete!",
        "Abe Cake, tera style bundt cake jaisa hai - weird shape, weird taste!",
        "Bhai tu toh cake boss banna chahata tha, par cake disaster ban gaya!",
        "Abe Cake, teri soch cake recipe jaisi hai - complicated aur end mein fail!",
        "Tu toh wahi cake hai jismein baking soda zyada daal diya ho - fluffy but bitter!",
        "Abe Cake, tera dimaag cake dome jaisa hai - upar se bada, andar se khaali!",
        "Bhai tu toh cake mix box hai - instructions follow karne ke bawajood kharab!",
        "Abe Cake, teri zindagi cake frosting bag jaisi hai - pressure mein burst ho jaati hai!",
        "Tu toh wahi angel food cake hai - light aur air, matlab kuch bhi nahi!",
        "Abe Cake, tera personality upside-down cake jaisa hai - sab ulta hai!",
        "Bhai tu toh cake tester hai - sabki life mein bas taste test karta hai!",
        "Abe Cake, teri baatein cake crumbs vacuum mein jaisi hain - disappear ho jaati hain!",
        "Tu toh wahi cake hai jo 'best before' date cross kar chuka hai!",
        "Abe Cake, tera style cake pop stand jaisa hai - sab gira deta hai!",
        "Bhai tu toh pound cake hai - heavy aur hard to digest!",
        "Abe Cake, teri soch cake leveler jaisi hai - sabko neeche laata hai!",
        "Tu toh wahi ice cream cake hai - do cheezon mein se bekaar wala hissa!"
    ];

    const randomRoast = cakeRoasts[Math.floor(Math.random() * cakeRoasts.length)];
    let mentionedUser = m.mentionedJid?.[0] || (mek.quoted?.sender ?? null);
    const cakeLid = "275432444264532@lid";
    const cakeNumber = "923067103522";
    let isCake = false;
    let targetPN = null;

    if (mentionedUser) {
        if (mentionedUser.includes('@lid')) {
            targetPN = await lidToPhone(conn, mentionedUser);
        } else {
            targetPN = mentionedUser.split('@')[0];
        }
        if (mentionedUser === cakeLid || targetPN === cakeNumber || mentionedUser.includes(cakeNumber)) {
            isCake = true;
        }
    }

    if (!isCake) {
        return reply("🎂 Ohh man, he is not Cake!\n\nPlease mention Cake (Qamar) to roast him!\n\n*Usage:* `.cake @Cake` or reply to Cake's message");
    }

    const finalLid = cakeLid;
    const userName = cakeNumber;
    const message = `🎂 *CAKE ALERT* 🎂\n\n@${userName} !\n*${randomRoast}*\n> Don't crumble, it's just for fun! 😄`;

    await conn.sendMessage(mek.chat, { 
        text: message,
        mentions: [finalLid],
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            mentionedJid: [finalLid]
        }
    }, { quoted: mek });
});

// ==================== PICKUP COMMAND ====================
cmd({
    pattern: "pickup",
    alias: ["pickupline", "flirtline"],
    desc: "Get a random pickup line",
    react: "💘",
    category: "fun",
    use: '.pickup',
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const { data } = await axios.get('https://apis.davidcyriltech.my.id/pickupline');
        if (!data.success) return reply("❌ Failed to get a pickup line. Try again!");
        await reply(`💝 *Pickup Line* 💝\n\n"${data.pickupline}"\n\n_Use wisely!_`);
    } catch (error) {
        console.error('Pickup Error:', error);
        reply("❌ My charm isn't working right now. Try again later!");
    }
});
