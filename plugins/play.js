import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);

// Helper to extract YouTube video ID
function getVideoId(url) {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
}

// ============================================
// COMMAND: play (Audio Only) - With Fallback
// ============================================
cmd({
    pattern: "play",
    alias: ["song", "music", "audio"],
    desc: "Download YouTube audio",
    category: "download",
    react: "🎧",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) return reply("❌ Please provide song name\nExample: .play Shape of You");

        // YouTube search
        const { default: yts } = await import('yt-search');
        
        let url = text;
        let vid = null;

        if (text.startsWith('http://') || text.startsWith('https://')) {
            if (!text.includes("youtube.com") && !text.includes("youtu.be")) {
                return reply("❌ Please provide a valid YouTube URL!");
            }
            const videoId = getVideoId(text);
            if (!videoId) return reply("❌ Invalid YouTube URL!");
            const searchFromUrl = await yts({ videoId: videoId });
            vid = searchFromUrl;
        } else {
            const search = await yts(text);
            if (!search.videos || !search.videos.length) {
                return reply("❌ No song found!");
            }
            vid = search.videos[0];
            url = vid.url;
        }

        if (!vid) return reply("❌ No results found!");

        await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption: `╭━━〔 *Play* 〕━━┈⊷
┃❖╭─────────────·๏
┃❖┃ Title: ${vid.title}
┃❖┃ Duration: ${vid.timestamp}
┃❖┃ Views: ${vid.views?.toLocaleString() || 'N/A'}
┃❖┃ Author: ${vid.author?.name || 'Unknown'}
┃❖┃ Status: Downloading...
┃❖└───────────┈⊷
╰──────────────┈⊷

> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳*`
        }, { quoted: mek });

        let audioUrl = null;
        let success = false;
        let finalTitle = vid.title;

        const AXIOS_DEFAULTS = {
            timeout: 60000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*'
            }
        };

        const tryRequest = async (getter, attempts = 3) => {
            let lastError;
            for (let attempt = 1; attempt <= attempts; attempt++) {
                try {
                    return await getter();
                } catch (err) {
                    lastError = err;
                    if (attempt < attempts) {
                        await new Promise(r => setTimeout(r, 1000 * attempt));
                    }
                }
            }
            throw lastError;
        };

        const apiMethods = [
            {
                name: 'EliteProTech',
                method: async () => {
                    const apiUrl = `https://eliteprotech-apis.zone.id/ytdown?url=${encodeURIComponent(url)}&format=mp3`;
                    const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
                    if (res?.data?.success && res?.data?.downloadURL) {
                        return { download: res.data.downloadURL, title: res.data.title };
                    }
                    throw new Error('EliteProTech returned no download');
                }
            },
            {
                name: 'Yupra',
                method: async () => {
                    const apiUrl = `https://api.yupra.my.id/api/downloader/ytmp3?url=${encodeURIComponent(url)}`;
                    const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
                    if (res?.data?.success && res?.data?.data?.download_url) {
                        return {
                            download: res.data.data.download_url,
                            title: res.data.data.title
                        };
                    }
                    throw new Error('Yupra returned no download');
                }
            },
            {
                name: 'Okatsu',
                method: async () => {
                    const apiUrl = `https://okatsu-rolezapiiz.vercel.app/downloader/ytmp3?url=${encodeURIComponent(url)}`;
                    const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
                    if (res?.data?.dl) {
                        return {
                            download: res.data.dl,
                            title: res.data.title
                        };
                    }
                    throw new Error('Okatsu returned no download');
                }
            },
            {
                name: 'Alya',
                method: async () => {
                    const res = await tryRequest(() =>
                        axios.get(
                            `https://api.alyachan.pro/api/ytmp3?url=${encodeURIComponent(url)}&apikey=G7I6X7`,
                            AXIOS_DEFAULTS
                        )
                    );
                    if (res?.data?.status && res?.data?.data?.url) {
                        return {
                            download: res.data.data.url,
                            title: res.data.data.title
                        };
                    }
                    throw new Error('Alya failed');
                }
            },
            {
                name: 'Vreden',
                method: async () => {
                    const res = await tryRequest(() =>
                        axios.get(
                            `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(url)}`,
                            AXIOS_DEFAULTS
                        )
                    );
                    if (res?.data?.status && res?.data?.result?.download?.url) {
                        return {
                            download: res.data.result.download.url,
                            title: res.data.result.metadata.title
                        };
                    }
                    throw new Error('Vreden failed');
                }
            }
        ];

        for (const apiMethod of apiMethods) {
            try {
                const audioData = await apiMethod.method();
                if (!audioData?.download) continue;

                const audioResponse = await axios.get(audioData.download, {
                    responseType: 'arraybuffer',
                    timeout: 120000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0',
                        'Accept': '*/*'
                    }
                });

                const buffer = Buffer.from(audioResponse.data);
                if (buffer.length > 0) {
                    audioUrl = audioData.download;
                    finalTitle = audioData.title || vid.title;
                    success = true;

                    await conn.sendMessage(from, {
                        audio: buffer,
                        mimetype: "audio/mpeg",
                        fileName: `${finalTitle}.mp3`,
                        ptt: false
                    }, { quoted: mek });

                    break;
                }
            } catch (e) {
                console.log(`${apiMethod.name} failed:`, e.message);
            }
        }

        if (!success) {
            return reply("❌ All download sources failed! Try again later.");
        }

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error("❌ PLAY ERROR:", err);
        reply("❌ Error occurred! Please try again later.");
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});
