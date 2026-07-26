// plugins/more-utility.js - ESM Version
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import config from '../config.js';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { sleep } from '../lib/functions.js';

const __filename = fileURLToPath(import.meta.url);

// ==================== SURAH COMMAND ====================
cmd({
    pattern: "surah",
    desc: "Play Quran surah audio by number (1-114)",
    category: "download",
    react: "📖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return await reply("📖 Please provide a surah number!\n\nExample: .surah 1");

        const surahNumber = parseInt(q);
        if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
            return await reply("❌ Invalid surah number! Use 1-114");
        }

        const audioUrl = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNumber}.mp3`;
        
        const response = await axios({
            method: 'GET',
            url: audioUrl,
            responseType: 'stream'
        });

        const stream = response.data;
        stream._readableState = stream._readableState || {};
        stream.url = audioUrl;

        await conn.sendMessage(from, {
            document: stream,
            mimetype: "audio/mpeg",
            fileName: `SURAH-${surahNumber}.mp3`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("Error in .surah command:", e);
        await reply("❌ Error occurred, please try again!");
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});

// ==================== BLOCK COMMAND ====================
cmd({
    pattern: "block",
    desc: "Blocks a person",
    category: "owner",
    react: "🚫",
    filename: __filename
}, async (conn, m, { reply, q, react }) => {
    const botOwner = conn.user.id.split(":")[0] + "@s.whatsapp.net";
    
    if (m.sender !== botOwner) {
        await react("❌");
        return reply("Only the bot owner can use this command.");
    }

    let jid;
    if (m.quoted) {
        jid = m.quoted.sender;
    } else if (m.mentionedJid && m.mentionedJid.length > 0) {
        jid = m.mentionedJid[0];
    } else if (q && q.includes("@")) {
        jid = q.replace(/[@\s]/g, '') + "@s.whatsapp.net";
    } else {
        await react("❌");
        return reply("Please mention a user or reply to their message.");
    }

    try {
        await conn.updateBlockStatus(jid, "block");
        await react("✅");
        reply(`Successfully blocked @${jid.split("@")[0]}`, { mentions: [jid] });
    } catch (error) {
        console.error("Block command error:", error);
        await react("❌");
        reply("Failed to block the user.");
    }
});

// ==================== UNBLOCK COMMAND ====================
cmd({
    pattern: "unblock",
    desc: "Unblocks a person",
    category: "owner",
    react: "🔓",
    filename: __filename
}, async (conn, m, { reply, q, react }) => {
    const botOwner = conn.user.id.split(":")[0] + "@s.whatsapp.net";

    if (m.sender !== botOwner) {
        await react("❌");
        return reply("Only the bot owner can use this command.");
    }

    let jid;
    if (m.quoted) {
        jid = m.quoted.sender;
    } else if (m.mentionedJid && m.mentionedJid.length > 0) {
        jid = m.mentionedJid[0];
    } else if (q && q.includes("@")) {
        jid = q.replace(/[@\s]/g, '') + "@s.whatsapp.net";
    } else {
        await react("❌");
        return reply("Please mention a user or reply to their message.");
    }

    try {
        await conn.updateBlockStatus(jid, "unblock");
        await react("✅");
        reply(`Successfully unblocked @${jid.split("@")[0]}`, { mentions: [jid] });
    } catch (error) {
        console.error("Unblock command error:", error);
        await react("❌");
        reply("Failed to unblock the user.");
    }
});

// ==================== PRAYTIME COMMAND ====================
cmd({
    pattern: "praytime", 
    alias: ["prayertimes", "prayertime", "ptime"], 
    react: "✅", 
    desc: "Get the prayer times, weather, and location for the city.", 
    category: "utility", 
    filename: __filename,
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        const city = args.length > 0 ? args.join(" ") : "bhakkar";
        const apiUrl = `https://api.nexoracle.com/islamic/prayer-times?city=${city}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            return reply('Error fetching prayer times!');
        }

        const data = await response.json();

        if (data.status !== 200) {
            return reply('Failed to get prayer times. Please try again later.');
        }

        const prayerTimes = data.result.items[0];
        const weather = data.result.today_weather;
        const location = data.result.city;

        let dec = `*Prayer Times for ${location}, ${data.result.state}*\n\n`;
        dec += `📍 *Location*: ${location}, ${data.result.state}, ${data.result.country}\n`;
        dec += `🕌 *Method*: ${data.result.prayer_method_name}\n\n`;
        dec += `🌅 *Fajr*: ${prayerTimes.fajr}\n`;
        dec += `🌄 *Shurooq*: ${prayerTimes.shurooq}\n`;
        dec += `☀️ *Dhuhr*: ${prayerTimes.dhuhr}\n`;
        dec += `🌇 *Asr*: ${prayerTimes.asr}\n`;
        dec += `🌆 *Maghrib*: ${prayerTimes.maghrib}\n`;
        dec += `🌃 *Isha*: ${prayerTimes.isha}\n\n`;
        dec += `🧭 *Qibla Direction*: ${data.result.qibla_direction}°\n`;

        const temperature = weather.temperature !== null ? `${weather.temperature}°C` : 'Data not available';
        dec += `🌡️ *Temperature*: ${temperature}\n`;

        await conn.sendMessage(from, {
            image: { url: `https://files.catbox.moe/8fy6up.jpg` },
            caption: dec,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363426829681935@newsletter',
                    newsletterName: 'NawazTechX',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply('*Error occurred while fetching prayer times and weather.*');
    }
});

// ==================== PRIVACY COMMAND ====================
cmd({
    pattern: "privacy",
    alias: ["privacymenu"],
    desc: "Privacy settings menu",
    category: "setting",
    react: "🔐",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        let privacyMenu = `╭━━〔 *Privacy Settings* 〕━━┈⊷
┃◈╭─────────────·๏
┃◈┃• blocklist - View blocked users
┃◈┃• getbio - Get user's bio
┃◈┃• setppall - Set profile pic privacy
┃◈┃• setonline - Set online privacy
┃◈┃• setpp - Change bot's profile pic
┃◈┃• setmyname - Change bot's name
┃◈┃• updatebio - Change bot's bio
┃◈┃• groupsprivacy - Set group add privacy
┃◈┃• getprivacy - View current privacy settings
┃◈┃• getpp - Get user's profile picture
┃◈┃
┃◈┃*Options for privacy commands:*
┃◈┃• all - Everyone
┃◈┃• contacts - My contacts only
┃◈┃• contact_blacklist - Contacts except blocked
┃◈┃• none - Nobody
┃◈┃• match_last_seen - Match last seen
┃◈└───────────┈⊷
╰──────────────┈⊷
*Note:* Most commands are owner-only`;

        await conn.sendMessage(from, {
            image: { url: `https://files.catbox.moe/7zfdcq.jpg` },
            caption: privacyMenu,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363426829681935@newsletter',
                    newsletterName: "Privacy Settings",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// ==================== BLOCKLIST COMMAND ====================
cmd({
    pattern: "blocklist",
    desc: "View the list of blocked users.",
    category: "setting",
    react: "📋",
    filename: __filename
}, async (conn, mek, m, { from, isCreator, reply }) => {
    if (!isCreator) return reply("*📛 You are not the owner!*");

    try {
        const blockedUsers = await conn.fetchBlocklist();

        if (blockedUsers.length === 0) {
            return reply("📋 Your block list is empty.");
        }

        const list = blockedUsers.map((user, i) => `🚧 BLOCKED ${user.split('@')[0]}`).join('\n');
        const count = blockedUsers.length;
        reply(`📋 Blocked Users (${count}):\n\n${list}`);
    } catch (err) {
        console.error(err);
        reply(`❌ Failed to fetch block list: ${err.message}`);
    }
});

// ==================== GETBIO COMMAND ====================
cmd({
    pattern: "getbio",
    desc: "Displays the user's bio.",
    category: "setting",
    filename: __filename,
}, async (conn, mek, m, { args, reply }) => {
    try {
        const jid = args[0] || mek.key.remoteJid;
        const about = await conn.fetchStatus?.(jid);
        if (!about) return reply("No bio found.");
        return reply(`User Bio:\n\n${about.status}`);
    } catch (error) {
        console.error("Error in bio command:", error);
        reply("No bio found.");
    }
});

// ==================== SETPPALL COMMAND ====================
cmd({
    pattern: "setppall",
    desc: "Update Profile Picture Privacy",
    category: "setting",
    react: "🔐",
    filename: __filename
}, async (conn, mek, m, { args, isCreator, reply }) => {
    if (!isCreator) return reply("❌ You are not the owner!");
    
    try {
        const value = args[0] || 'all'; 
        const validValues = ['all', 'contacts', 'contact_blacklist', 'none'];  
        
        if (!validValues.includes(value)) {
            return reply("❌ Invalid option. Valid options are: 'all', 'contacts', 'contact_blacklist', 'none'.");
        }
        
        await conn.updateProfilePicturePrivacy(value);
        reply(`✅ Profile picture privacy updated to: ${value}`);
    } catch (e) {
        return reply(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});

// ==================== SETONLINE COMMAND ====================
cmd({
    pattern: "setonline",
    desc: "Update Online Privacy",
    category: "setting",
    react: "🔐",
    filename: __filename
}, async (conn, mek, m, { args, isCreator, reply }) => {
    if (!isCreator) return reply("❌ You are not the owner!");

    try {
        const value = args[0] || 'all'; 
        const validValues = ['all', 'match_last_seen'];
        
        if (!validValues.includes(value)) {
            return reply("❌ Invalid option. Valid options are: 'all', 'match_last_seen'.");
        }

        await conn.updateOnlinePrivacy(value);
        reply(`✅ Online privacy updated to: ${value}`);
    } catch (e) {
        return reply(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});

// ==================== SETNAME COMMAND ====================
cmd({
    pattern: "setname",
    desc: "Set your WhatsApp display name.",
    category: "setting",
    react: "👄",
    filename: __filename
}, async (conn, mek, m, { isCreator, reply, args }) => {
    if (!isCreator) return reply("❌ You are not the owner!");

    const displayName = args.join(" ");
    if (!displayName) return reply("❌ Please provide a display name.");

    try {
        await conn.updateProfileName(displayName);
        reply(`✅ Your display name has been set to: ${displayName}`);
    } catch (err) {
        console.error(err);
        reply("❌ Failed to set your display name.");
    }
});

// ==================== UPDATEBIO COMMAND ====================
cmd({
    pattern: "updatebio",
    react: "🥏",
    desc: "Change the Bot number Bio.",
    category: "setting",
    use: '.updatebio',
    filename: __filename
}, async (conn, mek, m, { from, q, isCreator, reply }) => {
    try {
        if (!isCreator) return reply('🚫 *You must be an Owner to use this command*');
        if (!q) return reply('❓ *Enter the New Bio*');
        if (q.length > 139) return reply('❗ *Sorry! Character limit exceeded*');
        await conn.updateProfileStatus(q);
        await conn.sendMessage(from, { text: "✔️ *New Bio Added Successfully*" }, { quoted: mek });
    } catch (e) {
        reply('🚫 *An error occurred!*\n\n' + e);
        console.log(e);
    }
});

// ==================== GROUPSPRIVACY COMMAND ====================
cmd({
    pattern: "groupsprivacy",
    desc: "Update Group Add Privacy",
    category: "setting",
    react: "🔐",
    filename: __filename
}, async (conn, mek, m, { args, isCreator, reply }) => {
    if (!isCreator) return reply("❌ You are not the owner!");

    try {
        const value = args[0] || 'all'; 
        const validValues = ['all', 'contacts', 'contact_blacklist', 'none'];
        
        if (!validValues.includes(value)) {
            return reply("❌ Invalid option. Valid options are: 'all', 'contacts', 'contact_blacklist', 'none'.");
        }

        await conn.updateGroupsAddPrivacy(value);
        reply(`✅ Group add privacy updated to: ${value}`);
    } catch (e) {
        return reply(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});

// ==================== GETPRIVACY COMMAND ====================
cmd({
    pattern: "getprivacy",
    desc: "Get the bot Number Privacy Setting Updates.",
    category: "setting",
    use: '.getprivacy',
    filename: __filename
}, async (conn, mek, m, { from, isCreator, reply }) => {
    try {
        if (!isCreator) return reply('🚫 *You must be an Owner to use this command*');
        const duka = await conn.fetchPrivacySettings?.(true);
        if (!duka) return reply('🚫 *Failed to fetch privacy settings*');
        
        let puka = `
╭───「 𝙿𝚁𝙸𝚅𝙰𝙲𝚈  」───◆  
│ ∘ 𝚁𝚎𝚊𝚍 𝚁𝚎𝚌𝚎𝚒𝚙𝚝: ${duka.readreceipts}  
│ ∘ 𝙿𝚛𝚘𝚏𝚒𝚕𝚎 𝙿𝚒𝚌𝚝𝚞𝚛𝚎: ${duka.profile}  
│ ∘ 𝚂𝚝𝚊𝚝𝚞𝚜: ${duka.status}  
│ ∘ 𝙾𝚗𝚕𝚒𝚗𝚎: ${duka.online}  
│ ∘ 𝙻𝚊𝚜𝚝 𝚂𝚎𝚎𝚗: ${duka.last}  
│ ∘ 𝙶𝚛𝚘𝚞𝚙 𝙿𝚛𝚒𝚟𝚊𝚌𝚢: ${duka.groupadd}  
│ ∘ 𝙲𝚊𝚕𝚕 𝙿𝚛𝚒𝚟𝚊𝚌𝚢: ${duka.calladd}  
╰────────────────────`;
        await conn.sendMessage(from, { text: puka }, { quoted: mek });
    } catch (e) {
        reply('🚫 *An error occurred!*\n\n' + e);
        console.log(e);
    }
});

// ==================== CAPTION COMMAND ====================
cmd({
    pattern: "caption",
    alias: ["cap", "recaption", "c"],
    react: '✏️',
    desc: "Add or change caption of media/document",
    category: "utility",
    filename: __filename
}, async (client, message, match, { from }) => {
    try {
        if (!message.quoted) {
            return await client.sendMessage(from, {
                text: "*🍁 Please reply to a media message (image/video/document) to add caption!*\n\n*Usage:*\n- Reply to media with .caption [your text]\n- Or just .caption [text] to add caption to previous media"
            }, { quoted: message });
        }

        const quotedMsg = message.quoted;
        if (!quotedMsg || !quotedMsg.download) {
            return await client.sendMessage(from, {
                text: "❌ The quoted message is not valid media"
            }, { quoted: message });
        }

        const buffer = await quotedMsg.download();
        const mtype = quotedMsg.mtype;
        
        const cmdText = message.body.split(' ')[0].toLowerCase();
        const newCaption = message.body.slice(cmdText.length).trim();

        if (!buffer) {
            return await client.sendMessage(from, {
                text: "❌ Failed to download the media"
            }, { quoted: message });
        }

        const messageContent = {
            caption: newCaption,
            mimetype: quotedMsg.mimetype
        };

        switch (mtype) {
            case "imageMessage":
                messageContent.image = buffer;
                messageContent.mimetype = messageContent.mimetype || "image/jpeg";
                break;
            case "videoMessage":
                messageContent.video = buffer;
                messageContent.mimetype = messageContent.mimetype || "video/mp4";
                break;
            case "documentMessage":
                messageContent.document = buffer;
                messageContent.mimetype = messageContent.mimetype || "application/octet-stream";
                break;
            case "audioMessage":
                messageContent.audio = buffer;
                messageContent.mimetype = messageContent.mimetype || "audio/mp4";
                messageContent.ptt = quotedMsg.ptt || false;
                break;
            default:
                return await client.sendMessage(from, {
                    text: "❌ Only image, video, document and audio messages can be recaptioned"
                }, { quoted: message });
        }

        await client.sendMessage(from, messageContent, { quoted: message });

    } catch (error) {
        console.error("Caption Error:", error);
        await client.sendMessage(from, {
            text: "❌ Error adding caption:\n" + (error.message || error.toString())
        }, { quoted: message });
    }
});

// ==================== REPEAT COMMAND ====================
cmd({
    pattern: "repeat",
    alias: ["rp", "rpm"],
    desc: "Repeat a message a specified number of times.",
    category: "fun",
    filename: __filename
}, async (conn, m, store, { args, reply, from }) => {
    try {
        if (!args[0]) {
            return reply("✳️ Use this command like:\n*Example:* .repeat 10,I love you");
        }

        const [countStr, ...messageParts] = args.join(" ").split(",");
        const count = parseInt(countStr.trim());
        const message = messageParts.join(",").trim();

        if (isNaN(count) || count <= 0 || count > 300) {
            return reply("❎ Please specify a valid number between 1 and 300.");
        }

        if (!message) {
            return reply("❎ Please provide a message to repeat.");
        }

        reply(`🔁 Sending "${message}" ${count} times...`);

        for (let i = 0; i < count; i++) {
            await conn.sendMessage(from, { text: message }, { quoted: m });
            await sleep(1000);
        }

    } catch (error) {
        console.error("❌ Error in repeat command:", error);
        reply("❎ An error occurred while processing your request.");
    }
});

// ==================== SREPO COMMAND ====================
cmd({
    pattern: "srepo",
    desc: "Fetch information about a GitHub repository.",
    category: "other",
    react: "🍃",
    filename: __filename
}, async (conn, m, store, { from, args, reply }) => {
    try {
        const repoName = args.join(" ");
        if (!repoName) {
            return reply("❌ Please provide a GitHub repository in the format 📌 `owner/repo`.");
        }

        const apiUrl = `https://api.github.com/repos/${repoName}`;
        const { data } = await axios.get(apiUrl);

        let responseMsg = `📁 *GitHub Repository Info* 📁\n\n`;
        responseMsg += `📌 *Name*: ${data.name}\n`;
        responseMsg += `🔗 *URL*: ${data.html_url}\n`;
        responseMsg += `📝 *Description*: ${data.description || "No description"}\n`;
        responseMsg += `⭐ *Stars*: ${data.stargazers_count}\n`;
        responseMsg += `🍴 *Forks*: ${data.forks_count}\n`;
        responseMsg += `👤 *Owner*: ${data.owner.login}\n`;
        responseMsg += `📅 *Created At*: ${new Date(data.created_at).toLocaleDateString()}\n`;
        responseMsg += `\n> *© Powered by NawazTechX*`;

        await conn.sendMessage(from, { text: responseMsg }, { quoted: m });
    } catch (error) {
        console.error("GitHub API Error:", error);
        reply(`❌ Error fetching repository data: ${error.response?.data?.message || error.message}`);
    }
});
