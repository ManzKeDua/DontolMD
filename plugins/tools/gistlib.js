//Simple Base Botz
// • Credits : wa.me/6285822146627 [ Nazir ]
// • Feature : tools/gistlib


const axios = require('axios');
const qs = require('qs');

const gistlib = {
    api: {
        base: "https://api.gistlib.com/v1/prompt/query",
        token: "https://securetoken.googleapis.com/v1/token",
        userInfo: "https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo",
        key: "AIzaSyABSb80nLRB_FN2bdZrtIV5k7_oLRMQF9w"
    },
    headers: {
        'authority': 'api.gistlib.com',
        'accept': 'application/json, text/plain, */*',
        'origin': 'https://gistlib.com',
        'pragma': 'no-cache',
        'referer': 'https://gistlib.com/',
        'user-agent': 'Postify/1.0.0'
    },
    languages: [
        'javascript',
        'typescript',
        'python',
        'swift',
        'ruby',
        'csharp',
        'go',
        'rust',
        'php',
        'matlab',
        'r'
    ],
    refreshToken: 'AMf-vBxj8NY808dvIjtCj_1UzVZvqjiYAKwiDJHrd_CN7S9tfb9z8i9rQgn4JqpJ88mCD_bgYxP4mSwQEU341_2mzI5rNGD5RiRXnpMxvIxLLWSZz2Ofhf9tz3Lc31mGCeb3dLnwKr7XiSK89Sc77yS8ZqzXYGYJhEptXsm5XqNQHoX_St101c4',
    a: {
        token: null,
        expiresAt: null
    },
    ensureToken: async () => {
        const now = Date.now();
        if (gistlib.a.token && gistlib.a.expiresAt && now < gistlib.a.expiresAt - 300000) {
            return {
                success: true,
                code: 200,
                result: {
                    token: gistlib.a.token
                }
            };
        }
        try {
            const data = {
                grant_type: 'refresh_token',
                refresh_token: gistlib.refreshToken
            };
            const response = await axios.post(
                `${gistlib.api.token}?key=${gistlib.api.key}`,
                qs.stringify(data), {
                    headers: gistlib.headers
                }
            );
            if (!response.data?.access_token) {
                return {
                    success: false,
                    code: 400,
                    result: {
                        error: "Token lu invalid anjirr, lu mau ngecheat yak "
                    }
                };
            }
            gistlib.a = {
                token: response.data.access_token,
                expiresAt: now + (response.data.expires_in * 1000 || 3600000)
            };
            return {
                success: true,
                code: 200,
                result: {
                    token: gistlib.a.token
                }
            };
        } catch (error) {
            return {
                success: false,
                code: error.response?.status || 500,
                result: {
                    error: "Yeah, i see  Tokennya kagak mau diambil bree wkwk .. Lu maen curang soalnya .."
                }
            };
        }
    },
    isValid: (data) => {
        if (!data) {
            return {
                success: false,
                code: 400,
                result: {
                    error: "Datanya kagak ada bree! Lu input apaan sih? "
                }
            };
        }
        if (!data.prompt) {
            return {
                success: false,
                code: 400,
                result: {
                    error: "Promptnya mana bree? Kalo niat make mah jangan kosong begitu inputnya yak "
                }
            };
        }
        if (!data.language) {
            return {
                success: false,
                code: 400,
                result: {
                    error: "Bahasanya mana bree? jangan kosong begitu anjirr... dikira gua tau lu mau make Bahasa apa  Jawa aja kali yak :v"
                }
            };
        }
        if (!gistlib.languages.includes(data.language.toLowerCase())) {
            return {
                success: false,
                code: 400,
                result: {
                    error: `${data.language} apaan tuh bree? Yang bener dong, aelah... Nih bahasa yang support: ${gistlib.languages.join(', ')} `
                }
            };
        }
        return {
            success: true,
            code: 200,
            result: {
                message: "Datanya valid nih bree "
            }
        };
    },
    create: async (prompt, language) => {
        const validation = gistlib.isValid({
            prompt,
            language
        });
        if (!validation.success) {
            return validation;
        }
        const ab = await gistlib.ensureToken();
        if (!ab.success) {
            return ab;
        }
        try {
            const response = await axios.get(gistlib.api.base, {
                headers: {
                    ...gistlib.headers,
                    'Authorization': `Bearer ${ab.result.token}`
                },
                params: {
                    prompt,
                    language
                }
            });
            return {
                success: true,
                code: 200,
                result: response.data
            };
        } catch (error) {
            return {
                success: false,
                code: error.response?.status || 500,
                result: {
                    error: "Anjaiii... Server Gistlibnya lagi kumat bree ",
                    details: error.message
                }
            };
        }
    }
};

const handler = async (m, {
    conn,
    text
}) => {
    const [language, ...promptArray] = text.split(' ');
    const prompt = promptArray.join(' ');

    if (!language || !prompt) {
        return m.reply('Contoh penggunaan :* .code javascript buat fungsi fibonacci \n\n*List Programming Language : \n\n- javascript\n\n- python\n\n- ruby\n\n- php\n\n- matlab\n\n- go\n\n- swift\n\n- csharp\n\n- r\n\n- typescript\n\n- rust');
    }

    const result = await gistlib.create(prompt, language.toLowerCase());

    if (!result.success) {
        return m.reply(`${result.result.error || 'Error'}`);
    }

    const codeResult = result.result;
    let responseText = `*Result Code ${language.toUpperCase()}*:\n\n`;
    responseText += `${codeResult.language}\n\n${codeResult.code}`;

    m.reply(responseText);
};

handler.help = ['gistlib <programming language > <prompt>'];
handler.command = ['gistlib'];
handler.tags = ['ai'];

module.exports = handler;