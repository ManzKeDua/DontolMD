//Simple Base Botz
// • Credits : wa.me/6288989721627 [ manzxy ]
// • Feature : ai/aiimage


/*
Name : Ai Image [ Flux & Photorealistic3 ]
Type : Plugins Esm 
Sumber : https://whatsapp.com/channel/0029Vb4yGiCISTkSLyvoeT23
*/

const fetch = require('node-fetch')

const handler = async (m, {
    conn,
    text
}) => {
    if (!text) {
        return conn.reply(m.chat, 'Silakan masukkan model (1/2) dan prompt untuk menghasilkan gambar.\nContoh: .aiimage 1 Momoi anime', m);
    }

    const args = text.split(' ');
    const model = args.shift();
    const prompt = args.join(' ');

    if (!['1', '2'].includes(model)) {
        return conn.reply(m.chat, 'Model tidak valid! Gunakan 1 atau 2.', m);
    }

    if (!prompt) {
        return conn.reply(m.chat, 'Silakan masukkan prompt setelah model.', m);
    }

    const api = `https://api.crafters.biz.id/ai-img/flux?prompt=${encodeURIComponent(prompt)}&model=${model}`;

    try {
        await conn.sendMessage(m.chat, {
            react: {
                text: '⏳',
                key: m.key
            }
        });
        const response = await fetch(api);
        if (!response.ok) throw new Error('Gagal mengambil gambar dari API');

        const json = await response.json();
        if (!json.status || !json.result || json.result.length === 0) {
            throw new Error('Gambar tidak ditemukan dalam respons API');
        }

        for (const imageUrl of json.result) {
            await conn.sendMessage(m.chat, {
                image: {
                    url: imageUrl
                },
                caption: `Hasil untuk: ${prompt} (Model ${model})`
            }, {
                quoted: m
            });
        }
        await conn.sendMessage(m.chat, {
            react: {
                text: '✅',
                key: m.key
            }
        });
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, 'Terjadi kesalahan saat mengambil gambar.', m);
        await conn.sendMessage(m.chat, {
            react: {
                text: '❌',
                key: m.key
            }
        });
    }
};

handler.help = ['aiimage <model> <prompt>'];
handler.tags = ['ai'];
handler.command = /^(aiimage)$/i;

module.exports = handler;