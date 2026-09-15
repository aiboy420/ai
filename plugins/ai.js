// ai.js - NAWAZ MD AI Chat
// AI ON/OFF + .ai command

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ==================================================
// ⚠️ یہاں اپنی نئی OpenAI API Key لگائیں
// ==================================================

const OPENAI_API_KEY = 'k4A';

const AI_MODEL = 'gpt-5.6-luna';

// ==================================================
// AI FUNCTION
// ==================================================

let aiEnabled = false;

async function askAI(question) {
if (!OPENAI_API_KEY) {
throw new Error('OPENAI_API_KEY is not configured');
}

const response = await axios.post(  
    'https://api.openai.com/v1/responses',  
    {  
        model: AI_MODEL,  
        input: [  
            {  
                role: 'system',  
                content:  
                    'You are NAWAZ MD AI Assistant. Give helpful, friendly and concise answers. Reply in the same language as the user when possible.'  
            },  
            {  
                role: 'user',  
                content: question  
            }  
        ]  
    },  
    {  
        timeout: 60000,  
        headers: {  
            Authorization: `Bearer ${OPENAI_API_KEY}`,  
            'Content-Type': 'application/json'  
        }  
    }  
);  

if (response.data?.output_text) {  
    return response.data.output_text;  
}  

const output = response.data?.output || [];  

for (const item of output) {  
    if (item.type === 'message' && Array.isArray(item.content)) {  
        for (const content of item.content) {  
            if (  
                content.type === 'output_text' &&  
                content.text  
            ) {  
                return content.text;  
            }  
        }  
    }  
}  

throw new Error('No AI response received');

}

// ==================================================
// AI COMMAND
// ==================================================

cmd(
{
pattern: 'ai',
alias: ['ask', 'chatgpt'],
react: '🤖',
desc: 'AI Chat',
category: 'ai',
filename: __filename
},

async (conn, mek, m, {  
    from,  
    q,  
    reply,  
    prefix,  
    command  
}) => {  

    try {  

        const text = q?.trim();  


        // ==============================  
        // AI ON  
        // ==============================  

        if (text?.toLowerCase() === 'on') {  

            aiEnabled = true;  

            return reply(  
                '🤖 *AI CHAT ACTIVATED*\n\n' +  
                'AI Chat is now ON.\n' +  
                `Use ${prefix + command} hello to chat with AI.`  
            );  
        }  


        // ==============================  
        // AI OFF  
        // ==============================  

        if (text?.toLowerCase() === 'off') {  

            aiEnabled = false;  

            return reply(  
                '🤖 *AI CHAT DEACTIVATED*\n\n' +  
                'AI Chat is now OFF.'  
            );  
        }  


        // ==============================  
        // AI STATUS  
        // ==============================  

        if (text?.toLowerCase() === 'status') {  

            return reply(  
                '🤖 *AI CHAT STATUS*\n\n' +  
                `Status: ${aiEnabled ? 'ON 🟢' : 'OFF 🔴'}`  
            );  
        }  


        // ==============================  
        // NO QUESTION  
        // ==============================  

        if (!text) {  

            return reply(  
                '🤖 *AI CHAT*\n\n' +  
                'Use:\n' +  
                `${prefix + command} on\n` +  
                `${prefix + command} off\n` +  
                `${prefix + command} status\n\n` +  
                'Example:\n' +  
                `${prefix + command} hello`  
            );  
        }  


        // ==============================  
        // AI OFF  
        // ==============================  

        if (!aiEnabled) {  

            return reply(  
                '❌ AI Chat is currently OFF.\n\n' +  
                `Use ${prefix + command} on to activate AI Chat.`  
            );  
        }  


        // ==============================  
        // PROCESSING  
        // ==============================  

        await conn.sendMessage(from, {  
            react: {  
                text: '⏳',  
                key: mek.key  
            }  
        });  


        // ==============================  
        // ASK AI  
        // ==============================  

        const answer = await askAI(text);  


        // ==============================  
        // AI RESPONSE  
        // ==============================  

        await reply(  
            `🤖 *NAWAZ MD AI*\n\n${answer}`  
        );  


        // ==============================  
        // SUCCESS  
        // ==============================  

        await conn.sendMessage(from, {  
            react: {  
                text: '✅',  
                key: mek.key  
            }  
        });  


    } catch (error) {  

        console.error(  
            '[NAWAZ AI ERROR]:',  
            error.response?.data || error.message  
        );  


        await conn.sendMessage(from, {  
            react: {  
                text: '❌',  
                key: mek.key  
            }  
        });  


        if (  
            error.message ===  
            'OPENAI_API_KEY is not configured'  
        ) {  

            return reply(  
                '❌ OpenAI API key is not configured.\n\n' +  
                'Please add your API Key in the marked place in ai.js.'  
            );  
        }  


        return reply(  
            '⚠️ AI service is temporarily unavailable. Please try again later.'  
        );  
    }  
}

);
