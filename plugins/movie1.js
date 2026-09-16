import axios from 'axios';
import { cmd } from '../command.js';
import { getContextInfo } from './new.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "movie1",
    desc: "Fetch detailed information about a movie.",
    category: "utility",
    react: "🎬",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        const movieName = args?.length
            ? args.join(' ')
            : (m.text || '').replace(/^[.#$!]?movie\s?/i, '').trim();

        if (!movieName) {
            return reply(
                "📽️ Please provide the name of the movie.\nExample: .movie Iron Man"
            );
        }

        const apiUrl = `https://apis.davidcyriltech.my.id/imdb?query=${encodeURIComponent(movieName)}`;

        const response = await axios.get(apiUrl, {
            timeout: 30000
        });

        if (!response.data?.status || !response.data?.movie) {
            return reply(
                "🚫 Movie not found. Please check the name and try again."
            );
        }

        const movie = response.data.movie;

        const rottenTomatoes =
            movie.ratings?.find(
                r => r.source === 'Rotten Tomatoes'
            )?.value || 'N/A';

        const dec = `
🎬 *${movie.title || 'N/A'}* (${movie.year || 'N/A'}) ${movie.rated || ''}

⭐ *IMDb:* ${movie.imdbRating || 'N/A'} | 🍅 *Rotten Tomatoes:* ${rottenTomatoes} | 💰 *Box Office:* ${movie.boxoffice || 'N/A'}

📅 *Released:* ${movie.released ? new Date(movie.released).toLocaleDateString() : 'N/A'}
⏳ *Runtime:* ${movie.runtime || 'N/A'}
🎭 *Genre:* ${movie.genres || 'N/A'}

📝 *Plot:* ${movie.plot || 'N/A'}

🎥 *Director:* ${movie.director || 'N/A'}
✍️ *Writer:* ${movie.writer || 'N/A'}
🌟 *Actors:* ${movie.actors || 'N/A'}

🌍 *Country:* ${movie.country || 'N/A'}
🗣️ *Language:* ${movie.languages || 'N/A'}
🏆 *Awards:* ${movie.awards || 'None'}

[View on IMDb](${movie.imdbUrl || ''})
`;

        await conn.sendMessage(
            from,
            {
                image: {
                    url: movie.poster && movie.poster !== 'N/A'
                        ? movie.poster
                        : 'https://cdn.giftedtech.web.id/file/nqCsY.jpg'
                },
                caption: dec,
                contextInfo: getContextInfo(m.sender)
            },
            { quoted: mek }
        );

    } catch (e) {
        console.error('Movie command error:', e);
        return reply(`❌ Error: ${e.message}`);
    }
});

