//Simple Base Botz
// • Credits : wa.me/6288989721627 [ manzxy ]
// • Feature : info/rules


const fetch = require('node-fetch');
const fs = require('fs');

let handler = async (m, {
    conn
}) => {
    let text = ` _*RULES DONTOLMD*_

❃ 1. Dilarang Melakukan Spam Kepada Bot, Jika Ketahuan Akan Di Banned

❃ 2. Jika Bot Tidak Menjawab 1x, Silahkan Di Coba Lagi, Tapi Jika Bot Tidak Menjawab 2x Itu Artinya Delay, Jangan Di Pakai Dulu

❃ 3. Jangan Spam Bot, Kalau Belum Donasi, Sadar Diri Aja Makenya :)

❃ 4. Jika Limit Habis Silahkan Bermain Game, Untuk Mendapatkan Exp
Contoh Game:
Tebak Tebakan
Rpg Game
Dll

❃ 5. Dilarang Mengirim Virtex/Bug Ke Bot, Walau Gaada Efek :v

❃ 6. Dilarang Keras Menelpon Bot, Jika Menelpon Akan Otomatis Di Block

❃ 7. Jika Tidak Mengerti Cara Menggunakan Bot, Silahkan Bertanya Pada Member Lain, Atau Jika Tidak Join Group Bot Silahkan Ketik #gcbot Dan Masuk Group Bot

❃ 8. Jika Ada Fitur Error/Tidak Mengerti Cara Menggunakannya Silahkan Laporkan/Tanyakan Kepada Owner

❃ 9. Jika Bot Delay Jangan Di Spam Terlebih Dahulu

❃ 10. Untuk User *Premium* Dilarang Keras Asal Bug Orang`;

    await conn.relayMessage(m.chat, {
        reactionMessage: {
            key: m.key,
            text: '✅'
        }
    }, {
        messageId: m.key.id
    });
    conn.sendMessage(m.chat, {
        text: text,
        contextInfo: {
            externalAdReply: {
                title: "DontolMD",
                body: "",
                thumbnailUrl: 'https://telegra.ph/file/2778fbd7bc79731808f5d.png',
                sourceUrl: "",
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    });
};

handler.help = ['rules'];
handler.tags = ['main'];
handler.command = /^(rules)$/i;

module.exports = handler;