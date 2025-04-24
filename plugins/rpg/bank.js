//Simple Base Botz
// • Credits : wa.me/6288989721627 [ manzxy ]
// • Feature : rpg/bank




let handler = async (m, {
    conn
}) => {
    let user = global.db.data.users[m.sender]
    const caption = `┌  • *M Y - B A N K*
│  ◦ *Name:* ${user.registered ? user.name : conn.getName(m.sender)}
│  ◦ *Money:* ${user.money}
│  ◦ *Bank:* ${user.bank}
│  ◦ *Atm:* ${user.atm > 0 ? 'Level ' + user.atm : '✖'}
│  ◦ *Status:* ${user.premiumTime > 0 ? 'Premium' : 'Free'}
└────────────
`.trim()
    conn.sendMessage(m.chat, {
        text: caption,
        contextInfo: {
            externalAdReply: {
                title: `${global.namebot}`,
                body: "your bank",
                thumbnailUrl: "https://res.cloudinary.com/digtxl0uh/image/upload/v1688284420/tmp_llb2zb.jpg",
                sourceUrl: "",
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    })
}
handler.help = ['bank']
handler.tags = ['rpg']
handler.command = /^(bank)$/i
handler.register = true
module.exports = handler