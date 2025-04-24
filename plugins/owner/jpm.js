//Simple Base Botz
// • Credits : wa.me/6288989721627 [ manzxy ]
// • Feature : owner/jpm


const axios = require('axios')

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

let handler = async (m, {
    conn,
    text
}) => {
    try {
        if (!text) throw 'Masukkan teks yang ingin dikirim ke semua grup!\n\nContoh:\n.jpm hallo semua'

        const groups = await conn.groupFetchAllParticipating()
        const groupIds = Object.keys(groups)
        if (!groupIds.length) throw 'Bot tidak tergabung di grup manapun.'

        m.reply('⏳ Proses broadcast ke semua grup dimulai...')

        const thumbUrl = 'https://files.catbox.moe/a641qt.jpg'
        const {
            data: thumbBuffer
        } = await axios.get(thumbUrl, {
            responseType: 'arraybuffer'
        })

        global.ftextt = {
            key: {
                fromMe: false,
                participant: '0@s.whatsapp.net',
                ...(m.chat ? {
                    remoteJid: '6282127487538-1625305606@g.us'
                } : {})
            },
            message: {
                extendedTextMessage: {
                    text: "manzxy",
                    title: "manzxy",
                    jpegThumbnail: thumbBuffer
                }
            }
        }

        let sukses = 0,
            gagal = 0

        for (let id of groupIds) {
            try {
                await conn.sendMessage(id, {
                    text
                }, {
                    quoted: ftextt
                })
                sukses++
            } catch (err) {
                gagal++
            }
            await delay(1500)
        }

        m.reply(`✅ Broadcast selesai.\nSukses: ${sukses}\nGagal: ${gagal}`)
    } catch (e) {
        m.reply(`❌ Error\nLogs error : ${e}`)
    }
}

handler.command = /^jpm$/i
handler.help = ['jpm <teks>']
handler.tags = ['owner']
handler.owner = true

module.exports = handler