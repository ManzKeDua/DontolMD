//Simple Base Botz
// • Credits : wa.me/6288989721627 [ manzxy ]
// • Feature : _event/autokik


const before = async (m, {
    conn,
    isAdmin,
    isBotAdmin
}) => {
    if (m.isGroup && !m.fromMe) {
        const bocahDongo = '6281916941751';
        const pirtekkokgkBerasa = m.sender.split('@')[0];

        if (pirtekkokgkBerasa === bocahDongo) {
            const chat = global.db.data.chats[m.chat];

            if (!isAdmin && isBotAdmin) {
                await conn.reply(
                    m.chat,
                    `*A N T I   U S E R 𖤶*\n\n> Grup Ini Melarang bocah peler kek kontol gatawuk diri 😂\n\n𖤇 Anda akan di *kick.*`,
                    m
                );

                await new Promise((resolve) => setTimeout(resolve, 1000));
                await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
            }
        }
    }
};

module.exports = {
    before
};