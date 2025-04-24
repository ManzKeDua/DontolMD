//Simple Base Botz
// • Credits : wa.me/6288989721627 [ manzxy ]
// • Feature : internet/mangatoon


const axios = require('axios');
const {
    JSDOM
} = require('jsdom');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const mangatoon = {
    api: {
        base: "https://mangatoon.mobi",
        endpoint: {
            detail: id => `/id/detail/${id}`,
            watch: (contentId, chapterId) => `/id/watch/${contentId}/${chapterId}`,
            search: query => `/id/search?word=${encodeURIComponent(query)}`
        }
    },

    headers: {
        'User-Agent': 'Postify/1.0.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Referer': 'https://mangatoon.mobi/'
    },

    parse: url => {
        if (!url) throw new Error('Linknya mana bree? 🗿');

        if (!isNaN(url)) return url;
        if (url.includes('content_id=')) return url.split('content_id=')[1];
        if (url.includes('/detail/')) return url.split('/detail/')[1];
        throw new Error('Linknya kagak valid bree 😂\nGituan aja ampe salah link anjirr ');
    },

    info: async url => {
        try {
            if (!url) {
                return {
                    status: true,
                    code: 400,
                    result: {
                        error: "Linknya mana bree? 🗿"
                    }
                };
            }

            const contentId = mangatoon.parse(url);
            const response = await axios.get(
                mangatoon.api.base + mangatoon.api.endpoint.detail(contentId), {
                    headers: mangatoon.headers
                }
            );

            const document = new JSDOM(response.data).window.document;

            let chapters = [];
            document.querySelectorAll('script').forEach(script => {
                if (script.textContent.includes('data = JSON.parse(')) {
                    const match = script.textContent.match(/data = JSON\.parse\('(.+?)'\);/);
                    if (match) {
                        chapters = JSON.parse(match[1].replace(/\\/g, '')).map(chapter => ({
                            id: chapter.id,
                            url: mangatoon.api.base + mangatoon.api.endpoint.watch(contentId, chapter.id),
                            number: chapter.weight,
                            title: chapter.title,
                            date: chapter.open_at,
                            likes: chapter.like_count,
                            comments: chapter.comment_count,
                            isFree: !chapter.is_fee,
                            fileSize: chapter.file_size
                        }));
                    }
                }
            });

            return {
                status: true,
                code: 200,
                result: {
                    title: document.querySelector('.detail-title')?.textContent?.trim(),
                    author: document.querySelector('.detail-author-name')?.textContent?.trim().replace('Nama Author: ', ''),
                    description: document.querySelector('.detail-description-short')?.textContent?.trim(),
                    status: document.querySelector('.detail-status')?.textContent?.trim(),
                    tags: Array.from(document.querySelectorAll('.detail-tags-info a')).map(tag => tag.textContent.trim()),
                    cover: document.querySelector('.detail-img img')?.src,
                    totalChapters: document.querySelector('.detail-episodes-number')?.textContent?.trim(),
                    stats: {
                        views: document.querySelector('.view-count')?.textContent?.trim(),
                        likes: document.querySelector('.like-count')?.textContent?.trim(),
                        rating: {
                            score: document.querySelector('.detail-score-points')?.textContent?.trim(),
                            stars: document.querySelectorAll('.detail-score-stars').length
                        }
                    },
                    chapters: chapters.sort((a, b) => a.number - b.number),
                    contentId
                }
            };
        } catch (error) {
            return {
                status: true,
                code: error.response?.status || 400,
                result: {
                    error: error.message || "Kagak bisa di fetch bree 🗿"
                }
            };
        }
    },

    watch: async url => {
        try {
            if (!url) {
                return {
                    status: true,
                    code: 400,
                    result: {
                        error: "Linknya mana woy? Kalo emang niat make mah langsung input linknya dong ahhh 😑"
                    }
                };
            }

            const [contentId, chapterId] = url.split('/watch/')[1].split('/');
            await delay(1000);

            const response = await axios.get(
                mangatoon.api.base + mangatoon.api.endpoint.watch(contentId, chapterId), {
                    headers: {
                        ...mangatoon.headers,
                        'Referer': mangatoon.api.base + mangatoon.api.endpoint.detail(contentId)
                    }
                }
            );

            const document = new JSDOM(response.data).window.document;

            let pictures = [];
            document.querySelectorAll('script').forEach(script => {
                if (script.textContent.includes('pictures = [')) {
                    const match = script.textContent.match(/pictures = (\[.*?\]);/s);
                    if (match) try {
                        pictures = JSON.parse(match[1]);
                    } catch (e) {}
                }
            });

            const images = [];
            document.querySelectorAll('.lazyload_img').forEach(img => {
                const dataSrc = img.getAttribute('data-src');
                if (dataSrc) {
                    images.push({
                        url: dataSrc,
                        alt: img.getAttribute('alt') || ''
                    });
                }
            });

            return {
                status: true,
                code: 200,
                result: {
                    mangaTitle: document.querySelector('.title')?.textContent?.trim(),
                    chapterTitle: document.querySelector('.episode-title, .watch-chapter-title')?.textContent?.trim(),
                    images,
                    pictures,
                    navigation: {
                        previous: document.querySelector('.page-icons-prev') ? {
                            url: mangatoon.api.base + document.querySelector('.page-icons-prev').getAttribute('href')
                        } : null,
                        next: document.querySelector('.page-icons-next') ? {
                            url: mangatoon.api.base + document.querySelector('.page-icons-next').getAttribute('href')
                        } : null
                    },
                    contentId,
                    chapterId
                }
            };
        } catch (error) {
            return {
                status: true,
                code: error.response?.status || 400,
                result: {
                    error: error.message || "Kagak bisa ngefetch chapternya bree 😉"
                }
            };
        }
    },

    search: async query => {
        try {
            if (!query) {
                return {
                    status: true,
                    code: 400,
                    result: {
                        error: "Lu benaran mau nyari apa kagak sih? Keyword aja kagak lu input anjirr 🗿"
                    }
                };
            }

            const response = await axios.get(
                mangatoon.api.base + mangatoon.api.endpoint.search(query), {
                    headers: mangatoon.headers
                }
            );

            const document = new JSDOM(response.data).window.document;
            const comics = [];

            document.querySelectorAll('.recommend-item').forEach(comic => {
                const link = comic.querySelector('a');
                const image = comic.querySelector('.comics-image img');
                const title = comic.querySelector('.recommend-comics-title span');
                const tags = comic.querySelector('.comics-type span');

                if (link && image && title) {
                    const href = link.getAttribute('href');
                    if (href.includes('noveltoon.mobi')) return;

                    let contentId = href.includes('content_id=') ?
                        href.split('content_id=')[1] :
                        href.includes('/detail/') ? href.split('/detail/')[1] : null;

                    comics.push({
                        title: title.textContent.trim(),
                        url: mangatoon.api.base + href,
                        cover: image.getAttribute('data-src') || image.getAttribute('src'),
                        tags: tags ? tags.textContent.trim().split('/') : [],
                        contentId
                    });
                }
            });

            return {
                status: true,
                code: 200,
                result: comics
            };
        } catch (error) {
            return {
                status: true,
                code: error.response?.status || 400,
                result: {
                    error: error.message || "Oke, sekian terima kasih 👍🏻"
                }
            };
        }
    }
};

const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    const [subcmd, ...query] = args;
    const input = query.join(' ').trim();

    if (!subcmd) {
        const helpText = `Cara Pakai ${usedPrefix + command} <command>\nList Command :\n• search <query>\n• chapter <url>\n• info <url>`;
        return m.reply(helpText);
    }

    if (subcmd === 'search') {
        if (!input) return m.reply(`Example : ${usedPrefix + command} search bos Sombong`);

        try {
            const search = await mangatoon.search(input);
            if (!search.status || search.code !== 200) throw new Error(search.result.error);
            if (search.result.length === 0) return m.reply('Gak Ketemu :v');

            let searchText = `Hasil pencarian "${input}":\n\n`;
            search.result.forEach((item, i) => {
                searchText += `${i + 1}. Judul : ${item.title}\n`;
                searchText += `   Tags : ${item.tags.join(', ')}\n`;
                searchText += `   Link : ${item.url}\n\n`;
            });
            return m.reply(searchText);
        } catch (error) {
            return m.reply(`${error.message}`);
        }
    }

    if (subcmd === 'chapter') {
        if (!input) return m.reply(`Contoh: ${usedPrefix + command} chapter https://mangatoon.mobi/id/watch/12345/1`);

        try {
            if (!input.includes('/watch/')) throw new Error('URL harus mengandung /watch/');
            const parts = input.split('/watch/')[1].split('/');
            if (parts.length < 2) throw new Error('Format URL tidak valid');

            const chapter = await mangatoon.watch(input);
            if (!chapter.status || chapter.code !== 200) throw new Error(chapter.result.error);
            if (!chapter.result.images || !chapter.result.images.length) throw new Error('Tidak ada gambar ditemukan');

            for (const img of chapter.result.images) {
                await conn.sendMessage(m.chat, {
                    image: {
                        url: img.url
                    }
                }, {
                    quoted: m
                });
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } catch (error) {
            return m.reply(`Pastikan URL chapter valid Example : https://mangatoon.mobi/id/watch/12345/1`);
        }
        return;
    }

    if (subcmd === 'info') {
        if (!input) return m.reply(`Contoh: ${usedPrefix + command} info https://mangatoon.mobi/id/detail/12345`);

        try {
            const info = await mangatoon.info(input);
            if (!info.status || info.code !== 200) throw new Error(info.result.error);

            const {
                result
            } = info;
            let infoText = `Judul : ${result.title}\n`;
            infoText += `Author : ${result.author}\n`;
            infoText += `Status : ${result.status}\n`;
            infoText += `Rating : ${result.stats.rating.score} (${result.stats.rating.stars} bintang)\n`;
            infoText += `Views : ${result.stats.views}\n`;
            infoText += `Likes : ${result.stats.likes}\n`;
            infoText += `Total Chapter : ${result.totalChapters}\n`;
            infoText += `Tags : ${result.tags.join(', ')}\n`;
            infoText += `Deskripsi : ${result.description}\n\n`;
            infoText += `Daftar Chapter (10 pertama) :\n`;

            const firstChapters = result.chapters.slice(0, 10);
            firstChapters.forEach(chapter => {
                infoText += `Chapter ${chapter.number} : ${mangatoon.api.base}${mangatoon.api.endpoint.watch(result.contentId, chapter.id)}\n`;
            });
            infoText += `\nLink : ${mangatoon.api.base + mangatoon.api.endpoint.detail(result.contentId)}`;

            if (result.cover) {
                return conn.sendMessage(m.chat, {
                    image: {
                        url: result.cover
                    },
                    caption: infoText
                }, {
                    quoted: m
                });
            }
            return m.reply(infoText);
        } catch (error) {
            return m.reply(`${error.message}`);
        }
    }

    return m.reply(`Command tidak valid. Gunakan salah satu search, chapter, atau info`);
};

handler.help = ['mangatoon <search/chapter/info> <query/url>'];
handler.command = ['mangatoon'];
handler.tags = ['internet'];

module.exports = handler;