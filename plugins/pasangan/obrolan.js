const axios = require('axios')
const fs = require('fs/promises')

const COUPLE_FILE = './json/pasangan.json'

class CoupleManager {
    constructor() {
        this.couples = this.loadCouples()
    }

    loadCouples() {
        try {
            return JSON.parse(fs.readFileSync(COUPLE_FILE, 'utf-8') || '[]')
        } catch (err) {
            return []
        }
    }

    saveCouples() {
        fs.writeFileSync(COUPLE_FILE, JSON.stringify(this.couples, null, 2), 'utf-8')
    }
}

const coupleManager = new CoupleManager()

const omiObrolanPas = async (m, { conn, text, usedPrefix, command }) => {
    conn.obrolan = conn.obrolan ? conn.obrolan : {}

    let pasangan = coupleManager.couples.find((p) => p.pemilik === thisUser[m.sender].nama)

    if (!pasangan) return conn.sendMessage(m.chat, { text: "Kamu belum memiliki pasangan." }) 
    if (!text) return conn.sendMessage(m.chat, { text: `Contoh: ${usedPrefix + command} on/off` }) 

    if (text == 'on') {
        conn.obrolan[m.sender] = {
            pesan: []
        }
        return conn.sendMessage(m.chat, { text: "Berhasil membuat sesi chat." }) 
    } else if (text == 'off') {
        delete conn.obrolan[m.sender]
        return conn.sendMessage(m.chat, { text: "Berhasil menghapus sesi chat." }) 
    }
}

omiObrolanPas.before = async (m, { conn }) => {
    conn.obrolan = conn.obrolan ? conn.obrolan : {}
    if (m.isBaileys && m.fromMe) return
    if (!m.text) return
    if (!conn.obrolan[m.sender]) return
    if (m.text.startsWith(".") || m.text.startsWith("#") || m.text.startsWith("!") || m.text.startsWith("/") || m.text.startsWith("\\/")) return

    if (conn.obrolan[m.sender] && m.text) {

        let d = new Date(new Date + 3600000)
        let week = d.toLocaleDateString('id-ID', {
            weekday: 'long',
            timeZone: 'Asia/Jakarta'
        })
        let date = d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            timeZone: 'Asia/Jakarta'
        })
        let options = {
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23',
            timeZone: 'Asia/Jakarta'
        }
        let time = d.toLocaleTimeString('id-ID', options).replace(/\./g, ':')

        let pasangan = coupleManager.couples.find((p) => p.pemilik === thisUser[m.sender].nama)

        try {
            const gemini = async (prompt = prompt) => {
                try {
                    const response = await axios({
                        method: 'post',
                        url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey.gemini,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: {
                            contents: [{
                                parts: [{
                                    text: `Bertindaklah seperti karakter bernama ${pasangan.pasangan}. Kamu adalah seseorang yang memiliki kelucuan, dan menggoda adalah sesuatu yang anda sukai. Sapa lah pasanganmu yang sedang mengajakmu berbicara menggunakan bahasa gaul yang biasanya digunakan orang Indonesia, orang tersebut bernama ${thisUser[m.sender].nama}. Statusmu dengan pasanganmu adalah ${pasangan.status} dan telah berhubungan sejak ${pasangan.tanggalJadian}. Pasanganmu berjenis kelamin ${thisUser[m.sender].gender}. Jika kamu seorang lelaki, berikan jawaban layaknya seorang jantan. Dan jika kamu seorang wanita, maka berikan jawaban dengan sifat tsundere. Jika pasanganmu mengeluarkan kata-kata kasar, tidak sopan dan tidak pantas, maka berikan jawaban singkat sambil marah-marah dengan sifatmu. Kalau status kalian Belum Menikah, maka berikan jawaban sambil malu-malu layaknya tsundere, dan jika status kalian Telah Menikah, berikan jawaban layaknya orang yang ceria dan terbuka layaknya seorang suami istri. Tunjukkan sikap acuh tak acuh atau kadang-kadang kasar terhadap orang lain, dan ubah sikapmu menjadi perhatian dan ramah tergantung suasananya. Jangan menawarkan bantuan apapun dan diam saja. Hari ini adalah hari ${week}, ${date} jam ${time} WIB.

${prompt}`
                                }]
                            }]
                        }
                    })
            
                    let hasil = response.data.candidates[0].content.parts[0].text
                    return hasil
                } catch (error) {
                    console.error('Error calling Gemini API:', error)
                    return 'Maaf, terjadi kesalahan saat memproses permintaan.'
                }
            }
        
            let result = await gemini(m.text)

            const point = (Math.ceil(Math.random() * 7)) * 1
            if (pasangan.komunikasiLevel > 10000) {
                pasangan.komunikasiLevel = 10000
            } else {
                conn.sendMessage(m.chat, {
                    text: result + `\n\n\`+${point} Level Komunikasi\``,
                    contextInfo: {
                        externalAdReply: {
                            showAdAttribution: true,
                            title: `Chat - ${pasangan.pasangan}`,
                            body: `${pasangan.image ? 'Ingat: Semua yang dikatakan oleh para karakter hanyalah rekaan belaka!' : "Kamu belum men-set foto pasangan kamu!"}`,
                            mediaType: 1,
                            sourceUrl: url.source,
                            thumbnailUrl: `${pasangan.image ? pasangan.image : 'https://telegra.ph/file/7eca79a1f58620714d55e.jpg'}`,
                            renderLargerThumbnail: false
                        }
                    }
                })
                pasangan.komunikasiLevel += point
                await coupleManager.saveCouples()
            }
        } catch (error) {
            console.log(error)
            return conn.sendMessage(m.chat, { text: msg.error }) 
        }
    }
}

omiObrolanPas.help = ['obrolan']
omiObrolanPas.tags = ['pasangan']
omiObrolanPas.command = ['obrolan']

module.exports = omiObrolanPas