import axios from 'axios';
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
  pattern: 'movie2',
  desc: 'Search movie information using IMDb API',
  category: 'movie',
  react: '🎬',
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    const movieName = q?.trim();

    if (!movieName) {
      return reply(
        '❌ Please provide a movie name.\n\n' +
        'Example: .movie2 Avengers'
      );
    }

    await reply('🔎 Searching movie information...');

    const apiUrl =
      `https://apis.davidcyriltech.my.id/imdb?query=${encodeURIComponent(movieName)}`;

    const response = await axios.get(apiUrl, {
      timeout: 30000
    });

    const data = response.data;

    if (!data || data.error) {
      return reply('❌ Movie information not found.');
    }

    const movie = data.result || data.data || data;

    const title =
      movie.title ||
      movie.name ||
      movie.Title ||
      movieName;

    const description =
      movie.plot ||
      movie.description ||
      movie.overview ||
      movie.Plot ||
      'Not available';

    const year =
      movie.year ||
      movie.Year ||
      'Not available';

    const rating =
      movie.rating ||
      movie.imdbRating ||
      movie.imdb_rating ||
      'Not available';

    const genre =
      movie.genre ||
      movie.Genre ||
      'Not available';

    const language =
      movie.language ||
      movie.Language ||
      'Not available';

    const poster =
      movie.poster ||
      movie.Poster ||
      movie.image ||
      movie.thumbnail;

    const caption = `
🎬 *NAWAZ MD MOVIE INFO*

📌 *Title:* ${title}
📅 *Year:* ${year}
⭐ *IMDb Rating:* ${rating}
🎭 *Genre:* ${genre}
🌐 *Language:* ${language}

📝 *Description:*
${description}
    `.trim();

    if (poster && /^https?:\/\//i.test(poster)) {
      await conn.sendMessage(
        from,
        {
          image: { url: poster },
          caption
        },
        { quoted: mek }
      );
    } else {
      await reply(caption);
    }

  } catch (error) {
    console.error('MOVIE2 ERROR:', error);

    return reply(
      '❌ Movie API error. Please try again later.'
    );
  }
});
