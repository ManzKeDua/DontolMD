//Simple Base Botz
// • Credits : wa.me/6285822146627 [ Nazir ]
// • Feature : downloader/noplay


const fetch = require('node-fetch');
const yts = require('yt-search');

const handler = async (m, {
    conn,
    args,
    text
}) => {
    if (!text) {
        return m.reply('Tolong masukkan judul lagu atau link YouTube!');
    }

    let url = text;
    if (!text.includes('youtube.com') && !text.includes('youtu.be')) {
        const search = await yts(text);
        if (!search.videos.length) {
            return m.reply('Video tidak ditemukan!');
        }
        url = search.videos[0].url;
    }

    await conn.sendMessage(m.chat, {
        react: {
            text: '',
            key: m.key
        }
    });

    const apiUrl = `https://ytdlpyton.nvlgroup.my.id/download/audio/?url=${encodeURIComponent(url)}&mode=url`;

    try {
        const res = await fetch(apiUrl);
        const json = await res.json();
        if (!json.download_url) {
            return m.reply('Link download tidak valid!');
        }

        const {
            title,
            thumbnail,
            download_url
        } = json;
        const judulBersih = title.replace(/[^a-zA-Z0-9 ]/g, '') + '.mp3';

        const doc = {
            audio: {
                url: download_url
            },
            mimetype: 'audio/mp3',
            fileName: judulBersih,
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: true,
                    mediaType: 2,
                    mediaUrl: url,
                    title: title,
                    body: global.wm,
                    sourceUrl: url,
                    thumbnail: await (await conn.getFile(thumbnail)).data,
                },
            },
        };

        await conn.sendMessage(m.chat, {
            react: {
                text: '',
                key: m.key
            }
        });
        await conn.sendMessage(m.chat, doc, {
            quoted: m
        });
    } catch (err) {
        console.error(err);
        m.reply('Terjadi kesalahan!');
    }
};

handler.help = ['noplay <query/url>'];
handler.tags = ['downloader'];
handler.command = /^(noplay)$/i;

module.exports = handler;