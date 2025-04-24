//Simple Base Botz
// • Credits : wa.me/6288989721627 [ manzxy ]
// • Feature : sticker/bratv


const axios = require("axios");
const {
    execSync
} = require("child_process");
const fs = require("fs");
const path = require("path");

const omiBratVideo = async (m, {
    conn,
    text
}) => {
    if (!text) return conn.sendMessage(m.chat, {
        text: "Contoh: /bratvideo hai"
    });

    // Define the prohibited terms with spaces removed
    const prohibitedTerms = [
        "lonte",
        "bokep",
        "telanjang",
        "pukimai",
        "anjing",
        "anj",
        "kontol",
        "memek",
        "mmk",
        "kntl",
        "kntol",
        "bajingan",
        "asu",
        "colmek",
        "coli",
        "puki",
    ];

    // Remove all spaces from the search query
    const queryWithoutSpaces = text.replace(/\s/g, "").toLowerCase();

    // Check if any prohibited term is present in the search query
    if (prohibitedTerms.some((term) => queryWithoutSpaces.includes(term))) {
        return conn.reply(m.chat, "* Permintaan Ditolak, Terdeteksi Ada Kalimat Kasar*", m);
    }

    try {
        const words = text.split(" ");
        const tempDir = path.join(process.cwd(), "tmp");
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
        const framePaths = [];

        for (let i = 0; i < words.length; i++) {
            const currentText = words.slice(0, i + 1).join(" ");

            const res = await axios.get(
                `https://brat.caliphdev.com/api/brat?text=${encodeURIComponent(
          currentText
        )}`, {
                    responseType: "arraybuffer"
                }
            );

            const framePath = path.join(tempDir, `frame${i}.mp4`);
            fs.writeFileSync(framePath, res.data);
            framePaths.push(framePath);
        }

        const fileListPath = path.join(tempDir, "filelist.txt");
        let fileListContent = "";

        for (let i = 0; i < framePaths.length; i++) {
            fileListContent += `file '${framePaths[i]}'\n`;
            fileListContent += `duration 0.5\n`;
        }

        fileListContent += `file '${framePaths[framePaths.length - 1]}'\n`;
        fileListContent += `duration 3\n`;

        fs.writeFileSync(fileListPath, fileListContent);

        const outputVideoPath = path.join(tempDir, "output.mp4");
        execSync(
            `ffmpeg -y -f concat -safe 0 -i ${fileListPath} -vf "fps=30" -c:v libx264 -preset veryfast -pix_fmt yuv420p -t 00:00:10 ${outputVideoPath}`
        );

        await conn.sendVideoAsSticker(m.chat, outputVideoPath, m, {
            packname: packname,
            author: "\n" + m.pushName,
        });

        framePaths.forEach((filePath) => fs.unlinkSync(filePath));
        fs.unlinkSync(fileListPath);
        fs.unlinkSync(outputVideoPath);
    } catch (error) {
        console.error(error);
        return conn.sendMessage(m.chat, {
            text: "Maaf, terjadi kesalahan"
        });
    }
};

omiBratVideo.help = ["bratvideo"];
omiBratVideo.tags = ["sticker"];
omiBratVideo.command = ["bratvid", "bratvideo"];

module.exports = omiBratVideo;