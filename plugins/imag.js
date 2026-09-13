// imag.js - NAWAZ MD Random Name Image
// Powered By NAWAZ MD

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cmd } from '../command.js';
import axios from 'axios';
import sharp from 'sharp';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============ LANDSCAPE IMAGES ============

const BACKGROUNDS = [
    'mountain-landscape',
    'mountain-scenery',
    'snow-mountain',
    'river-landscape',
    'river-mountains',
    'lake-landscape',
    'ocean-landscape',
    'sea-sunset',
    'waterfall-landscape',
    'valley-landscape',
    'nature-landscape',
    'sunset-landscape',
    'green-valley',
    'beautiful-landscape',
    'scenic-landscape',
    'countryside-landscape'
];

// ============ USED IMAGE CACHE ============

const usedImages = new Set();
const MAX_USED_IMAGES = 100;

// ============ RANDOM IMAGE ============

async function getRandomImage() {

    for (let attempt = 0; attempt < 15; attempt++) {

        try {

            const category =
                BACKGROUNDS[
                    Math.floor(
                        Math.random() * BACKGROUNDS.length
                    )
                ];

            const random =
                Date.now() +
                Math.floor(Math.random() * 999999);

            const url =
                `https://loremflickr.com/1280/720/${category}?random=${random}`;

            const response = await axios.get(url, {
                responseType: 'arraybuffer',
                timeout: 20000,
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });

            const image = Buffer.from(response.data);

            // Check actual image hash
            const hash = crypto
                .createHash('sha256')
                .update(image)
                .digest('hex');

            // Don't send same image again
            if (usedImages.has(hash)) {
                console.log(
                    '[IMAG] Duplicate image - trying again'
                );
                continue;
            }

            usedImages.add(hash);

            // Keep cache limited
            if (usedImages.size > MAX_USED_IMAGES) {

                const first =
                    usedImages.values().next().value;

                usedImages.delete(first);
            }

            return image;

        } catch (error) {

            console.log(
                `[IMAG] Attempt ${attempt + 1}:`,
                error.message
            );
        }
    }

    throw new Error('Could not get a new image');
}

// ============ ESCAPE TEXT ============

function escapeXml(text) {

    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// ============ CREATE NAME IMAGE ============

async function createNameImage(imageBuffer, name) {

    const safeName = escapeXml(name);

    let fontSize = 92;

    if (name.length > 18) fontSize = 78;
    if (name.length > 25) fontSize = 66;
    if (name.length > 32) fontSize = 54;

    const svg = `
    <svg width="1280" height="720">

        <defs>

            <linearGradient
                id="overlay"
                x1="0"
                y1="0"
                x2="0"
                y2="1">

                <stop
                    offset="0%"
                    stop-color="black"
                    stop-opacity="0.02"/>

                <stop
                    offset="100%"
                    stop-color="black"
                    stop-opacity="0.55"/>

            </linearGradient>

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

        <rect
            width="1280"
            height="720"
            fill="url(#overlay)"/>

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
    desc: "Create a random landscape image with name",
    category: "fun",
    react: "🖼️",
    filename: __filename
},

async (conn, mek, m, { from, reply, args }) => {

    try {

        // ONLY text after .imag
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

        // Get new random landscape
        const image = await getRandomImage();

        // Add stylish name
        const finalImage =
            await createNameImage(image, name);

        // Send final image
        await conn.sendMessage(
            from,
            {
                image: finalImage,

                caption:
                    `⚡ 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝑩𝒚 𝑵𝑨𝑾𝑨𝒁 𝑴𝑫`
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
            '⚠️ Could not create a new image. Please try again.'
        );
    }
});
