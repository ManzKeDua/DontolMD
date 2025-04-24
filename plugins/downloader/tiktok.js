let handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    if (!text) m.reply(`*• Example :* ${usedPrefix + command} *[Tiktok Url]*`);
    try {
        let fetch = await Scraper["Download"].tiktok.v1(text);
        let {
            data
        } = fetch;
        let lastMessage;
        if (data.images) {
            let cap = `┌─⭓「 *Tiktok Downloader* 」\n│ *• ID :* *[ ${data.id} ]*\n│ *• Views :* ${Func.formatNumber(data.play_count)}\n│ *• Likes :* ${Func.formatNumber(data.digg_count)}\n│ *• Comment :* ${Func.formatNumber(data.comment_count)}\n│ *• Author :* ${data.author.nickname}\n└───────────────⭓\n*• Title :* ${data.title}`
            m.reply(cap);
            for (let i = 0; i < data.images.length; i++) {
                lastMessage = await conn.sendMessage(
                    m.chat, {
                        image: {
                            url: data.images[i],
                        },
                        caption: null,
                    }, {
                        quoted: m,
                    },
                );

                if (i === data.images.length - 1) {
                    await conn.sendMessage(
                        m.chat, {
                            audio: {
                                url: data.music,
                            },
                            mimetype: "audio/mpeg",
                            contextInfo: {
                                externalAdReply: {
                                    title: data.music_info.title,
                                    body: '',
                                    thumbnailUrl: data.author.avatar,
                                    sourceUrl: `https://www.tiktok.com/@` + data.music_info.author,
                                    mediaType: 1,
                                    renderLargerThumbnail: false,
                                },
                            },
                        }, {
                            quoted: lastMessage,
                        },
                    );
                }
            }
        } else {
            lastMessage = await conn.sendMessage(
                m.chat, {
                    video: {
                        url: data.play,
                    },
                    caption: `┌─⭓「 *Tiktok Downloader* 」\n│ *• ID :* *[ ${data.id} ]*\n│ *• Views :* ${Func.formatNumber(data.play_count)}\n│ *• Likes :* ${Func.formatNumber(data.digg_count)}\n│ *• Comment :* ${Func.formatNumber(data.comment_count)}\n│ *• Author :* ${data.author.nickname}\n└───────────────⭓\n*• Title :* ${data.title}`,
                }, {
                    quoted: m,
                },
            );

            await conn.sendMessage(
                m.chat, {
                    audio: {
                        url: data.music,
                    },
                    mimetype: "audio/mpeg",
                    contextInfo: {
                        externalAdReply: {
                            title: data.music_info.title,
                            body: '',
                            thumbnailUrl: data.author.avatar,
                            sourceUrl: `https://www.tiktok.com/@` + data.music_info.author,
                            mediaType: 1,
                            renderLargerThumbnail: false,
                        },
                    },
                }, {
                    quoted: lastMessage,
                },
            );
        }
    } catch (e) {
        try {
            let tiktok = await Scraper["Download"].tiktok.v2(text);
            let cap = `┌─⭓「 *TiktokV2 Downloader* 」\n│ *• Caption :* ${tiktok.caption}\n└───────────────⭓`;
            let key = await conn.sendFile(m.chat, tiktok.server1.url, null, cap, m);
        } catch (e) {
            throw eror;
        }
    }
};

handler.help = ["tt", "tiktok"].map((a) => a + " *[Tiktok Url]*");
handler.tags = ["downloader"];
handler.command = ["tt", "tiktok"];

module.exports = handler;