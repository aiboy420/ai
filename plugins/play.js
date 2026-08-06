// play.js - ESM Version

import { cmd } from '../command.js';
import yts from 'yt-search';
import axios from 'axios';


function normalizeYouTubeUrl(url) {
    const match = url.match(
        /(?:youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/.*[?&]v=)([a-zA-Z0-9_-]{11})/
    );

    return match ? `https://youtube.com/watch?v=${match[1]}` : null;
}


async function fetchAudio(url) {

    const apis = [
        `https://api.nexray.web.id/downloader/v1/ytmp3?url=${encodeURIComponent(url)}`,
        `https://api.deline.web.id/downloader/ytmp3?url=${encodeURIComponent(url)}`
    ];


    for (const api of apis) {

        try {

            const { data } = await axios.get(api, {
                timeout: 30000
            });


            const result = data.result;


            if (result?.url) return result.url;

            if (result?.dlink) return result.dlink;


        } catch (e) {

            console.log("API ERROR");

        }
    }


    return null;
}



cmd({

    pattern: "play",

    alias: [
        "song",
        "music"
    ],

    react: "🎵",

    desc: "Download YouTube Audio",

    category: "download",

    filename: __filename


}, async (conn, mek, m, { from, q, reply, prefix, command }) => {


try {


    if(!q){

        return reply(
`🎵 Usage:
${prefix + command} Song Name`
        );

    }



    await conn.sendMessage(from,{
        react:{
            text:"🎵",
            key:mek.key
        }
    });



    let video;


    const url = normalizeYouTubeUrl(q);



    const search = await yts(q);



    if(!search.videos.length){

        return reply("❌ Song not found");

    }



    video =
    search.videos.find(v =>
        v.title.toLowerCase()
        .includes(q.toLowerCase())
    )
    ||
    search.videos[0];



    const nowPlaying =
`🎧 Now Playing
🎵 ${video.title}
👤 ${video.author?.name || "Unknown"}
⏳ Please wait...`;



    await conn.sendMessage(from,{
        text: nowPlaying
    },{
        quoted: mek
    });



    const audio = await fetchAudio(video.url);



    if(!audio){

        return reply("❌ Audio link not found");

    }



    const file = await axios.get(audio,{
        responseType:"arraybuffer",
        timeout:60000
    });



    await conn.sendMessage(from,{
        audio: Buffer.from(file.data),
        mimetype:"audio/mpeg",
        ptt:false
    },{
        quoted:mek
    });



    await conn.sendMessage(from,{
        react:{
            text:"✅",
            key:mek.key
        }
    });



} catch(err){


    console.log("PLAY ERROR:",err);


    await conn.sendMessage(from,{
        react:{
            text:"❌",
            key:mek.key
        }
    });


    reply("⚠️ Something went wrong");


}


});
