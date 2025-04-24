const axios = require('axios')

module.exports = {
    help: ['fastbitgetcountries'],
    command: ['fastbitgetcountries'],
    tags: 'fastbit',
    code: async (m) => {
        try {
            const {
                data
            } = await axios.get(`https://fastbit.tech/api/countries?apikey=${global.fastbit_apikey}`)

            const result = data.data.map(v => `• ${v.name} ( ${v.iso}, id: ${v.prefix})`).join('\n')
            m.reply(`*Daftar Negara:* \n${result}`)
        } catch (e) {
            m.reply('Gagal mengambil daftar negara.' + e.message)
        }
    }
}