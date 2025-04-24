//Simple Base Botz
// • Credits : wa.me/6288989721627 [ manzxy ]
// • Feature : anime/nontonanime


const axios = require('axios');
const cheerio = require('cheerio');

const base = {
    latest: "https://nontonanime.live/",
    orderAnime: "https://nontonanime.live/anime/?status&type&order",
    search: "https://nontonanime.live/?s=",
};

const nontonAnime = {
    latest: async () => {
        const response = await axios.get(base.latest);
        const $ = cheerio.load(response.data);
        return $(".listupd.normal .bsx a").map((_, el) => ({
            title: $(el).attr("title"),
            url: $(el).attr("href"),
            episode: $(el).find(".bt .epx").text().trim(),
            type: $(el).find(".limit .typez").text().trim(),
            thumbnail: $(el).find(".lazyload").attr("data-src") || $(el).find("img").attr("src"),
        })).get();
    },

    upcoming: async () => {
        const response = await axios.get(base.orderAnime);
        const $ = cheerio.load(response.data);
        return $(".listupd .bsx a").map((_, el) => {
            const episode = $(el).find(".bt .epx").text().trim();
            if (episode.toLowerCase() !== "upcoming") return null;
            return {
                title: $(el).attr("title"),
                url: $(el).attr("href"),
                episode,
                type: $(el).find(".limit .typez").text().trim(),
                thumbnail: $(el).find(".lazyload").attr("data-src") || $(el).find("img").attr("src"),
            };
        }).get().filter(Boolean);
    },

    search: async (q) => {
        const response = await axios.get(base.search + encodeURIComponent(q));
        const $ = cheerio.load(response.data);
        return $(".bsx a").map((_, el) => ({
            title: $(el).attr("title"),
            url: $(el).attr("href"),
            episode: $(el).find(".bt .epx").text().trim(),
            type: $(el).find(".limit .typez").text().trim(),
            thumbnail: $(el).find(".lazyload").attr("data-src") || $(el).find("img").attr("src"),
        })).get();
    },

    details: async (url) => {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        return {
            title: $("h1.entry-title").text().trim(),
            thumbnail: $(".bigcover .lazyload").attr("data-src") || $(".bigcover img").attr("src"),
            synopsis: $(".entry-content p").first().text().trim(),
            status: $(".info-content .spe span:contains('Status')").text().replace("Status:", "").trim(),
            studio: $(".info-content .spe span:contains('Studio') a").text().trim(),
            season: $(".info-content .spe span:contains('Season') a").text().trim(),
            type: $(".info-content .spe span:contains('Type')").text().replace("Type:", "").trim(),
        };
    },

    download: async (url) => {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const links = [];

        $(".mirror option").each((_, el) => {
            const val = $(el).attr("value");
            if (val) {
                const buf = Buffer.from(val, "base64").toString("utf-8");
                const link = buf.includes("<iframe") ? cheerio.load(buf)("iframe").attr("src") : buf;
                links.push(`• ${$(el).text().trim()}:\n${link}`);
            }
        });

        return links;
    }
};

const handler = async (m, {
    conn,
    args,
    command
}) => {
    switch (command) {
        case "nontonanime-latest": {
            const list = await nontonAnime.latest();
            if (!list.length) return m.reply("Gagal mengambil data anime terbaru.");
            for (let i = 0; i < Math.min(3, list.length); i++) {
                const a = list[i];
                await conn.sendMessage(m.chat, {
                    image: {
                        url: a.thumbnail
                    },
                    caption: `*${a.title}*\nEpisode: ${a.episode}\nTipe: ${a.type}\nURL: ${a.url}`
                }, {
                    quoted: m
                });
            }
        }
        break;

        case "nontonanime-upcoming": {
            const list = await nontonAnime.upcoming();
            if (!list.length) return m.reply("Tidak ada anime upcoming ditemukan.");
            for (let i = 0; i < Math.min(3, list.length); i++) {
                const a = list[i];
                await conn.sendMessage(m.chat, {
                    image: {
                        url: a.thumbnail
                    },
                    caption: `*${a.title}*\nEpisode: ${a.episode}\nTipe: ${a.type}\nURL: ${a.url}`
                }, {
                    quoted: m
                });
            }
        }
        break;

        case "nontonanime-search": {
            if (!args[0]) return m.reply("Masukkan judul anime yang ingin dicari!");
            const list = await nontonAnime.search(args.join(" "));
            if (!list.length) return m.reply("Anime tidak ditemukan.");
            for (let i = 0; i < Math.min(3, list.length); i++) {
                const a = list[i];
                await conn.sendMessage(m.chat, {
                    image: {
                        url: a.thumbnail
                    },
                    caption: `*${a.title}*\nEpisode: ${a.episode}\nTipe: ${a.type}\nURL: ${a.url}`
                }, {
                    quoted: m
                });
            }
        }
        break;

        case "nontonanime-detail": {
            if (!args[0]) return m.reply("Masukkan URL anime!");
            const detail = await nontonAnime.details(args[0]);
            if (!detail) return m.reply("Gagal mengambil detail anime.");
            await conn.sendMessage(m.chat, {
                image: {
                    url: detail.thumbnail
                },
                caption: `*${detail.title}*\n\n${detail.synopsis}\n\nStatus: ${detail.status}\nStudio: ${detail.studio}\nSeason: ${detail.season}\nTipe: ${detail.type}`
            }, {
                quoted: m
            });
        }
        break;

        case "nontonanime-download": {
            if (!args[0]) return m.reply("Masukkan link episode!");
            const links = await nontonAnime.download(args[0]);
            if (!links.length) return m.reply("Link download tidak ditemukan.");
            await conn.sendMessage(m.chat, {
                text: `*Link Download:*\n\n${links.join("\n\n")}`,
            }, {
                quoted: m
            });
        }
        break;
    }
};

handler.help = [
    "nontonanime-latest",
    "nontonanime-upcoming",
    "nontonanime-search <query>",
    "nontonanime-detail <url>",
    "nontonanime-download <url>",
];

handler.tags = ["anime"];
handler.command = /^nontonanime-(latest|upcoming|search|detail|download)$/i;

module.exports = handler;