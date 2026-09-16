//---------------------------------------------------------------------------
//                    NAWAZ MD - SONG DOWNLOADER
//---------------------------------------------------------------------------

import { fileURLToPath } from "url";
import { cmd } from "../command.js";
import axios from "axios";
import yts from "yt-search";

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "song2",
    alias: ["yta", "audio", "music"],
    desc: "Download YouTube songs as audio",
    category: "download",
    react: "🎵",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {

    try {
        if (!text) {
            return reply(
                "🎵 *Please provide a song name or YouTube URL.*\n\n" +
                "Example:\n" +
                "`.song Believer Imagine Dragons`"
            );
        }

        let videoUrl = text.trim();
        let title = text.trim();

        // Search YouTube if user gives song name
        if (!/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(videoUrl)) {

            const search = await yts(videoUrl);

            if (!search.videos || !search.videos.length) {
                return reply("❌ *Song not found.*");
            }

            const video = search.videos[0];

            videoUrl = video.url;
            title = video.title;
        }

        await reply("⏳ *Downloading song, please wait...*");

        // API Download
        const api = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(videoUrl)}`;

        const { data } = await axios.get(api, {
            timeout: 120000
        });

        console.log("SONG API RESPONSE:", data);

        // Try common response formats
        const audioUrl =
            data?.url ||
            data?.audio ||
            data?.audio_url ||
            data?.download ||
            data?.download_url ||
            data?.result?.url ||
            data?.result?.audio ||
            data?.result?.audio_url ||
            data?.result?.download ||
            data?.result?.download_url;

        if (!audioUrl) {
            return reply(
                "❌ *Song download failed.*\n\n" +
                "API did not return a valid audio URL."
            );
        }

        await conn.sendMessage(from, {
            audio: { url: audioUrl },
            mimetype: "audio/mpeg",
            fileName: `${title}.mp3`,
            ptt: false
        }, { quoted: mek });

    } catch (error) {

        console.error("SONG ERROR:", error);

        return reply(
            "❌ *Song download failed.*\n" +
            "Please try again later."
        );
    }
});
