export type StaticPageSlug = 'privacy-policy' | 'terms' | 'about' | 'contact';

export type StaticPageContent = {
  slug: StaticPageSlug;
  title: string;
  eyebrow: string;
  intro: string;
  sections: Array<{
    heading: string;
    body: string[];
  }>;
};

export const supportWhatsAppNumber = '081383734851';
export const supportWhatsAppHref = 'https://wa.me/6281383734851';
export const supportEmail = 'javesstore76@gmail.com';

export const staticPages: Record<StaticPageSlug, StaticPageContent> = {
  'privacy-policy': {
    slug: 'privacy-policy',
    title: 'Kebijakan Privasi',
    eyebrow: 'Informasi Legal',
    intro:
      'Javes Store berkomitmen menjaga kerahasiaan data pelanggan saat menggunakan layanan top up game digital di website ini.',
    sections: [
      {
        heading: 'Data yang Kami Kumpulkan',
        body: [
          'Kami dapat mengumpulkan data seperti nama pelanggan, alamat email atau nomor WhatsApp, ID game, server atau zone ID, detail produk yang dipilih, serta riwayat transaksi yang dilakukan melalui website Javes Store.',
          'Data pembayaran yang tampil pada halaman checkout hanya digunakan untuk memproses pesanan dan verifikasi transaksi. Kami tidak menyimpan data sensitif kartu atau akun bank pelanggan di frontend website ini.',
        ],
      },
      {
        heading: 'Tujuan Penggunaan Data',
        body: [
          'Data pelanggan digunakan untuk memproses pesanan top up, mengirimkan konfirmasi, membantu pengecekan status transaksi, menangani kendala pesanan, serta meningkatkan kualitas layanan dan keamanan sistem Javes Store.',
          'Nomor WhatsApp atau email juga dapat digunakan oleh tim support untuk menghubungi pelanggan apabila ada kendala pada pesanan, verifikasi data, atau informasi penting terkait transaksi.',
        ],
      },
      {
        heading: 'Penyimpanan dan Perlindungan Data',
        body: [
          'Kami berupaya melindungi data pelanggan dengan langkah teknis yang wajar serta membatasi akses hanya untuk pihak yang membutuhkan data tersebut dalam proses layanan.',
          'Pelanggan disarankan memastikan data ID game, nomor WhatsApp, dan informasi transaksi yang dimasukkan sudah benar agar proses top up dapat berjalan lancar.',
        ],
      },
    ],
  },
  terms: {
    slug: 'terms',
    title: 'Ketentuan Layanan',
    eyebrow: 'Informasi Legal',
    intro:
      'Dengan menggunakan layanan Javes Store, pelanggan dianggap telah membaca, memahami, dan menyetujui ketentuan layanan berikut ini.',
    sections: [
      {
        heading: 'Aturan Transaksi dan Pesanan',
        body: [
          'Pelanggan wajib memasukkan data akun game dengan benar, termasuk ID user, zone ID, atau server bila diperlukan. Kesalahan input dari pelanggan dapat menyebabkan pesanan gagal atau masuk ke akun yang salah.',
          'Pesanan akan diproses setelah pembayaran berhasil diterima sesuai metode yang dipilih. Estimasi proses dapat berbeda tergantung game, provider, dan kondisi sistem.',
        ],
      },
      {
        heading: 'Pembayaran dan Konfirmasi',
        body: [
          'Harga yang tampil di website dapat berubah sewaktu-waktu mengikuti harga pasar, biaya channel pembayaran, atau penyesuaian merchant. Harga final akan mengikuti nominal pada checkout saat pelanggan membuat pesanan.',
          'Pelanggan wajib menyelesaikan pembayaran sebelum waktu invoice berakhir. Pesanan dengan status belum dibayar atau kedaluwarsa dapat dibatalkan secara otomatis oleh sistem.',
        ],
      },
      {
        heading: 'Refund dan Tanggung Jawab Pengguna',
        body: [
          'Refund dapat dipertimbangkan apabila transaksi gagal diproses karena kendala dari sistem atau merchant. Refund tidak berlaku untuk kesalahan data yang disebabkan oleh pelanggan, termasuk salah memasukkan ID game atau nomor tujuan.',
          'Pelanggan bertanggung jawab menjaga keamanan akun game dan memastikan akun dapat menerima item atau mata uang digital yang dibeli. Javes Store tidak bertanggung jawab atas kendala yang berasal dari pembatasan publisher game atau masalah akun pelanggan.',
        ],
      },
    ],
  },
  about: {
    slug: 'about',
    title: 'Tentang Kami',
    eyebrow: 'Profil Merchant',
    intro:
      'Javes Store adalah layanan top up game digital yang membantu pelanggan membeli diamond, UC, voucher, weekly pass, dan produk digital game lainnya secara cepat, mudah, dan aman.',
    sections: [
      {
        heading: 'Siapa Kami',
        body: [
          'Kami fokus menyediakan pengalaman top up game yang sederhana dengan pilihan produk populer, tampilan yang mudah dipahami, serta proses checkout yang praktis untuk pemain casual maupun gamer aktif.',
          'Brand Javes Store dibangun untuk menjadi merchant digital yang responsif, terpercaya, dan siap membantu pelanggan ketika membutuhkan informasi pesanan atau dukungan after-sales.',
        ],
      },
      {
        heading: 'Layanan yang Kami Sediakan',
        body: [
          'Website ini menyediakan katalog top up untuk berbagai game populer beserta informasi harga, variasi produk, dan metode pembayaran yang mendukung proses transaksi digital.',
          'Kami terus menyesuaikan tampilan dan alur website agar pelanggan dapat melakukan pemesanan dengan nyaman melalui perangkat desktop maupun mobile.',
        ],
      },
    ],
  },
  contact: {
    slug: 'contact',
    title: 'Kontak Support',
    eyebrow: 'Bantuan Pelanggan',
    intro:
      'Jika pesanan mengalami kendala, pembayaran belum masuk, atau butuh bantuan konfirmasi transaksi, tim support Javes Store siap membantu melalui kontak berikut.',
    sections: [
      {
        heading: 'Kontak Resmi',
        body: [
          `WhatsApp Customer Service: ${supportWhatsAppNumber}`,
          `Email Support: ${supportEmail}`,
        ],
      },
      {
        heading: 'Jam Operasional',
        body: [
          'Layanan support tersedia 24 jam setiap hari. Tim kami akan berusaha merespons secepat mungkin untuk membantu kebutuhan top up dan pengecekan transaksi.',
        ],
      },
      {
        heading: 'Jika Pesanan Bermasalah',
        body: [
          'Silakan siapkan ID transaksi atau nomor invoice, nama game, ID akun game, nominal produk, serta bukti pembayaran jika diperlukan. Kirimkan detail tersebut melalui WhatsApp agar tim kami dapat membantu pengecekan lebih cepat.',
          'Untuk pertanyaan umum, kerja sama, atau kebutuhan verifikasi merchant, pelanggan juga dapat menghubungi email support resmi Javes Store.',
        ],
      },
    ],
  },
};
