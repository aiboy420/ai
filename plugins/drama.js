// drama.js - ESM Version
// NAWAZ MD - YOUTUBE VIDEO DOWNLOADER

import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import yts from 'yt-search';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);

// In-memory cache for pending downloads
const cache = new Map();

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
            `https://jawad-tech.vercel.app/download/ytdl?url=${encodeURIComponent(url)}`;

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

            // SEARCH
            const normalizedUrl = normalizeYouTubeUrl(q);
            let ytdata;

            if (normalizedUrl) {
                const searchResults = await yts({
                    videoId: normalizedUrl.split("v=")[1]
                });

                ytdata = searchResults;
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

            const videoUrl = ytdata.url;

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
            const dlData = await fetchDownloadData(videoUrl);

            if (!dlData?.video_url) {
                return reply("❌ Video link not found or expired!");
            }

            // DOWNLOAD VIDEO BUFFER
            let videoBuffer;

            try {
                const response = await axios.get(dlData.video_url, {
                    responseType: "arraybuffer",
                    timeout: 60000
                });

                videoBuffer = Buffer.from(response.data);

            } catch (err) {
                console.log("VIDEO DOWNLOAD ERROR:", err.message);
                return reply("❌ Video download failed (invalid link or large file).");
            }

            // CREATE REPLY OPTIONS
            const optionMessage = await conn.sendMessage(from, {
                text: `*╭─❍══ ⃟ ⃟ ⃟   𝙽𝙰𝚆𝙰𝚉 𝙼𝙳   ⃟ ⃟ ⃟══⊷❍*
┇◆┋📥 *Choose Download Type*
┇◆┋
┇◆┋1️⃣ *Video*
┇◆┋2️⃣ *Document*
┇◆┋
┇◆┋Reply with *1* or *2*
┇◆╰┉┉┉┉┉┉┉┉┉┉┉┉┉━┈⊷
╰═══════════════════⍟

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`
            }, {
                quoted: mek
            });

            // SAVE PENDING CHOICE
            cache.set(optionMessage.key.id, {
                from,
                videoBuffer,
                title: dlData.title || ytdata.title,
                originalMessage: mek
            });

            // AUTO EXPIRE AFTER 5 MINUTES
            setTimeout(() => {
                cache.delete(optionMessage.key.id);
            }, 5 * 60 * 1000);

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

// HANDLE REPLIES: 1 = VIDEO, 2 = DOCUMENT
cmd(
    {
        on: "text",
        fromMe: false
    },
    async (conn, mek, m, { from, body, reply }) => {
        try {
            const text = (
                body ||
                mek.message?.conversation ||
                mek.message?.extendedTextMessage?.text ||
                ""
            ).trim();

            const quotedId =
                mek.message?.extendedTextMessage?.contextInfo?.stanzaId;

            if (!quotedId || !cache.has(quotedId)) return;

            const pending = cache.get(quotedId);

            if (pending.from !== from) return;

            if (text !== "1" && text !== "2") return;

            cache.delete(quotedId);

            if (text === "1") {
                await conn.sendMessage(from, {
                    video: pending.videoBuffer,
                    mimetype: "video/mp4",
                    caption: `🎬 *${pending.title}*\n\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`
                }, {
                    quoted: mek
                });

            } else {
                await conn.sendMessage(from, {
                    document: pending.videoBuffer,
                    mimetype: "video/mp4",
                    fileName: `${pending.title}.mp4`,
                    caption: `🎬 *${pending.title}*\n\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`
                }, {
                    quoted: mek
                });
            }

            await conn.sendMessage(from, {
                react: {
                    text: "✅",
                    key: mek.key
                }
            });

        } catch (e) {
            console.log("DRAMA REPLY ERROR:", e.message);
            reply("❌ Failed to send video!");
        }
    }
);
