// imag.js

import { fileURLToPath } from 'url';
import path from 'path';
import { cmd } from '../command.js';
import axios from 'axios';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============ IMAGE URLS ============

const imageUrls = [
    'https://files.catbox.moe/y1l7ed.jpg',
    'https://files.catbox.moe/4kujce.jpg',
    'https://files.catbox.moe/vrrn72.jpg',
    'https://files.catbox.moe/7w87wk.jpg',
    'https://files.catbox.moe/jf7cwz.jpg',
    'https://files.catbox.moe/gc3c1g.jpg',
    'https://files.catbox.moe/nufhim.jpg',
    'https://files.catbox.moe/yfce44.jpg',
    'https://files.catbox.moe/gdhv0h.jpg',
    'https://files.catbox.moe/ptwcm0.jpg',
    'https://files.catbox.moe/3upyka.jpg',
    'https://files.catbox.moe/erj2f8.jpg',
    'https://files.catbox.moe/g50vs5.jpg',
    'https://files.catbox.moe/1jta5y.jpg',
    'https://files.catbox.moe/siph10.jpg',
    'https://files.catbox.moe/mxlbfq.jpg',
    'https://files.catbox.moe/3aqy6x.jpg',
    'https://files.catbox.moe/0qvy21.jpg',
    'https://files.catbox.moe/szdoa0.jpg',
    'https://files.catbox.moe/3upyka.jpg',
    'https://files.catbox.moe/jadoal.jpg',
    'https://files.catbox.moe/yfce44.jpg'
];

// ============ RANDOM URL ============

function getRandomImageUrl() {
    return imageUrls[
        Math.floor(Math.random() * imageUrls.length)
    ];
}

// ============ DOWNLOAD IMAGE ============

async function downloadImage(url) {
    const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 20000,
        headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        }
    });

    return Buffer.from(response.data);
}

// ============ ESCAPE XML ============

function escapeXml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// ============ WRITE NAME ON IMAGE ============

async function createNameImage(imageBuffer, name) {

    const safeName = escapeXml(name);

    let fontSize = 92;

    if (name.length > 18) fontSize = 78;
    if (name.length > 25) fontSize = 66;
    if (name.length > 32) fontSize = 54;

    const svg = `
    <svg width="1280" height="720">

        <defs>

            <filter
                id="shadow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%">

                <feDropShadow
                    dx="0"
                    dy="6"
                    stdDeviation="7"
                    flood-color="black"
                    flood-opacity="0.85"/>

            </filter>

        </defs>

        <text
            x="640"
            y="390"
            text-anchor="middle"
            dominant-baseline="middle"

            font-family="Georgia, 'Times New Roman', serif"
            font-size="${fontSize}px"
            font-weight="700"
            font-style="italic"

            letter-spacing="2"

            fill="white"
            stroke="black"
            stroke-width="3"
            paint-order="stroke"

            filter="url(#shadow)">

            ${safeName}

        </text>

    </svg>
    `;

    return await sharp(imageBuffer)
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
}

// ============ .IMAG COMMAND ============

cmd({
    pattern: "imag",
    alias: ["image", "img"],
    desc: "Create image with name",
    category: "fun",
    react: "🖼️",
    filename: __filename
},

async (conn, mek, m, { from, reply, args }) => {

    try {

        const name = Array.isArray(args)
            ? args.join(' ').trim()
            : '';

        if (!name) {
            return reply(
                `❌ Please provide a name.\n\nExample:\n.imag Nawaz MD`
            );
        }

        await conn.sendMessage(from, {
            react: {
                text: "⏳",
                key: mek.key
            }
        });

        // Random image from your URLs
        const randomUrl = getRandomImageUrl();

        // Download image
        const originalImage =
            await downloadImage(randomUrl);

        // Write name on image
        const finalImage =
            await createNameImage(
                originalImage,
                name
            );

        // Send image
        await conn.sendMessage(
            from,
            {
                image: finalImage,
                caption: name
            },
            {
                quoted: mek
            }
        );

        await conn.sendMessage(from, {
            react: {
                text: "✅",
                key: mek.key
            }
        });

    } catch (error) {

        console.error(
            '[IMAG] Error:',
            error.message
        );

        await conn.sendMessage(from, {
            react: {
                text: "❌",
                key: mek.key
            }
        });

        return reply(
            '⚠️ Image could not be created. Please try again.'
        );
    }
});
