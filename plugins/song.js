// play.js - ESM Version (New Title Style)
// NAWAZ MD - YOUTUBE MUSIC DOWNLOADER
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cmd } from '../command.js';
import yts from 'yt-search';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cache
const cache = new Map();

/**
 * Normalize YouTube URL
 */
function normalizeYouTubeUrl(url) {
    const match = url.match(
        /(?:youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/.*[?&]v=)([a-zA-Z0-9_-]{11})/
    );
    return match ? `https://youtube.com/watch?v=${match[1]}` : null;
}

/**
 * Get MP3 Download Link - Only Deline API
 */
async function fetchAudio(url, retries = 2) {
    try {
        const apiUrl = `https://api.deline.web.id/downloader/ytmp3?url=${encodeURIComponent(url)}`;
        
        const { data } = await axios.get(apiUrl, {
            timeout: 15000,
        });

        if (data?.status && data?.result?.dlink) {
            return {
                title: data.result.title || "Unknown Song",
                audio: data.result.dlink,
            };
        }

        throw new Error("API Error");

    } catch (e) {
        if (retries > 0) {
            await new Promise(r => setTimeout(r, 2000));
            return fetchAudio(url, retries - 1);
        }
        return null;
    }
}

cmd(
{
    pattern: "play2",
    alias: ["song2", "music", "audio", "mp3"],
    react: "🎵",
    desc: "Download YouTube Audio",
    category: "download",
    filename: __filename,
},
    async (conn, mek, m, { from, q, reply, prefix, command }) => {

try {

if (!q) {
return reply(`🎵 *Usage:* ${prefix + command} Faded`);
}

await conn.sendMessage(from, {
react: {
text: "🔍",
key: mek.key
}
});

const url = normalizeYouTubeUrl(q);

let ytdata;

if (url) {

const search = await yts(q);
ytdata = search.videos?.[0];

} else {

const search = await yts(q);

if (!search.videos.length) {
return reply("❌ Song not found!");
}

ytdata = search.videos[0];

}

// ✅ NEW TITLE STYLE
const caption = `
╔═══════════════════════╗
║    🎵 𝗡𝗔𝗪𝗔𝗭 𝗧𝗘𝗖𝗛 𝗫 🎵    ║
╚═══════════════════════╝

╭─❍「 📀 SONG INFO 」
│
├ 🎵 Title    : ${ytdata.title}
├ 👤 Channel  : ${ytdata.author?.name || "Unknown"}
├ ⏱ Duration : ${ytdata.timestamp}
├ 👁 Views    : ${ytdata.views?.toLocaleString() || "Unknown"}
│
╰─────────────────

⏳ Please wait...
🎧 Audio is being prepared.

╔═══════════════════════╗
║  💜 Powered By Nawaz MD  ║
╚═══════════════════════╝
`;

await conn.sendMessage(from,{
image:{url:ytdata.thumbnail || ytdata.image},
caption
},{quoted:mek});

await conn.sendMessage(from,{
react:{
text:"⏳",
key:mek.key
}
});

const dlData = await fetchAudio(ytdata.url);

if (!dlData || !dlData.audio){
return reply("❌ Audio link not found! Try again later.");
}
    try {

const audioBuffer = await axios.get(dlData.audio,{
responseType:"arraybuffer",
timeout:60000
});

await conn.sendMessage(from,{
audio:Buffer.from(audioBuffer.data),
mimetype:"audio/mpeg",
fileName:`${dlData.title}.mp3`,
ptt:false
},{quoted:mek});

await conn.sendMessage(from,{
react:{
text:"✅",
key:mek.key
}
});

} catch(err){

console.log("AUDIO SEND ERROR:",err.message);

return reply("❌ Audio send failed!");

}

} catch(e){

console.log("PLAY ERROR:",e);

await conn.sendMessage(from,{
react:{
text:"❌",
key:mek.key
}
});

reply("⚠️ Something went wrong!");

}

});
