//Simple Base Botz
// • Credits : wa.me/6288989721627 [ manzxy ]
// • Feature : sticker/brat


const axios = require('axios');
const fs = require('fs');
const moment = require("moment-timezone");

const handler = async (m, {
    conn,
    text,
    usedPrefix
}) => {
    if (!text) return m.reply(`Gunakan perintah ini dengan format: ${usedPrefix}brat <teks>`);
    if (m.text.length >= 50) return m.reply(`[❗] *Teks terlalu panjang, maksimal 50 karakter*`);

    // Define the prohibited terms with spaces removed
    const prohibitedTerms = ['lonte', 'bokep', 'telanjang', 'pukimai', 'anjing', 'anj', 'kontol', 'memek', 'mmk', 'kntl', 'kntol', 'bajingan', 'asu', 'colmek', 'coli', 'puki']; // Add more terms if needed

    // Remove all spaces from the search query
    const queryWithoutSpaces = text.replace(/\s/g, '').toLowerCase();

    // Check if any prohibited term is present in the search query
    if (prohibitedTerms.some(term => queryWithoutSpaces.includes(term))) {
        return conn.reply(m.chat, '*❌ Permintaan Ditolak, Terdeteksi Ada Kalimat Kasar*', m);
    }

    try {
        const name = m.pushName || conn.getName(m.sender);
        const url = `https://brat.caliphdev.com/api/brat?text=${encodeURIComponent(text)}`;
        const response = await axios.get(url, {
            responseType: 'arraybuffer'
        });

        const tempFilePath = `./temp_${new Date().getTime()}.jpg`;
        fs.writeFileSync(tempFilePath, response.data);

        await conn.sendImageAsSticker(m.chat, tempFilePath, m, {
            packname: `Time : ${moment.tz("Asia/Jakarta")}\n`,
            author: `Created By ${name}`,
        });

        fs.unlinkSync(tempFilePath);
    } catch (error) {
        console.error(error);
        try {
            const url = `https://aqul-brat.hf.space/api/brat?text=${encodeURIComponent(text)}`;
            const response = await axios.get(url, {
                responseType: 'arraybuffer'
            });
            const tempFilePath = `./temp_${new Date().getTime()}.jpg`;
            fs.writeFileSync(tempFilePath, response.data);
            await conn.sendImageAsSticker(m.chat, tempFilePath, m, {
                packname: `Time : ${moment.tz("Asia/Jakarta")}\n`,
                author: `Created By ${m.pushName || conn.getName(m.sender)}`,
            });
            fs.unlinkSync(tempFilePath);
        } catch (error) {
            console.error(error);
            m.reply('Gagal membuat stiker');
        }
    }
};

handler.help = ['brat']
handler.tags = ['sticker'];
handler.command = /^brat$/i;
handler.limit = true;

module.exports = handler;