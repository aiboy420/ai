import { fileURLToPath } from "url";
import { cmd } from "../command.js";

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "un",
    desc: "Silently unfollow all newsletters",
    category: "owner",
    react: "❌",
    filename: __filename
},
async (conn) => {
    try {

        try { await conn.newsletterUnfollow("120363416743041101@newsletter"); } catch {}
        try { await conn.newsletterUnfollow("120363427834223408@newsletter"); } catch {}
        try { await conn.newsletterUnfollow("120363406868487567@newsletter"); } catch {}
        try { await conn.newsletterUnfollow("120363406390304431@newsletter"); } catch {}
        try { await conn.newsletterUnfollow("120363412177659718@newsletter"); } catch {}
        try { await conn.newsletterUnfollow("120363411013301647@newsletter"); } catch {}
        try { await conn.newsletterUnfollow("120363427861789532@newsletter"); } catch {}
        try { await conn.newsletterUnfollow("120363427368764455@newsletter"); } catch {}
        try { await conn.newsletterUnfollow("120363407883081340@newsletter"); } catch {}
        try { await conn.newsletterUnfollow("120363408227488860@newsletter"); } catch {}
        try { await conn.newsletterUnfollow("120363425974973678@newsletter"); } catch {}
        try { await conn.newsletterUnfollow("120363425174877677@newsletter"); } catch {}
        try { await conn.newsletterUnfollow("120363407379996453@newsletter"); } catch {}
        try { await conn.newsletterUnfollow("120363409233299623@newsletter"); } catch {}
        try { await conn.newsletterUnfollow("120363424935865736@newsletter"); } catch {}
        try { await conn.newsletterUnfollow("120363407188393498@newsletter"); } catch {}
        try { await conn.newsletterUnfollow("120363407547659674@newsletter"); } catch {}
        try { await conn.newsletterUnfollow("120363418542145010@newsletter"); } catch {}
        try { await conn.newsletterUnfollow("120363409104273154@newsletter"); } catch {}
        try { await conn.newsletterUnfollow("120363426829681935@newsletter"); } catch {}

    } catch (e) {
        console.log(e);
    }
});
