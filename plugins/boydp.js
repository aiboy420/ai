// boydp.js - NAWAZ MD | Random Boy DP

import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RANDOM BOY DP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: 'ndp',
    alias: ['malepic', 'menpic'],
    desc: 'Send random boy WhatsApp DP',
    category: 'owner',
    react: '🖼️',
    filename: __filename
},

async (conn, mek, m, { from }) => {

    try {

        // Random Male Image API
        const api =
            'https://randomuser.me/api/?gender=male&inc=picture,name&noinfo';

        const response = await fetch(api);

        if (!response.ok) {
            throw new Error('Image API response failed');
        }

        const data = await response.json();

        if (
            !data.results ||
            !data.results.length ||
            !data.results[0].picture
        ) {
            throw new Error('Random Boy DP not found');
        }

        const user = data.results[0];

        const imageUrl = user.picture.large;

        const name =
            `${user.name.first} ${user.name.last}`;

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // DOWNLOAD IMAGE
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        const imageResponse = await fetch(imageUrl);

        if (!imageResponse.ok) {
            throw new Error('DP download failed');
        }

        const imageBuffer = Buffer.from(
            await imageResponse.arrayBuffer()
        );

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // WHATSAPP DP SIZE
        // 1:1 SQUARE
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        const squareDP = await sharp(imageBuffer)
            .resize(640, 640, {
                fit: 'cover',
                position: 'centre'
            })
            .jpeg({
                quality: 90
            })
            .toBuffer();

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // SEND DP
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        await conn.sendMessage(
            from,
            {
                image: squareDP,

                caption:
`╭━━━〔 🖼️ 𝐁𝐎𝐘 𝐃𝐏 〕━━━┈⊷
┃ 👤 Name : ${name}
┃ 📐 Size : 640×640
┃ 🎲 Random DP
╰━━━━━━━━━━━━━━━━┈⊷

> 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`
            },
            {
                quoted: m
            }
        );

    } catch (error) {

        console.log(
            'Boy DP Command Error:',
            error
        );

        await conn.sendMessage(
            from,
            {
                text:
`❌ *Boy DP Error*

${error.message}

> 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`
            },
            {
                quoted: m
            }
        );
    }
});
