const axios = require('axios');

const miq = {
    api: {
        base: "https://api.voids.top",
        endpoints: {
            fakequote: "/fakequote",
            fakequotebeta: "/fakequotebeta"
        },
        botghost: {
            base: "https://dashboard.botghost.com/api/public/tools/user_lookup"
        }
    },

    headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
        'origin': 'https://botghost.com',
        'referer': 'https://botghost.com/',
        'user-agent': 'Postify/1.0.0'
    },

    wm: "MIQ#Daffa ~",

    getDiscordUser: async (userId) => {
        if (!userId || userId.trim() === '') {
            return {
                status: false,
                code: 400,
                message: 'ID User Discordnya mana bree? jangan kosong begitu inputnya lah '
            };
        }

        try {
            const response = await axios.get(`${miq.api.botghost.base}/${userId}`, {
                headers: miq.headers
            });

            const user = response.data;
            if (!user || Object.keys(user).length === 0) {
                return {
                    status: false,
                    code: 404,
                    message: `User ID ${userId} kagak ada bree, ganti user id yang lain aja yak `
                };
            }

            const ava = user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : null;

            return {
                status: true,
                code: 200,
                result: {
                    avatar: ava,
                    username: user.username,
                    displayName: user.global_name || user.username
                }
            };
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return {
                    status: false,
                    code: 404,
                    message: `User ID ${userId}nya kagak ada breee, coba ganti yang lain aja dahhh `
                };
            } else if (error.response) {
                return {
                    status: false,
                    code: error.response.status,
                    message: `${error.response.data.message || error.message}`
                };
            } else {
                return {
                    status: false,
                    code: 500,
                    message: `${error.message}`
                };
            }
        }
    },

    isDiscord: (id) => {
        return /^\d{17,19}$/.test(id);
    },

    generate: async (userId, text, color, watermark) => {
        if (!userId || !miq.isDiscord(userId)) {
            return {
                status: false,
                code: 400,
                message: 'User IDnya kagak valid bree  minimal user nya make discord .'
            };
        }

        if (!text || typeof text !== 'string' || text.trim() === '') {
            return {
                status: false,
                code: 400,
                message: 'Teks Quotenya kagak boleh kosong bree '
            };
        }

        if (typeof color !== 'boolean') {
            return {
                status: false,
                code: 400,
                message: 'Color harus boolean (true atau false) yak bree'
            };
        }

        watermark = watermark || miq.wm;

        try {
            const userInfo = await miq.getDiscordUser(userId);
            if (!userInfo.status) {
                return userInfo;
            }

            const payload = {
                text: text,
                avatar: userInfo.result.avatar,
                username: userInfo.result.username,
                display_name: userInfo.result.displayName,
                color: color,
                watermark: watermark
            };

            const response = await axios.post(`${miq.api.base}${miq.api.endpoints.fakequote}`, payload, {
                headers: miq.headers
            });

            return {
                status: true,
                code: 200,
                result: {
                    image: response.data.url
                }
            };

        } catch (error) {
            if (error.response) {
                return {
                    status: false,
                    code: error.response.status,
                    message: `${error.response.data.message || error.message}`
                };
            } else {
                return {
                    status: false,
                    code: 500,
                    message: `${error.message}`
                };
            }
        }
    }
};

const handler = async (m, {
    conn,
    text,
    args
}) => {
    if (!args[0]) return m.reply('Gini Cara Pakenya\n\n*Usage :* .miq ID Discord|Text Qoutes|true/false|watermark\n\n*Example :* .miq 1336652791925706822|Kadang Hidup Itu Senang Kadang Susah|true|bella');

    const [userId, quoteText, color, watermark] = text.split('|');

    if (!miq.isDiscord(userId)) return m.reply('User ID Discord Nya Yang Valid Dong');
    if (!quoteText) return m.reply('Qoute Jangan Kosong');

    const colorBool = color === 'true';

    try {
        const result = await miq.generate(userId, quoteText, colorBool, watermark);

        if (!result.status) return m.reply(result.message);

        await conn.sendMessage(m.chat, {
            image: {
                url: result.result.image
            },
        }, {
            quoted: m
        });

    } catch (error) {
        m.reply(`${error.message}`);
    }
};

handler.help = ['miq'];
handler.command = ['miq'];
handler.tags = ['tools'];

module.exports = handler;
