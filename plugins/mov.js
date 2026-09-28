// 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳

import { fileURLToPath } from 'url';
import axios from 'axios';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "movie",
    desc: "Download YouTube video as a document",
    category: "download",
    react: "🎬",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            return reply(
                "❌ Please enter a YouTube URL!\n\n" +
                "Example: .movie https://youtu.be/xxxxx"
            );
        }

        const API_KEY = 'erfanxjawadi';
        const BASE_URL = 'https://xjawadtech.vercel.app/ytdl';

        await conn.sendMessage(from, {
            react: {
                text: "⏳",
                key: mek.key
            }
        });

        // First message
        await conn.sendMessage(from, {
            text:
                `🎬 Downloading started...\n\n` +
                `🔗 URL: ${q}\n\n` +
                `⏳ Please wait...`
        }, { quoted: mek });

        // YTDL API
        const apiUrl =
            `${BASE_URL}?url=${encodeURIComponent(q)}&key=${API_KEY}`;

        const apiRes = await axios.get(apiUrl, {
            timeout: 60000
        });

        if (!apiRes.data?.status) {
            await conn.sendMessage(from, {
                text: "❌ API failed to generate the download link."
            }, { quoted: mek });

            await conn.sendMessage(from, {
                react: {
                    text: "❌",
                    key: mek.key
                }
            });

            return;
        }

        const finalUrl = apiRes.data?.download?.urlx;
        const title = apiRes.data?.download?.title || "NAWAZ MD Video";

        if (!finalUrl) {
            await conn.sendMessage(from, {
                text: "❌ No download URL received from API."
            }, { quoted: mek });

            await conn.sendMessage(from, {
                react: {
                    text: "❌",
                    key: mek.key
                }
            });

            return;
        }

        // Download video to buffer
        let videoBuffer;

        try {
            const videoRes = await axios.get(finalUrl, {
                responseType: 'arraybuffer',
                timeout: 180000,
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                headers: {
                    'User-Agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36'
                }
            });

            videoBuffer = Buffer.from(videoRes.data);

        } catch (downloadError) {
            console.error("VIDEO DOWNLOAD ERROR:", downloadError);

            await conn.sendMessage(from, {
                text:
                    `❌ Video download failed.\n\n` +
                    `Error: ${downloadError.message}`
            }, { quoted: mek });

            await conn.sendMessage(from, {
                react: {
                    text: "❌",
                    key: mek.key
                }
            });

            return;
        }

        if (!videoBuffer?.length) {
            await conn.sendMessage(from, {
                text: "❌ Downloaded video is empty."
            }, { quoted: mek });

            return;
        }

        const fileName =
            `${title.replace(/[\\/:*?"<>|]/g, '')}.mp4`;

        // Send document
        await conn.sendMessage(from, {
            document: videoBuffer,
            mimetype: 'video/mp4',
            fileName,
            caption:
                `🎬 ${title}\n\n` +
                `✨ Powered by Nawaz MD`
        }, { quoted: mek });

        await conn.sendMessage(from, {
            react: {
                text: "✅",
                key: mek.key
            }
        });

    } catch (e) {
        console.error("YTDL MOVIE ERROR:", e);

        await conn.sendMessage(from, {
            react: {
                text: "❌",
                key: mek.key
            }
        });

        return reply(
            `❌ Download failed.\n\nError: ${e.message}`
        );
    }
});
