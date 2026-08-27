// plugins/autoreply.js - ESM Version
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { cmd } from '../command.js';
import config from '../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Auto Reply Handler
cmd({
    on: "body"
}, async (conn, mek, m, { from, body }) => {
    try {
        const filePath = path.join(__dirname, '../lib/autoreply.json');
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.warn(`Auto-reply file not found: ${filePath}`);
            return;
        }
        
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        for (const text in data) {
            if (body && body.toLowerCase() === text.toLowerCase()) {
                if (config.AUTO_REPLY === 'true') {
                    await m.reply(data[text]);
                }
            }
        }
    } catch (error) {
        console.error("Auto-reply error:", error);
    }
});

// Auto Sticker Handler
cmd({
    on: "body"
}, async (conn, mek, m, { from, body }) => {
    try {
        const filePath = path.join(__dirname, '../lib/autosticker.json');
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.warn(`Auto-sticker file not found: ${filePath}`);
            return;
        }
        
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        for (const text in data) {
            if (body && body.toLowerCase() === text.toLowerCase()) {
                if (config.AUTO_STICKER === 'true') {
                    const stickerPath = path.join(__dirname, '../lib/autosticker', data[text]);

                    if (fs.existsSync(stickerPath)) {
                        const stickerBuffer = fs.readFileSync(stickerPath);

                        await conn.sendMessage(from, {
                            sticker: stickerBuffer,
                            packname: 'KHAN-AI',
                            author: 'AUTO-STICKER'
                        }, { quoted: mek });
                    } else {
                        console.warn(`Sticker not found: ${stickerPath}`);
                    }
                }
            }
        }
    } catch (error) {
        console.error("Auto-sticker error:", error);
    }
});
