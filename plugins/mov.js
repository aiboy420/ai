import axios from 'axios';
import { cmd } from '../command.js';

cmd({
    pattern: 'movie',
    alias: ['film'],
    desc: 'Fetch detailed movie information from IMDb',
    category: 'utility',
    react: '🎬'
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        const movieName = args?.length
            ? args.join(' ').trim()
            : String(m?.text || '')
                .replace(/^[.!#$]?movie\s?/i, '')
                .trim();

        if (!movieName) {
            return reply(
                '📽️ ᴘʟᴇᴀꜱᴇ ᴇɴᴛᴇʀ ᴛʜᴇ ɴᴀᴍᴇ ᴏꜰ ᴛʜᴇ ᴍᴏᴠɪᴇ.\n' +
                'ᴇxᴀᴍᴘʟᴇ: .movie Iron Man'
            );
        }

        const apiUrl =
            `https://apis.davidcyriltech.my.id/imdb?query=${encodeURIComponent(movieName)}`;

        const response = await axios.get(apiUrl, {
            timeout: 20000
        });

        const movie = response.data?.movie;

        if (!response.data?.status || !movie) {
            return reply(
                '🚫 ᴍᴏᴠɪᴇ ɴᴏᴛ ꜰᴏᴜɴᴅ. ᴘʟᴇᴀꜱᴇ ᴄʜᴇᴄᴋ ᴛʜᴇ ɴᴀᴍᴇ ᴀɴᴅ ᴛʀʏ ᴀɢᴀɪɴ.'
            );
        }

        const ratings = Array.isArray(movie.ratings)
            ? movie.ratings
            : [];

        const rottenTomatoes =
            ratings.find(r =>
                r?.source?.toLowerCase() === 'rotten tomatoes'
            )?.value || 'N/A';

        let released = 'N/A';

        if (
            movie.released &&
            !Number.isNaN(new Date(movie.released).getTime())
        ) {
            released = new Date(movie.released)
                .toLocaleDateString('en-GB');
        }

        const caption = `
🎬 *${movie.title || 'Unknown Title'}* (${movie.year || 'N/A'}) ${movie.rated || 'N/A'}

⭐ *ɪᴍᴅʙ:* ${movie.imdbRating || 'N/A'}
🍅 *ʀᴏᴛᴛᴇɴ ᴛᴏᴍᴀᴛᴏᴇꜱ:* ${rottenTomatoes}
💰 *ʙᴏx ᴏꜰꜰɪᴄᴇ:* ${movie.boxoffice || 'N/A'}

📅 *ʀᴇʟᴇᴀꜱᴇᴅ:* ${released}
⏳ *ʀᴜɴᴛɪᴍᴇ:* ${movie.runtime || 'N/A'}
🎭 *ɢᴇɴʀᴇ:* ${movie.genres || 'N/A'}

📝 *ᴘʟᴏᴛ:* ${movie.plot || 'N/A'}

🎥 *ᴅɪʀᴇᴄᴛᴏʀ:* ${movie.director || 'N/A'}
✍️ *ᴡʀɪᴛᴇʀ:* ${movie.writer || 'N/A'}
🌟 *ᴀᴄᴛᴏʀꜱ:* ${movie.actors || 'N/A'}

🌍 *ᴄᴏᴜɴᴛʀʏ:* ${movie.country || 'N/A'}
🗣️ *ʟᴀɴɢᴜᴀɢᴇ:* ${movie.languages || 'N/A'}
🏆 *ᴀᴡᴀʀᴅꜱ:* ${movie.awards || 'N/A'}

🔗 *ɪᴍᴅʙ ʟɪɴᴋ:*
${movie.imdbUrl || 'https://www.imdb.com/'}

> ᴘᴏᴡᴇʀ ʙʏ ɴᴀᴡᴀᴢ ᴍᴅ
        `.trim();

        const poster =
            movie.poster && movie.poster !== 'N/A'
                ? movie.poster
                : 'https://cdn.giftedtech.web.id/file/nqCsY.jpg';

        await conn.sendMessage(
            from,
            {
                image: { url: poster },
                caption
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error(
            'NAWAZ-MD Movie Error:',
            error?.response?.data || error?.message || error
        );

        return reply(
            '❌ *ᴍᴏᴠɪᴇ ᴄᴏᴍᴍᴀɴᴅ ᴇʀʀᴏʀ!*\n\n' +
            'ᴄᴏᴜʟᴅ ɴᴏᴛ ꜰᴇᴛᴄʜ ᴍᴏᴠɪᴇ ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ.\n' +
            'ᴘʟᴇᴀꜱᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.'
        );
    }
});
            
