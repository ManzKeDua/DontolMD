const ffmpeg = require('fluent-ffmpeg');
const fs = require("fs").promises;
let FormData = require("form-data");
let Jimp = require("jimp");
let fetch = require("node-fetch")
async function Upscale(imageBuffer) {
    try {
        const response = await fetch("https://lexica.qewertyy.dev/upscale", {
            body: JSON.stringify({
                image_data: Buffer.from(imageBuffer, "base64"),
                format: "binary",
            }),
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
        });
        return Buffer.from(await response.arrayBuffer());
    } catch {
        return null;
    }
};

async function enhanceVideo(buffer) {
    const output = `${process.cwd()}/output.mp4`;
    const input = `${process.cwd()}/input.mp4`;
    await fs.writeFile(input, buffer);
    return new Promise((resolve, reject) => {
        ffmpeg(input)
            .outputOptions([
                '-vf', 'hqdn3d,minterpolate=fps=60',
                '-preset', 'medium',
                '-crf', '18',
                '-c:v', 'libx264',
                '-c:a', 'aac',
                '-b:a', '128k',
                '-movflags', 'faststart'
            ])
            .on('progress', (progress) => {
                console.log(`Processing: ${progress.percent}% done`);
            })
            .on('end', async () => {
                console.log('Video enhancement completed successfully.');
                try {
                    const data = await fs.readFile(output);
                    await fs.unlink(input);
                    await fs.unlink(output);
                    resolve(data);
                } catch (err) {
                    console.error('Error during file operations:', err);
                    reject(err);
                }
            })
            .on('error', (err) => {
                console.error('Error during video enhancement:', err);
                reject(err);
            })
            .save(output);
    });
}

let handler = async (m, {
    conn,
    usedPrefix,
    command
}) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || "";
    if (!mime) {
        throw `*• Example:* ${usedPrefix + command} *[reply/send media]*`;
    }
    m.reply(wait);
    let buffer = await q.download();
    if (/video/.test(mime)) {
        let data = await enhanceVideo(buffer);
        await conn.sendFile(m.chat, data, "Remini.mp4", `*乂 ${command.split("").join(" ").toUpperCase()} - V I D E O*
        
   ◦ Size : ${await Func.formatSize(data.length)}`, m);
    } else {        
        let target = m.quoted ? m.quoted : m;
        let buffer = await target.download();
        let enhancedImage = await Upscale(buffer);
        let size = Func.formatSize(enhancedImage.length);
        await conn.sendFile(m.chat, enhancedImage, "Remini.jpg", `*乂 ${command.split("").join(" ").toUpperCase()} - I M A G E*
        
   ◦ Size : ${size}`, m);
    }
    await q.delete();
};

handler.help = [
    "unblur",
    "enchaner",
    "enhance",
    "hdr",
    "colorize",
    "hd",
    "remini",
    "hdvid",
    "videoenchance",
    "videohd",
    "unblur",
].map((a) => a + " *[reply/send media]*");
handler.tags = ["tools"];
handler.premium = false;
handler.command = [
    "unblur",
    "enchaner",
    "enhance",
    "hdr",
    "colorize",
    "hd",
    "remini",
    "hdvid",
    "videoenchance",
    "videohd",
    "unblur",
];

module.exports = handler;