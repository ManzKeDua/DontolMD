const axios = require('axios')

module.exports = {
    help: ['fastbitgetservice'],
    tags: ['fastbit'],
    command: ['fastbitgetservice'],
    code: async (m) => {
        try {
            const {
                data
            } = await axios.get(`https://fastbit.tech/api/services?apikey=${global.fastbit_apikey}`)

            const result = data.data.map(v => `• ${v.text}: ${v.id}`).join('\n')
            m.reply(`*Daftar Layanan OTP:* \n${result}`)
        } catch (e) {
            m.reply(`Gagal mengambil daftar layanan.\n${e.message}`)
        }
    }
}