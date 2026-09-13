// name-image.js - NAWAZ MD Name Image Command
// Powered By NAWAZ MD

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cmd } from '../command.js';
import axios from 'axios';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============ NATURE CATEGORIES ============

const NATURE_CATEGORIES = [
  'mountain',
  'river',
  'ocean',
  'lake',
  'waterfall',
  'forest',
  'beach',
  'valley'
];

// ============ GET RANDOM IMAGE ============

async function getRandomNatureImage() {
  const category =
    NATURE_CATEGORIES[
      Math.floor(Math.random() * NATURE_CATEGORIES.length)
    ];

  const lock = Math.floor(Math.random() * 999999);

  const url =
    `https://loremflickr.com/1280/720/${category}?lock=${lock}`;

  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout: 20000
  });

  return Buffer.from(response.data);
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

  const svg = `
  <svg width="1280" height="720">

    <defs>

      <linearGradient
        id="dark"
        x1="0"
        y1="0"
        x2="0"
        y2="1">

        <stop
          offset="0%"
          stop-color="black"
          stop-opacity="0.05"/>

        <stop
          offset="100%"
          stop-color="black"
          stop-opacity="0.60"/>

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
          stdDeviation="6"
          flood-color="black"
          flood-opacity="0.8"/>

      </filter>

    </defs>

    <rect
      width="1280"
      height="720"
      fill="url(#dark)"/>

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

// ============ COMMAND ============

cmd({
  pattern: "imag",
  alias: ["namepic", "write"],
  desc: "Write a name on a random nature image",
  category: "fun",
  react: "🖼️",
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {

  try {

    const name = m.text?.trim();

    if (!name) {
      return reply(
        `❌ Please provide a name.\n\nExample:\n.name Nawaz MD`
      );
    }

    await conn.sendMessage(from, {
      react: {
        text: "⏳",
        key: mek.key
      }
    });

    // Get random nature image
    const image = await getRandomNatureImage();

    // Write name on image
    const finalImage = await createNameImage(
      image,
      name
    );

    // Send image
    await conn.sendMessage(
      from,
      {
        image: finalImage,
        caption: `✨ ${name}`
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
      "[NAME IMAGE] Error:",
      error.message
    );

    await conn.sendMessage(from, {
      react: {
        text: "❌",
        key: mek.key
      }
    });

    reply(
      "⚠️ Could not create the image. Please try again."
    );
  }

});
