// apk.js - NAWAZ MD | ESM Version

import { fileURLToPath } from 'url';
import axios from 'axios';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "apk",
    alias: ["app"],
    desc: "Download APK",
    category: "download",
    react: "📦",
    filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) {
            return reply(
                `*📦 APK DOWNLOADER*\n\n` +
                `*🔎 Please enter an APK name.*\n\n` +
                `*Example:* .apk WhatsApp`
            );
        }

        const apiUrl =
            `http://ws75.aptoide.com/api/7/apps/search/query=${encodeURIComponent(q)}/limit=1`;

        const { data } = await axios.get(apiUrl);

        if (!data?.datalist?.list?.length) {
            return reply(`*❌ APK NOT FOUND*\n\n*🔎 Search:* ${q}`);
        }

        const app = data.datalist.list[0];
        const apkUrl = app.file?.path || app.file?.path_alt;

        if (!apkUrl) {
            return reply(`*❌ APK DOWNLOAD LINK NOT FOUND*`);
        }

        const size = app.size
            ? `${(app.size / 1048576).toFixed(2)} MB`
            : "Unknown";

        const name = app.name || "Unknown";
        const version = app.file?.vername || "Unknown";
        const packageName = app.package || "Unknown";

        const caption =
            `*📦 APK DOWNLOADER*\n\n` +
            `*📱 Name:* ${name}\n` +
            `*📦 Size:* ${size}\n` +
            `*🔖 Version:* ${version}\n` +
            `*🆔 Package:* ${packageName}\n\n` +
            `*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɴᴀᴡᴀᴢ ᴍᴅ*`;

        // Message 1: APK Info
        await conn.sendMessage(
            from,
            {
                image: { url: app.icon },
                caption: caption
            },
            { quoted: mek }
        );

        // Message 2: APK File
        await conn.sendMessage(
            from,
            {
                document: { url: apkUrl },
                mimetype: "application/vnd.android.package-archive",
                fileName: `${name}.apk`
            },
            { quoted: mek }
        );

    } catch (e) {
        console.error("APK Command Error:", e);
        return reply("*❌ APK DOWNLOAD FAILED*\n\n*Please try again later.*");
    }
});
