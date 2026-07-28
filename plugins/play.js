import { cmd } from "../command.js";
import yts from "yt-search";
import axios from "axios";

async function fetchAudio(url) {
    const apis = [
        `https://api.nexray.web.id/downloader/v1/ytmp3?url=${encodeURIComponent(url)}`,
        `https://api.deline.web.id/downloader/ytmp3?url=${encodeURIComponent(url)}`,
        `https://api.nexray.web.id/downloader/ytmp3?url=${encodeURIComponent(url)}`
    ];

    for (const api of apis) {
        try {
            const { data } = await axios.get(api, { timeout: 15000 });

            const audio =
                data.result?.url ||
                data.result?.dlink;

            if (audio) {
                return {
                    title: data.result?.title || "Unknown Song",
                    audio
                };
            }
        } catch {}
    }

    return null;
}
cmd({
    pattern: "play",
    react: "🎵"
}, async (conn, mek, m, { from, q, reply }) => {

    if (!q) return reply("Example: .play Faded");

    try {

        const search = await yts(q);

        if (!search.videos.length)
            return reply("Song not found!");

        const video = search.videos[0];

        await reply("⏳ Waiting for download...");

        const data = await fetchAudio(video.url);

        if (!data)
            return reply("Download failed!");

        const audio = await axios.get(data.audio, {
            responseType: "arraybuffer"
        });

        await conn.sendMessage(from, {
            audio: Buffer.from(audio.data),
            mimetype: "audio/mpeg",
            fileName: `${data.title}.mp3`
        }, { quoted: mek });

    } catch (err) {
        console.log(err);
        reply(err.message);
    }

});
