//Simple Base Botz
// • Credits : wa.me/6285822146627 [ Nazir ]
// • Feature : info/unreg


handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    const user = db.data.users[m.sender];
    if (!text) m.reply(`*• Example :* ${usedPrefix + command} *[your ID]*`);
    const {
        key
    } = await conn.sendMessage(m.chat, {
        text: wait
    }, {
        quoted: m
    });
    try {
        if (!user.registered)
            return conn.sendMessage(
                m.chat, {
                    text: "*[ YOU NOT A. REGISTER ]*",
                    edit: key
                }, {
                    quoted: m
                },
            );
        if (text === user.sn) {
            user.sn = "Unreg";
            user.registered = false;
            await conn.sendMessage(
                m.chat, {
                    text: "*[ SUCCESS UNREGISTER ]*",
                    edit: key
                }, {
                    quoted: m
                },
            );
        } else
            return conn.sendMessage(
                m.chat, {
                    text: "*[ INVALID ID ]*",
                    edit: key
                }, {
                    quoted: m
                },
            );
    } catch (e) {}
};
handler.help = ["unreg", "unregister"].map((a) => a + " *[Your Id]*");
handler.tags = ["main"];
handler.command = ["unreg", "unregister"];

module.exports = handler;