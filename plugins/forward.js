import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: 'forward',
    alias: ['fyd', 'fod', 'frd'],
    desc: 'Forward original replied message to groups',
    category: 'owner',
    react: '📤',
    filename: __filename
}, async (conn, mek, m, { from, isCreator, reply }) => {
    try {
        // OWNER ONLY
        if (!isCreator) {
            return reply('📛 This is an owner command.');
        }

        // CHECK REPLIED MESSAGE
        if (!m.quoted) {
            return reply(
                '🍁 Please reply to a Video, Image, Text or Link message.\n\n' +
                'Example:\n' +
                '.forward\n' +
                '.forward/2\n' +
                '.fyd/3'
            );
        }

        // GET GROUP LIMIT
        const commandText = (m.body || m.text || '').trim();
        const slashMatch = commandText.match(/\/(\d+)$/);

        let count = null;

        if (slashMatch) {
            count = Number.parseInt(slashMatch[1], 10);

            if (!Number.isSafeInteger(count) || count < 1) {
                return reply('❌ Please enter a valid group number.');
            }
        }

        // GET ALL PARTICIPATING GROUPS
        const groups = await conn.groupFetchAllParticipating();
        let groupIds = Object.keys(groups || {});

        if (!groupIds.length) {
            return reply('❌ No groups found.');
        }

        // LIMIT GROUPS IF SPECIFIED
        if (count !== null) {
            groupIds = groupIds.slice(0, count);
        }

        if (!groupIds.length) {
            return reply('❌ No groups available to forward.');
        }

        // GET ORIGINAL QUOTED MESSAGE
        const quoted = m.quoted;

        // Use the original message object where available.
        const originalMessage =
            quoted.fakeObj ||
            quoted.message ||
            quoted;

        // CHECK FOR COPY/FORWARD SUPPORT
        if (typeof conn.copyNForward !== 'function') {
            return reply(
                '❌ Your WhatsApp connection does not support copyNForward().\n' +
                'Please check your Baileys connection setup.'
            );
        }

        // SEND TO GROUPS
        let sent = 0;
        let failed = 0;

        for (const groupId of groupIds) {
            try {
                // Forward original message to preserve
                // media, caption, text and supported content.
                await conn.copyNForward(
                    groupId,
                    originalMessage,
                    true
                );

                sent++;

            } catch (error) {
                failed++;

                console.error(
                    `Forward failed: ${groupId}`,
                    error
                );
            }

            // Small delay between groups
            await new Promise(resolve =>
                setTimeout(resolve, 500)
            );
        }

        // RESULT
        await conn.sendMessage(
            from,
            {
                text:
                    `📤 *FORWARD COMPLETED*\n\n` +
                    `✅ Sent: ${sent}\n` +
                    `❌ Failed: ${failed}\n` +
                    `👥 Groups: ${groupIds.length}`
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error('Error in forward command:', error);

        await conn.sendMessage(
            from,
            {
                text: `❌ Error: ${error.message}`
            },
            { quoted: mek }
        );
    }
});
    
