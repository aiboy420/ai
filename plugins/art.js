// ascii.js - مزید ASCII Art کمانڈز (اضافی)
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── SUN ───
cmd({
    pattern: "sun",
    desc: "Show sun ASCII art",
    category: "fun",
    react: "☀️",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const art = `
         \\|/
        --O--
         /|\\
        / | \\
       /  |  \\
      /   |   \\
     /    |    \\
    /     |     \\
   /______|______\\
    `;
    reply(art);
});

// ─── CLOUD ───
cmd({
    pattern: "cloud",
    desc: "Show cloud ASCII art",
    category: "fun",
    react: "☁️",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const art = `
          .--.
        .'    '.
       /        \\
      :          :
      |          |
      :          :
       \\        /
        '.    .'
          '--'
    `;
    reply(art);
});

// ─── RAIN ───
cmd({
    pattern: "rain",
    desc: "Show rain ASCII art",
    category: "fun",
    react: "🌧️",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const art = `
        .-.  .-.  .-.
       (   )(   )(   )
        '-'  '-'  '-'
         |    |    |
         |    |    |
         |    |    |
         |    |    |
         |    |    |
         |    |    |
    `;
    reply(art);
});

// ─── SNOW ───
cmd({
    pattern: "snow",
    desc: "Show snow ASCII art",
    category: "fun",
    react: "❄️",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const art = `
        *   *   *   *
       *  *  *  *  *
      * * * * * * *
       *  *  *  *  *
        *   *   *   *
       *  *  *  *  *
      * * * * * * *
       *  *  *  *  *
        *   *   *   *
    `;
    reply(art);
});

// ─── BUTTERFLY ───
cmd({
    pattern: "butterfly",
    desc: "Show butterfly ASCII art",
    category: "fun",
    react: "🦋",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const art = `
        /\\   /\\
       /  \\ /  \\
      /    V    \\
     /   (___)   \\
    /     \\ /     \\
   /       V       \\
  /_________________\\
    `;
    reply(art);
});

// ─── EAGLE ───
cmd({
    pattern: "eagle",
    desc: "Show eagle ASCII art",
    category: "fun",
    react: "🦅",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const art = `
          ___
        .'   '.
       /       \\
      |  _   _  |
      | ( ) ( ) |
       \\  '-'  /
        '.   .'
          '---'
         /     \\
        /       \\
       /_________\\
    `;
    reply(art);
});

// ─── LION ───
cmd({
    pattern: "lion",
    desc: "Show lion ASCII art",
    category: "fun",
    react: "🦁",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const art = `
          ________
        /    /\\    \\
       /    /  \\    \\
      /    /    \\    \\
     /    /      \\    \\
    /____/________\\____\\
    |    |        |    |
    |    |        |    |
    |    |        |    |
    |____|________|____|
    `;
    reply(art);
});

// ─── ELEPHANT ───
cmd({
    pattern: "elephant",
    desc: "Show elephant ASCII art",
    category: "fun",
    react: "🐘",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const art = `
         _____
       .'     '.
      /         \\
     |  O     O  |
     |    ---    |
      \\    V    /
       '._____.'
        /     \\
       /       \\
      /_________\\
    `;
    reply(art);
});

// ─── TURTLE ───
cmd({
    pattern: "turtle",
    desc: "Show turtle ASCII art",
    category: "fun",
    react: "🐢",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const art = `
        ______
       /      \\
      /   __   \\
     |  (__)   |
     |   __    |
      \\  (__) /
       \\______/
        |  |  |
        |  |  |
        |__|__|
    `;
    reply(art);
});

// ─── SNAKE ───
cmd({
    pattern: "snake",
    desc: "Show snake ASCII art",
    category: "fun",
    react: "🐍",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const art = `
        __
       /  \\
      /    \\
     /  ()  \\
    /  ----  \\
   /    ()    \\
  /  ----  ---- \\
 /              \\
/________________\\
    `;
    reply(art);
});

// ─── CROWN ───
cmd({
    pattern: "crown",
    desc: "Show crown ASCII art",
    category: "fun",
    react: "👑",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const art = `
       .---.
      /     \\
     /  /\\  \\
    /  /  \\  \\
   /  /    \\  \\
  /  /      \\  \\
 /  /________\\  \\
/________________\\
  |    |  |    |
  |    |  |    |
  |____|  |____|
    `;
    reply(art);
});

// ─── SWORD ───
cmd({
    pattern: "sword",
    desc: "Show sword ASCII art",
    category: "fun",
    react: "⚔️",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const art = `
          /\\
         /  \\
        /    \\
       /  ||  \\
      /   ||   \\
     /    ||    \\
    /     ||     \\
   /      ||      \\
  /       ||       \\
 /________||________\\
         ||||
         ||||
         ||||
        (____)
    `;
    reply(art);
});

// ─── SHIELD ───
cmd({
    pattern: "shield",
    desc: "Show shield ASCII art",
    category: "fun",
    react: "🛡️",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const art = `
       .-------.
      /         \\
     /   /\\   /\\
    /   /  \\ /  \\
   /   /    V    \\
  /   /     |     \\
 /   /      |      \\
/___/_______|_______\\
    |        |        |
    |        |        |
    |________|________|
    `;
    reply(art);
});

// ─── CASTLE ───
cmd({
    pattern: "castle",
    desc: "Show castle ASCII art",
    category: "fun",
    react: "🏰",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const art = `
       /\\        /\\
      /  \\      /  \\
     /    \\    /    \\
    /      \\  /      \\
   /        \\/        \\
  /_________/\\_________\\
  |  |  |  |  |  |  |  |
  |  |  |  |  |  |  |  |
  |  |  |  |  |  |  |  |
  |__|__|__|__|__|__|__|
    `;
    reply(art);
});

// ─── BOAT ───
cmd({
    pattern: "boat",
    desc: "Show boat ASCII art",
    category: "fun",
    react: "⛵",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const art = `
          /\\
         /  \\
        /    \\
       /      \\
      /________\\
     |  |  |  |
     |  |  |  |
     |__|__|__|
        ~~~  
       ~~~~~
      ~~~~~~~
    `;
    reply(art);
});

// ─── AIRPLANE ───
cmd({
    pattern: "airplane",
    desc: "Show airplane ASCII art",
    category: "fun",
    react: "✈️",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const art = `
        _______
       /       \\
      /    o    \\
     /           \\
    /     ___     \\
   /     /   \\     \\
  /_____/     \\_____\\
 /     /       \\     \\
/_____/         \\_____\\
    `;
    reply(art);
});

// ─── ROCKET ───
cmd({
    pattern: "rocket2",
    desc: "Show rocket ASCII art",
    category: "fun",
    react: "🚀",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const art = `
          /\\
         /  \\
        /    \\
       /  ||  \\
      /   ||   \\
     /    ||    \\
    /     ||     \\
   /      ||      \\
  /       ||       \\
 /________||________\\
    |    ||    |
    |    ||    |
    |    ||    |
    |____||____|
         ||
         ||
        /__\\
    `;
    reply(art);
});

// ─── GHOST ───
cmd({
    pattern: "ghost2",
    desc: "Show ghost ASCII art",
    category: "fun",
    react: "👻",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const art = `
        .-----.
       /       \\
      |  O   O  |
      |    V    |
      |   ---   |
       \\   _   /
        '.   .'
          `._.'
         /| |\\
        / | | \\
       /  | |  \\
      /___| |___\\
          | |
          | |
          |_|
    `;
    reply(art);
});

// ─── WITCH ───
cmd({
    pattern: "witch",
    desc: "Show witch ASCII art",
    category: "fun",
    react: "🧙‍♀️",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const art = `
         /\\
        /  \\
       /    \\
      /  ||  \\
     /   ||   \\
    /    ||    \\
   /     ||     \\
  /      ||      \\
 /_______||_______\\
    |  |  |
    |  |  |
    |  |  |
    |__|__|
    `;
    reply(art);
});

// ─── DRAGON ───
cmd({
    pattern: "dragon",
    desc: "Show dragon ASCII art",
    category: "fun",
    react: "🐉",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const art = `
         /\\
        /  \\
       /    \\
      /  ()  \\
     /  ----  \\
    /    ()    \\
   /  ----  ---- \\
  /    ()    ()   \\
 /________________\\
  |   ||    ||   |
  |   ||    ||   |
  |___||____||___|
    `;
    reply(art);
});

// ─── UNICORN ───
cmd({
    pattern: "unicorn",
    desc: "Show unicorn ASCII art",
    category: "fun",
    react: "🦄",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const art = `
          /\\
         /  \\
        /    \\
       /  /\\  \\
      /  /  \\  \\
     /  /    \\  \\
    /  /      \\  \\
   /  /________\\  \\
  /                \\
 /____/\\    /\\____\\
      /      \\
     /  __   \\
    /  (__)   \\
   /    __     \\
  /    (__)     \\
 /_______________\\
    `;
    reply(art);
});
