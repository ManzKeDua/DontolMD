const axios = require('axios');

module.exports = {
  help: ['fastbitgetcountrybyservice'],
  tags: ['fastbit'],
  command: ['fastbitgetcountrybyservice'],
  code: async (m, { text }) => {
    const [serviceId] = text.split(' ');
    if (!serviceId) return m.reply('Harap masukkan ID layanan.');

    try {
      const { data } = await axios.get(`https://fastbit.tech/api/services/countries?apikey=${global.fastbit_apikey}&application_id=${serviceId}`);

      // Menghapus duplikat berdasarkan kombinasi name + prefix
      const seen = new Set();
      const uniqueCountries = data.countries.filter(({ name, prefix }) => {
        const key = `${name}-${prefix}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      if (uniqueCountries.length === 0) {
        return m.reply('Tidak ada negara yang ditemukan untuk layanan ID ' + serviceId);
      }

      const result = uniqueCountries.map(v => `• ${v.name} (id: ${v.prefix})`).join('\n');
      m.reply(`*Daftar Negara untuk Layanan ID ${serviceId}:*\n\n${result}`);
    } catch (e) {
      console.error(e);
      m.reply('Gagal mengambil daftar negara untuk layanan tersebut. ' + e.message);
    }
  }
};