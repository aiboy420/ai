// 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳

import { fileURLToPath } from 'url';
import axios from 'axios';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "movie",
    desc: "Automatically download a movie as a document",
    category: "download",
    react: "🎬",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            return reply(
                `╭─❍══ ⃟ ⃟ ⃟   𝙽𝙰𝚆𝙰𝚉 𝙼𝙳   ⃟ ⃟ ⃟══⊷❍\n` +
                `┇◆┋ 🎬 *CINESUBZ MOVIE*\n` +
                `┇◆┋\n` +
                `┇◆┋ ❌ Please enter a movie name!\n` +
                `┇◆┋ 📌 Example: .movie3 Superman\n` +
                `╰─❍`
            );
        }

        const API_KEY = '12f85decd3d58102';
        const BASE_URL = 'https://api-dark-shan-yt.koyeb.app/movie';

        await conn.sendMessage(from, {
            react: { text: "⏳", key: mek.key }
        });

        // First message: downloading started
        await conn.sendMessage(from, {
            text:
                `╭─❍══ ⃟ ⃟ ⃟   𝙽𝙰𝚆𝙰𝚉 𝙼𝙳   ⃟ ⃟ ⃟══⊷❍\n` +
                `┇◆┋ 🎬 *MOVIE DOWNLOADING STARTED*\n` +
                `┇◆┋\n` +
                `┇◆┋ 🎥 *Movie:* ${q}\n` +
                `┇◆┋ ⏳ Please wait, your movie is being prepared...\n` +
                `╰─❍`
        }, { quoted: mek });

        // Search movie
        const searchUrl =
            `${BASE_URL}/cinesubz-search?q=${encodeURIComponent(q)}&apikey=${API_KEY}`;

        const searchRes = await axios.get(searchUrl, { timeout: 60000 });

        if (!searchRes.data?.status || !searchRes.data.data?.length) {
            await conn.sendMessage(from, {
                text: "❌ No movie found. Please try another movie name."
            }, { quoted: mek });

            await conn.sendMessage(from, {
                react: { text: "❌", key: mek.key }
            });
            return;
        }

        // Automatically select first result
        const movie = searchRes.data.data[0];
        const movieTitle = movie.title.split('|')[0].trim();

        // Get movie info and available downloads
        const infoUrl =
            `${BASE_URL}/cinesubz-info?url=${encodeURIComponent(movie.link)}&apikey=${API_KEY}`;

        const infoRes = await axios.get(infoUrl, { timeout: 60000 });

        const downloads = infoRes.data?.data?.downloads;

        if (!infoRes.data?.status || !downloads?.length) {
            await conn.sendMessage(from, {
                text: "❌ No download links found for this movie."
            }, { quoted: mek });

            await conn.sendMessage(from, {
                react: { text: "❌", key: mek.key }
            });
            return;
        }

        // Automatically select first available quality
        const selectedQuality = downloads[0];

        const downloadUrl =
            `${BASE_URL}/cinesubz-download?url=${encodeURIComponent(selectedQuality.link)}&apikey=${API_KEY}`;

        const downloadRes = await axios.get(downloadUrl, { timeout: 60000 });

        const downloadInfo = downloadRes.data?.data?.download;

        if (!downloadRes.data?.status || !downloadInfo?.length) {
            await conn.sendMessage(from, {
                text: "❌ Failed to retrieve the download link."
            }, { quoted: mek });

            await conn.sendMessage(from, {
                react: { text: "❌", key: mek.key }
            });
            return;
        }

        const directItem =
            downloadInfo.find(d => d.name === 'unknown') || downloadInfo[0];

        const finalUrl = directItem?.url;

        if (!finalUrl) {
            await conn.sendMessage(from, {
                text: "❌ No valid file link was returned."
            }, { quoted: mek });

            await conn.sendMessage(from, {
                react: { text: "❌", key: mek.key }
            });
            return;
        }

        const fileName =
            `${movieTitle} [${selectedQuality.quality || 'Movie'}] CineSubz.mp4`;

        // Second message: movie document
        await conn.sendMessage(from, {
            document: { url: finalUrl },
            mimetype: 'video/mp4',
            fileName,
            caption:
                `╭─❍══ ⃟ ⃟ ⃟   𝙽𝙰𝚆𝙰𝚉 𝙼𝙳   ⃟ ⃟ ⃟══⊷❍\n` +
                `┇◆┋ 🎬 *${movieTitle}*\n` +
                `┇◆┋ 💿 *Quality:* ${selectedQuality.quality || 'N/A'}\n` +
                `┇◆┋ 📦 *Size:* ${selectedQuality.size || 'N/A'}\n` +
                `┇◆┋ 👑 *𝙿𝚘𝚠𝚎𝚛 𝙱𝚢 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳*\n` +
                `╰─❍`
        }, { quoted: mek });

        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
        });

    } catch (e) {
        console.error("CineSubz movie3 error:", e);

        await conn.sendMessage(from, {
            react: { text: "❌", key: mek.key }
        });

        return reply(
            "❌ *Download failed. The API may be unavailable or the movie link may be invalid.*"
        );
    }
});
