//Simple Base Botz
// • Credits : wa.me/6288989721627 [ manzxy ]
// • Feature : owner/reactch


let manz = async (m, {
    text,
    conn,
    args
}) => {
    // Cek argumen
    if (!text || !args[0] || !args[1]) {
        return m.reply(`Contoh penggunaan:\n.reactch https://whatsapp.com/channel/0029VakRR89L7UVPwf53TB0v/4054 😂`)
    }

    // Cek link tautan
    if (!args[0].includes("https://whatsapp.com/channel/")) {
        return m.reply("Link tautan tidak valid")
    }

    // Ekstrak informasi dari link
    const result = args[0].split('/')[4]
    const serverId = args[0].split('/')[5]

    try {
        // Dapatkan metadata newsletter
        const res = await conn.newsletterMetadata("invite", result)

        // Kirim reaksi ke channel
        await conn.newsletterReactMessage(res.id, serverId, args[1])

        // Balas pesan sukses
        m.reply(`Berhasil mengirim reaction ${args[1]} ke dalam channel ${res.name}`)
    } catch (error) {
        // Tangani error
        m.reply(`Gagal mengirim reaction: ${error.message}`)
    }
}

// Informasi komando
manz.command = ['reactch']
manz.help = ['reactch']
manz.tags = ['owner']

// Ekspor komando
module.exports = manz