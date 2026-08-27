// islamic-wallpaper.js - NAWAZ-MD

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import axios from 'axios';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API = 'https://commons.wikimedia.org/w/api.php';

const searches = [
    'mosque',
    'Islamic architecture',
    'Islamic mosque',
    'Masjid',
    'Islamic art'
];

async function getIslamicWallpaper() {

    const search =
        searches[Math.floor(Math.random() * searches.length)];

    const { data } = await axios.get(API, {
        params: {
            action: 'query',
            format: 'json',
            generator: 'search',
            gsrsearch: search,
            gsrnamespace: 6,
            gsrlimit: 20,
            prop: 'imageinfo',
            iiprop: 'url',
            iiurlwidth: 1200,
            origin: '*'
        },
        timeout: 20000,
        headers: {
            'User-Agent': 'NAWAZ-MD/1.0'
        }
    });

    const pages = data?.query?.pages;

    if (!pages) return null;

    const images = Object.values(pages).filter(page => {
        const info = page?.imageinfo?.[0];

        if (!info) return false;

        const url = info.thumburl || info.url;

        return url &&
            /\.(jpg|jpeg|png|webp)$/i.test(url.split('?')[0]);
    });

    if (!images.length) return null;

    const random =
        images[Math.floor(Math.random() * images.length)];

    const info = random.imageinfo[0];

    return {
        url: info.thumburl || info.url,
        title: random.title
            ?.replace(/^File:/, '')
            ?.replace(/\.[^/.]+$/, '') || 'Islamic Wallpaper'
    };
}

cmd({
    pattern: 'islamic',
    alias: [
        'islamicwp',
        'islamicwallpaper',
        'islamicpic'
    ],
    react: '🕌',
    desc: 'Send random Islamic wallpaper',
    category: 'download',
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {

    try {

        await conn.sendMessage(from, {
            react: {
                text: '🔍',
                key: mek.key
            }
        });

        const wallpaper = await getIslamicWallpaper();

        if (!wallpaper) {
            await conn.sendMessage(from, {
                react: {
                    text: '❌',
                    key: mek.key
                }
            });

            return reply(
                '❌ Islamic wallpaper not found. Please try again.'
            );
        }

        await conn.sendMessage(
            from,
            {
                image: {
                    url: wallpaper.url
                },
                caption:
`🕌 *ISLAMIC WALLPAPER* 🌙

✨ *${wallpaper.title}*

🤍 *May Allah bless you always.*

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɴᴀᴡᴀᴢ ᴍᴅ`
            },
            {
                quoted: mek
            }
        );

        await conn.sendMessage(from, {
            react: {
                text: '✅',
                key: mek.key
            }
        });

    } catch (error) {

        console.log(
            'ISLAMIC WALLPAPER ERROR:',
            error?.response?.data || error.message
        );

        await conn.sendMessage(from, {
            react: {
                text: '❌',
                key: mek.key
            }
        });

        reply(
            '❌ Islamic wallpaper not found. Please try again.'
        );
    }
});
