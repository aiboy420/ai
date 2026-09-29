// play.js - ESM Version
// NAWAZ MD - YouTube Music Downloader

import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);


// ==========================================
// API CONFIG
// ==========================================

const API_URL =
    'https://api.alyacore.xyz/dl/ytmp3v2';

const SEARCH_URL =
    'https://api.alyacore.xyz/search/yt';

const API_KEY =
    'Duarte-zz12';

const LONG_AUDIO_SECONDS = 1800;

const ID_RE =
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/|v\/))([\w-]{11})/;


// ==========================================
// PLAY COMMAND
// ==========================================

cmd({

    pattern: "play2",

    alias: [
        "song",
        "music"
    ],

    react: "🎧",

    desc: "Download music from YouTube",

    category: "download",

    filename: __filename

}, async (
    conn,
    mek,
    m,
    {
        from,
        reply,
        text
    }
) => {

    try {

        const query =
            (text || "").trim();


        // ==================================
        // CHECK QUERY
        // ==================================

        if (!query) {

            return reply(
                `🎧 *Play Music*

Use:
.play song name
.play YouTube link

Examples:
.play Shape of You
.song Believer`
            );

        }


        await reactSafe(
            conn,
            from,
            mek,
            "🎧"
        );


        // ==================================
        // CHECK YOUTUBE ID
        // ==================================

        const id =
            query.match(ID_RE)?.[1];


        const directUrl =
            id
                ? `https://youtu.be/${id}`
                : null;


        // ==================================
        // SEARCH YOUTUBE
        // ==================================

        const info =
            await searchVideo(
                query,
                id
            );


        if (
            !info &&
            !directUrl
        ) {

            await reactSafe(
                conn,
                from,
                mek,
                "❌"
            );

            return reply(
                "❌ No song found."
            );

        }


        // ==================================
        // VIDEO INFORMATION
        // ==================================

        const url =
            info?.url ||
            directUrl;


        const title =
            info?.title ||
            "Unknown Title";


        const duration =
            info?.duration ||
            "Unknown";


        const views =
            formatViews(
                info?.views
            );


        // ==================================
        // DOWNLOAD
        // ==================================

        const download =
            await downloadAudio(
                url
            );


        const audioUrl =
            download?.data?.dl ||
            download?.data?.url ||
            download?.result?.url ||
            download?.url;


        if (!audioUrl) {

            await reactSafe(
                conn,
                from,
                mek,
                "❌"
            );

            return reply(
                "❌ API did not return an audio link."
            );

        }


        // ==================================
        // PLAY CARD
        // ==================================

        const caption =
            `🎧 *Now Playing*\n\n` +
            `🎵 *${title}*\n` +
            `👁️ *Views:* ${views}\n` +
            `⏱️ *Duration:* ${duration}\n` +
            `⏳ *Please wait...*`;


        await conn.sendMessage(
            from,
            {
                text: caption
            },
            {
                quoted: mek
            }
        );


        // ==================================
        // FILE NAME
        // ==================================

        const fileName =
            `${cleanFileName(
                download?.data?.title ||
                title
            )}.mp3`;


        // ==================================
        // SEND AUDIO
        // ==================================

        await conn.sendMessage(
            from,
            {
                audio: {
                    url: audioUrl
                },

                mimetype:
                    'audio/mpeg',

                fileName,

                ptt:
                    false
            },
            {
                quoted: mek
            }
        );


        await reactSafe(
            conn,
            from,
            mek,
            "✅"
        );


    } catch (err) {

        console.error(
            "❌ PLAY ERROR:",
            err
        );


        await reactSafe(
            conn,
            from,
            mek,
            "❌"
        );


        return reply(
            "⚠️ Error downloading the song. Please try again."
        );

    }

});


// ==========================================
// YOUTUBE SEARCH
// ==========================================

async function searchVideo(
    query,
    id
) {

    try {

        const { data } =
            await axios.get(
                SEARCH_URL,
                {
                    params: {

                        query:
                            id ||
                            query,

                        key:
                            API_KEY

                    },

                    timeout:
                        30000
                }
            );


        const results =
            data?.status &&
            Array.isArray(
                data.result
            )
                ? data.result
                : [];


        const video =
            id
                ? results.find(
                    item =>
                        item.url?.includes(id)
                )
                : results[0];


        if (!video)
            return null;


        return {

            url:
                video.url,

            title:
                video.title,

            duration:
                video.duration,

            views:
                toNumber(
                    video.views
                ),

            thumbnail:
                video.banner,

            author:
                video.autor?.trim()

        };


    } catch (err) {

        console.error(
            "❌ SEARCH API ERROR:",
            err.message
        );

        return null;

    }

}


// ==========================================
// DOWNLOAD AUDIO
// ==========================================

async function downloadAudio(
    url
) {

    const response =
        await axios.get(
            API_URL,
            {

                params: {

                    url,

                    apikey:
                        API_KEY

                },

                timeout:
                    60000

            }
        );


    return response.data;

}


// ==========================================
// SAFE REACTION
// ==========================================

async function reactSafe(
    conn,
    from,
    mek,
    emoji
) {

    try {

        if (
            conn?.sendMessage
        ) {

            await conn.sendMessage(
                from,
                {
                    react: {
                        text: emoji,
                        key: mek.key
                    }
                }
            );

        }

    } catch {

        // Ignore reaction errors

    }

}


// ==========================================
// NUMBER
// ==========================================

function toNumber(
    value
) {

    return (
        parseInt(
            String(
                value || ""
            ).replace(
                /\D/g,
                ""
            ),
            10
        ) || 0
    );

}


// ==========================================
// FORMAT VIEWS
// ==========================================

function formatViews(
    views
) {

    if (!views)
        return "N/A";


    if (
        views >=
        1_000_000_000
    ) {

        return `${(
            views /
            1_000_000_000
        ).toFixed(1)}B`;

    }


    if (
        views >=
        1_000_000
    ) {

        return `${(
            views /
            1_000_000
        ).toFixed(1)}M`;

    }


    if (
        views >=
        1_000
    ) {

        return `${(
            views /
            1_000
        ).toFixed(1)}K`;

    }


    return String(
        views
    );

}


// ==========================================
// CLEAN FILE NAME
// ==========================================

function cleanFileName(
    name
) {

    return String(name)

        .replace(
            /[\\/:*?"<>|]/g,
            ""
        )

        .replace(
            /\s+/g,
            " "
        )

        .trim()

        .slice(
            0,
            100
        )

        || "audio";

}
