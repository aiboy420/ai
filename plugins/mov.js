import axios from 'axios';
import { cmd } from '../command.js';
import { getContextInfo } from './new.js';

cmd({
    pattern: 'movie',
    alias: ['film'],
    desc: 'Fetch detailed information about a movie',
    category: 'utility',
    react: '🎬',
    filename: import.meta.url
}, async (conn, mek, m, { from, reply, sender, args }) => {
    try {
        // Extract movie name
        const movieName = args?.length > 0
            ? args.join(' ').trim()
            : String(m?.text || '')
                .replace(/^[.!#$]?movie\s?/i, '')
                .trim();

        if (!movieName) {
            return reply(
                '📽️ Please provide the name of the movie.\n' +
                'Example: .movie Iron Man'
            );
        }

        // IMDb API
        const apiUrl =
            `https://apis.davidcyriltech.my.id/imdb?query=${encodeURIComponent(movieName)}`;

        const response = await axios.get(apiUrl, {
            timeout: 20000
        });

        if (
            !response.data?.status ||
            !response.data?.movie
        ) {
            return reply(
                '🚫 Movie not found. Please check the name and try again.'
            );
        }

        const movie = response.data.movie;

        // Safely extract Rotten Tomatoes rating
        const ratings = Array.isArray(movie.ratings)
            ? movie.ratings
            : [];

        const rottenTomatoes =
            ratings.find(r => r?.source === 'Rotten Tomatoes')?.value
            || 'N/A';

        // Safely format release date
        const releaseDate = movie.released &&
            !isNaN(new Date(movie.released).getTime())
                ? new Date(movie.released).toLocaleDateString()
                : 'N/A';

        // Format movie details
        const caption = `
🎬 *${movie.title || 'Unknown Title'}* (${movie.year || 'N/A'}) ${movie.rated || ''}

⭐ *IMDb:* ${movie.imdbRating || 'N/A'}
🍅 *Rotten Tomatoes:* ${rottenTomatoes}
💰 *Box Office:* ${movie.boxoffice || 'N/A'}

📅 *Released:* ${releaseDate}
⏳ *Runtime:* ${movie.runtime || 'N/A'}
🎭 *Genre:* ${movie.genres || 'N/A'}

📝 *Plot:* ${movie.plot || 'N/A'}

🎥 *Director:* ${movie.director || 'N/A'}
✍️ *Writer:* ${movie.writer || 'N/A'}
🌟 *Actors:* ${movie.actors || 'N/A'}

🌍 *Country:* ${movie.country || 'N/A'}
🗣️ *Language:* ${movie.languages || 'N/A'}
🏆 *Awards:* ${movie.awards || 'None'}

🔗 [View on IMDb](${movie.imdbUrl || 'https://www.imdb.com/'})

> Power By Nawaz MD
        `.trim();

        // Movie poster
        const poster =
            movie.poster && movie.poster !== 'N/A'
                ? movie.poster
                : 'https://cdn.giftedtech.web.id/file/nqCsY.jpg';

        // Send movie information
        await conn.sendMessage(
            from,
            {
                image: { url: poster },
                caption,
                contextInfo: getContextInfo(sender)
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error(
            'Movie command error:',
            error?.response?.data || error?.message || error
        );

        return reply(
            '❌ Movie command failed. Please try again later.'
        );
    }
});
                
