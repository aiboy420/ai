import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);

function getVideoId(url) {
    const match = url.match(
        /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    );
    return match ? match[1] : null;
}

/* =========================================================
   MULTIPLE VIDEO APIs
   API 1 fail → API 2 → API 3 → API 4...
   ========================================================= */

async function fetchDownloadData(url) {

    const apis = [

        // API 1 — Jawad Tech
        {
            name: "Jawad Tech",
            run: async () => {
                const apiUrl =
                    `https://jawad-tech.vercel.app/download/ytdl?url=${encodeURIComponent(url)}`;

                const response = await axios.get(apiUrl, {
                    timeout: 20000
                });

                const data = response.data;

                if (data?.status === true && data.result?.mp4) {
                    return {
                        video_url: data.result.mp4,
                        title: data.result.title || "YouTube Video"
                    };
                }

                throw new Error("Jawad API failed");
            }
        },

        // API 2 — Arslan
        {
            name: "Arslan",
            run: async () => {
                const response = await axios.get(
                    `https://arslan-apis-v2.vercel.app/download/ytmp4`,
                    {
                        params: { url },
                        timeout: 30000
                    }
                );

                const data = response.data;

                if (
                    data?.status === true &&
                    data?.result?.download?.url
                ) {
                    return {
                        video_url: data.result.download.url,
                        title:
                            data.result.metadata?.title ||
                            "YouTube Video"
                    };
                }

                throw new Error("Arslan API failed");
            }
        },

        // API 3 — EliteProTech
        {
            name: "EliteProTech",
            run: async () => {
                const response = await axios.get(
                    `https://eliteprotech-apis.zone.id/ytdown`,
                    {
                        params: {
                            url,
                            format: "mp4"
                        },
                        timeout: 30000
                    }
                );

                const data = response.data;

                if (
                    data?.success &&
                    data?.downloadURL
                ) {
                    return {
                        video_url: data.downloadURL,
                        title: data.title || "YouTube Video"
                    };
                }

                throw new Error("EliteProTech API failed");
            }
        },

        // API 4 — Gifted Tech
        {
            name: "Gifted Tech",
            run: async () => {
                const response = await axios.get(
                    `https://api.giftedtech.co.ke/api/download/ytmp4v2`,
                    {
                        params: {
                            apikey: "gifted",
                            url
                        },
                        timeout: 30000
                    }
                );

                const data = response.data;

                if (
                    data?.success &&
                    data?.result?.download_url
                ) {
                    return {
                        video_url: data.result.download_url,
                        title:
                            data.result.title ||
                            "YouTube Video"
                    };
                }

                throw new Error("Gifted API failed");
            }
        },

        // API 5 — Qasim Dev
        {
            name: "Qasim Dev",
            run: async () => {
                const apiUrl =
                    `https://api.qasimdev.dpdns.org/api/loaderto/download?apiKey=qasim-dev&format=360&url=${encodeURIComponent(url)}`;

                const response = await axios.get(apiUrl, {
                    timeout: 60000
                });

                const data = response.data;

                if (
                    data?.success &&
                    data?.data?.downloadUrl
                ) {
                    return {
                        video_url: data.data.downloadUrl,
                        title:
                            data.data.title ||
                            "YouTube Video"
                    };
                }

                throw new Error("Qasim API failed");
            }
        },

        // API 6 — Agatz
        {
            name: "Agatz",
            run: async () => {
                const response = await axios.get(
                    `https://api.agatz.xyz/api/ytmp4`,
                    {
                        params: { url },
                        timeout: 30000
                    }
                );

                const data = response.data;

                if (
                    data?.data?.download?.url
                ) {
                    return {
                        video_url:
                            data.data.download.url,
                        title:
                            data.data.title ||
                            "YouTube Video"
                    };
                }

                throw new Error("Agatz API failed");
            }
        },

        // API 7 — Ryzendesu
        {
            name: "Ryzendesu",
            run: async () => {
                const response = await axios.get(
                    `https://api.ryzendesu.vip/api/downloader/ytmp4`,
                    {
                        params: { url },
                        timeout: 30000
                    }
                );

                const data = response.data;

                if (data?.url) {
                    return {
                        video_url: data.url,
                        title:
                            data.title ||
                            "YouTube Video"
                    };
                }

                throw new Error("Ryzendesu API failed");
            }
        },

        // API 8 — Siputzx
        {
            name: "Siputzx",
            run: async () => {
                const response = await axios.get(
                    `https://api.siputzx.my.id/api/d/ytmp4`,
                    {
                        params: { url },
                        timeout: 30000
                    }
                );

                const data = response.data;

                if (
                    data?.data?.download?.url
                ) {
                    return {
                        video_url:
                            data.data.download.url,
                        title:
                            data.data.metadata?.title ||
                            "YouTube Video"
                    };
                }

                throw new Error("Siputzx API failed");
            }
        }
    ];

    for (const api of apis) {
        try {
            console.log(`[VIDEO] Trying ${api.name}...`);

            const result = await api.run();

            if (result?.video_url) {
                console.log(
                    `[VIDEO] ✅ ${api.name} SUCCESS`
                );

                return result;
            }

        } catch (error) {
            console.log(
                `[VIDEO] ❌ ${api.name} FAILED:`,
                error.message
            );

            // अगली API automatically चलेगी
        }
    }

    console.error(
        "[VIDEO] ❌ All video APIs failed"
    );

    return null;
}

cmd({
    pattern: "video",
    alias: ["ytv", "ytmp4", "vd"],
    desc: "Download YouTube video",
    category: "download",
    react: "📹",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {

        if (!text) {
            return reply(
                "🎥 Please provide a video name or link!\n\nExample: .video Alone Marshmello"
            );
        }

        const { default: yts } = await import('yt-search');

        let url = text;
        let vid = null;

        if (
            text.startsWith('http://') ||
            text.startsWith('https://')
        ) {

            if (
                !text.includes("youtube.com") &&
                !text.includes("youtu.be")
            ) {
                return reply(
                    "❌ Please provide a valid YouTube URL!"
                );
            }

            const videoId = getVideoId(text);

            if (!videoId) {
                return reply(
                    "❌ Invalid YouTube URL!"
                );
            }

            vid = await yts({ videoId });

        } else {

            const search = await yts(text);

            if (!search?.videos?.length) {
                return reply(
                    "❌ No video results found!"
                );
            }

            vid = search.videos[0];
            url = vid.url;
        }

        if (!vid) {
            return reply(
                "❌ No results found!"
            );
        }

        await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption: `*╭─❍══ ⃟ ⃟ ⃟   𝙽𝙰𝚆𝙰𝚉 𝙼𝙳   ⃟ ⃟ ⃟══⊷❍*
┇◆╭┉┉┉┉┉┉┉┉┉┉━┈᛭
┇◆┋📹 *𝐕𝐈𝐃𝐄𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑*
┇◆┋
┇◆┋🎬 *Title:* ${vid.title}
┇◆┋📺 *Channel:* ${vid.author?.name || 'Unknown'}
┇◆┋⏱️ *Duration:* ${vid.timestamp}
┇◆┋📥 *Status:* Downloading Video...
┇◆╰┉┉┉┉┉┉┉┉┉┉┉┉┉━┈⊷
╰═══════════════════⍟

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`
        }, { quoted: mek });

        // =================================================
        // सभी APIs क्रम से try होंगी
        // =================================================

        const result = await fetchDownloadData(url);

        if (!result?.video_url) {
            return reply(
                "❌ Video API failed! Please try again later."
            );
        }

        await conn.sendMessage(from, {
            video: { url: result.video_url },
            caption: `🎬 *${result.title || vid.title}*\n\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`
        }, { quoted: mek });

        await conn.sendMessage(from, {
            react: {
                text: '✅',
                key: m.key
            }
        });

    } catch (e) {

        console.error(
            "Error in .video command:",
            e
        );

        reply(
            "❌ Error occurred, please try again later!"
        );

        await conn.sendMessage(from, {
            react: {
                text: '❌',
                key: m.key
            }
        });
    }
});
