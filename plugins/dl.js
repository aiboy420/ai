import axios from 'axios'
import { fileURLToPath } from 'url'
import { cmd } from '../command.js'

const __filename = fileURLToPath(import.meta.url)

cmd({
    pattern: 'download',
    alias: ['dl', 'down'],
    desc: 'Download video from URL',
    category: 'download',
    react: '⬇️',
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        const url = args?.[0]

        if (!url) {
            return await reply(
                '❌ Please provide a video URL.\n\n' +
                'Example:\n' +
                '.download https://example.com/video'
            )
        }

        await reply('⏳ Downloading, please wait...')

        const apiUrl =
            `https://api-dark-shan-yt.koyeb.app/download/beeg?url=${encodeURIComponent(url)}`

        const response = await axios.get(apiUrl, {
            timeout: 60000
        })

        const data = response?.data
        const downloadUrl = data?.download

        if (!downloadUrl) {
            console.log('API Response:', data)
            return await reply('❌ Download link not found in API response.')
        }

        await conn.sendMessage(
            from,
            {
                video: {
                    url: downloadUrl
                },
                caption:
                    '╭─❍ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳\n' +
                    '┇◆┋ 𝘿𝙤𝙬𝙣𝙡𝙤𝙖𝙙 𝘾𝙤𝙢𝙥𝙡𝙚𝙩𝙚\n' +
                    '╰─❍ 𝙋𝙤𝙬𝙚𝙧 𝘽𝙮 𝙉𝙖𝙬𝙖𝙯 𝙈𝘿'
            },
            {
                quoted: mek
            }
        )

    } catch (error) {
        console.error('DOWNLOAD ERROR:', error?.response?.data || error)

        return await reply(
            '❌ Download failed.\nPlease check the URL and try again.'
        )
    }
})
