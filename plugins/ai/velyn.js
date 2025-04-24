//Simple Base Botz
// • Credits : wa.me/6288989721627 [ manzxy ]
// • Feature : ai/velyn


const fetch = require('node-fetch');

let handler = async (m, {
    conn,
    text
}) => {
    if (!text) return m.reply("[ Example ] : .velyn hola");

    try {
        const url = `https://www.velyn.biz.id/api/ai/velyn-1.0-1b?prompt=${encodeURIComponent(text)}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const result = data.result || "Maaf, tidak ada jawaban.";

        return m.reply(result);
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
        return m.reply("Maaf, terjadi kesalahan saat menghubungi AI.");
    }
}

handler.command = ['velyn', 'lyn', 'vel'];
handler.tags = ["ai"];
handler.help = ['velyn', 'lyn', 'vel'].map(cmd => `${cmd} *[text]*`);

module.exports = handler;