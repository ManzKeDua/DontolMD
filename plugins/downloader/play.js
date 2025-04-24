//Simple Base Botz
// • Credits : wa.me/6285822146627 [ Nazir ]
// • Feature : downloader/play


const fetch = require('node-fetch');

let manz = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    if (!text) return m.reply(`Masukkan judul lagu!\nContoh: ${usedPrefix + command} mendua`);

    await m.reply("✨ Tunggu Sebentar, Sedang Mencari Lagu...");

    try {
        const searchUrl = `https://api.im-rerezz.xyz/api/search/youtube?query=${encodeURIComponent(text)}`;
        const response = await fetch(searchUrl);
        const data = await response.json();

        if (!data.status || !data.result.length) {
            return m.reply(`Lagu tidak ditemukan.`);
        }

        const result = data.result[0];
        const {
            title,
            url
        } = result;

        const downloadUrl = `https://api.im-rerezz.xyz/api/dl/ytmp3v2?url=${encodeURIComponent(url)}`;
        const downloadResponse = await fetch(downloadUrl);
        const downloadData = await downloadResponse.json();

        if (!downloadData.status || !downloadData.data.download) {
            return m.reply(`Gagal mengunduh lagu. Coba lagi nanti.`);
        }

        const audioUrl = downloadData.data.download;

        await conn.sendMessage(m.chat, {
            audio: {
                url: audioUrl
            },
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`
        }, {
            quoted: m
        });
    } catch (error) {
        console.error('Error in play command:', error);
        return m.reply(`❌ Terjadi kesalahan saat memproses permintaan.`);
    }
};

manz.command = manz.help = ['play'];
manz.tags = ['downloader'];
module.exports = manz;