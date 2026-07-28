import { cmd } from "../command.js";
import yts from "yt-search";
import axios from "axios";

async function fetchAudio(url) {
    const apis = [
        {
            url: `https://api.nexray.web.id/downloader/v1/ytmp3?url=${encodeURIComponent(url)}`,
            parse: d => d.result?.url
        },
        {
            url: `https://api.deline.web.id/downloader/ytmp3?url=${encodeURIComponent(url)}`,
            parse: d => d.result?.dlink
        },
        {
            url: `https://api.nexray.web.id/downloader/ytmp3?url=${encodeURIComponent(url)}`,
            parse: d => d.result?.url
        }
    ];

    for (const api of apis) {
        try {
            const { data } = await axios.get(api.url, { timeout: 15000 });
            const audio = api.parse(data);
            if (audio) {
                return {
                    title: data.result?.title || "Unknown",
                    audio
                };
            }
        } catch {}
    }

    return null;
}
cmd({
    pattern: "play"
}, async (conn, mek, m, { from, q, reply }) => {

    if (!q) return reply("Example: .play Faded");

    const search = await yts(q);

    if (!search.videos.length)
        return reply("Song not found!");

    const video = search.videos[0];

    await reply("⏳ Waiting for download...");

    const data = await fetchAudio(video.url);

    if (!data)
        return reply("Download failed!");

    await conn.sendMessage(from, {
        audio: { url: data.audio },
        mimetype: "audio/mpeg",
        fileName: `${data.title}.mp3"
    }, { quoted: mek });

});
