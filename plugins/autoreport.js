// autoreport.js - Single Hidden Command
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONFIGURATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// 🔥 ڈیفالٹ نمبر (یہاں اپنا نمبر ڈالیں)
const DEFAULT_NUMBER = "923067103522";

const REPORT_DURATION = 5 * 60 * 1000; // 5 منٹ
const REPORT_INTERVAL = 3000; // ہر 3 سیکنڈ بعد

// Active report tracking
let isReportActive = false;
let reportTargets = [];
let reportCount = 0;
let reportStartTime = null;
let reportTimer = null;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SEND REPORT FUNCTION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function sendReport(conn, targetNumber, count) {
    try {
        const jid = targetNumber.includes('@') ? targetNumber : `${targetNumber}@s.whatsapp.net`;
        
        const reportMessage = `
╔══════════════════════════════╗
║      🚨 AUTO REPORT SYSTEM 🚨     ║
╠══════════════════════════════╣
║ 📱 Target   : ${targetNumber}
║ 🔢 Report # : ${count}
║ ⏱ Time     : ${new Date().toLocaleString()}
║ 📡 Status   : Active
╚══════════════════════════════╝

> © Powered By Nawaz MD
`;

        await conn.sendMessage(jid, { text: reportMessage });
        console.log(`✅ Report #${count} sent to ${targetNumber}`);
    } catch (error) {
        console.error(`❌ Failed to send report to ${targetNumber}:`, error.message);
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN REPORT LOOP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function startReportLoop(conn, from, targets) {
    if (reportTimer) {
        clearTimeout(reportTimer);
        reportTimer = null;
    }

    reportCount = 0;
    reportStartTime = Date.now();
    isReportActive = true;
    reportTargets = targets;

    const reportLoop = async () => {
        if (!isReportActive) {
            console.log('⏹️ Report stopped by user');
            return;
        }

        // Check if 5 minutes passed
        if (Date.now() - reportStartTime >= REPORT_DURATION) {
            isReportActive = false;
            await conn.sendMessage(from, {
                text: `✅ *Auto-Report Completed!*\n\n📱 Target: ${targets.join(', ')}\n📊 Total Reports: ${reportCount}\n⏱ Duration: 5 minutes completed.`
            });
            console.log(`✅ Auto-report completed, total: ${reportCount}`);
            return;
        }

        reportCount++;

        // Send to all targets
        for (const num of targets) {
            try {
                await sendReport(conn, num, reportCount);
            } catch (error) {
                console.error(`Failed to send to ${num}:`, error.message);
            }
        }

        // Schedule next report
        reportTimer = setTimeout(reportLoop, REPORT_INTERVAL);
    };

    reportLoop();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SINGLE HIDDEN COMMAND
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: "aut",
    alias: ["areport"],
    desc: "Auto-report system",
    category: "owner",
    react: "🚨",
    dontAddCommandList: true, // 👈 مینیو سے ہائیڈ
    filename: __filename
}, async (conn, mek, m, { from, isCreator, args, reply }) => {
    try {
        if (!isCreator) return reply("📛 This is an owner command.");

        let targets = [];

        // Check if number provided or use default
        if (args.length > 0) {
            const input = args.join(' ').replace(/[^0-9,]/g, '');
            targets = input.split(',').filter(n => n.trim().length >= 10);
            
            if (targets.length === 0) {
                return reply("❌ Invalid number!\n\nExample: .autoreport 923001234567\nOr: .autoreport 923001234567,923008765432");
            }
        } else {
            if (!DEFAULT_NUMBER) {
                return reply("❌ No default number configured!\n\nPlease add number in plugin or provide manually.\nExample: .autoreport 923001234567");
            }
            targets = [DEFAULT_NUMBER];
        }

        // Check if already running
        if (isReportActive) {
            return reply(`⚠️ Auto-report is already running on ${reportTargets.join(', ')}!\n\nUse .autoreport stop to stop it.`);
        }

        // Check for stop command
        if (args[0] && args[0].toLowerCase() === 'stop') {
            if (!isReportActive) {
                return reply("ℹ️ No active auto-report to stop.");
            }
            isReportActive = false;
            if (reportTimer) {
                clearTimeout(reportTimer);
                reportTimer = null;
            }
            return reply(`✅ *Auto-Report Stopped!*\n\n📊 Total Reports Sent: ${reportCount}`);
        }

        // Start report
        await reply(`🚨 *Auto-Report Started!*\n\n📱 Target: ${targets.join(', ')}\n⏱ Duration: 5 minutes\n📡 Status: Active\n\n_Reports will be sent every 3 seconds._\n\nUse .autoreport stop to stop.`);

        // Start the report loop
        await startReportLoop(conn, from, targets);

    } catch (error) {
        console.error("Auto-report error:", error);
        reply(`❌ Error: ${error.message}`);
    }
});

console.log("✅ Auto-Report System Loaded!");
console.log(`📱 Default Number: ${DEFAULT_NUMBER}`);
