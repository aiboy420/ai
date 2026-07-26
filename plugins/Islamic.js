// islamic.js - ESM Version
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/////////////////////////////
// 🕌 ISLAMIC FULL SYSTEM
/////////////////////////////

cmd({
    pattern: "dua_forgiveness",
    category: "islamic",
    react: "🤲",
    filename: __filename
}, async (conn, mek, m, { reply }) => {

    reply("🤲 اللهم اغفر لي وارحمني");
});

cmd({
    pattern: "dua_rizq",
    category: "islamic",
    react: "🤲",
    filename: __filename
}, async (conn, mek, m, { reply }) => {

    reply("🤲 اللهم ارزقني رزقًا حلالًا طيبًا");
});

cmd({
    pattern: "dua_guidance",
    category: "islamic",
    react: "🤲",
    filename: __filename
}, async (conn, mek, m, { reply }) => {

    reply("🤲 اللهم اهدني ووفقني");
});

cmd({
    pattern: "dua_health",
    category: "islamic",
    react: "🤲",
    filename: __filename
}, async (conn, mek, m, { reply }) => {

    reply("🤲 اللهم عافني في بدني");
});

cmd({
    pattern: "zikr_astaghfirullah",
    category: "islamic",
    react: "🕋",
    filename: __filename
}, async (conn, mek, m, { reply }) => {

    reply("🕋 أستغفر الله العظيم");
});

cmd({
    pattern: "zikr_alhamdulillah",
    category: "islamic",
    react: "🕋",
    filename: __filename
}, async (conn, mek, m, { reply }) => {

    reply("🕋 الحمد لله رب العالمين");
});

cmd({
    pattern: "zikr_subhanallah",
    category: "islamic",
    react: "🕋",
    filename: __filename
}, async (conn, mek, m, { reply }) => {

    reply("🕋 سبحان الله");
});

cmd({
    pattern: "zikr_allahuakbar",
    category: "islamic",
    react: "🕋",
    filename: __filename
}, async (conn, mek, m, { reply }) => {

    reply("🕋 الله أكبر");
});

cmd({
    pattern: "zikr_lailahaillallah",
    category: "islamic",
    react: "🕋",
    filename: __filename
}, async (conn, mek, m, { reply }) => {

    reply("🕋 لا إله إلا الله");
});

cmd({
    pattern: "zikr_lahawla",
    category: "islamic",
    react: "🕋",
    filename: __filename
}, async (conn, mek, m, { reply }) => {

    reply("🕋 لاحول ولا قوة إلا بالله");
});

cmd({
    pattern: "hadith_good_morals",
    category: "islamic",
    react: "📖",
    filename: __filename
}, async (conn, mek, m, { reply }) => {

    reply("📖 بہترین انسان وہ ہے جس کے اخلاق اچھے ہوں");
});

cmd({
    pattern: "hadith_cleanliness",
    category: "islamic",
    react: "📖",
    filename: __filename
}, async (conn, mek, m, { reply }) => {

    reply("📖 صفائی ایمان کا حصہ ہے");
});

cmd({
    pattern: "hadith_truth",
    category: "islamic",
    react: "📖",
    filename: __filename
}, async (conn, mek, m, { reply }) => {

    reply("📖 سچائی نجات دیتی ہے");
});

cmd({
    pattern: "hadith_patience",
    category: "islamic",
    react: "📖",
    filename: __filename
}, async (conn, mek, m, { reply }) => {

    reply("📖 صبر جنت کی کنجی ہے");
});

cmd({
    pattern: "darood_sharif",
    category: "islamic",
    react: "🌙",
    filename: __filename
}, async (conn, mek, m, { reply }) => {

    reply("🌙 اللهم صل وسلم على نبينا محمد");
});

cmd({
    pattern: "kalima_tayyiba",
    category: "islamic",
    react: "☪️",
    filename: __filename
}, async (conn, mek, m, { reply }) => {

    reply("☪️ لا إله إلا الله محمد رسول الله");
});

cmd({
    pattern: "islam_fact",
    category: "islamic",
    react: "🕌",
    filename: __filename
}, async (conn, mek, m, { reply }) => {

    reply("🕌 صدقہ رزق میں برکت لاتا ہے اور گناہ مٹاتا ہے");
});

cmd({
    pattern: "quran_reminder",
    category: "islamic",
    react: "📖",
    filename: __filename
}, async (conn, mek, m, { reply }) => {

    reply("📖 قرآن مجید ہدایت اور رحمت ہے");
});
