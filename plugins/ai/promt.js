//Simple Base Botz
// • Credits : wa.me/6285822146627 [ Nazir ]
// • Feature : ai/promt


const axios = require('axios');

const handler = async (m, {
    text,
    usedPrefix,
    command
}) => {
    if (!text) throw `Contoh penggunaan:\n${usedPrefix + command} tuliskan promptmu di sini`;

    try {
        const res = await createPrompt(text);
        if (!res || typeof res !== 'string') throw 'Gagal';
        m.reply(res);
    } catch (e) {
        console.error(e);
        throw 'Terjadi kesalahan saat memproses prompt.';
    }
};

handler.help = ['createprompt <teks>'];
handler.tags = ['ai'];
handler.command = /^createprompt|buatprompt$/i;

module.exports = handler;

async function createPrompt(prompt) {
    const payload = {
        content: prompt,
        op: 'op-prompt',
    };

    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Content-Type': 'application/json',
        Origin: 'https://junia.ai',
        Referer: 'https://junia.ai/',
        Connection: 'keep-alive',
        'Sec-Fetch-Site': 'same-site',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Ch-Ua': '"Chromium";v="123", "Not:A-Brand";v="8"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
    };

    try {
        const response = await axios.post(
            'https://api-v1.junia.ai/api/free-tools/generate',
            payload, {
                headers
            }
        );

        if (response?.data?.result) {
            return response.data.result;
        } else if (typeof response.data === 'string') {
            return response.data;
        } else {
            throw new Error('Respons dari API tidak sesuai format.');
        }
    } catch (e) {
        console.error(e);
        throw new Error('Gagal mengirim permintaan ke API.');
    }
}