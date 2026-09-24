import axios from 'axios'
import { cmd } from '../command.js'

cmd({
    pattern: "yts",
    alias: ["dl", "down"],
    desc: "Download video from URL",
    category: "download",
    react: "⬇️",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        const url = args[0]

        if (!url) {
            return reply(
                "❌ Please provide a video URL.\n\n" +
                "Example:\n.download https://example.com/video"
            )
        }

        await reply("⏳ Downloading, please wait...")

        const api = `https://api-dark-shan-yt.koyeb.app/download/beeg?url=${encodeURIComponent(url)}`

        const { data } = await axios.get(api, {
            timeout: 60000
        })

        const downloadUrl = data?.download

        if (!downloadUrl) {
            return reply("❌ Download URL was not found in API response.")
        }

        await conn.sendMessage(
            from,
            {
                video: { url: downloadUrl },
                caption: "╭─❍ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳\n┇◆┋ 𝘿𝙤𝙬𝙣𝙡𝙤𝙖𝙙 𝘾𝙤𝙢𝙥𝙡𝙚𝙩𝙚\n╰─❍ 𝙋𝙤𝙬𝙚𝙧 𝘽𝙮 𝙉𝙖𝙬𝙖𝙯 𝙈𝘿"
            },
            { quoted: mek }
        )

    } catch (error) {
        console.error(error)
        return reply("❌ Download failed. Please try again.")
    }
})
