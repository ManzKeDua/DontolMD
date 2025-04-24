//Simple Base Botz
// • Credits : wa.me/6288989721627 [ manzxy ]
// • Feature : internet/sakuranovel


const axios = require('axios');
const cheerio = require('cheerio'); // Perbaikan import cheerio

const sakura = {
    baseUrl: 'https://sakuranovel.id/',
    cf: 'https://kaviaann-cloudflare.hf.space/scrape',
    baseHeaders: { // Perbaikan nama variabel
        accept: '*/*',
        'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'cache-control': 'no-cache',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        pragma: 'no-cache',
        origin: 'https://sakuranovel.id/',
        referer: 'https://sakuranovel.id/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
        'x-requested-with': 'XMLHttpRequest',
    },

    async search(query) {
        try {
            const {
                data
            } = await axios.post(
                `${this.baseUrl}wp-admin/admin-ajax.php`,
                `action=data_fetch&keyword=${encodeURIComponent(query)}`, {
                    headers: this.baseHeaders
                }
            );
            const $ = cheerio.load(data);
            const result = $('.searchbox')
                .map((_, el) => ({
                    title: $(el).find('a').attr('title'),
                    link: $(el).find('a').attr('href'),
                    thumbnail: $(el).find('img').attr('src')?.split('?')[0],
                    type: $(el).find('.type').map((_, el) => $(el).text().trim()).get(),
                    status: $(el).find('.status').text()?.trim(),
                }))
                .get();
            return result;
        } catch (error) {
            throw error;
        }
    },

    async info(url) {
        try {
            const {
                data
            } = await axios.get(`${this.cf}?url=${url}`);
            const $ = cheerio.load(data);
            const el = $('.series .container .series-flex');
            const kr = el.find('.series-flexleft');
            const kn = el.find('.series-flexright');
            return {
                id: kr.find('button.bookmark').attr('data-postid'),
                title: kr.find('.series-titlex h2').text()?.trim(),
                thumbnail: kr.find('img').attr('src'),
                synops: kn.find('.series-synops p').map((_, el) => $(el).text().trim()).get().join('\n'),
                info: kr.find('.series-infoz.block span').map((_, el) => ({
                    category: $(el).attr('class')?.split(' ')[0],
                    value: $(el).text()?.trim(),
                })).get().concat(
                    kr.find('ul.series-infolist li').map((_, el) => {
                        const s = $(el).find('span');
                        return {
                            category: $(el).find('b').text().toLowerCase(),
                            value: s.text(),
                            anchor: !s.find('a').length ? null : s.find('a').map((_, el) => ({
                                value: $(el).text(),
                                link: $(el).attr('href'),
                            })).get(),
                        };
                    }).get()
                ),
                ratings: +kr.find('.series-infoz.score span[itemprop="ratingValue"]').text().trim() || 0,
                favorite: +kr.find('button.bookmark').attr('data-favoritecount') || 0,
                genres: kn.find('.series-genres a').map((_, el) => $(el).text().trim()).get(),
                chapter: kn.find('ul.series-chapterlists li').map((_, el) => ({
                    title: $(el).find('a').attr('title'),
                    link: $(el).find('a').attr('href'),
                    date: $(el).find('span.date').text(),
                })).get(),
            };
        } catch (error) {
            throw error;
        }
    },

    async read(url) {
        try {
            const {
                data
            } = await axios.get(`${this.cf}?url=${url}`);
            const $ = cheerio.load(data);
            const content = $('main .content');
            return {
                title: content.find('h2.title-chapter').text().trim(),
                novel: content.find('.asdasd p')
                    .slice(0, -1)
                    .map((_, el) => $(el).text().trim()).get(),
            };
        } catch (error) {
            throw error;
        }
    }
};

const handler = async (m, {
    conn,
    command,
    args
}) => {
    const query = args.join(' ');
    if (!query) return m.reply(`Contoh:\n.sakusearch takane no hana\n.sakuinfo https://sakuranovel.id/novel/xyz/\n.sakubaca https://sakuranovel.id/novel/xyz/`);

    if (command === 'sakusearch') {
        try {
            const res = await sakura.search(query);
            if (!res.length) return m.reply('Tidak ditemukan.');

            let teks = `Hasil Pencarian:\n\n`;
            for (let x of res) {
                teks += `• *${x.title}*\n`;
                teks += `Status: ${x.status}\n`;
                teks += `Type: ${x.type.join(', ')}\n`;
                teks += `Link: ${x.link}\n\n`;
            }
            m.reply(teks.trim());
        } catch (e) {
            m.reply(`Gagal cari: ${e.message}`);
        }
    }

    if (command === 'sakuinfo') {
        try {
            const res = await sakura.info(query);
            let teks = `*${res.title}*\n\n`;
            teks += `Genres: ${res.genres.join(', ')}\n`;
            teks += `Rating: ${res.ratings}\n`;
            teks += `Favorite: ${res.favorite}\n\n`;
            teks += `*Informasi:*\n`;
            for (let x of res.info) {
                teks += `- ${x.category}: ${x.value}\n`;
            }
            teks += `\n*Sinopsis:*\n${res.synops}\n\n`;
            teks += `*Chapters:*\n`;
            for (let x of res.chapter.slice(0, 10)) {
                teks += `- ${x.title}\n${x.link}\n`;
            }
            conn.sendFile(m.chat, res.thumbnail, 'thumb.jpg', teks, m);
        } catch (e) {
            m.reply(`Gagal ambil info: ${e.message}`);
        }
    }

    if (command === 'sakubaca') {
        try {
            const res = await sakura.read(query);
            let teks = `*${res.title}*\n\n${res.novel.join('\n')}`;
            m.reply(teks);
        } catch (e) {
            m.reply(`Gagal ambil konten: ${e.message}`);
        }
    }
};

handler.help = ['sakusearch', 'sakuinfo', 'sakubaca'];
handler.tags = ['internet'];
handler.command = ['sakusearch', 'sakuinfo', 'sakubaca'];
module.exports = handler;