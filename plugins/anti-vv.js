// plugins/viewonce.js - ESM Version
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import config from '../config.js';

const __filename = fileURLToPath(import.meta.url);

// Define the exact keywords to check for (only these three)
const positiveKeywords = ["nice", "good", "cute", "🌝", "🥵", "💋", "👍", "🌚", "wow", "😩", "super"];

// Helper function to extract quoted message from contextInfo
function extractQuotedMessage(m) {
    // If m.quoted exists, use it
    if (m.quoted) return m.quoted;
    
    // Try to extract from contextInfo
    const quotedMsg = m.msg?.contextInfo?.quotedMessage;
    if (!quotedMsg) return null;
    
    // Determine message type
    let mtype = null;
    let viewOnce = false;
    let text = '';
    let mimetype = '';
    let ptt = false;
    let mediaKey = null;
    
    if (quotedMsg.imageMessage) {
        mtype = "imageMessage";
        viewOnce = quotedMsg.imageMessage.viewOnce || false;
        text = quotedMsg.imageMessage.caption || '';
        mimetype = quotedMsg.imageMessage.mimetype || "image/jpeg";
        mediaKey = quotedMsg.imageMessage.mediaKey;
    } else if (quotedMsg.videoMessage) {
        mtype = "videoMessage";
        viewOnce = quotedMsg.videoMessage.viewOnce || false;
        text = quotedMsg.videoMessage.caption || '';
        mimetype = quotedMsg.videoMessage.mimetype || "video/mp4";
        mediaKey = quotedMsg.videoMessage.mediaKey;
    } else if (quotedMsg.audioMessage) {
        mtype = "audioMessage";
        viewOnce = quotedMsg.audioMessage.viewOnce || false;
        text = quotedMsg.audioMessage.text || '';
        mimetype = quotedMsg.audioMessage.mimetype || "audio/mp4";
        ptt = quotedMsg.audioMessage.ptt || false;
        mediaKey = quotedMsg.audioMessage.mediaKey;
    } else if (quotedMsg.documentMessage) {
        mtype = "documentMessage";
        viewOnce = quotedMsg.documentMessage.viewOnce || false;
        text = quotedMsg.documentMessage.caption || '';
        mimetype = quotedMsg.documentMessage.mimetype || "application/pdf";
        mediaKey = quotedMsg.documentMessage.mediaKey;
    } else {
        return null;
    }
    
    // Return a quoted message object
    return {
        viewOnce: viewOnce,
        mtype: mtype,
        text: text,
        mimetype: mimetype,
        ptt: ptt,
        mediaKey: mediaKey,
        // Download function - this will be handled by the client
        download: async () => {
            // Use the client's download method
            // This depends on how your client handles downloads
            try {
                // If using baileys, you can use:
                const quotedMsgData = m.msg.contextInfo.quotedMessage;
                const type = Object.keys(quotedMsgData)[0];
                const msg = quotedMsgData[type];
                
                // Download using the client
                return await client.downloadMediaMessage(msg);
            } catch (error) {
                console.error("Download error:", error);
                throw error;
            }
        }
    };
}

// No prefix keyword handler for view once messages (owner only)
cmd({
    'on': "body"
}, async (client, message, m, {
    from,
    body,
    isCreator,
    reply,
    sender,
    userConfig
}) => {
    try {
        // Only allow the bot owner/creator
        if (!isCreator) {
            return;
        }

        // Get DESCRIPTION from userConfig if available, otherwise use config.DESCRIPTION
        const DESCRIPTION = userConfig?.DESCRIPTION || config.DESCRIPTION || "";

        const messageText = body.trim().toLowerCase();
        
        // Check if the message contains EXACTLY one of the keywords ONLY
        const hasExactKeywordOnly = positiveKeywords.includes(messageText);
        
        // Extract quoted message properly
        const quotedMsg = extractQuotedMessage(m);
        
        // Only process if contains exact keyword ONLY AND replying to a view once message
        if (hasExactKeywordOnly && quotedMsg?.viewOnce) {
            const buffer = await quotedMsg.download();
            const mtype = quotedMsg.mtype;
            const originalCaption = quotedMsg.text || '';
            const options = { quoted: message };

            let messageContent = {};
            switch (mtype) {
                case "imageMessage":
                    messageContent = {
                        image: buffer,
                        caption: originalCaption ? `${originalCaption}\n\n> ${DESCRIPTION}` : `> ${DESCRIPTION}`,
                        mimetype: quotedMsg.mimetype || "image/jpeg"
                    };
                    break;
                case "videoMessage":
                    messageContent = {
                        video: buffer,
                        caption: originalCaption ? `${originalCaption}\n\n> ${DESCRIPTION}` : `> ${DESCRIPTION}`,
                        mimetype: quotedMsg.mimetype || "video/mp4"
                    };
                    break;
                case "audioMessage":
                    messageContent = {
                        audio: buffer,
                        mimetype: "audio/mp4",
                        ptt: quotedMsg.ptt || false
                    };
                    break;
                default:
                    return;
            }

            // Send the view once content to the user's DM
            await client.sendMessage(message.sender, messageContent, options);
        }
    } catch (error) {
        console.error("View Once Keyword Error:", error);
    }
});

// Command handler for manual retrieval of view once messages (owner only)
cmd({
    pattern: "vv3",
    react: '🐳',
    desc: "Retrieve view once messages (Owner Only)",
    category: "owner",
    filename: __filename
}, async (client, message, m, {
    from,
    isCreator,
    userConfig
}) => {
    try {
        // Only allow the bot owner/creator
        if (!isCreator) {
            return;
        }

        // Get DESCRIPTION from userConfig if available, otherwise use config.DESCRIPTION
        const DESCRIPTION = userConfig?.DESCRIPTION || config.DESCRIPTION || "";

        // Extract quoted message properly
        const quotedMsg = extractQuotedMessage(m);
        
        if (!quotedMsg) {
            return await client.sendMessage(from, {
                text: "*🍁 Please reply to a view once message!*"
            }, { quoted: message });
        }

        // Check if it's a view once message
        if (!quotedMsg.viewOnce) {
            return await client.sendMessage(from, {
                text: "*❌ Please reply to a view once message!*"
            }, { quoted: message });
        }

        const buffer = await quotedMsg.download();
        const mtype = quotedMsg.mtype;
        const originalCaption = quotedMsg.text || '';
        const options = { quoted: message };

        let messageContent = {};
        switch (mtype) {
            case "imageMessage":
                messageContent = {
                    image: buffer,
                    caption: originalCaption ? `${originalCaption}\n\n> ${DESCRIPTION}` : `> ${DESCRIPTION}`,
                    mimetype: quotedMsg.mimetype || "image/jpeg"
                };
                break;
            case "videoMessage":
                messageContent = {
                    video: buffer,
                    caption: originalCaption ? `${originalCaption}\n\n> ${DESCRIPTION}` : `> ${DESCRIPTION}`,
                    mimetype: quotedMsg.mimetype || "video/mp4"
                };
                break;
            case "audioMessage":
                messageContent = {
                    audio: buffer,
                    mimetype: "audio/mp4",
                    ptt: quotedMsg.ptt || false
                };
                break;
            default:
                return await client.sendMessage(from, {
                    text: "❌ Only image, video, and audio view once messages are supported"
                }, { quoted: message });
        }

        await client.sendMessage(from, messageContent, options);
    } catch (error) {
        console.error("vv Error:", error);
        await client.sendMessage(from, {
            text: "❌ Error retrieving view once message:\n" + error.message
        }, { quoted: message });
    }
});

// ==================== VV COMMAND ====================
cmd({
    pattern: "vv",
    alias: ["viewonce", 'retrive'],
    react: '🐳',
    desc: "Owner Only - retrieve quoted message back to user",
    category: "owner",
    filename: __filename
}, async (client, message, m, { 
    from, 
    isCreator,
    userConfig
}) => {
    try {
        if (!isCreator) {
            return await client.sendMessage(from, {
                text: "*📛 This is an owner command.*"
            }, { quoted: message });
        }

        // Get DESCRIPTION from userConfig if available, otherwise use config.DESCRIPTION
        const DESCRIPTION = userConfig?.DESCRIPTION || config.DESCRIPTION || "";

        // Extract quoted message properly
        const quotedMsg = extractQuotedMessage(m);
        
        if (!quotedMsg) {
            return await client.sendMessage(from, {
                text: "*🍁 Please reply to a view once message!*"
            }, { quoted: message });
        }

        // Check if it's a view once message
        if (!quotedMsg.viewOnce) {
            return await client.sendMessage(from, {
                text: "*❌ Please reply to a view once message!*"
            }, { quoted: message });
        }

        const buffer = await quotedMsg.download();
        const mtype = quotedMsg.mtype;
        const originalCaption = quotedMsg.text || '';
        const options = { quoted: message };

        let messageContent = {};
        switch (mtype) {
            case "imageMessage":
                messageContent = {
                    image: buffer,
                    caption: originalCaption ? `${originalCaption}\n\n> ${DESCRIPTION}` : `> ${DESCRIPTION}`,
                    mimetype: quotedMsg.mimetype || "image/jpeg"
                };
                break;
            case "videoMessage":
                messageContent = {
                    video: buffer,
                    caption: originalCaption ? `${originalCaption}\n\n> ${DESCRIPTION}` : `> ${DESCRIPTION}`,
                    mimetype: quotedMsg.mimetype || "video/mp4"
                };
                break;
            case "audioMessage":
                messageContent = {
                    audio: buffer,
                    mimetype: "audio/mp4",
                    ptt: quotedMsg.ptt || false
                };
                break;
            default:
                return await client.sendMessage(from, {
                    text: "❌ Only image, video, and audio messages are supported"
                }, { quoted: message });
        }

        await client.sendMessage(from, messageContent, options);
    } catch (error) {
        console.error("vv Error:", error);
        await client.sendMessage(from, {
            text: "❌ Error fetching vv message:\n" + error.message
        }, { quoted: message });
    }
});

// ==================== VV2 COMMAND ====================
cmd({
    pattern: "vv2",
    alias: ["wah", "ohh", "oho", "🙂", "😂", "❤️", "💋", "🥵", "🌚", "😒", "nice", "ok"],
    desc: "Owner Only - retrieve quoted message back to user",
    category: "owner",
    filename: __filename
}, async (client, message, m, { 
    from, 
    isCreator,
    userConfig
}) => {
    try {
        if (!isCreator) {
            return;
        }

        // Get DESCRIPTION from userConfig if available, otherwise use config.DESCRIPTION
        const DESCRIPTION = userConfig?.DESCRIPTION || config.DESCRIPTION || "";

        // Extract quoted message properly
        const quotedMsg = extractQuotedMessage(m);
        
        if (!quotedMsg) {
            return await client.sendMessage(from, {
                text: "*🍁 Please reply to a view once message!*"
            }, { quoted: message });
        }

        // Check if it's a view once message
        if (!quotedMsg.viewOnce) {
            return await client.sendMessage(from, {
                text: "*❌ Please reply to a view once message!*"
            }, { quoted: message });
        }

        const buffer = await quotedMsg.download();
        const mtype = quotedMsg.mtype;
        const originalCaption = quotedMsg.text || '';
        const options = { quoted: message };

        let messageContent = {};
        switch (mtype) {
            case "imageMessage":
                messageContent = {
                    image: buffer,
                    caption: originalCaption ? `${originalCaption}\n\n> ${DESCRIPTION}` : `> ${DESCRIPTION}`,
                    mimetype: quotedMsg.mimetype || "image/jpeg"
                };
                break;
            case "videoMessage":
                messageContent = {
                    video: buffer,
                    caption: originalCaption ? `${originalCaption}\n\n> ${DESCRIPTION}` : `> ${DESCRIPTION}`,
                    mimetype: quotedMsg.mimetype || "video/mp4"
                };
                break;
            case "audioMessage":
                messageContent = {
                    audio: buffer,
                    mimetype: "audio/mp4",
                    ptt: quotedMsg.ptt || false
                };
                break;
            default:
                return await client.sendMessage(from, {
                    text: "❌ Only image, video, and audio messages are supported"
                }, { quoted: message });
        }

        // Forward to user's DM
        await client.sendMessage(message.sender, messageContent, options);
    } catch (error) {
        console.error("vv Error:", error);
        await client.sendMessage(from, {
            text: "❌ Error fetching vv message:\n" + error.message
        }, { quoted: message });
    }
});
