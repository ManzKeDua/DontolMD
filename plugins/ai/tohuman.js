//Simple Base Botz
// • Credits : wa.me/6288989721627 [ manzxy ]
// • Feature : ai/tohuman


const axios = require('axios');
const bingTranslate = require('bing-translate-api').translate;

// Definisi handler
let handler = async (m, {
    conn,
    text
}) => {
    if (!text) return m.reply('Mana Text Nya');

    m.reply('*Sebentar Ya...*');

    try {
        const aiHumanResult = await convertAiToHuman(text);

        const translationResult = await bingTranslate(aiHumanResult, null, 'id');

        const finalResult = `*${translationResult.translation}`;

        m.reply(finalResult);
    } catch (error) {
        console.error('Error:', error);
        m.reply(`Error: ${error.message}`);
    }
};

// Fungsi untuk mendapatkan nonce
async function getNonce() {
    try {
        const {
            data
        } = await axios.get("https://aitohuman.org/ai-to-human-text-converter-ai/");
        const nonce = data.split("ajax_nonce: '")[1]?.split("'")[0];
        if (!nonce) throw new Error('Failed to extract nonce');
        return nonce;
    } catch (error) {
        console.error('Error getting nonce:', error);
        throw new Error('Failed to get nonce from website');
    }
}

// Fungsi untuk mengkonversi text AI menjadi human
async function convertAiToHuman(discussiontopic) {
    const nonce = await getNonce();

    const params = {
        wpaicg_stream: 'yes',
        discussiontopic: encodeURIComponent(discussiontopic),
        engine: 'gpt-4o-mini',
        max_tokens: 2600,
        temperature: 0.8,
        top_p: 1,
        best_of: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: '',
        post_title: 'AI to Human Text Converter (Normal)',
        id: '1654',
        source_stream: 'form',
        nonce: nonce
    };

    const headers = {
        'authority': 'aitohuman.org',
        'accept': 'text/event-stream',
        'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'cache-control': 'no-cache',
        'pragma': 'no-cache',
        'referer': 'https://aitohuman.org/ai-to-human-text-converter-ai/',
        'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
        'sec-ch-ua-mobile': '?1',
        'sec-ch-ua-platform': '"Android"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36'
    };

    try {
        const response = await axios({
            method: 'get',
            url: 'https://aitohuman.org/index.php',
            params: params,
            headers: headers,
            responseType: 'stream'
        });

        return new Promise((resolve, reject) => {
            let fullResponse = '';

            response.data.on('data', (chunk) => {
                const chunkStr = chunk.toString();
                const lines = chunkStr.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.substring(6).trim();

                        if (data === '[DONE]') {
                            return;
                        }

                        try {
                            const parsed = JSON.parse(data);

                            if (parsed.choices && parsed.choices[0].delta?.content) {
                                fullResponse += parsed.choices[0].delta.content;
                            }
                        } catch (e) {}
                    }
                }
            });

            response.data.on('end', () => {
                resolve(fullResponse);
            });

            response.data.on('error', (err) => {
                reject(new Error(`Stream error: ${err.message}`));
            });
        });
    } catch (error) {
        throw new Error(`API request failed: ${error.message}`);
    }
}

// Definisi help dan tags
handler.help = ['tohuman'];
handler.tags = ['ai'];
handler.command = /^(tohumanai|tohuman|ai2human)$/i;

// Export handler
module.exports = handler;