// drama.js - ESM Version
// NAWAZ MD - YOUTUBE VIDEO DOWNLOADER

import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import yts from 'yt-search';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);

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
 * Get Download Link API
 */
async function fetchDownloadData(url, retries = 2) {
    try {
        const apiUrl =
            `https://api-dark-shan-yt.koyeb.app/download/ytmp4?url=${encodeURIComponent(url)}&apikey=96f1fd99744e5c39`;

        const response = await axios.get(apiUrl, {
            timeout: 20000
        });

        const data = response.data;

        if (data.status === true && data.result?.mp4) {
            return {
                video_url: data.result.mp4,
                title: data.result.title || "YouTube Video"
            };
        }

        throw new Error("API failed");

    } catch (e) {
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            return fetchDownloadData(url, retries - 1);
        }

        console.log("DOWNLOAD API ERROR:", e.message);
        return null;
    }
}

// MAIN COMMAND
cmd(
    {
        pattern: "drama",
        alias: ["ytmp4", "vdl"],
        react: "🔁",
        desc: "YouTube Video Downloader",
        category: "download",
        filename: __filename
    },

    async (conn, mek, m, { from, q, reply, prefix, command }) => {
        try {
            if (!q) {
                return reply(
                    `🎥 *Usage:* ${prefix + command} video name or link`
                );
            }

            await conn.sendMessage(from, {
                react: {
                    text: "🔍",
                    key: mek.key
                }
            });

            // SEARCH VIDEO
            const normalizedUrl = normalizeYouTubeUrl(q);
            let ytdata;

            if (normalizedUrl) {
                const videoId = normalizedUrl.split("v=")[1];
                ytdata = await yts({ videoId });
            } else {
                const searchResults = await yts(q);

                if (!searchResults.videos?.length) {
                    return reply("❌ No video found!");
                }

                ytdata = searchResults.videos[0];
            }

            if (!ytdata) {
                return reply("❌ No video found!");
            }

            // VIDEO INFO - NAWAZ MD STYLE
            const infoText = `*╭─❍══ ⃟ ⃟ ⃟   𝙽𝙰𝚆𝙰𝚉 𝙼𝙳   ⃟ ⃟ ⃟══⊷❍*
┇◆╭┉┉┉┉┉┉┉┉┉┉━┈᛭
┇◆┋📹 *𝐕𝐈𝐃𝐄𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑*
┇◆┋
┇◆┋🎬 *Title:* ${ytdata.title}
┇◆┋📺 *Channel:* ${ytdata.author?.name || "Unknown"}
┇◆┋⏱️ *Duration:* ${ytdata.timestamp || "Unknown"}
┇◆┋👁️ *Views:* ${ytdata.views?.toLocaleString?.() || "Unknown"}
┇◆┋📥 *Status:* Downloading Video...
┇◆╰┉┉┉┉┉┉┉┉┉┉┉┉┉━┈⊷
╰═══════════════════⍟

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`;

            await conn.sendMessage(from, {
                image: {
                    url: ytdata.thumbnail || ytdata.image
                },
                caption: infoText
            }, {
                quoted: mek
            });

            await conn.sendMessage(from, {
                react: {
                    text: "⏳",
                    key: mek.key
                }
            });

            // GET DOWNLOAD LINK
            const dlData = await fetchDownloadData(
                normalizedUrl || ytdata.url
            );

            if (!dlData?.video_url) {
                return reply("❌ Video link not found or expired!");
            }

            // DOWNLOAD VIDEO
            let videoBuffer;

            try {
                const videoResponse = await axios.get(dlData.video_url, {
                    responseType: "arraybuffer",
                    timeout: 60000
                });

                videoBuffer = Buffer.from(videoResponse.data);

            } catch (err) {
                console.log("VIDEO DOWNLOAD ERROR:", err.message);
                return reply(
                    "❌ Video download failed (invalid link or large file)."
                );
            }

            // SEND VIDEO DIRECTLY
            await conn.sendMessage(from, {
                video: videoBuffer,
                mimetype: "video/mp4",
                caption: `🎬 *${dlData.title || ytdata.title}*\n\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`
            }, {
                quoted: mek
            });

            await conn.sendMessage(from, {
                react: {
                    text: "✅",
                    key: mek.key
                }
            });

        } catch (e) {
            console.log("DRAMA COMMAND ERROR:", e);

            await conn.sendMessage(from, {
                react: {
                    text: "❌",
                    key: mek.key
                }
            });

            reply("⚠️ Something went wrong!");
        }
    }
);
