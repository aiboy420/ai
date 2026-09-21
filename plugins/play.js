import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);

const API_URL = 'https://eliteprotech-apis.zone.id/download/ytmp3';

function getVideoId(url) {
    const match = url.match(
        /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    );
    return match ? match[1] : null;
}

cmd({
    pattern: 'play',
    alias: ['audio'],
    desc: 'Download YouTube audio',
    category: 'download',
    react: '🎧',
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) {
            return reply(
                '❌ Please provide song name\nExample: .play Shape of You'
            );
        }

        const { default: yts } = await import('yt-search');

        let url = text.trim();
        let vid = null;

        if (url.startsWith('http://') || url.startsWith('https://')) {
            if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
                return reply('❌ Please provide a valid YouTube URL!');
            }

            const videoId = getVideoId(url);
            if (!videoId) {
                return reply('❌ Invalid YouTube URL!');
            }

            vid = await yts({ videoId });
        } else {
            const search = await yts(url);

            if (!search?.videos?.length) {
                return reply('❌ No song found!');
            }

            vid = search.videos[0];
            url = vid.url;
        }

        if (!vid) {
            return reply('❌ No results found!');
        }

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

        const response = await axios.get(API_URL, {
            params: { url },
            timeout: 60000,
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        const data = response.data;

        const audioUrl = data?.download?.downloadUrl;

        if (data?.status !== true || !audioUrl) {
            console.error(
                'ELITEPROTECH API RESPONSE:',
                JSON.stringify(data, null, 2)
            );

            return reply('❌ API did not return a valid audio link.');
        }

        await conn.sendMessage(from, {
            audio: { url: audioUrl },
            mimetype: 'audio/mpeg',
            fileName: `${vid.title}.mp3`,
            ptt: false
        }, { quoted: mek });

        await conn.sendMessage(from, {
            react: { text: '✅', key: m.key }
        });

    } catch (err) {
        console.error(
            '❌ PLAY ERROR:',
            err.response?.data || err.message
        );

        await reply('❌ Song download failed! Please try again later.');

        await conn.sendMessage(from, {
            react: { text: '❌', key: m.key }
        });
    }
});
    
