//Simple Base Botz
// • Credits : wa.me/6288989721627 [ manzxy ]
// • Feature : ai/codegen




/* 
• Plugins Ai - Convert Code
• Source: https://whatsapp.com/channel/0029VakezCJDp2Q68C61RH2C
• Source Scrape: https://whatsapp.com/channel/0029VbB0oUvBlHpYbmFDsb3E
*/

const axios = require('axios');

const handler = async (m, {
    conn,
    text
}) => {
    if (!text) {
        return m.reply(
            `*Contoh penggunaan:*\n` +
            `.codegen Fungsi untuk menghitung luas segitiga|Python`
        );
    }

    let [prompt, language] = text.split("|").map(v => v.trim());

    if (!prompt || !language) {
        return m.reply(
            `*Format salah!*\nGunakan format seperti ini:\n` +
            `.codegen <prompt>|<bahasa>\n\n` +
            `Contoh:\n.codegen Cek bilangan prima|JavaScript`
        );
    }

    try {
        const payload = {
            customInstructions: prompt,
            outputLang: language
        };

        const {
            data
        } = await axios.post("https://www.codeconvert.ai/api/generate-code", payload);

        if (!data || typeof data !== "string") {
            return m.reply("Gagal mengambil hasil dari API.");
        }

        m.reply(
            `*Kode Hasil (${language}):*\n` +
            "```" + language.toLowerCase() + "\n" +
            data.trim() +
            "\n```"
        );

    } catch (error) {
        console.error(error);
        m.reply("Terjadi kesalahan saat memproses permintaan.");
    }
};

handler.command = handler.help = ['codegen'];
handler.tags = ['ai'];
handler.premium = false;
handler.limit = true;

module.exports = handler;