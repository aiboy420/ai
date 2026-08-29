import { cmd } from '../command.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==================== 8 COMMAND ====================
cmd({
    pattern: "suckboobs",
    react: "🔞",
    desc: "Send a meme video (Owner only)",
    category: "nsfw",
    use: ".8",
    filename: __filename
}, async (conn, mek, m, { 
    args, 
    q, 
    reply,
    from,
    isCreator
}) => {
    try {
        // Creator restriction
        if (!isCreator) {
            return reply("*📛 This is an owner command.*");
        }

        // Get sender and mentioned user
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        // Create message based on mentions and group
        let message = mentionedUser
            ? `${sender} is doing suckboobs with @${mentionedUser.split("@")[0]} 😏`
            : isGroup
            ? `${sender} wants to do suckboobs with everyone! 😈`
            : `> *© Powered By SIGMA-MD 🥵 🖤*`;

        // Direct video links (10 videos)
        const videos = [
            'https://telegra.ph/file/01143878beb3d0430c33e.mp4',
            'https://telegra.ph/file/7b181cbaa54eee6c048fc.mp4',
            'https://telegra.ph/file/f8cf75586670483fadc1d.mp4',
            'https://telegra.ph/file/f8969e557ad07e7e53f1a.mp4',
            'https://telegra.ph/file/1104aa065e51d29a5fb4f.mp4',
            'https://telegra.ph/file/9e1240c29f3a6a9867aaa.mp4',
            'https://telegra.ph/file/949dff632250307033b2e.mp4',
            'https://telegra.ph/file/b178b294a963d562bb449.mp4',
            'https://telegra.ph/file/95efbd8837aa18f3e2bde.mp4',
            'https://telegra.ph/file/9827c7270c9ceddb8d074.mp4'
        ];

        // Select random video
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];

        // Send video with gifPlayback
        await conn.sendMessage(
            mek.chat,
            { 
                video: { url: randomVideo }, 
                caption: message, 
                gifPlayback: true, 
                mentions: [mek.sender, mentionedUser].filter(Boolean) 
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error("❌ Error in .8 command:", error);
        reply(`❌ *Error in .8 command:*\n\`\`\`${error.message}\`\`\``);
    }
});



// ==================== MAX COMMAND ====================
cmd({
    pattern: "fuck",
    react: "🔞",
    desc: "Send a max meme video (Owner only)",
    category: "nsfw",
    use: ".max",
    filename: __filename
}, async (conn, mek, m, { 
    args, 
    q, 
    reply,
    from,
    isCreator
}) => {
    try {
        // Creator restriction
        if (!isCreator) {
            return reply("*📛 This is an owner command.*");
        }

        // Get sender and mentioned user
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        // Create message based on mentions and group
        let message = mentionedUser
            ? `${sender} is fucking @${mentionedUser.split("@")[0]} 🥵`
            : isGroup
            ? `${sender} wants to do fuck with everyone! 🥹`
            : `> *© Powered By SIGMA-MD 🥵 🖤*`;

        // Direct video links (25 videos)
        const videos = [
            'https://telegra.ph/file/6ea4ddf2f9f4176d4a5c0.mp4',
            'https://telegra.ph/file/66535b909845bd2ffbad9.mp4',
            'https://telegra.ph/file/1af11cf4ffeda3386324b.mp4',
            'https://telegra.ph/file/e2beba258ba83f09a34df.mp4',
            'https://telegra.ph/file/21543bac2383ce0fc6f51.mp4',
            'https://telegra.ph/file/1baf2e8577d5118c03438.mp4',
            'https://telegra.ph/file/80aa0e43656667b07d0b4.mp4',
            'https://telegra.ph/file/7638618cf43e499007765.mp4',
            'https://telegra.ph/file/1c7d59e637f8e5915dbbc.mp4',
            'https://telegra.ph/file/e7078700d16baad953348.mp4',
            'https://telegra.ph/file/100ba1caee241e5c439de.mp4',
            'https://telegra.ph/file/3b1d6ef30a5e53518b13b.mp4',
            'https://telegra.ph/file/249518bf45c1050926d9c.mp4',
            'https://telegra.ph/file/34e1fb2f847cbb0ce0ea2.mp4',
            'https://telegra.ph/file/52c82a0269bb69d5c9fc4.mp4',
            'https://telegra.ph/file/ca64bfe2eb8f7f8c6b12c.mp4',
            'https://telegra.ph/file/8e94da8d393a6c634f6f9.mp4',
            'https://telegra.ph/file/216b3ab73e1d98d698843.mp4',
            'https://telegra.ph/file/1dec277caf371c8473c08.mp4',
            'https://telegra.ph/file/bbf6323509d48f4a76c13.mp4',
            'https://telegra.ph/file/f8e4abb6923b95e924724.mp4',
            'https://telegra.ph/file/bd4d5a957466eee06a208.mp4',
            'https://telegra.ph/file/a91d94a51dba34dc1bed9.mp4',
            'https://telegra.ph/file/b08996c47ff1b38e13df0.mp4',
            'https://telegra.ph/file/58bcc3cd79cecda3acdfa.mp4'
        ];

        // Select random video
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];

        // Send video with gifPlayback
        await conn.sendMessage(
            mek.chat,
            { 
                video: { url: randomVideo }, 
                caption: message, 
                gifPlayback: true, 
                mentions: [mek.sender, mentionedUser].filter(Boolean) 
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error("❌ Error in .max command:", error);
        reply(`❌ *Error in .max command:*\n\`\`\`${error.message}\`\`\``);
    }
});




// ==================== 6 COMMAND ====================
cmd({
    pattern: "follar",
    alias: ["jhatka"],
    react: "🔞",
    desc: "Send a meme video (Owner only)",
    category: "nsfw",
    use: ".6",
    filename: __filename
}, async (conn, mek, m, { 
    args, 
    q, 
    reply,
    from,
    isCreator
}) => {
    try {
        // Creator restriction
        if (!isCreator) {
            return reply("*📛 This is an owner command.*");
        }

        // Get sender and mentioned user
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        // Create message based on mentions and group
        let message = mentionedUser
            ? `${sender} is doing hardcore with @${mentionedUser.split("@")[0]} 🥵`
            : isGroup
            ? `${sender} want to give hardcore to  everyone! 🫠`
            : `> *© Powered By SIGMA-MD 🥵 🖤*`;

        // Direct video links from Catbox
        const videos = [
            'https://files.catbox.moe/7ito13.mp4',
            'https://files.catbox.moe/6to3zj.mp4',
            'https://files.catbox.moe/8j94sh.mp4',
            'https://files.catbox.moe/ylfpb7.mp4',
            'https://files.catbox.moe/kccjc7.mp4',
            'https://files.catbox.moe/lt9e1u.mp4'
        ];

        // Select random video
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];

        // Send video with gifPlayback
        await conn.sendMessage(
            mek.chat,
            { 
                video: { url: randomVideo }, 
                caption: message, 
                gifPlayback: true, 
                mentions: [mek.sender, mentionedUser].filter(Boolean) 
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error("❌ Error in .6 command:", error);
        reply(`❌ *Error in .6 command:*\n\`\`\`${error.message}\`\`\``);
    }
});



// ==================== 2 COMMAND ====================
cmd({
    pattern: "blowjob",
    react: "🔞",
    desc: "Send a meme video (Owner only)",
    category: "nsfw",
    use: ".2",
    filename: __filename
}, async (conn, mek, m, { 
    args, 
    q, 
    reply,
    from,
    isCreator
}) => {
    try {
        // Creator restriction
        if (!isCreator) {
            return reply("*📛 This is an owner command.*");
        }

        // Get sender and mentioned user
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        // Create message based on mentions and group
        let message = mentionedUser
            ? `${sender} is doing blowjob with @${mentionedUser.split("@")[0]} 🥵👅`
            : isGroup
            ? `${sender} wants to do blowjob with everyone! 💦`
            : `> *© Powered By SIGMA-MD 🥵 🖤*`;

        // Direct video links
        const videos = [
            'https://telegra.ph/file/0260766c6b36537aa2802.mp4',
            'https://telegra.ph/file/2c1c68c9e310f60f1ded1.mp4',
            'https://telegra.ph/file/e14f5a31d3b3c279f5593.mp4',
            'https://telegra.ph/file/e020aa808f154a30b8da7.mp4',
            'https://telegra.ph/file/1cafb3e72664af94d45c0.mp4',
            'https://telegra.ph/file/72b49d3b554df64e377bb.mp4',
            'https://telegra.ph/file/9687aedfd58a3110c7f88.mp4',
            'https://telegra.ph/file/c799ea8a1ed0fd336579c.mp4',
            'https://telegra.ph/file/7352d18934971201deed5.mp4',
            'https://telegra.ph/file/379edd38bac6de4258843.mp4'
        ];

        // Select random video
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];

        // Send video with gifPlayback
        await conn.sendMessage(
            mek.chat,
            { 
                video: { url: randomVideo }, 
                caption: message, 
                gifPlayback: true, 
                mentions: [mek.sender, mentionedUser].filter(Boolean) 
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error("❌ Error in .2 command:", error);
        reply(`❌ *Error in .2 command:*\n\`\`\`${error.message}\`\`\``);
    }
});



// ==================== 1 COMMAND ====================
cmd({
    pattern: "boobsjob",
    react: "🔞",
    desc: "Send a meme video (Owner only)",
    category: "nsfw",
    use: ".1",
    filename: __filename
}, async (conn, mek, m, { 
    args, 
    q, 
    reply,
    from,
    isCreator
}) => {
    try {
        // Creator restriction
        if (!isCreator) {
            return reply("*📛 This is an owner command.*");
        }

        // Get sender and mentioned user
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        // Create message based on mentions and group
        let message = mentionedUser
            ? `${sender} is doing boobsjob with @${mentionedUser.split("@")[0]} 🥵💦`
            : isGroup
            ? `${sender} wants to do boobsjob with everyone! 🥵`
            : `> *© Powered By SIGMA-MD 🥵 🖤*`;

        // Direct video links
        const videos = [
            'https://telegra.ph/file/e4412c087db1b1a7a4022.mp4',
            'https://telegra.ph/file/7e6bd15e33a1d77d6fb15.mp4',
            'https://telegra.ph/file/de3cbbb4611242eb0648c.mp4',
            'https://telegra.ph/file/4ca2676e76364d6861852.mp4',
            'https://telegra.ph/file/1099709e53a16a8a791fd.mp4',
            'https://telegra.ph/file/3baffe20cdfbb03d31e45.mp4',
            'https://telegra.ph/file/7cc41bab371611124693e.mp4',
            'https://telegra.ph/file/adaefc5b25537d948b959.mp4'
        ];

        // Select random video
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];

        // Send video with gifPlayback
        await conn.sendMessage(
            mek.chat,
            { 
                video: { url: randomVideo }, 
                caption: message, 
                gifPlayback: true, 
                mentions: [mek.sender, mentionedUser].filter(Boolean) 
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error("❌ Error in .1 command:", error);
        reply(`❌ *Error in .1 command:*\n\`\`\`${error.message}\`\`\``);
    }
});




// ==================== 80 COMMAND ====================
cmd({
    pattern: "sex",
    react: "🔞",
    desc: "Send an 80 meme video (Owner only)",
    category: "nsfw",
    use: ".80",
    filename: __filename
}, async (conn, mek, m, { 
    args, 
    q, 
    reply,
    from,
    isCreator
}) => {
    try {
        // Creator restriction
        if (!isCreator) {
            return reply("*📛 This is an owner command.*");
        }

        // Get sender and mentioned user
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        // Create message based on mentions and group
        let message = mentionedUser
            ? `${sender} is doing sex with @${mentionedUser.split("@")[0]} 🥵💦`
            : isGroup
            ? `${sender} wants to do sex with everyone! 🥵💦`
            : `> *© Powered By SIGMA-MD 🥵 🖤*`;

        // Direct video links (memes, not actual NSFW)
        const videos = [
            'https://telegra.ph/file/a2ad1dd463a935d5dfd17.mp4',
            'https://telegra.ph/file/e3abb2e79cd1ccf709e91.mp4',
            'https://telegra.ph/file/c5be4a906531c6731cd41.mp4',
            'https://telegra.ph/file/9c4b894e034c290df75e4.mp4',
            'https://telegra.ph/file/3246f62c61a0ebebcb5c8.mp4',
            'https://telegra.ph/file/820460f05d76bb2329bbc.mp4',
            'https://telegra.ph/file/2072f260302c6bb97682a.mp4',
            'https://telegra.ph/file/22d0ef801c93c1b2ac074.mp4',
            'https://telegra.ph/file/6f66fd1974e8df1496768.mp4'
        ];

        // Select random video
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];

        // Send video with gifPlayback
        await conn.sendMessage(
            mek.chat,
            { 
                video: { url: randomVideo }, 
                caption: message, 
                gifPlayback: true, 
                mentions: [mek.sender, mentionedUser].filter(Boolean) 
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error("❌ Error in .80 command:", error);
        reply(`❌ *Error in .80 command:*\n\`\`\`${error.message}\`\`\``);
    }
});




// ==================== 69 COMMAND ====================
cmd({
    pattern: "69",
    react: "🔞",
    desc: "Send a 69 meme video (Owner only)",
    category: "nsfw",
    use: ".69",
    filename: __filename
}, async (conn, mek, m, { 
    args, 
    q, 
    reply,
    from,
    isCreator
}) => {
    try {
        // Creator restriction
        if (!isCreator) {
            return reply("*📛 This is an owner command.*");
        }

        // Get sender and mentioned user
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        // Create message based on mentions and group
        let message = mentionedUser
            ? `${sender} is doing 69 with @${mentionedUser.split("@")[0]} 🥵`
            : isGroup
            ? `${sender} wants to do 69 with everyone! 🥺`
            : `> *© Powered By SIGMA-MD 🥵 🖤*`;

        // Direct video links (memes, not actual NSFW)
        const videos = [
            'https://telegra.ph/file/bb4341187c893748f912b.mp4',
            'https://telegra.ph/file/c7f154b0ce694449a53cc.mp4',
            'https://telegra.ph/file/1101c595689f638881327.mp4',
            'https://telegra.ph/file/f7f2a23e9c45a5d6bf2a1.mp4',
            'https://telegra.ph/file/a2098292896fb05675250.mp4',
            'https://telegra.ph/file/16f43effd7357e82c94d3.mp4',
            'https://telegra.ph/file/55cb31314b168edd732f8.mp4',
            'https://telegra.ph/file/1cbaa4a7a61f1ad18af01.mp4',
            'https://telegra.ph/file/1083c19087f6997ec8095.mp4'
        ];

        // Select random video
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];

        // Send video with gifPlayback
        await conn.sendMessage(
            mek.chat,
            { 
                video: { url: randomVideo }, 
                caption: message, 
                gifPlayback: true, 
                mentions: [mek.sender, mentionedUser].filter(Boolean) 
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error("❌ Error in .69 command:", error);
        reply(`❌ *Error in .69 command:*\n\`\`\`${error.message}\`\`\``);
    }
});





// ==================== 68 COMMAND ====================
cmd({
    pattern: "anal",
    react: "🔞",
    desc: "Send a 68 meme video (Owner only)",
    category: "nsfw",
    use: ".68",
    filename: __filename
}, async (conn, mek, m, { 
    args, 
    q, 
    reply,
    from,
    isCreator
}) => {
    try {
        // Creator restriction
        if (!isCreator) {
            return reply("*📛 This is an owner command.*");
        }

        // Get sender and mentioned user
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        // Create message based on mentions and group
        let message = mentionedUser
            ? `${sender} is doing anal with @${mentionedUser.split("@")[0]} 🥵🥺`
            : isGroup
            ? `${sender} wants to do anal with everyone! 🌚`
            : `> *© Powered By SIGMA-MD 🥵 🖤*`;

        // Direct video links (memes, not actual NSFW)
        const videos = [
            'https://telegra.ph/file/7185b0be7a315706d086a.mp4',
            'https://telegra.ph/file/a11625fef11d628d3c8df.mp4',
            'https://telegra.ph/file/062b9506656e89b069618.mp4',
            'https://telegra.ph/file/1325494a54adc9a87ec56.mp4'
        ];

        // Select random video
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];

        // Send video with gifPlayback
        await conn.sendMessage(
            mek.chat,
            { 
                video: { url: randomVideo }, 
                caption: message, 
                gifPlayback: true, 
                mentions: [mek.sender, mentionedUser].filter(Boolean) 
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error("❌ Error in .68 command:", error);
        reply(`❌ *Error in .68 command:*\n\`\`\`${error.message}\`\`\``);
    }
});





// ==================== 60 COMMAND ====================
cmd({
    pattern: "cum",
    react: "🔞",
    desc: "Send a 60 meme video (Owner only)",
    category: "nsfw",
    use: ".60",
    filename: __filename
}, async (conn, mek, m, { 
    args, 
    q, 
    reply,
    from,
    isCreator
}) => {
    try {
        // Creator restriction
        if (!isCreator) {
            return reply("*📛 This is an owner command.*");
        }

        // Get sender and mentioned user
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        // Create message based on mentions and group
        let message = mentionedUser
            ? `${sender} is doing cum with @${mentionedUser.split("@")[0]} 🥵💦`
            : isGroup
            ? `${sender} wants to do cum with everyone! 💦`
            : `> *© Powered By SIGMA-MD 🥵 🖤*`;

        // Direct video links (memes, not actual NSFW)
        const videos = [
            'https://telegra.ph/file/9243544e7ab350ce747d7.mp4',
            'https://telegra.ph/file/fadc180ae9c212e2bd3e1.mp4',
            'https://telegra.ph/file/79a5a0042dd8c44754942.mp4',
            'https://telegra.ph/file/035e84b8767a9f1ac070b.mp4'
];
// Select random video
const randomVideo =
videos[Math.floor(Math.random() * videos.length)];

// Send video with gifPlayback
await conn.sendMessage(
    mek.chat,
    {
        video: { url: randomVideo },
        caption: message,
        gifPlayback: true,
        mentions: [mek.sender, mentionedUser.filter(Boolean)]
    },
    { quoted: mek }
);

} catch (error) {
    console.error("❌ Error in .60 command:", error);
    reply(`❌ *Error in .60 command:*\n\n\`\`\`${error.message}\`\`\``);
}
});
      
