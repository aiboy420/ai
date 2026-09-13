import axios from 'axios';
import sharp from 'sharp';
import { cmd } from '../command.js';

cmd({
    pattern: 'img',
    alias: ['write', 'namepic'],
    desc: 'Write a name on a random nature image',
    category: 'fun',
    react: '🖼️',
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {

    try {
        const name = args.join(' ').trim();

        if (!name) {
            return reply('❌ Please provide a name.\n\nExample: .name Nawaz');
        }

        const backgrounds = [
            'mountain,landscape,nature',
            'river,mountains,nature',
            'ocean,sea,sunset',
            'lake,mountains,landscape',
            'forest,mountains,nature',
            'waterfall,forest,nature',
            'beach,ocean,sunset',
            'valley,mountains,landscape'
        ];

        const query =
            backgrounds[Math.floor(Math.random() * backgrounds.length)];

        const imageUrl =
            `https://loremflickr.com/1280/720/${query}?lock=${Math.floor(Math.random() * 100000)}`;

        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
            timeout: 20000
        });

        const image = Buffer.from(response.data);

        const safeName = name
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');

        const svg = `
        <svg width="1280" height="720">
            <defs>
                <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="black" stop-opacity="0.05"/>
                    <stop offset="100%" stop-color="black" stop-opacity="0.55"/>
                </linearGradient>

                <filter id="shadow">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="8"/>
                    <feOffset dy="5"/>
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.6"/>
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            <rect width="1280" height="720" fill="url(#shade)"/>

            <text
                x="640"
                y="390"
                text-anchor="middle"
                dominant-baseline="middle"
                font-family="Arial, sans-serif"
                font-size="92"
                font-weight="700"
                fill="white"
                stroke="black"
                stroke-width="3"
                paint-order="stroke"
                filter="url(#shadow)">
                ${safeName}
            </text>
        </svg>
        `;

        const output = await sharp(image)
            .resize(1280, 720, {
                fit: 'cover'
            })
            .composite([
                {
                    input: Buffer.from(svg),
                    top: 0,
                    left: 0
                }
            ])
            .jpeg({
                quality: 92
            })
            .toBuffer();

        await conn.sendMessage(
            from,
            {
                image: output,
                caption: `✨ ${name}`
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error('NAME IMAGE ERROR:', error);
        reply('❌ Image generate nahi ho saki. Please try again.');
    }
});
