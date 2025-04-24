//Simple Base Botz
// • Credits : wa.me/6288989721627 [ manzxy ]
// • Feature : _event/autosholat


const moment = require("moment-timezone");

async function before(m, {
    isBotAdmin,
    isAdmin
}) {
    const gcnya = global.gc;
    const time = moment.tz('Asia/Jakarta').format('HH:mm');

    // Pagi
    if (time === "06:00") {
        await conn.groupSettingUpdate(gcnya, "not_announcement");
        await conn.reply(gcnya, `*[System Notice]*\nSelamat pagi, teman-teman! Semoga hari ini penuh dengan semangat dan kebahagiaan. Mari kita mulai hari ini dengan semangat yang tinggi dan berbagi kebaikan di grup WhatsApp kita. Selamat beraktivitas dan semoga hari ini menjadi hari yang produktif dan menyenangkan bagi kita semua.`, null);
    }

    // Malam
    else if (time === "00:00") {
        await conn.groupSettingUpdate(gcnya, "announcement");
        await conn.reply(gcnya, `*[System Notice]*\nHalo semua, maaf mengganggu. Sistem grup WhatsApp akan ditutup sementara karena sudah larut malam. Mohon maaf atas ketidaknyamanannya. Silakan istirahat yang baik dan kita akan melanjutkan percakapan besok pagi. Terima kasih atas pengertian dan kerjasamanya. Selamat malam!.`, null);
    }

    // Dzuhur
    else if (time === "12:19") {
        await conn.groupSettingUpdate(gcnya, "announcement");
        await conn.reply(gcnya, `*[System Notice]*\nHalo semuanya! Sistem grup WhatsApp akan ditutup sementara karena sudah memasuki waktu Dzuhur. Silakan istirahat sejenak dan nikmati waktu bersama keluarga atau melakukan aktivitas lainnya. Kami akan membuka kembali sistem grup ini setelah waktu Dzuhur. Terima kasih atas pengertian dan kerjasamanya. Selamat beristirahat!`, null);
    } else if (time === "12:24") {
        await conn.groupSettingUpdate(gcnya, "not_announcement");
        await conn.reply(gcnya, `*[System Notice]*\nSelamat siang semuanya! Sistem grup WhatsApp telah dibuka setelah Dzuhur. Semoga kita semua telah menjalankan ibadah dengan baik dan mendapatkan berkah di hari ini. Mari kita berbagi cerita, informasi, dan kebahagiaan bersama di grup ini. Selamat bergabung dan semoga kita memiliki waktu yang menyenangkan!`, null);
    }

    // Ashar
    else if (time === "15:48") {
        await conn.groupSettingUpdate(gcnya, "announcement");
        await conn.reply(gcnya, `*[System Notice]*\nHalo semuanya! Sistem grup WhatsApp akan ditutup sementara karena sudah memasuki waktu Ashar. Silakan istirahat sejenak dan nikmati waktu bersama keluarga atau melakukan aktivitas lainnya. Kami akan membuka kembali sistem grup ini setelah waktu Ashar. Terima kasih atas pengertian dan kerjasamanya. Selamat beristirahat!`, null);
    } else if (time === "15:53") { // perubahan waktu
        await conn.groupSettingUpdate(gcnya, "not_announcement");
        await conn.reply(gcnya, `*[System Notice]*\nSelamat sore semuanya! Sistem grup WhatsApp telah dibuka setelah Ashar. Semoga kita semua telah menjalankan ibadah dengan baik dan mendapatkan berkah di hari ini. Mari kita berbagi cerita, informasi, dan kebahagiaan bersama di grup ini. Selamat bergabung dan semoga kita memiliki waktu yang menyenangkan!`, null);
    }

    // Magrib
    else if (time === "18:38") {
        await conn.groupSettingUpdate(gcnya, "announcement");
        await conn.reply(gcnya, `*[System Notice]*\nHalo semuanya! Sistem grup WhatsApp akan ditutup sementara karena sudah memasuki waktu Buka Puasa && Sholat Magrib. Silakan istirahat sejenak dan nikmati waktu bersama keluarga atau melakukan aktivitas lainnya. Kami akan membuka kembali sistem grup ini setelah waktu Magrib. Terima kasih atas pengertian dan kerjasamanya. Selamat beristirahat!`, null);
    } else if (time === "18:50") {
        await conn.groupSettingUpdate(gcnya, "not_announcement");
        await conn.reply(gcnya, `*[System Notice]*\nSelamat malam semuanya! Sistem grup WhatsApp telah dibuka setelah Magrib. Semoga kita semua telah menjalankan ibadah dengan baik dan mendapatkan berkah di hari ini. Mari kita berbagi cerita, informasi, dan kebahagiaan bersama di grup ini. Selamat bergabung dan semoga kita memiliki waktu yang menyenangkan!`, null);
    }

    // Isha
    else if (time === "20:04") {
        await conn.groupSettingUpdate(gcnya, "announcement");
        await conn.reply(gcnya, `*[System Notice]*\nHalo semuanya! Sistem grup WhatsApp akan ditutup sementara karena sudah memasuki waktu Isha && Terawih. Silakan istirahat sejenak dan nikmati waktu bersama keluarga atau melakukan aktivitas lainnya. Kami akan membuka kembali sistem grup ini setelah waktu Isha. Terima kasih atas pengertian dan kerjasamanya. Selamat beristirahat!`, null);
    } else if (time === "20:10") {
        await conn.groupSettingUpdate(gcnya, "not_announcement");
        await conn.reply(gcnya, `*[System Notice]*\nSelamat malam semuanya! Sistem grup WhatsApp telah dibuka setelah Isha. Semoga kita semua telah menjalankan ibadah dengan baik dan mendapatkan berkah di hari ini. Mari kita berbagi cerita, informasi, dan kebahagiaan bersama di grup ini. Selamat bergabung dan semoga kita memiliki waktu yang menyenangkan!`, null);
    }
}

module.exports = {
    before
}