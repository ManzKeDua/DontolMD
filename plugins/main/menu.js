/*
 * DontolMD
 * by manxy
 */

const moment = require("moment-timezone");
const os = require("os");

const defaultMenu = {
  before: `
Hi 👑 %ucpn
 Selamat datang di Dashboard Bot !

*– U S E R*
┌ ◦ *Name:* %name
│ ◦ *Status:* %vips
└ ◦ *Limit:* %limit

*– W A K T U*
┌ ◦ *Hari:* %week %weton
│ ◦ *Tanggal:* %date
│ ◦ *Tanggal Islam:* %dateIslamic
└ ◦ *Waktu:* %wib WIB

*– I N F O - B O T*
┌ ◦ *Nama Bot:* DontolMd
│ ◦ *Platform:* %platform
│ ◦ *Mode:* %mode
│ ◦ *Running - on:* ${process.env.USER == "root" ? "Vps" : process.env.USER === "Container" ? "Panel" : "Hosting/local"}
│ ◦ *Node Version:* ${process.version}
│ ◦ *Wa-web Version:* ${conn.ws.config.version}
│ ◦ *Browsers:* ${conn.ws.config.browser[0]}
│ ◦ *Baileys:* Whiskeysockets
│ ◦ *Uptime:* %muptime
└ ◦ *Database:* %rtotalreg dari %totalreg
%readmore`.trimStart(),
  header: "– 乂 %category",
  body: "• %cmd %isGroup %isPrivate %isOwner %isVip %isLimit %isError",
  footer: "",
  after: "Lightweight wabot made by manzxy",
};

const omiHelp = async (m, {
  conn,
  usedPrefix: _p
}) => {
  try {
    let isPrefix = m.prefix ? "Multi" : "No";
    let tags = {
      "ai": "Artificial Intelligence",
      "main": "Perintah Umum",
      "info": "Informasi",
      "anime": "Anime & Manga",
      "downloader": "Downloader",
      "game": "Games",
      "group": "Group",
      "internet": "Internet",
      "fastbit": "Fastbit",
      "music": "Music",
      "fun": "Fun!",
      "maker": "Maker",
      "staff": "Staff",
      "owner": "Dev",
      "totalsaluran": "Totalsaluran",
      "sticker": "Sticker",
      "premium": "Premium",
      "quotes": "Quotes",
      "rpg": "Role Play Game",
      "tools": "Utility"
    };

    let tag = `@${m.sender.split("@")[0]}`;
    let wib = moment.tz("Asia/Jakarta").format("HH:mm:ss");

    // Info Menu
    let mode = global.opts["self"] ? "Private" : "Publik";
    let {
      limit
    } = global.db.data.users[m.sender];
    let name = await conn.getName(m.sender);
    let vip = global.db.data.users[m.sender].vipTime;
    let vips = `${vip > 0 ? "VIP" : "Free"}`;
    let platform = os.platform();

    // Time
    let ucpn = ucapan();
    let d = new Date(Date.now() + 3600000);
    let locale = "id";
    let weton = ["Pahing", "Pon", "Wage", "Kliwon", "Legi"][Math.floor(d / 84600000) % 5];
    let week = d.toLocaleDateString(locale, {
      weekday: "long"
    });
    let date = d.toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    let dateIslamic = Intl.DateTimeFormat(locale + "-TN-u-ca-islamic", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(d);

    // Uptime
    let _uptime = process.uptime() * 1000;
    let _muptime;
    if (process.send) {
      process.send("uptime");
      _muptime = await new Promise(resolve => {
        process.once("message", resolve);
        setTimeout(resolve, 1000);
      }) * 1000;
    }
    let muptime = clockString(_muptime);

    // Stats
    let totalreg = Object.keys(global.db.data.users).length;
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered).length;

    // Generate menu
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: "customPrefix" in plugin,
        limit: plugin.limit,
        vip: plugin.vip,
        enabled: !plugin.disabled
      };
    });

    // Build tags
    for (let plugin of help) {
      if (plugin && "tags" in plugin) {
        for (let tag of plugin.tags) {
          if (!(tag in tags) && tag) tags[tag] = tag;
        }
      }
    }

    // Menu template
    conn.menu = conn.menu || {};
    let before = conn.menu.before || defaultMenu.before;
    let header = conn.menu.header || defaultMenu.header;
    let body = conn.menu.body || defaultMenu.body;
    let footer = conn.menu.footer || defaultMenu.footer;
    let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? "" : `Powered by https://wa.me/${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after;

    // Build text
    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, "*" + (tags[tag]) + "*") + "\n" + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : "%_p" + help)
                .replace(/%isGroup/g, menu.group ? "Ⓖ" : "")
                .replace(/%isPrivate/g, menu.private ? "Ⓟ" : "")
                .replace(/%isOwner/g, menu.owner ? "Ⓞ" : "")
                .replace(/%isVip/g, menu.vip ? "🅟" : "")
                .replace(/%isLimit/g, menu.limit ? "Ⓛ" : "")
                .replace(/%isError/g, menu.error ? "❌" : "")
                .replace(/<([^>]*)>/g, "[$1]")
                .trim();
            }).join("\n");
          }),
          footer
        ].join("\n");
      }),
      after
    ].join("\n");

    let text = typeof conn.menu === "string" ? conn.menu : typeof conn.menu === "object" ? _text : "";
    let replacements = {
      "%": "%",
      p: _p,
      uptime: clockString(_uptime),
      muptime,
      me: global.wm,
      tag,
      ucpn,
      platform,
      wib,
      mode,
      _p,
      isPrefix,
      name,
      vips,
      limit,
      weton,
      week,
      date,
      dateIslamic,
      totalreg,
      rtotalreg,
      readmore: readMore
    };

    text = text.replace(new RegExp(`%(${Object.keys(replacements).sort((a, b) => b.length - a.length).join`|`})`, "g"), (_, name) => "" + replacements[name]);

    conn.sendMessage(m.chat, {
      text: text,
      contextInfo: {
        externalAdReply: {
          title: 'dontol-md v${require("../../package.json").version}',
          body: 'made by manzxy',
          thumbnailUrl: 'https://files.catbox.moe/ol1d3u.jpg',
          sourceUrl: 'https://chat.whatsapp.com/JHyfuisJfu38QB0CX0mKUx',
          mediaType: 1,
          renderLargerThumbnail: true,
        }
      }
    }, {
      quoted: {
        key: {
          participant: '0@s.whatsapp.net',
          remoteJid: '120363378386141988@g.us'
        },
        message: {
          conversation: m.name
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
};

omiHelp.help = ['help'];
omiHelp.tags = ['main'];
omiHelp.command = ['help', 'menu'];

module.exports = omiHelp;

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

function clockString(ms) {
  let h = isNaN(ms) ? "--" : Math.floor(ms / 3600000);
  let m = isNaN(ms) ? "--" : Math.floor(ms / 60000) % 60;
  let s = isNaN(ms) ? "--" : Math.floor(ms / 1000) % 60;
  return [h, " H ", m, " M ", s, " S "].map(v => v.toString().padStart(2, 0)).join("");
}

function ucapan() {
  let waktunya = moment.tz("Asia/Jakarta").format("HH");
  return waktunya >= 24 ? "Selamat Begadang 😗" :
    waktunya >= 18 ? "Selamat malam 🌙" :
    waktunya >= 15 ? "Selamat sore 🌅" :
    waktunya > 10 ? "Selamat siang ☀️" :
    waktunya >= 4 ? "Selamat pagi 🌄" :
    "Selamat Pagi 🫠";
}
