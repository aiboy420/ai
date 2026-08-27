// time.js - ESM Version
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

cmd({
    pattern: "time",
    desc: "Show accurate date and time",
    category: "utility",
    react: "⏰",
    filename: __filename
}, async (conn, mek, m, { reply }) => {

    try {

        const now = new Date();

        // Pakistan Time Settings
        const timeOptions = {
            timeZone: "Asia/Karachi",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        };

        const dateOptions = {
            timeZone: "Asia/Karachi",
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        };

        const time = now.toLocaleTimeString("en-US", timeOptions);
        const date = now.toLocaleDateString("en-US", dateOptions);

        let msg =
`⏰ *SYSTEM TIME INFO*

📅 Date: ${date}
🕒 Time: ${time}
🇵🇰 Timezone: Asia/Karachi

🤖 Bot Status: Active`;

        return reply(msg);

    } catch (e) {
        console.log("Time command error:", e);
        return reply("❌ Error fetching time. Please try again.");
    }

});
