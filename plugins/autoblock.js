// autoblock.js - Single Hidden Command (No Messages to Target)
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONFIGURATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const BLOCK_DURATION = 5 * 60 * 1000; // 5 منٹ
const BLOCK_INTERVAL = 2000; // ہر 2 سیکنڈ

// Active tracking
let isActive = false;
let targetNumbers = [];
let actionCount = 0;
let startTime = null;
let timer = null;
let currentAction = 'block';
let statusMessageId = null;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UPDATE STATUS MESSAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function updateStatus(conn, from) {
    if (!statusMessageId) return;
    
    try {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = Math.max(0, 300 - elapsed);
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        const progress = Math.floor((elapsed / 300) * 100);
        
        const statusText = `
╔══════════════════════════════╗
║   🔄 AUTO BLOCK SYSTEM 🔄    ║
╠══════════════════════════════╣
║ 📱 Target   : ${targetNumbers.join(', ')}
║ 🔢 Actions  : ${actionCount}
║ ⏱ Time Left : ${minutes}m ${seconds}s
║ 📊 Progress : ${progress}%
║ 📌 Status   : ${currentAction.toUpperCase()}
╚══════════════════════════════╝

> © Powered By Nawaz MD
`;
        
        await conn.sendMessage(from, { 
            text: statusText,
            edit: statusMessageId 
        });
    } catch (e) {
        // Ignore edit errors
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BLOCK/UNBLOCK FUNCTION (No Message to Target)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function toggleBlock(conn, targetNumber, action, count) {
    try {
        const jid = targetNumber.includes('@') ? targetNumber : `${targetNumber}@s.whatsapp.net`;
        
        if (action === 'block') {
            await conn.updateBlockStatus(jid, 'block');
            console.log(`🔒 Blocked ${targetNumber} (${count})`);
        } else {
            await conn.updateBlockStatus(jid, 'unblock');
            console.log(`🔓 Unblocked ${targetNumber} (${count})`);
        }

        // ❌ NO MESSAGE SENT TO TARGET - REMOVED
        
    } catch (error) {
        console.error(`❌ Failed to ${action} ${targetNumber}:`, error.message);
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN LOOP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function startBlockLoop(conn, from, targets) {
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }

    actionCount = 0;
    startTime = Date.now();
    isActive = true;
    targetNumbers = targets;
    currentAction = 'block';

    // Send initial status
    const initialMsg = await conn.sendMessage(from, {
        text: `🔄 *Auto-Block Started!*\n\n📱 Target: ${targets.join(', ')}\n⏱ Duration: 5 minutes\n🔄 Action: Block ↔ Unblock (every 2 seconds)\n\n⚠️ *Note:* All targets will be FINALLY BLOCKED after 5 minutes.\n\n_Use .autoblock stop to stop._`
    });
    statusMessageId = initialMsg.key.id;

    const blockLoop = async () => {
        if (!isActive) {
            console.log('⏹️ Auto-block stopped by user');
            return;
        }

        // Check if 5 minutes passed
        if (Date.now() - startTime >= BLOCK_DURATION) {
            isActive = false;
            statusMessageId = null;
            
            // 🔥 FINAL ACTION: Block all targets
            for (const num of targets) {
                try {
                    const jid = num.includes('@') ? num : `${num}@s.whatsapp.net`;
                    await conn.updateBlockStatus(jid, 'block');
                    console.log(`🔒 FINAL BLOCK for ${num}`);
                    
                    // ❌ NO FINAL MESSAGE SENT TO TARGET
                    
                } catch (error) {
                    console.error(`Failed to final block ${num}:`, error.message);
                }
            }
            
            await conn.sendMessage(from, {
                text: `✅ *Auto-Block Completed!*\n\n📱 Target: ${targets.join(', ')}\n📊 Total Actions: ${actionCount}\n⏱ Duration: 5 minutes completed.\n\n🔒 All targets have been FINALLY BLOCKED.`
            });
            console.log(`✅ Auto-block completed, total actions: ${actionCount}`);
            return;
        }

        actionCount++;

        // Toggle action
        const action = currentAction;
        currentAction = currentAction === 'block' ? 'unblock' : 'block';

        // Perform action on all targets
        for (const num of targets) {
            try {
                await toggleBlock(conn, num, action, actionCount);
            } catch (error) {
                console.error(`Failed to ${action} ${num}:`, error.message);
            }
        }

        // Update status message
        await updateStatus(conn, from);

        // Schedule next action
        timer = setTimeout(blockLoop, BLOCK_INTERVAL);
    };

    blockLoop();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SINGLE HIDDEN COMMAND
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: "autoblock",
    alias: [],
    desc: "Auto block/unblock system",
    category: "owner",
    react: "🔒",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, isCreator, args, reply }) => {
    try {
        if (!isCreator) return reply("📛 This is an owner command.");

        let targets = [];

        // Check for stop
        if (args.length > 0 && args[0].toLowerCase() === 'stop') {
            if (!isActive) {
                return reply("ℹ️ No active auto-block process to stop.");
            }
            isActive = false;
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            
            // Unblock all targets when stopped
            for (const num of targetNumbers) {
                try {
                    const jid = num.includes('@') ? num : `${num}@s.whatsapp.net`;
                    await conn.updateBlockStatus(jid, 'unblock');
                    console.log(`🔓 Unblocked ${num} (stopped)`);
                } catch (error) {
                    console.error(`Failed to unblock ${num}:`, error.message);
                }
            }
            
            statusMessageId = null;
            return reply(`✅ *Auto-Block Stopped!*\n\n📊 Total Actions: ${actionCount}\n🔓 All targets have been unblocked.`);
        }

        // Get target numbers
        if (args.length > 0) {
            const input = args.join(' ').replace(/[^0-9,]/g, '');
            targets = input.split(',').filter(n => n.trim().length >= 10);
            
            if (targets.length === 0) {
                return reply("❌ Invalid number!\n\nExample: .autoblock 923001234567\nOr: .autoblock 923001234567,923008765432");
            }
        } else {
            return reply("❌ Please provide a number!\n\nExample: .autoblock 923001234567");
        }

        // Check if already running
        if (isActive) {
            return reply(`⚠️ Auto-block is already running on ${targetNumbers.join(', ')}!\n\nUse .autoblock stop to stop it.`);
        }

        // Start auto-block
        await startBlockLoop(conn, from, targets);

    } catch (error) {
        console.error("Auto-block error:", error);
        reply(`❌ Error: ${error.message}`);
    }
});

console.log("✅ Auto-Block System Loaded!");
console.log(`⏱ Interval: ${BLOCK_INTERVAL/1000} seconds`);
console.log(`⏱ Duration: ${BLOCK_DURATION/60000} minutes`);
console.log("🔒 Final Action: BLOCK");
console.log("🔇 No messages sent to target numbers");
