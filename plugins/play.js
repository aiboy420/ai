import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);

function getVideoId(url) {
    const match = url.match(
        /(?:youtube.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : null;
}

cmd({
    pattern: "play",
    alias: ["audio"],
    desc: "Download YouTube audio",
    category: "download",
    react: "🎧",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) {
            return reply("❌ Please provide song name\nExample: .play Shape of You");
        }

        const { default: yts } = await import('yt-search');

        let url = text;
        let vid = null;

        if (text.startsWith('http://') || text.startsWith('https://')) {
            if (!text.includes("youtube.com") && !text.includes("youtu.be")) {
                return reply("❌ Please provide a valid YouTube URL!");
            }

            const videoId = getVideoId(text);
            if (!videoId) return reply("❌ Invalid YouTube URL!");

            vid = await yts({ videoId });
        } else {
            const search = await yts(text);

            if (!search?.videos?.length) {
                return reply("❌ No song found!");
            }

            vid = search.videos[0];
            url = vid.url;
        }

        if (!vid) return reply("❌ No results found!");

        await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption: `*╭─❍══ ⃟ ⃟ ⃟   𝙽𝙰𝚆𝙰𝚉 𝙼𝙳   ⃟ ⃟ ⃟══⊷❍*

┇◆╭┉┉┉┉┉┉┉┉┉┉━┈⊷
┇◆┋🎧 𝐀𝐔𝐃𝐈𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑
┇◆┋
┇◆┋🎵 Title: ${vid.title}
┇◆┋⏱️ Duration: ${vid.timestamp}
┇◆┋👀 Views: ${vid.views?.toLocaleString() || 'N/A'}
┇◆┋📺 Author: ${vid.author?.name || 'Unknown'}
┇◆┋📥 Status: Downloading...
┇◆╰┉┉┉┉┉┉┉┉┉┉┉┉┉━┈⊷
╰═══════════════════⍟

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`
        }, { quoted: mek });

        // ✅ نئی فری APIs — یکے بعد دیگرے ٹرائی ہوں گی
        const audioAPIs = [
            { name: "Bhariya",  type: "bhariya" },
            { name: "Yuki",     type: "yuki" },
            { name: "Y2mate",   type: "y2mate" },
            { name: "Vreden",   type: "vreden" },
            { name: "Cobalt",   type: "cobalt" },
            { name: "Ytdl",     type: "ytdl" },
            { name: "Siputzx",  type: "siputzx" },
            { name: "NexRay",   type: "nexray" }
        ];

        let success = false;
        let lastError = null;

        for (const api of audioAPIs) {
            try {
                let audioUrl = null;

                // 1️⃣ Bhariya Music API
                if (api.type === "bhariya") {
                    const prep = await axios.get(
                        `https://bhindi1.ddns.net/music/api/prepare/${encodeURIComponent(url)}`,
                        { timeout: 20000 }
                    );
                    const songId = prep.data?.id || prep.data?.song_id;
                    if (!songId) throw new Error("Bhariya: no song ID");

                    const fetchRes = await axios.get(
                        `https://bhindi1.ddns.net/music/api/fetch/${songId}`,
                        { timeout: 20000 }
                    );
                    audioUrl = fetchRes.data?.audio_url || fetchRes.data?.audio;
                    if (!audioUrl) throw new Error("Bhariya: no audio URL");
                }

                // 2️⃣ YukiAPI
                else if (api.type === "yuki") {
                    const res = await axios.get(
                        `https://music.yukiapi.site/api/get_stream?query=${encodeURIComponent(url)}&type=audio`,
                        { timeout: 20000 }
                    );
                    audioUrl = res.data?.stream_url || res.data?.url || res.data?.audio;
                    if (!audioUrl) throw new Error("Yuki: no stream URL");
                }

                // 3️⃣ y2mate scraper
                else if (api.type === "y2mate") {
                    const res = await axios.post(
                        "https://www.y2mate.com/mates/en115/analyze/ajax",
                        `url=${encodeURIComponent(url)}&q_auto=0&ajax=1`,
                        {
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                                "X-Requested-With": "XMLHttpRequest",
                                "Origin": "https://www.y2mate.com",
                                "Referer": "https://www.y2mate.com/"
                            },
                            timeout: 20000
                        }
                    );
                    const html = res.data?.result || "";
                    const match = html.match(/href="(https:\/\/[^"]+\.mp3[^"]*)"/);
                    if (match) audioUrl = match[1];
                    if (!audioUrl) throw new Error("y2mate: no link found");
                }

                // 4️⃣ Vreden API
                else if (api.type === "vreden") {
                    const res = await axios.get(
                        `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(url)}`,
                        { timeout: 20000 }
                    );
                    audioUrl = res.data?.result?.download?.url;
                    if (!audioUrl) throw new Error("Vreden: no audio URL");
                }

                // 5️⃣ Cobalt API
                else if (api.type === "cobalt") {
                    const res = await axios.post(
                        "https://api.cobalt.tools/api/json",
                        { url: url, isAudioOnly: true },
                        {
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json"
                            },
                            timeout: 20000
                        }
                    );
                    audioUrl = res.data?.url;
                    if (!audioUrl) throw new Error("Cobalt: no audio URL");
                }

                // 6️⃣ Ytdl API
                else if (api.type === "ytdl") {
                    const res = await axios.get(
                        `https://ytdl-api.caliph.my.id/download/ytmp3?url=${encodeURIComponent(url)}`,
                        { timeout: 20000 }
                    );
                    audioUrl = res.data?.result?.url || res.data?.url;
                    if (!audioUrl) throw new Error("Ytdl: no audio URL");
                }

                // 7️⃣ Siputzx API
                else if (api.type === "siputzx") {
                    const res = await axios.get(
                        `https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(url)}`,
                        { timeout: 20000 }
                    );
                    audioUrl = res.data?.data?.url || res.data?.data?.dl;
                    if (!audioUrl) throw new Error("Siputzx: no audio URL");
                }

                // 8️⃣ NexRay API
                else if (api.type === "nexray") {
                    const res = await axios.get(
                        `https://api.nexray.web.id/downloader/youtube?url=${encodeURIComponent(url)}&format=mp3`,
                        { timeout: 20000 }
                    );
                    audioUrl = res.data?.result?.url || res.data?.result?.download;
                    if (!audioUrl) throw new Error("NexRay: no audio URL");
                }

                if (!audioUrl) continue;

                // آڈیو بھیجیں
                await conn.sendMessage(from, {
                    audio: { url: audioUrl },
                    mimetype: "audio/mpeg",
                    fileName: `${vid.title}.mp3`,
                    ptt: false
                }, { quoted: mek });

                success = true;
                break;

            } catch (e) {
                lastError = e.message;
                console.error(`⚠️ ${api.name} API failed:`, e.message);
            }
        }

        if (!success) {
            console.error("❌ All APIs failed. Last error:", lastError);
            return reply("❌ All download sources failed! Try again later.");
        }

        await conn.sendMessage(from, {
            react: { text: '✅', key: m.key }
        });

    } catch (err) {
        console.error("❌ PLAY ERROR:", err);
        reply("❌ Error occurred! Please try again later.");

        await conn.sendMessage(from, {
            react: { text: '❌', key: m.key }
        });
    }
});
