// 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳

import { fileURLToPath } from 'url';
import axios from 'axios';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "movie",
    desc: "Download YouTube video as document",
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
        const BASE_URL = 'https://xjawadtech.vercel.app/ytv3';

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

        // API URL
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

        // Get direct GoogleVideo URL
        const finalUrl = apiRes.data?.download?.url;

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

        // Download video to buffer first
        let videoBuffer;

        try {
            const videoRes = await axios.get(finalUrl, {
                responseType: 'arraybuffer',
                timeout: 180000,
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                headers: {
                    'User-Agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36',
                    'Accept': '*/*',
                    'Referer': 'https://www.youtube.com/'
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

        if (!videoBuffer || !videoBuffer.length) {
            await conn.sendMessage(from, {
                text: "❌ Downloaded video buffer is empty."
            }, { quoted: mek });

            await conn.sendMessage(from, {
                react: {
                    text: "❌",
                    key: mek.key
                }
            });

            return;
        }

        const fileName = "NAWAZ-MD-Video.mp4";

        // Send downloaded buffer as document
        await conn.sendMessage(from, {
            document: videoBuffer,
            mimetype: 'video/mp4',
            fileName: fileName,
            caption:
                `🎬 Video Downloaded\n\n` +
                `🔗 Source: YouTube\n\n` +
                `✨ Powered by Nawaz MD`
        }, { quoted: mek });

        await conn.sendMessage(from, {
            react: {
                text: "✅",
                key: mek.key
            }
        });

    } catch (e) {
        console.error("YTV3 MOVIE ERROR:", e);

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
