//Simple Base Botz
// • Credits : wa.me/6288989721627 [ manzxy ]
// • Feature : rpg/limit


let handler = async (m, {
    conn
}) => {
    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    else who = m.sender
    if (typeof db.data.users[who] == 'undefined') throw 'Pengguna tidak ada didalam data base'
    let user = global.db.data.users[who]
    let limit = user.premiumTime >= 1 ? 'Unlimited' : user.limit
    m.reply(`
❏ *Username:* ${user.registered ? user.name : conn.getName(who)}
▧ *Status:* ${who.split`@`[0] == global.nomorowner ? 'Developer' : user.premiumTime >= 1 ? 'Premium User' : user.level >= 1000 ? 'Elite User' : 'Free User'}
▧ *Limit:* ${limit} / 1000
`.trim())
}
handler.help = ['limit']
handler.tags = ['rpg']
handler.command = /^(limit)$/i
module.exports = handler