const fs = require("fs");
const archiver = require("archiver");
const path = require("path");

let handler = async (m, { conn }) => {
  conn.chatRead(m.chat);
  conn.sendMessage(m.chat, {
    react: {
      text: "🕒",
      key: m.key,
    },
  });
  let backupName = `backup_${new Date().toISOString().replace(/:/g, "-")}.zip`;
  let output = fs.createWriteStream(backupName);
  let archive = archiver("zip", { zlib: { level: 9 } });

  output.on("close", function () {
    let caption = `Berikut adalah file backup kode bot:\nNama file: ${backupName}\nUkuran file: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`;
    conn.sendFile(m.chat, backupName, backupName, caption, m);
  });

  archive.on("warning", function (err) {
    if (err.code === "ENOENT") {
      console.warn(err);
    } else {
      throw err;
    }
  });

  archive.on("error", function (err) {
    throw err;
  });

  archive.pipe(output);
  archive.glob("**/*", {
    cwd: path.resolve(__dirname, "../"),
    ignore: [
      "node_modules/**",
      "tmp/**",
      "**/viki-audio/**",
      "**.pm2/**",
      ".npm/**",
      backupName,
    ],
  });
  archive.finalize();
};

handler.help = ["backupme"].map((a) => a + " *[backup file sc]*");
handler.tags = ["owner"];
handler.command = /^backupme$/i;

handler.rowner = true;

module.exports = handler;
