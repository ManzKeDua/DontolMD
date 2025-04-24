const {
    createHash
} = require('crypto');

let handler = async (m, {
    conn,
    text,
    usedPrefix
}) {
    let sn = db.data.users[m.sender].sn
    let caption = `🗃️ *Silahkan salin kode dibawah:* \n${sn}`;
    m.reply(caption, false, false, {
        smlcap: true,
        except: [sn]
    });
};

handler.help = ["ceksn"];
handler.tags = ["main"];
handler.command = /^(ceksn|sn|serialnumber|cekid)$/i;
handler.register = true;
module.exports = handler;