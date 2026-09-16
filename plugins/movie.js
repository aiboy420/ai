import axios from 'axios';
import { cmd } from '../command.js';

global.movieCache = global.movieCache || {};

cmd({
    pattern: 'movie',
    alias: ['film'],
    category: 'download',
    react: '🎬',
    desc: 'Search movies and open the download menu'
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        // STEP 1 — SEARCH
        if (args?.length > 0) {
            const query = args.join(' ').trim();
            const url = `https://api.srihub.store/movie/sinhalasub?apikey=dew_5H5Dbuh4v7NbkNRmI0Ns2u2ZK240aNnJ9lnYQXR9&q=${encodeURIComponent(query)}`;

            const { data } = await axios.get(url, {
                timeout: 20000
            });

            const movie = data?.result;

            if (!movie) {
                return reply('❌ No results found.');
            }

            global.movieCache[from] = movie;

            const searchText = `
🔎 *NAWAZ-MD MOVIE SEARCH*

📱 Input   : ${query}
🍒 Results : 1

🎬 *Movies*
01. ${movie.title || 'Unknown title'}

Reply with *1* to open the movie download menu.
            `.trim();

            return conn.sendMessage(from, {
                image: movie.image
                    ? { url: movie.image }
                    : undefined,
                caption: searchText
            }, { quoted: mek });
        }

        // STEP 2 — USER REPLY
        const text = String(
            m?.text || mek?.message?.conversation || ''
        ).trim();

        const choice = Number.parseInt(text, 10);
        const movie = global.movieCache[from];

        if (!movie || !Number.isInteger(choice)) {
            return reply(
                '🔎 Search a movie first:\n.movie <movie name>'
            );
        }

        // STEP 3 — SHOW MOVIE DOWNLOAD MENU
        if (choice === 1) {
            const menu = `
╭──────────────────╮
│ *NAWAZ-MD MOVIE DOWNLOAD*
╰──────────────────╯

➠ *Title* : ${movie.title || 'Unknown title'}
➠ *Site*  : SinhalaSub.lk

01 || Send Details
02 || Send Images

03 || FHD 1080p [ PIXELDRAIN ]
04 || HD 720p  [ PIXELDRAIN ]
05 || SD 480p  [ PIXELDRAIN ]

06 || FHD 1080p [ SINHALASUB ]
07 || HD 720p  [ SINHALASUB ]
08 || SD 480p  [ SINHALASUB ]

09 || FHD 1080p [ MIRROR ]
10 || HD 720p  [ MIRROR ]
11 || SD 480p  [ MIRROR ]

> Power By Nawaz MD
            `.trim();

            return conn.sendMessage(from, {
                image: movie.image
                    ? { url: movie.image }
                    : undefined,
                caption: menu
            }, { quoted: mek });
        }

        // STEP 4 — OPTION 11: SEND SD 480P VIDEO
        if (choice === 11) {
            const sd480 =
                movie.downloads?.sinhalasub?.find(v =>
                    String(v?.quality || '').includes('480')
                ) ||
                movie.downloads?.pixeldrain?.find(v =>
                    String(v?.quality || '').includes('480')
                );

            if (!sd480?.link) {
                return reply('❌ SD 480p is not available.');
            }

            return conn.sendMessage(from, {
                video: { url: sd480.link },
                caption:
                    `🎬 *${movie.title || 'Movie'}*\n\n` +
                    `📀 Quality : SD 480p\n` +
                    `📦 Size : ${sd480.size || 'Unknown'}\n\n` +
                    '> Power By Nawaz MD',
                mimetype: 'video/mp4'
            }, { quoted: mek });
        }

        return reply(
            '❌ That option is not implemented yet. ' +
            'Please choose 1 to open the menu, or 11 for SD 480p.'
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

