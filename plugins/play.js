import { fileURLToPath } from "url";
import { dirname } from "path";
import { cmd } from "../command.js";
import yts from "yt-search";
import axios from "axios";

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

    return match
        ? `https://youtube.com/watch?v=${match[1]}`
        : null;
}

/**
 * Fetch Audio
 */
async function fetchAudio(url) {

    const apis = [

        {
            url: `https://api.nexray.web.id/downloader/v1/ytmp3?url=${encodeURIComponent(url)}`,
            parse: data => data.result?.url,
            title: data => data.result?.title || "Unknown Song"
        },

        {
            url: `https://api.deline.web.id/downloader/ytmp3?url=${encodeURIComponent(url)}`,
            parse: data => data.result?.dlink,
            title: data => data.result?.title || "Unknown Song"
        },

        {
            url: `https://api.nexray.web.id/downloader/ytmp3?url=${encodeURIComponent(url)}`,
            parse: data => data.result?.url,
            title: data => data.result?.title || "Unknown Song"
        }

    ];

    for (const api of apis) {

        try {

            const { data } = await axios.get(api.url, {
                timeout: 15000
            });

            const audio = api.parse(data);

            if (audio) {
                return {
                    title: api.title(data),
                    audio
                };
            }

        } catch (err) {

            console.log("API Failed:", api.url);

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

await conn.sendMessage(from,{
react:{
text:"🔍",
key:mek.key
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
╭━━━━━━━━━━━━━━━╮
┃ 🎶 𝗡𝗔𝗪𝗔𝗭 𝗠𝗗 🎶
╰━━━━━━━━━━━━━━━╯

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

╭────────────────╮
│ Powered By Nawaz MD
╰────────────────╯
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

if (!dlData || !dlData.audio) {
    return reply("❌ Audio link not found!");
}

try {

    const audio = await axios.get(dlData.audio, {
        responseType: "arraybuffer",
        timeout: 60000
    });

    await conn.sendMessage(from, {
        audio: Buffer.from(audio.data),
        mimetype: "audio/mpeg",
        fileName: `${dlData.title}.mp3`,
        ptt: false
    }, { quoted: mek });

    await conn.sendMessage(from, {
        react: {
            text: "✅",
            key: mek.key
        }
    });

} catch (err) {

    console.log("AUDIO SEND ERROR:", err);

    return reply("❌ Audio send failed!");

}

} catch (err) {

    console.log("PLAY ERROR:", err);

    await conn.sendMessage(from, {
        react: {
            text: "❌",
            key: mek.key
        }
    });

    reply("⚠️ Something went wrong!");

}

});                                                                 }
