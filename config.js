let { Scraper, Uploader } = require("akiraa-scrape");
const moment = require("moment-timezone");

/*--------[ OWNER SETTING ]------------*/
global.owner = ["6288989721627"];
global.mods = ["6288989721627"]; // Moderator
global.prems = ["6288989721627"]; // Premium
global.numberbot = "6288989721627";
global.nameowner = "manzxy";
global.pairing = "MANZKENZ"; // code pairing
global.nomorowner = "6288989721627";


/*--------[ BOT SETTING ]------------*/
global.namebot = "Almarhum Dontol";
global.gc = [""];
global.swa = "wa.me/6288989721627";
global.fastbit_apikey = "";
global.version = "3.2.4";
global.wm = "© manzxy";
global.isPairing = true;
global.packname = "Request By";
global.author = `Time : ${moment.tz("Asia/Jakarta")}`;

/*-------[ RESPONSE ]--------*/
global.res = {
    wait: '*[ Loading ] Plase Wait...*',
    done: '*Success Result*',
    eror: '*Error System*'
}

/*--------[ THUMBNAIL SETTING ]------------*/
global.thumb = "https://i.pinimg.com/originals/3d/32/b6/3d32b6ddc0aa71201fa76a6a2a8cd3c6.jpg";
//thumb adalah thumbail menu, dan lain lain
global.botpp = ""
//klo gabut aj
global.dontol = ""
//ubah ke ini aj
global.icon = "https://i.pinimg.com/originals/e5/7f/9a/e57f9a98c998175cd5734f1afe774faa.png";
//icon adalah pp kosong


/*--------[ FUNCITION SETTINGS ]------------*/
global.Uploader = require(process.cwd()+"/lib/uploader.js");
global.Func = new (require(process.cwd() + "/lib/func"))();
global.fetch = require("node-fetch");
global.axios = require("axios");
global.cheerio = require("cheerio");
global.Scraper = new Scraper();
global.gconly = true; //ini khusus group dan tidak bisa digunakn di private chat
global.formMe = false; //ini untuk mencegah pesan membalas diri sendiri
global.captcha = true; //ini register versi cacptha



/*--------[ QUOTED SETTINGS ]------------*/
global.fakestatus = (txt) => {
  return {
    key: {
      remoteJid: "0@s.whatsapp.net",
      participant: "0@s.whatsapp.net",
      id: "",
    },
    message: {
      conversation: txt,
    },
  };
};

global.fkontak = {
key: {
          participants: "0@s.whatsapp.net",
          remoteJid: "status@broadcast",
          fromMe: false,
          id: "Halo",
        },
        message: {
          contactMessage: {
            vcard: `BEGIN:VCARD
VERSION:3.0
N:Sy;Bot;;;
FN:y
item1.TEL;waid='0':'0'
item1.X-ABLabel:Ponsel
END:VCARD`,
          },
        },
        participant: "0@s.whatsapp.net",
      };
      
      
/*=====[ NewwestLater Settings]==========*/
global.textsaluran = "powered by manzxy 🧀";
global.saluran = "120363391202311948@newsletter";

global.capitalize = (str) => {
return str.charAt(0).toUpperCase() + str.slice(1);
}

let fs = require("fs");
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log("Update config.js");
  delete require.cache[file];
  require(file);
});
