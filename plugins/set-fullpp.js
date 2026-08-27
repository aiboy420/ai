// plugins/fullpp.js - ESM Version
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "fullpp",
    alias: ["setpp", "setdp", "pp", "setppbot"],
    react: "🖼️",
    desc: "Owner Only - Set bot's profile picture",
    category: "owner",
    filename: __filename
}, async (client, message, m, { from, isCreator }) => {
    try {
        if (!isCreator) {
            return await client.sendMessage(from, {
                text: "*📛 This is an owner command.*"
            }, { quoted: message });
        }

        if (!m.quoted) {
            return await client.sendMessage(from, {
                text: "*🍁 Please reply to an image with .fullpp*"
            }, { quoted: message });
        }

        const mtype = m.quoted.mtype;
        
        if (mtype !== "imageMessage") {
            return await client.sendMessage(from, {
                text: "❌ Only image messages are supported for profile picture"
            }, { quoted: message });
        }

        const buffer = await m.quoted.download();
        const botJid = client.decodeJid ? client.decodeJid(client.user.id) : client.user.id;

        await client.updateProfilePicture(botJid, buffer);
        await client.sendMessage(from, {
            text: "*✅ Bot's profile picture updated successfully!*"
        }, { quoted: message });

    } catch (error) {
        console.error("fullpp Error:", error);
        await client.sendMessage(from, {
            text: "❌ Error updating profile picture:\n" + error.message
        }, { quoted: message });
    }
});
