// JawadTech - Fixed Commands

import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';
const __filename = fileURLToPath(import.meta.url);

// Configuration
const WebUrl = 'https://nawazmd.vercel.app/api';

// ==================== HELPER FUNCTIONS ====================

// Function to get status emoji based on count
function getCountStatus(count) {
    if (count >= 50) return '🔴';
    if (count >= 40) return '🟣';
    if (count >= 30) return '🟡';
    if (count >= 20) return '🟠';
    if (count >= 10) return '🔵';
    return '🟢';
}

// Validate channel post URL format
function isValidChannelPostUrl(url) {
    const pattern = /^https?:\/\/(?:www\.)?whatsapp\.com\/channel\/[a-zA-Z0-9]+\/\d+$/;
    return pattern.test(url);
}

// Extract channel ID and post ID from URL
function extractIdsFromUrl(url) {
    const match = url.match(/\/channel\/([a-zA-Z0-9]+)\/(\d+)/);
    if (match) {
        return {
            channelId: match[1],
            postId: match[2]
        };
    }
    return null;
}

// Parse emojis
function parseEmojis(input) {
    let emojis = [];
    const parts = input.split(',').map(p => p.trim()).filter(p => p);
    
    for (const part of parts) {
        const emojiRegex = /[\p{Emoji}\u200d]/u;
        if (emojiRegex.test(part)) {
            emojis.push(part);
        }
    }
    
    return emojis;
}

// Validate emojis format
function validateEmojis(emojis) {
    if (!emojis || emojis.length === 0) {
        return {
            valid: false,
            error: '❌ *No valid emojis found!*\n*Example:* .chreact https://whatsapp.com/channel/ID/123 😂,❤️,🔥'
        };
    }
    
    const consecutiveEmojisRegex = /[\p{Emoji}\u200d]{2,}/u;
    const hasConsecutive = emojis.some(e => consecutiveEmojisRegex.test(e));
    
    if (hasConsecutive) {
        return {
            valid: false,
            error: '❌ *Invalid format! Please separate all emojis with commas*\n*Example:* .chreact link 😂,❤️,🔥,👏,😮'
        };
    }
    
    return { valid: true, emojis };
}

// Parse server selection (supports #1/2/3, &5, &6+9 formats)
function parseServerSelection(input) {
    if (!input) return { type: 'all', servers: null };
    
    const specificMatch = input.match(/^#([\d\/]+)$/);
    if (specificMatch) {
        const numbers = specificMatch[1].split('/').map(n => parseInt(n)).filter(n => !isNaN(n) && n > 0);
        if (numbers.length > 0) {
            return { type: 'specific', servers: numbers };
        }
    }
    
    // Range MUST be checked before "first" (&6+9 before &5)
    const rangeMatch = input.match(/^&(\d+)\+(\d+)$/);
    if (rangeMatch) {
        const start = parseInt(rangeMatch[1]);
        const end = parseInt(rangeMatch[2]);
        if (start > 0 && end > 0 && start <= end) {
            return { type: 'range', start: start, end: end };
        }
    }
    
    const firstMatch = input.match(/^&(\d+)$/);
    if (firstMatch) {
        const count = parseInt(firstMatch[1]);
        if (count > 0) {
            return { type: 'first', count: count };
        }
    }
    
    return { type: 'all', servers: null };
}

// Get servers based on selection
function getSelectedServers(servers, selection) {
    if (!selection || selection.type === 'all') {
        return servers;
    }
    
    if (selection.type === 'specific') {
        const selected = [];
        for (const num of selection.servers) {
            if (num <= servers.length && num > 0) {
                selected.push(servers[num - 1]);
            }
        }
        return selected;
    }
    
    if (selection.type === 'first') {
        return servers.slice(0, selection.count);
    }
    
    if (selection.type === 'range') {
        const start = Math.max(0, selection.start - 1);
        const end = Math.min(servers.length, selection.end);
        return servers.slice(start, end);
    }
    
    return servers;
}

// Get server selection explanation
function getServerSelectionExplanation(selection, totalServers) {
    if (!selection || selection.type === 'all') {
        return `🌐 *All ${totalServers} servers*`;
    }
    
    if (selection.type === 'specific') {
        return `🎯 *Specific servers:* #${selection.servers.join('/')}`;
    }
    
    if (selection.type === 'first') {
        return `🎯 *First ${selection.count} servers*`;
    }
    
    if (selection.type === 'range') {
        return `🎯 *Servers ${selection.start} to ${selection.end}*`;
    }
    
    return `🌐 *All ${totalServers} servers*`;
}

// Fetch servers from API
async function fetchServersFromApi() {
    try {
        const response = await axios.get(`${WebUrl}/servers`, { timeout: 10000 });
        
        if (response.data && Array.isArray(response.data.servers)) {
            return response.data.servers;
        }
        
        return null;
    } catch (error) {
        console.error('Failed to fetch servers from API:', error.message);
        return null;
    }
}

// ==================== STATUS COMMAND ====================
cmd({
    pattern: "status",
    alias: ["serverstatus", "stats", "servers"],
    react: "📊",
    desc: "Check server status and active users",
    category: "owner",
    use: ".status",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        const servers = await fetchServersFromApi();

        if (!servers || servers.length === 0) {
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return reply("❌ Failed to fetch server list from API.");
        }

        let serverStatus = [];
        let totalActive = 0;
        let totalLimit = 0;
        let onlineServers = 0;
        let offlineServers = 0;

        // Check all servers in parallel
        const statusPromises = servers.map(async (server) => {
            try {
                const statusResponse = await axios.get(
                    `${server.url}/active`,
                    { timeout: 8000 }
                );

                if (statusResponse.data && !statusResponse.data.error) {
                    return {
                        name: server.name,
                        count: statusResponse.data.count || 0,
                        limit: statusResponse.data.limit || 50,
                        status: 'ONLINE'
                    };
                }
                
                return {
                    name: server.name,
                    count: 0,
                    limit: 0,
                    status: 'OFFLINE'
                };
            } catch (error) {
                return {
                    name: server.name,
                    count: 0,
                    limit: 0,
                    status: 'OFFLINE'
                };
            }
        });

        const results = await Promise.all(statusPromises);

        for (const result of results) {
            serverStatus.push(result);
            
            if (result.status === 'ONLINE') {
                totalActive += result.count;
                totalLimit += result.limit;
                onlineServers++;
            } else {
                offlineServers++;
            }
        }

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

        let statusMessage = `╭──「 *SERVER STATUS* 」
│
│ *📊 Overview*
│ Total: ${servers.length}
│ Online: ${onlineServers} | Offline: ${offlineServers}
│ Active: ${totalActive}/${totalLimit}
│
│━━━━━━━━━━━━━━━━━━━━
`;

        serverStatus.forEach((s, index) => {
            const statusEmoji = s.status === 'OFFLINE'
                ? '🔴'
                : getCountStatus(s.count);

            statusMessage += `│ Server ${index + 1}: ${String(s.count).padStart(2, ' ')}/${s.limit} ${statusEmoji} ${s.status}\n`;
        });

        statusMessage += `╰─────────────────`;

        await reply(statusMessage);

    } catch (error) {
        console.error("Status command error:", error);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        await reply("❌ Error checking server status.");
    }
});

// ==================== CHREACT COMMAND ====================
cmd({
    pattern: "chreact",
    alias: ["channelreact", "creact", "rp"],
    react: "🎯",
    desc: "React to WhatsApp channel post with server selection",
    category: "group",
    use: ".chreact <channel_post_url> [emojis] [server_selection]",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        const usageMessage = `╭──「 *🎯 CHREACT COMMAND USAGE* 」
│
│ *Basic Usage:*
│ .chreact <channel_post_url> [emojis] [server_selection]
│
│ *Server Selection Options:*
│ • #1/2/3  → Use specific servers
│ • &5      → Use first 5 servers
│ • &6+9    → Use servers 6 to 9
│
│ *Examples (with default emojis ❤️,👍,🔥):*
│ 1. .chreact https://whatsapp.com/channel/xxx/123
│ 2. .chreact link #1/2/3
│ 3. .chreact link &5
│ 4. .chreact link &6+9
│
│ *Examples (with custom emojis):*
│ 5. .chreact link ❤️,🔥
│ 6. .chreact link ❤️,🔥 #1/2/3
│ 7. .chreact link ❤️,🔥 &5
│ 8. .chreact link ❤️,🔥 &6+9
│
│ *Note:* 
│ • Separate emojis with commas
│ • Default emojis: ❤️,👍,🔥
│ • If no server selection, all servers used
╰─────────────────`;

        if (!args[0]) {
            return reply(`❌ *Please provide a channel post URL!*\n\n${usageMessage}`);
        }
        
        const url = args[0];
        
        if (!isValidChannelPostUrl(url)) {
            return reply(`❌ *Invalid URL format!*

*Valid Format:*
https://whatsapp.com/channel/CHANNEL_ID/POST_ID

*Example:*
https://whatsapp.com/channel/0029VbCO8mW8F2p5iZ2ZoS3k/609

${usageMessage}`);
        }
        
        const ids = extractIdsFromUrl(url);
        if (!ids) {
            return reply(`❌ *Failed to extract channel/post IDs from URL!*\n\n${usageMessage}`);
        }
        
        let emojis = [];
        let emojisString = '';
        let selection = null;
        
        const remainingArgs = args.slice(1);
        let emojiArgs = [];
        
        // Parse server selection and emojis from remaining args
        for (const arg of remainingArgs) {
            const parsed = parseServerSelection(arg);
            if (parsed.type !== 'all') {
                selection = parsed;
            } else {
                emojiArgs.push(arg);
            }
        }
        
        // Parse emojis
        if (emojiArgs.length > 0) {
            const emojiText = emojiArgs.join(' ');
            emojis = parseEmojis(emojiText);
            emojisString = emojis.join(',');
        }
        
        // Default emojis
        if (!emojisString) {
            emojis = ['❤️', '👍', '🔥'];
            emojisString = emojis.join(',');
        }
        
        // Validate emojis
        const validation = validateEmojis(emojis);
        if (!validation.valid) {
            return reply(validation.error);
        }
        
        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });
        
        // Fetch servers from API
        const servers = await fetchServersFromApi();
        
        if (!servers || servers.length === 0) {
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return reply("❌ *Failed to fetch server list from API!*");
        }
        
        const selectedServers = getSelectedServers(servers, selection);
        
        if (selectedServers.length === 0) {
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return reply(`❌ *No valid servers selected!*

*Note:* Server numbers must be valid (1-${servers.length})

${usageMessage}`);
        }
        
        const selectionInfo = getServerSelectionExplanation(selection, servers.length);
        
        const resultMessage = `✅ *Reactions sent successfully!*

📊 *Details:*
🎯 *Channel:* ${ids.channelId}
📝 *Post:* ${ids.postId}
😊 *Emojis:* ${validation.emojis.join(' ')}
🖥️ ${selectionInfo}
📡 *Servers Used:* ${selectedServers.length}

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙰𝚆𝙰𝚉 𝙼𝙳`;

        await reply(resultMessage);
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
        
        // Fire reactions to selected servers (non-blocking)
        for (const server of selectedServers) {
            const reactUrl = `${server.url}/react?key=chacha420&url=${encodeURIComponent(url)}&emojis=${encodeURIComponent(emojisString)}`;
            axios.get(reactUrl, { timeout: 5000 }).catch(() => {});
        }
        
    } catch (error) {
        console.error("React post error:", error);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        await reply(`❌ *Error processing request!*\n\n*Error:* ${error.message}`);
    }
});

// ==================== SERVERLIST COMMAND ====================
cmd({
    pattern: "serverlist",
    alias: ["listservers", "allservers"],
    react: "📋",
    desc: "Show all available servers",
    category: "owner",
    use: ".serverlist",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    try {
        const servers = await fetchServersFromApi();

        if (!servers || servers.length === 0) {
            return reply("❌ Failed to fetch server list from API.");
        }

        let listMessage = `╭──「 *📋 SERVER LIST* 」
│\n`;

        servers.forEach((server, index) => {
            listMessage += `│ ${index + 1}. ${server.name}\n│    ${server.url}\n│\n`;
        });

        listMessage += `╰─────────────────\n\n`;
        listMessage += `*Total:* ${servers.length} servers\n`;
        listMessage += `*Usage:* .chreact <url> [emojis] [#1/2/3 | &5 | &6+9]`;

        await reply(listMessage);
    } catch (error) {
        console.error("Server list error:", error);
        await reply("❌ Error fetching server list.");
    }
});
