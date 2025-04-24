let handler = async (m, { conn, text, usedPrefix, command }) => {
  conn.reply(
    m.chat,
    `╭─── *「 Kartu Intro 」*
│       
│ *Nama     :* 
│ *Gender   :* 
│ *Umur      :* 
│ *Hobby    :* 
│ *Kelas      :* 
│ *Asal         :* 
│ *Agama    :* 
│ *Status     :* 
╰──────────────`,
    fkontak,
  );
};
handler.help = ["intro"].map((a) => a + " *[introduction ys]*");
handler.tags = ["group"];
handler.command = ["intro"];

module.exports = handler;
