// play.js - ESM Version (Multiple APIs)
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
 * Get MP3 Download Link - Multiple APIs
 */
async function fetchAudio(url, retries = 2) {
    // List of APIs to try
    const apis = [
        // API 1: JawadTech
        {
            url: `https://jawad-tech.vercel.app/download/ytdl?url=${encodeURIComponent(url)}`,
            parse: (data) => data.result?.mp3
        },
        // API 2: Deline
        {
            url: `https://api.deline.web.id/downloader/ytmp3?url=${encodeURIComponent(url)}`,
            parse: (data) => data.result?.dlink
        },
        // API 3: NexRay
        {
            url: `https://api.nexray.web.id/downloader/v1/ytmp3?url=${encodeURIComponent(url)}`,
            parse: (data) => data.result?.url
        },
        // API 4: NexRay Regular
        {
            url: `https://api.nexray.web.id/downloader/ytmp3?url=${encodeURIComponent(url)}`,
            parse: (data) => data.result?.url
        }
    ];

    for (const api of apis) {
        try {
            const { data } = await axios.get(api.url, {
                timeout: 20000,
            });

            const audioUrl = api.parse(data);
            if (audioUrl) {
                return {
                    title: data.result?.title || data.metadata?.title || "Unknown Song",
                    audio: audioUrl,
                };
            }
        } catch (e) {
            console.log(`API failed: ${api.url}`, e.message);
            continue;
        }
    }

    return null;
}

cmd(
{
    pattern: "play",
    alias: ["song", "music", "audio", "mp3"],
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

const caption = `
╭───────────────🎵
│  *YOUTUBE MUSIC*
╰───────────────

🎶 *Title:* ${ytdata.title}

👤 *Channel:* ${ytdata.author?.name || "Unknown"}

⏱ *Duration:* ${ytdata.timestamp}

👁 *Views:* ${ytdata.views.toLocaleString()}

────────────────────
⬇️ Downloading Audio...

🚀 Powered by Nawaz MD
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
