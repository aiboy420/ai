import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "testyt",
    alias: ["ytapi"],
    desc: "Test YouTube API",
    category: "download",
    react: "🔍",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {

    try {
        if (!text) {
            return reply(
                "❌ Please provide YouTube URL\n\nExample:\n.testyt https://youtu.be/xxxxxxxxxxx"
            );
        }

        const response = await axios.get(
            "https://api-dark-shan-yt.koyeb.app/download/ytmp4",
            {
                params: {
                    url: text,
                    apikey: "96f1fd99744e5c39"
                },
                timeout: 60000
            }
        );

        console.log(
            "========== DARK SHAN API =========="
        );

        console.log(
            JSON.stringify(response.data, null, 2)
        );

        console.log(
            "==================================="
        );

        return reply(
            "✅ API Response Received!\n\n" +
            "Check your bot console/logs for the complete API response."
        );

    } catch (error) {

        console.log(
            "========== DARK SHAN API ERROR =========="
        );

        console.log(
            error.response?.status
        );

        console.log(
            JSON.stringify(
                error.response?.data || error.message,
                null,
                2
            )
        );

        console.log(
            "=========================================="
        );

        return reply(
            "❌ API Request Failed!\n\n" +
            "Check bot console/logs."
        );
    }
});
