//---------------------------------------------------------------------------
//              NAWAZ-MD - MOVIE VIDEO DOWNLOADER
//---------------------------------------------------------------------------
//              🎬 SEARCH & DOWNLOAD MOVIE VIDEOS
//---------------------------------------------------------------------------

import { fileURLToPath } from "url";
import { cmd } from "../command.js";
import axios from "axios";
import yts from "yt-search";

const __filename = fileURLToPath(import.meta.url);

// Simple in-memory cache
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
 * Fetch Movie / Video Download Data
 * Jawad-Tech API
 */
async function fetchMovieData(url, retries = 2) {
    try {
        if (cache.has(url)) {
            return cache.get(url);
        }

        const apiUrl =
            `https://jawad-tech.vercel.app/download/ytdl?url=${encodeURIComponent(url)}`;

        const response = await axios.get(apiUrl, {
            timeout: 30000
        });

        const data = response.data;

        if (data?.status === true && data?.result?.mp4) {

            const result = {
                video_url: data.result.mp4,
                title: data.result.title || "Movie"
            };

            cache.set(url, result);

            return result;
        }

        throw new Error("API did not return a download link.");

    } catch (error) {

        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            return fetchMovieData(url, retries - 1);
        }

        return null;
    }
}

//---------------------------------------------------------------------------
//                         MOVIE COMMAND
//---------------------------------------------------------------------------

cmd({
    pattern: "movie",
    alias: ["mov", "film", "movies"],
    desc: "Search and download movie videos.",
    category: "download",
    react: "🎬",
    filename: __filename
}, async (conn, mek, m, { from, text, reply, prefix, command }) => {

    try {

        // Check query
        if (!text) {
            return reply(
                `🎬 *𝙈𝙤𝙫𝙞𝙚 𝘿𝙤𝙬𝙣𝙡𝙤𝙖𝙙𝙚𝙧*\n\n` +
                `📌 *𝙐𝙨𝙖𝙜𝙚:* ${prefix + command} <movie name or link>\n\n` +
                `📝 *𝙀𝙭𝙖𝙢𝙥𝙡𝙚:* ${prefix + command} Avengers Endgame`
            );
        }

        // Search reaction
        await conn.sendMessage(from, {
            react: {
                text: "🔍",
                key: mek.key
            }
        });

        // Check direct YouTube URL
        const directUrl = normalizeYouTubeUrl(text);

        let ytdata;

        //------------------------------------------------------------------------
        // DIRECT URL
        //------------------------------------------------------------------------

        if (directUrl) {

            const videoId = directUrl.match(/[?&]v=([^&]+)/)?.[1];

            const result = await yts({
                videoId: videoId
            });

            ytdata = result;

        }

        //------------------------------------------------------------------------
        // SEARCH MOVIE NAME
        //------------------------------------------------------------------------

        else {

            const search = await yts(text);

            if (!search?.videos?.length) {

                await conn.sendMessage(from, {
                    react: {
                        text: "❌",
                        key: mek.key
                    }
                });

                return reply(
                    "❌ *𝙈𝙤𝙫𝙞𝙚 𝙉𝙤𝙩 𝙁𝙤𝙪𝙣𝙙*\n\n" +
                    "𝙋𝙡𝙚𝙖𝙨𝙚 𝙩𝙧𝙮 𝙖𝙣𝙤𝙩𝙝𝙚𝙧 𝙢𝙤𝙫𝙞𝙚 𝙣𝙖𝙢𝙚."
                );
            }

            ytdata = search.videos[0];
        }

        // Check result
        if (!ytdata?.url) {
            return reply(
                "❌ *𝘾𝙤𝙪𝙡𝙙 𝙣𝙤𝙩 𝙛𝙞𝙣𝙙 𝙩𝙝𝙚 𝙢𝙤𝙫𝙞𝙚 𝙫𝙞𝙙𝙚𝙤.*"
            );
        }

        //------------------------------------------------------------------------
        // MOVIE INFORMATION
        //------------------------------------------------------------------------

        const infoText =
`🎬 *𝙉𝘼𝙒𝘼𝙕 𝙈𝘿 𝙈𝙊𝙑𝙄𝙀 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿𝙀𝙍*

🎥 *𝙏𝙞𝙩𝙡𝙚:* ${ytdata.title}

📺 *𝘾𝙝𝙖𝙣𝙣𝙚𝙡:* ${ytdata.author?.name || "Unknown"}

⏱️ *𝘿𝙪𝙧𝙖𝙩𝙞𝙤𝙣:* ${ytdata.timestamp || "Unknown"}

👁️ *𝙑𝙞𝙚𝙬𝙨:* ${
            typeof ytdata.views === "number"
                ? ytdata.views.toLocaleString()
                : "Unknown"
        }

⏳ *𝙋𝙧𝙤𝙘𝙚𝙨𝙨𝙞𝙣𝙜, 𝙥𝙡𝙚𝙖𝙨𝙚 𝙬𝙖𝙞𝙩...*

⚡ *𝙋𝙤𝙬𝙚𝙧𝙚𝙙 𝘽𝙮 𝙉𝙖𝙬𝙖𝙯 𝙈𝘿*`;

        //------------------------------------------------------------------------
        // SEND MOVIE INFO
        //------------------------------------------------------------------------

        if (ytdata.thumbnail || ytdata.image) {

            await conn.sendMessage(
                from,
                {
                    image: {
                        url: ytdata.thumbnail || ytdata.image
                    },
                    caption: infoText
                },
                {
                    quoted: mek
                }
            );

        } else {

            await reply(infoText);
        }

        // Processing reaction
        await conn.sendMessage(from, {
            react: {
                text: "⏳",
                key: mek.key
            }
        });

        //------------------------------------------------------------------------
        // GET DOWNLOAD LINK
        //------------------------------------------------------------------------

        const dlData = await fetchMovieData(ytdata.url);

        if (!dlData?.video_url) {

            await conn.sendMessage(from, {
                react: {
                    text: "❌",
                    key: mek.key
                }
            });

            return reply(
                "❌ *𝙈𝙤𝙫𝙞𝙚 𝘿𝙤𝙬𝙣𝙡𝙤𝙖𝙙 𝙁𝙖𝙞𝙡𝙚𝙙*\n\n" +
                "𝙋𝙡𝙚𝙖𝙨𝙚 𝙩𝙧𝙮 𝙖𝙜𝙖𝙞𝙣 𝙡𝙖𝙩𝙚𝙧."
            );
        }

        //------------------------------------------------------------------------
        // SEND PLAYABLE MOVIE VIDEO
        //------------------------------------------------------------------------

        await conn.sendMessage(
            from,
            {
                video: {
                    url: dlData.video_url
                },

                mimetype: "video/mp4",

                caption:
`🎬 *𝙈𝙤𝙫𝙞𝙚 𝘿𝙤𝙬𝙣𝙡𝙤𝙖𝙙𝙚𝙙 𝙎𝙪𝙘𝙘𝙚𝙨𝙨𝙛𝙪𝙡𝙡𝙮* ✅

🎥 *𝙏𝙞𝙩𝙡𝙚:* ${dlData.title}

⚡ *𝙋𝙤𝙬𝙚𝙧𝙚𝙙 𝘽𝙮 𝙉𝙖𝙬𝙖𝙯 𝙈𝘿*`,

                contextInfo: {
                    externalAdReply: {
                        title: "NAWAZ MD MOVIE DOWNLOADER",
                        body: dlData.title,
                        thumbnailUrl: ytdata.thumbnail || ytdata.image,
                        sourceUrl: ytdata.url,
                        mediaType: 2,
                        renderLargerThumbnail: false
                    }
                }
            },
            {
                quoted: mek
            }
        );

        // Success reaction
        await conn.sendMessage(from, {
            react: {
                text: "✅",
                key: mek.key
            }
        });

    } catch (error) {

        console.error("Movie Downloader Error:", error);

        await conn.sendMessage(from, {
            react: {
                text: "❌",
                key: mek.key
            }
        });

        return reply(
            `⚠️ *𝙈𝙤𝙫𝙞𝙚 𝘿𝙤𝙬𝙣𝙡𝙤𝙖𝙙 𝙀𝙧𝙧𝙤𝙧*\n\n` +
            `${error.message || "Something went wrong."}`
        );
    }
});
