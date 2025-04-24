 const cheerio = require("cheerio");
const {
    fetch
} = require("undici");
const {
    lookup
} = require("mime-types");

module.exports = {
    help: ["mediafire", "mf", "mfdl", "mediafiredl"],
    tags: ["downloader", "internet", "tools"],
    command: ["mediafire", "mf", "mfdl", "mediafiredl"],
    code: async (m, {
        conn,
        usedPrefix,
        command,
        text,
        isOwner,
        isAdmin,
        isBotAdmin,
        isPrems,
        chatUpdate
    }) => {
        if (!text) throw `*Example:* ${usedPrefix + command} [url]`
        let data = await mediafire(text);
        let buffer = await fetch(data.download).then(async (a) =>
            Buffer.from(await a.arrayBuffer()), );
        let mfsize = await Func.getSize(data.download);
        let cap = "*– 乂 MediaFire - Downloader*\n";
        cap += `*📑Filename :* ${data.filename}\n`;
        cap += `*🌿Tipe File :* ${data.mimetype}\n`;
        cap += `*🍟Size :* ${mfsize}`;

        await conn.sendMessage(m.chat, {
            document: buffer,
            mimetype: data.mimetype,
            fileName: data.filename,
            caption: cap,
        }, {
            quoted: m
        });

    }
}
async function mediafire(url) {
    return new Promise(async (resolve, reject) => {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);

        const type = $(".dl-btn-cont").find(".icon").attr("class").split("archive")[1].trim();
        const filename = $(".dl-btn-label").attr("title");
        const size = $('.download_link .input').text().trim().match(/\((.*?)\)/)[1];
        const ext = filename.split(".").pop();
        const mimetype =
            lookup(ext.toLowerCase()) || "application/" + ext.toLowerCase();
        const download = $(".input").attr("href");
        resolve({
            filename,
            type,
            size,
            ext,
            mimetype,
            download,
        });
    }).catch((e) =>
        reject({
            msg: "Gagal mengambil data dari link tersebut",
        }),
    );
}