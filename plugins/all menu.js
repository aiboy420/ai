import { fileURLToPath } from "url";
import { cmd } from "../command.js";

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "allmenu",
    alias: ["help", "commands"],
    desc: "Mini Command Menu",
    category: "main",
    react: "📜",
    filename: __filename
},
async (conn, mek, m, { from }) => {

const menu = `
╭───────────────╮
    𝗡𝗔𝗪𝗔𝗭 𝗧𝗘𝗖𝗛 
╰───────────────╯

❏ 𝗠𝗔𝗜𝗡
│◈ .menu
│◈ .alive
│◈ .ping
│◈ .uptime
╰────────────
❏ 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗
│◈ .play
│◈ .song
│◈ .video
│◈ .fb
│◈ .tiktok
│◈ .instagram
╰────────────
❏ 𝗦𝗘𝗔𝗥𝗖𝗛
│◈ .google
│◈ .ytsearch
│◈ .lyrics
╰────────────
❏ 𝗔𝗜
│◈ .ai
│◈ .gpt
│◈ .imagine
╰────────────
❏ 𝗚𝗥𝗢𝗨𝗣
│◈ .tagall
│◈ .hidetag
│◈ .kick
│◈ .promote
│◈ .demote
╰────────────
❏ 𝗙𝗨𝗡
│◈ .anime
│◈ .quote
│◈ .fact
╰────────────
❏ 𝗢𝗪𝗡𝗘𝗥
│◈ .owner
│◈ .restart
│◈ .shutdown
╰────────────
`;

await conn.sendMessage(
    from,
    {
        text: menu
    },
    {
        quoted: mek
    }
);

});
