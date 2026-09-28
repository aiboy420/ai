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

        let apiRes;

        try {
            apiRes = await axios.get(apiUrl, {
                timeout: 60000,
                validateStatus: () => true
            });
        } catch (apiError) {
            console.error("API REQUEST ERROR:", apiError);

            await conn.sendMessage(from, {
                text:
                    `❌ API Request Failed\n\n` +
                    `Error: ${apiError.message}`
            }, { quoted: mek });

            await conn.sendMessage(from, {
                react: {
                    text: "❌",
                    key: mek.key
                }
            });

            return;
        }

        // Debug API response
        console.log("YTV3 HTTP STATUS:", apiRes.status);
        console.log("YTV3 RESPONSE:", apiRes.data);

        // HTTP error
        if (apiRes.status < 200 || apiRes.status >= 300) {
            const responseText =
                typeof apiRes.data === "string"
                    ? apiRes.data
                    : JSON.stringify(apiRes.data, null, 2);

            await conn.sendMessage(from, {
                text:
                    `❌ API HTTP Error\n\n` +
                    `📡 Status: ${apiRes.status}\n\n` +
                    `📄 Response:\n${responseText.slice(0, 3000)}`
            }, { quoted: mek });

            await conn.sendMessage(from, {
                react: {
                    text: "❌",
                    key: mek.key
                }
            });

            return;
        }

        // API status false
        if (!apiRes.data?.status) {
            await conn.sendMessage(from, {
                text:
                    `❌ API returned an error.\n\n` +
                    `📡 HTTP Status: ${apiRes.status}\n\n` +
                    `📄 Response:\n` +
                    `${JSON.stringify(apiRes.data, null, 2).slice(0, 3000)}`
            }, { quoted: mek });

            await conn.sendMessage(from, {
                react: {
                    text: "❌",
                    key: mek.key
                }
            });

            return;
        }

        // Get download URL
        const finalUrl = apiRes.data?.download?.url;

        if (!finalUrl) {
            await conn.sendMessage(from, {
                text:
                    `❌ Download URL missing.\n\n` +
                    `📄 API Response:\n` +
                    `${JSON.stringify(apiRes.data, null, 2).slice(0, 3000)}`
            }, { quoted: mek });

            await conn.sendMessage(from, {
                react: {
                    text: "❌",
                    key: mek.key
                }
            });

            return;
        }

        console.log("YTV3 DOWNLOAD URL:", finalUrl);

        const fileName = "NAWAZ-MD-Video.mp4";

        // Send document
        try {
            await conn.sendMessage(from, {
                document: {
                    url: finalUrl
                },
                mimetype: 'video/mp4',
                fileName: fileName,
                caption:
                    `🎬 Video Downloaded\n\n` +
                    `🔗 Source: YouTube\n\n` +
                    `✨ Powered by Nawaz MD`
            }, { quoted: mek });

        } catch (sendError) {
            console.error("DOCUMENT SEND ERROR:", sendError);

            await conn.sendMessage(from, {
                text:
                    `❌ File Send Failed\n\n` +
                    `Error: ${sendError.message}\n\n` +
                    `🔗 API URL was received successfully.`
            }, { quoted: mek });

            await conn.sendMessage(from, {
                react: {
                    text: "❌",
                    key: mek.key
                }
            });

            return;
        }

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
            `❌ Unexpected Error\n\n${e.message}`
        );
    }
});
