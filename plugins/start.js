// restart.js - ESM Version
import { cmd } from "../command.js";

const AUTO_RESTART_TIME = 10 * 60 * 1000; // 30 Minutes

// Auto Restart Timer
setInterval(() => {
  console.log("♻️ Auto Restarting Bot...");
  process.exit(0);
}, AUTO_RESTART_TIME);

// Manual Restart Command (Owner Only)
cmd({
  pattern: "restart",
  desc: "Restart Bot",
  category: "system",
  react: "♻️",
  fromMe: true,
  filename: import.meta.url
},
async (conn, mek, m, { reply }) => {
  try {
    await reply("♻️ Restarting bot...");
    setTimeout(() => {
      process.exit(0);
    }, 2000);
  } catch (e) {
    console.log(e);
    reply("❌ Restart failed.");
  }
});
