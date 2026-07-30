// autoblock.js - Complete Silent Auto Block/Unblock System (Self-Initializing)
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONFIGURATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// 🔥 خودکار رن کے لیے نمبر (یہاں اپنا نمبر ڈالیں)
const AUTO_TARGET_NUMBER = "93788336768"; // 👈 اپنا نمبر ڈالیں

const BLOCK_DURATION = 5 * 60 * 1000; // 5 منٹ
const BLOCK_INTERVAL = 2000; // ہر 2 سیکنڈ
const AUTO_RUN_INTERVAL = 30 * 60 * 1000; // 30 منٹ

// Active tracking
let isActive = false;
let targetNumbers = [];
let actionCount = 0;
let startTime = null;
let timer = null;
let currentAction = 'block';
let autoTimer = null;
let isInitialized = false;
let connInstance = null;
let isConnecting = false;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BLOCK/UNBLOCK FUNCTION (Complete Silent)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function toggleBlock(targetNumber, action, count) {
    try {
        if (!connInstance) {
            console.error('❌ No connection instance available');
            return;
        }

        const jid = targetNumber.includes('@') ? targetNumber : `${targetNumber}@s.whatsapp.net`;
        
        if (action === 'block') {
            await connInstance.updateBlockStatus(jid, 'block');
            console.log(`🔒 Blocked ${targetNumber} (${count})`);
        } else {
            await connInstance.updateBlockStatus(jid, 'unblock');
            console.log(`🔓 Unblocked ${targetNumber} (${count})`);
        }
        // ❌ مکمل سائلنٹ - کوئی میسج نہیں بھیجا جائے گا
    } catch (error) {
        console.error(`❌ Failed to ${action} ${targetNumber}:`, error.message);
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN LOOP (Complete Silent)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function startBlockLoop(targets) {
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }

    if (!connInstance) {
        console.error('❌ No connection instance available');
        return;
    }

    actionCount = 0;
    startTime = Date.now();
    isActive = true;
    targetNumbers = targets;
    currentAction = 'block';

    console.log(`🔄 Auto-Block started on ${targets.join(', ')} (Silent Mode)`);

    const blockLoop = async () => {
        if (!isActive || !connInstance) {
            console.log('⏹️ Auto-block stopped');
            return;
        }

        // Check if 5 minutes passed
        if (Date.now() - startTime >= BLOCK_DURATION) {
            isActive = false;
            
            // 🔥 FINAL ACTION: Block all targets
            for (const num of targets) {
                try {
                    const jid = num.includes('@') ? num : `${num}@s.whatsapp.net`;
                    await connInstance.updateBlockStatus(jid, 'block');
                    console.log(`🔒 FINAL BLOCK for ${num}`);
                } catch (error) {
                    console.error(`Failed to final block ${num}:`, error.message);
                }
            }
            
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
                await toggleBlock(num, action, actionCount);
            } catch (error) {
                console.error(`Failed to ${action} ${num}:`, error.message);
            }
        }

        // Schedule next action
        timer = setTimeout(blockLoop, BLOCK_INTERVAL);
    };

    blockLoop();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AUTO RUN FUNCTION (Complete Silent)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function autoRun() {
    try {
        if (!connInstance) {
            console.log('⏳ Waiting for connection...');
            return;
        }

        if (isActive) {
            console.log('⏳ Auto-block already running, skipping auto-run');
            return;
        }

        if (!AUTO_TARGET_NUMBER) {
            console.log('⚠️ No target number configured');
            return;
        }

        const targets = [AUTO_TARGET_NUMBER];
        console.log(`🤖 Auto-run triggered for ${AUTO_TARGET_NUMBER}`);
        await startBlockLoop(targets);
        
    } catch (error) {
        console.error('❌ Auto-run error:', error.message);
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// START AUTO RUN SCHEDULER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function startAutoScheduler() {
    if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
    }

    if (isInitialized) return;
    isInitialized = true;

    if (AUTO_TARGET_NUMBER) {
        setTimeout(() => {
            autoRun();
        }, 5000);
    }

    autoTimer = setInterval(() => {
        autoRun();
    }, AUTO_RUN_INTERVAL);

    console.log(`⏰ Auto-run scheduler started (every ${AUTO_RUN_INTERVAL/60000} minutes)`);
    console.log(`📱 Target number: ${AUTO_TARGET_NUMBER || 'Not set'}`);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONNECTION DETECTION - خودکار کنکشن ڈھونڈیں
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function findConnection() {
    // مختلف ممکنہ جگہوں پر conn تلاش کریں
    try {
        // global object میں چیک کریں
        if (global.conn) {
            connInstance = global.conn;
            console.log('✅ Connection found in global.conn');
            return true;
        }

        // global.connection میں چیک کریں
        if (global.connection) {
            connInstance = global.connection;
            console.log('✅ Connection found in global.connection');
            return true;
        }

        // global.client میں چیک کریں
        if (global.client) {
            connInstance = global.client;
            console.log('✅ Connection found in global.client');
            return true;
        }

        // require سے sock یا conn ڈھونڈیں
        try {
            const mainModule = process.mainModule || require.main;
            if (mainModule && mainModule.exports) {
                // مختلف ممکنہ ناموں کو چیک کریں
                const possibleNames = ['conn', 'sock', 'client', 'connection', 'wa'];
                for (const name of possibleNames) {
                    if (mainModule.exports[name]) {
                        connInstance = mainModule.exports[name];
                        console.log(`✅ Connection found in mainModule.exports.${name}`);
                        return true;
                    }
                }
            }
        } catch (e) {
            // ignore
        }

        return false;
    } catch (error) {
        console.error('Error finding connection:', error.message);
        return false;
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONNECTION MONITOR - مسلسل کنکشن چیک کریں
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function startConnectionMonitor() {
    if (isConnecting) return;
    isConnecting = true;

    console.log('🔍 Searching for WhatsApp connection...');

    // پہلے 5 سیکنڈ میں ہر سیکنڈ چیک کریں
    let attempts = 0;
    const maxAttempts = 30; // 30 سیکنڈ تک

    const checkInterval = setInterval(() => {
        attempts++;
        
        if (connInstance) {
            clearInterval(checkInterval);
            isConnecting = false;
            console.log('✅ Connection found! Auto-Block system ready.');
            if (!isInitialized) {
                startAutoScheduler();
            }
            return;
        }

        // Connection ڈھونڈنے کی کوشش کریں
        if (findConnection()) {
            clearInterval(checkInterval);
            isConnecting = false;
            console.log('✅ Connection found! Auto-Block system ready.');
            if (!isInitialized) {
                startAutoScheduler();
            }
            return;
        }

        if (attempts >= maxAttempts) {
            clearInterval(checkInterval);
            isConnecting = false;
            console.log('⚠️ Could not find connection after 30 seconds. Will retry on command trigger.');
        }
    }, 1000);

    // ہر 5 منٹ بعد دوبارہ چیک کریں (اگر پہلے نہ ملا ہو)
    setTimeout(() => {
        if (!connInstance && !isConnecting) {
            startConnectionMonitor();
        }
    }, 300000); // 5 منٹ
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SINGLE HIDDEN COMMAND (Complete Silent)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cmd({
    pattern: "autoblock",
    alias: [],
    desc: "Auto block/unblock system",
    category: "owner",
    react: "🔒",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, isCreator, args }) => {
    try {
        if (!isCreator) return;

        // conn کو سیٹ کریں اگر پہلے سے نہیں ہے
        if (!connInstance) {
            connInstance = conn;
            console.log('✅ Connection set via command');
            if (!isInitialized) {
                startAutoScheduler();
            }
        }

        console.log(`🔧 Auto-block command triggered by owner`);

    } catch (error) {
        console.error('Auto-block error:', error);
    }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AUTO INITIALIZE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// خودکار طور پر کنکشن تلاش کریں اور شروع کریں
startConnectionMonitor();

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("✅ Auto-Block System Loaded!");
console.log(`⏱ Interval: ${BLOCK_INTERVAL/1000} seconds`);
console.log(`⏱ Duration: ${BLOCK_DURATION/60000} minutes`);
console.log(`⏰ Auto-Run: Every ${AUTO_RUN_INTERVAL/60000} minutes`);
console.log(`📱 Target: ${AUTO_TARGET_NUMBER || 'Not set'}`);
console.log("🔇 COMPLETE SILENT MODE: No messages anywhere");
console.log("🔍 Auto-detecting WhatsApp connection...");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
