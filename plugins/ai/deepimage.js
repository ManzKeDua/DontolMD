//Simple Base Botz
// • Credits : wa.me/6288989721627 [ manzxy ]
// • Feature : ai/deepimage


const axios = require('axios')

const omiDeepImg = async (m, {
    conn,
    text
}) => {
    if (!text) return conn.sendMessage(m.chat, {
        text: 'Contoh: /deepimg burger'
    })

    let imageUrl = await generateImage(text)
    if (!imageUrl) return conn.sendMessage(m.chat, {
        text: 'Gagal memuat gambar, coba prompt lain.'
    })

    await conn.sendMessage(m.chat, {
        image: {
            url: imageUrl
        },
        caption: `Gambar berhasil dibuat.\nPrompt: ${text}`
    })
}

omiDeepImg.help = ['deepimg']
omiDeepImg.tags = ['ai']
omiDeepImg.command = ['deepimg']

module.exports = omiDeepImg

async function generateImage(prompt) {
    try {
        let {
            data
        } = await axios.post("https://api-preview.chatgot.io/api/v1/deepimg/flux-1-dev", {
            prompt,
            size: "1024x1024",
            device_id: `dev-${Math.floor(Math.random() * 1000000)}`
        }, {
            headers: {
                "Content-Type": "application/json",
                Origin: "https://deepimg.ai",
                Referer: "https://deepimg.ai/"
            }
        })
        return data?.data?.images?.[0]?.url || null
    } catch (err) {
        console.error(err.response ? err.response.data : err.message)
        return null
    }
}