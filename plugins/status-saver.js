// plugins/savestatus.js - ESM Version
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import config from '../config.js';

const __filename = fileURLToPath(import.meta.url);

// Define the command keywords
const commandKeywords = ["send", "sendme", "do", "give", "bhejo", "bhej", "save", "sand", "sent", "forward"];

// No prefix keyword handler
cmd({
    'on': "body"
}, async (client, message, store, {
    from,
    body,
    isGroup,
    reply,
    userConfig  // Added userConfig parameter
}) => {
    try {
        // Ignore messages from groups (remove this line if you want it to work in groups too)
        if (isGroup) return;

        // Get DESCRIPTION from userConfig if available, otherwise use config.DESCRIPTION
        const DESCRIPTION = userConfig?.DESCRIPTION || config.DESCRIPTION || "";

        const messageText = body.toLowerCase();
        const containsKeyword = commandKeywords.some(word => messageText.includes(word));

        // Only process if contains keyword AND replying to status broadcast
        if (containsKeyword && message.quoted?.chat === 'status@broadcast') {
            // ⏳ React - processing
            await client.sendMessage(from, { react: { text: '⏳', key: message.key } });

            const buffer = await message.quoted.download();
            const mtype = message.quoted.mtype;
            const originalCaption = message.quoted.text || '';
            const options = { quoted: message };

            let messageContent = {};
            switch (mtype) {
                case "imageMessage":
                    messageContent = {
                        image: buffer,
                        caption: originalCaption ? `${originalCaption}\n\n> ${DESCRIPTION}` : (DESCRIPTION ? `> ${DESCRIPTION}` : ""),
                        mimetype: message.quoted.mimetype || "image/jpeg"
                    };
                    break;
                case "videoMessage":
                    messageContent = {
                        video: buffer,
                        caption: originalCaption ? `${originalCaption}\n\n> ${DESCRIPTION}` : (DESCRIPTION ? `> ${DESCRIPTION}` : ""),
                        mimetype: message.quoted.mimetype || "video/mp4"
                    };
                    break;
                case "audioMessage":
                    messageContent = {
                        audio: buffer,
                        mimetype: "audio/mp4",
                        ptt: message.quoted.ptt || false
                    };
                    break;
                default:
                    // 🚫 React - unsupported type
                    await client.sendMessage(from, { react: { text: '❌', key: message.key } });
                    return; // Silently ignore unsupported types
            }

            try {
                // Forward status to the same chat where keyword was sent
                await client.sendMessage(from, messageContent, options);
                // ✅ React - success
                await client.sendMessage(from, { react: { text: '✅', key: message.key } });
            } catch (sendError) {
                console.error("Failed to send status:", sendError);
                // ❌ React - send failed
                await client.sendMessage(from, { react: { text: '❌', key: message.key } });
            }
        }
    } catch (error) {
        console.error("Keyword Status Save Error:", error);
        // ❌ React - general error
        if (message && message.key) {
            try {
                await client.sendMessage(from, { react: { text: '❌', key: message.key } });
            } catch (reactError) {
                console.error("Failed to send error reaction:", reactError);
            }
        }
    }
});