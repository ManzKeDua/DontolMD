const axios = require('axios')

module.exports = {
    help: ['fastbitcreateorder'],
    tags: ['fastbit'],
    command: ['fastbitcreateorder'], // perbaikan typo: 'fasfastbitcreateorder' -> 'fastbitcreateorder'
    code: async (m, {
        text
    }) => {
        const [otpServiceId, quantity] = text.split(' ') // perbaikan: m.text -> text
        if (!otpServiceId || !quantity) return m.reply('Harap masukkan ID layanan OTP dan jumlah order.')

        try {
            const {
                data
            } = await axios.get(`https://fastbit.tech/api/virtual-number/generate-order?apikey=${global.fastbit_apikey}&otp_service_id=${otpServiceId}&quantity=${quantity}`)

            const result = `Order ID: ${data.data.order_ids.join(', ')}\nTotal Orders: ${data.data.total_orders}\nEstimated Time: ${data.data.estimated_process_time}`
            m.reply(`*Order Virtual Number Dibuat:*\n${result}`)
        } catch (e) {
            console.error(e) // tambahan untuk logging error
            m.reply('Gagal membuat order virtual number.' + e.message)
        }
    }
}