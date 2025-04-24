const axios = require('axios')

module.exports = {
    help: ['fastbitfinishorder'],
    tags: ['fastbit'],
    command: ['fastbitfinishorder'],
    code: async (m, {
        text
    }) => {
        const orderUuid = text
        if (!orderUuid) return m.reply('Harap masukkan UUID order.')

        try {
            const {
                data
            } = await axios.get(`https://fastbit.tech/api/virtual-number/orders/${orderUuid}/finish?apikey=${global.fastbit_apikey}`)

            const result = `Order UUID: ${data.data.order_uuid}\nStatus: Completed`
            m.reply(`*Order ${orderUuid} Selesai:*\n${result}`)
        } catch (e) {
            m.reply(`Gagal menyelesaikan order. Error: ${e.message}`)
        }
    }
}