const axios = require("axios");
let handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
        let data = await axios
            .get("https://api.github.com/repos/ManzKeDua/DontolMD")
            .then((a) => a.data);
        let cap = "*– 乂 Informasi - Script Bot*\n";
        cap += `🧩 *Name:* ${data.name}\n`;
        cap += `👤 *Owner:* ${data.owner.login}\n`;
        cap += `> ⭐ *Star:* ${data.stargazers_count}\n`;
        cap += `*Forks:* ${data.forks}\n`;
        cap += `📅 *Crated At:* ${data.created_at}\n`;
        cap += `🔄 *Last Update:* ${data.updated_at}\n`;
        cap += `🔄 *Last Publish:* ${Func.ago(data.pushed_at}\n`;
        cap += `🔗 *Url Repository:* ${data.html_url}\n\n`;
        cap +=
            "🔧 *Feature Advantages*\n" +
            "*TypePlugins*\n" +
            "*Low Size*\n" +
            "*90% Ussing Scrape*\n" +
            "*No Encrypt*\n\n";
        cap += "Script ini gratis, boleh kalian recode asal jangan hapus credit original dari kami!";
        await m.reply(cap);
        };
handler.help = ["sc", "script"]
handler.tags = ["downloader"];
handler.command = ["sc", "script""];

module.exports = handler
