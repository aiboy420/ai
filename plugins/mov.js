// 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳

import { fileURLToPath } from 'url';
import axios from 'axios';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "movie",
    desc: "Search and download movies from CineSubz with interactive steps",
    category: "download",
    react: "🎬",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, reply }) => {
    try {
        if (!q) {
            return reply(
                `╭─❍══ ⃟ ⃟ ⃟   𝙽𝙰𝚆𝙰𝚉 𝙼𝙳   ⃟ ⃟ ⃟══⊷❍\n` +
                `┇◆┋ 🎬 *CINESUBZ MOVIE*\n` +
                `┇◆┋\n` +
                `┇◆┋ ❌ Please enter a movie name!\n` +
                `┇◆┋\n` +
                `┇◆┋ 📌 *Example:* .movie3 Avatar\n` +
                `┇◆┋ ⚡ *Version:* 12.00\n` +
                `╰─❍`
            );
        }

        await conn.sendMessage(from, {
            react: { text: "⏳", key: mek.key }
        });

        const API_KEY = '12f85decd3d58102';
        const BASE_URL = 'https://api-dark-shan-yt.koyeb.app/movie';

        const searchUrl = `${BASE_URL}/cinesubz-search?q=${encodeURIComponent(q)}&apikey=${API_KEY}`;
        const searchRes = await axios.get(searchUrl, { timeout: 60000 });

        if (!searchRes.data?.status || !searchRes.data.data?.length) {
            await conn.sendMessage(from, {
                react: { text: "❌", key: mek.key }
            });
            return reply("❌ *No movie found!*");
        }

        const results = searchRes.data.data.slice(0, 5);
        const firstImage = results[0].image;

        const resultsList = results.map((movie, i) => {
            const title = movie.title.split('|')[0].trim();
            return `┇◆┋ *${i + 1} ┃ ${title}*\n┇◆┋ 🎬 Movie • ${movie.quality || 'N/A'}`;
        }).join('\n\n');

        const searchCaption = `
╭─❍══ ⃟ ⃟ ⃟   𝙽𝙰𝚆𝙰𝚉 𝙼𝙳   ⃟ ⃟ ⃟══⊷❍
┇◆┋ 🎬 *CINESUBZ SEARCH*
┇◆┋
${resultsList}

┇◆┋ 🔢 *Reply with a number to select a movie* 👇
┇◆┋
┇◆┋ ⚡ *Version:* 12.00
┇◆┋ 👑 *𝙿𝚘𝚠𝚎𝚛 𝙱𝚢 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳*
╰─❍`.trim();

        const searchMsg = await conn.sendMessage(from, {
            image: { url: firstImage },
            caption: searchCaption
        }, { quoted: mek });

        let step = 'movie',
            lastMsgId = searchMsg.key.id,
            selectedMovie = null,
            downloads = null,
            finalUrl = null,
            selectedQuality = null,
            movieTitle = '',
            timeout = null;

        const cleanup = () => {
            if (timeout) clearTimeout(timeout);
            conn.ev.off('messages.upsert', handler);
        };

        const handler = async (msgUpdate) => {
            try {
                const received = msgUpdate.messages[0];
                if (!received) return;

                const fromId = received.key.remoteJid || received.key.participant;
                if (fromId !== from) return;

                const quotedId = received.message?.extendedTextMessage?.contextInfo?.stanzaId;
                if (!quotedId || quotedId !== lastMsgId) return;

                const text = received.message?.conversation ||
                    received.message?.extendedTextMessage?.text;

                if (!text) return;

                const choice = parseInt(text.trim());

                if (isNaN(choice)) {
                    await conn.sendMessage(from, {
                        text: '❎ Please enter a valid number.'
                    }, { quoted: received });
                    return;
                }

                await conn.sendMessage(from, {
                    react: { text: '⏳', key: received.key }
                });

                if (step === 'movie') {
                    if (choice < 1 || choice > results.length) {
                        await conn.sendMessage(from, {
                            text: `❎ Select a valid number (1-${results.length})`
                        }, { quoted: received });
                        return;
                    }

                    selectedMovie = results[choice - 1];
                    movieTitle = selectedMovie.title.split('|')[0].trim();

                    const infoUrl = `${BASE_URL}/cinesubz-info?url=${encodeURIComponent(selectedMovie.link)}&apikey=${API_KEY}`;
                    const infoRes = await axios.get(infoUrl, { timeout: 60000 });

                    if (!infoRes.data?.status || !infoRes.data.data?.downloads) {
                        await conn.sendMessage(from, {
                            text: '❎ No download links found for this movie.'
                        }, { quoted: received });

                        cleanup();
                        return;
                    }

                    downloads = infoRes.data.data.downloads;
                    const info = infoRes.data.data;

                    const qualityList = downloads.map((qItem, i) => {
                        return `┇◆┋ *${i + 1} ┃ 📥 ${qItem.quality} • ${qItem.size} • ${qItem.language || 'English'}*`;
                    }).join('\n\n');

                    const qualityCaption = `
╭─❍══ ⃟ ⃟ ⃟   𝙽𝙰𝚆𝙰𝚉 𝙼𝙳   ⃟ ⃟ ⃟══⊷❍
┇◆┋ 🎬 *CINESUBZ INFO*
┇◆┋
┇◆┋ 🎬 *Title:* ${movieTitle}
┇◆┋ ⭐ *Rating:* ${info.rating || 'N/A'}
┇◆┋ 📅 *Year:* ${info.year || 'N/A'}
┇◆┋ ⏱️ *Duration:* ${info.duration || 'N/A'}
┇◆┋
┇◆┋ 🔢 *Reply with quality number* 👇
┇◆┋
${qualityList}

┇◆┋ ⚡ *Version:* 12.00
┇◆┋ 👑 *𝙿𝚘𝚠𝚎𝚛 𝙱𝚢 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳*
╰─❍`.trim();

                    const qualityMsg = await conn.sendMessage(from, {
                        image: { url: selectedMovie.image },
                        caption: qualityCaption
                    }, { quoted: received });

                    step = 'quality';
                    lastMsgId = qualityMsg.key.id;

                } else if (step === 'quality') {
                    if (!downloads || choice < 1 || choice > downloads.length) {
                        await conn.sendMessage(from, {
                            text: `❎ Select a valid number (1-${downloads.length})`
                        }, { quoted: received });
                        return;
                    }

                    selectedQuality = downloads[choice - 1];

                    const downloadUrl = `${BASE_URL}/cinesubz-download?url=${encodeURIComponent(selectedQuality.link)}&apikey=${API_KEY}`;
                    const downloadRes = await axios.get(downloadUrl, { timeout: 60000 });

                    if (!downloadRes.data?.status || !downloadRes.data.data?.download) {
                        await conn.sendMessage(from, {
                            text: '❎ Failed to retrieve the download link.'
                        }, { quoted: received });

                        cleanup();
                        return;
                    }

                    const downloadInfo = downloadRes.data.data.download;
                    const directItem = downloadInfo.find(d => d.name === 'unknown') || downloadInfo[0];
                    finalUrl = directItem.url;

                    const formatCaption = `
╭─❍══ ⃟ ⃟ ⃟   𝙽𝙰𝚆𝙰𝚉 𝙼𝙳   ⃟ ⃟ ⃟══⊷❍
┇◆┋ 🎬 *CINESUBZ FORMAT*
┇◆┋
┇◆┋ 🎬 *Title:* ${movieTitle}
┇◆┋ 💿 *Quality:* ${selectedQuality.quality}
┇◆┋ 📦 *Size:* ${selectedQuality.size}
┇◆┋
┇◆┋ 🔢 *Reply with format number* 👇
┇◆┋
┇◆┋ *1 ┃ 📽️ Video Format*
┇◆┋ *2 ┃ 📁 Document Format*
┇◆┋
┇◆┋ ⚡ *Version:* 12.00
┇◆┋ 👑 *𝙿𝚘𝚠𝚎𝚛 𝙱𝚢 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳*
╰─❍`.trim();

                    const formatMsg = await conn.sendMessage(from, {
                        image: { url: selectedMovie.image },
                        caption: formatCaption
                    }, { quoted: received });

                    step = 'format';
                    lastMsgId = formatMsg.key.id;

                } else if (step === 'format') {
                    if (choice < 1 || choice > 2) {
                        await conn.sendMessage(from, {
                            text: '❎ Please select 1 (Video) or 2 (Document).'
                        }, { quoted: received });
                        return;
                    }

                    await conn.sendMessage(from, {
                        react: { text: '📥', key: received.key }
                    });

                    const fileName = `${movieTitle} [${selectedQuality.quality}] CineSubz.mp4`;

                    if (choice === 2) {
                        await conn.sendMessage(from, {
                            document: { url: finalUrl },
                            mimetype: 'video/mp4',
                            fileName: fileName,
                            caption:
                                `╭─❍══ ⃟ ⃟ ⃟   𝙽𝙰𝚆𝙰𝚉 𝙼𝙳   ⃟ ⃟ ⃟══⊷❍\n` +
                                `┇◆┋ 🎬 *${movieTitle}*\n` +
                                `┇◆┋ 👑 *𝙿𝚘𝚠𝚎𝚛 𝙱𝚢 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳*\n` +
                                `╰─❍`
                        }, { quoted: received });

                    } else {
                        await conn.sendMessage(from, {
                            video: { url: finalUrl },
                            caption:
                                `╭─❍══ ⃟ ⃟ ⃟   𝙽𝙰𝚆𝙰𝚉 𝙼𝙳   ⃟ ⃟ ⃟══⊷❍\n` +
                                `┇◆┋ 🎬 *${movieTitle}*\n` +
                                `┇◆┋ 👑 *𝙿𝚘𝚠𝚎𝚛 𝙱𝚢 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳*\n` +
                                `╰─❍`
                        }, { quoted: received });
                    }

                    await conn.sendMessage(from, {
                        react: { text: '✅', key: received.key }
                    });

                    cleanup();
                }

            } catch (err) {
                console.error('CineSubz handler error:', err);
                cleanup();
            }
        };

        conn.ev.on('messages.upsert', handler);
        timeout = setTimeout(() => cleanup(), 60 * 1000);

    } catch (e) {
        await conn.sendMessage(from, {
            react: { text: "❌", key: mek.key }
        });

        return reply(
            "❌ *Something went wrong. Please try again later!*"
        );
    }
});
