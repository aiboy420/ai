import { cmd } from "../command.js";
import yts from "yt-search";
import axios from "axios";

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

cmd({
    pattern: "play",
    alias: ["song", "music", "mp3"],
    react: "🎵",
    desc: "Download YouTube Audio",
    category: "download"
}, async (conn, mek, m, { from, q, reply }) => {

    try {

        if (!q) return reply("🎵 Example: .play Faded");

        const search = await yts(q);

        if (!search.videos.length)
            return reply("❌ Song not found!");

        const video = search.videos[0];

        await reply(`🎵 *${video.title}*\n\n⏳ Waiting for download...`);

        const data = await fetchAudio(video.url);

        if (!data || !data.audio)
            return reply("❌ Download failed!");

        await conn.sendMessage(from, {
            audio: { url: data.audio },
            mimetype: "audio/mpeg",
            fileName: `${data.title}.mp3`,
            ptt: false
        }, { quoted: mek });

    } catch (err) {
        console.log(err);
        reply("❌ Error: " + err.message);
    }

});
