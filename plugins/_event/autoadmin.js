//Simple Base Botz
// • Credits : wa.me/6288989721627 [ manzxy ]
// • Feature : _event/autoadmin




const handler = async (m, {
    conn,
    isAdmin
}) => {
    if (m.fromMe) return;
    if (isAdmin) throw '*You Are Aldready An Admin✅*';
    try {
        await conn.groupParticipantsUpdate(m.chat, [m.sender], 'promote');
    } catch {
        await m.reply('*Error, It Was Not Possible To  Make You Admin❌*');
    }
};
handler.command = /^autoadmin$/i;
handler.owner = true;
handler.group = true;
handler.botAdmin = true;
module.exports = handler