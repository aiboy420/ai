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
            return reply("❌ Please enter a YouTube URL!\n\nExample: .movie https://youtu.be/xxxxx");
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
            text: `🎬 Downloading started...\n\n🔗 URL: ${q}\n\n⏳ Please wait...`
        }, { quoted: mek });

        // YTV3 API
        const apiUrl =
            `${BASE_URL}?url=${encodeURIComponent(q)}&key=${API_KEY}`;

        const apiRes = await axios.get(apiUrl, {
            timeout: 60000
        });

        if (!apiRes.data?.status) {
            await conn.sendMessage(from, {
                text: "❌ Failed to retrieve the download link."
            }, { quoted: mek });

            await conn.sendMessage(from, {
                react: {
                    text: "❌",
                    key: mek.key
                }
            });

            return;
        }

        const finalUrl = apiRes.data?.download?.url;

        if (!finalUrl) {
            await conn.sendMessage(from, {
                text: "❌ No valid file link was returned."
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

        // Second message - Document
        await conn.sendMessage(from, {
            document: {
                url: finalUrl
            },
            mimetype: 'video/mp4',
            fileName: fileName,
            caption: `🎬 Video Downloaded\n\n🔗 Source: YouTube\n\n✨ Powered by Nawaz MD`
        }, { quoted: mek });

        await conn.sendMessage(from, {
            react: {
                text: "✅",
                key: mek.key
            }
        });

    } catch (e) {
        console.error("YTV3 movie error:", e);

        await conn.sendMessage(from, {
            react: {
                text: "❌",
                key: mek.key
            }
        });

        return reply(
            "❌ Download failed. The API may be unavailable or the YouTube link may be invalid."
        );
    }
});
