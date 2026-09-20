/* EDIT DATA UNDANGAN DI SINI. Data awal adalah contoh dari referensi video. */
window.INVITATION = {
  couple: 'Rassya & Bunga',
  date: '2026-09-27T10:00:00+07:00',
  endDate: '2026-09-27T13:00:00+07:00',
  timeLabel: '10.00 – 12.00 WIB',
  eventLabel: 'Resepsi Pernikahan',
  venue: 'Balai Sudirman',
  address: 'Jl. Dr. Saharjo No.268, RT.1/RW.4, Menteng Dalam, Kec. Tebet, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta',
  mapsQuery: 'Balai Sudirman',
  dressCode: 'Bebas',
  dressColor: '',
  hashtag: '#RassyaBunga',
  guestDefault: 'Bapak / Ibu / Saudara/i',
  groom: {
    name: 'Rassya', fullName: 'Rassya Febriano Maklin',
    father: 'Yasser Maklin', mother: 'Yunita Luciana',
    tagline: 'Certified good listener',
    description: 'Tenang, penuh perhatian, dan selalu punya cara untuk membuat hari yang biasa terasa istimewa.',
    photo: 'assets/fotosendiripria.jpeg'
  },
  bride: {
    name: 'Bunga', fullName: 'Bunga Atha Desyuna',
    father: 'Erik Apriana', mother: 'SAnthi Rahayu',
    tagline: 'His favourite person',
    description: 'Pencinta cerita kecil, tawa panjang, dan segala hal manis. Kini, siap memulai bab baru bersama orang favoritnya.',
    photo: 'assets/fotosendiriwanita.jpeg'
  },
  story: [
    'Berawal dari membalas Instagram story. Satu mengirim emoji, satu lagi membalas terlalu cepat.',
    'Sejak itu, percakapan kami tidak pernah benar-benar selesai. Dari “sudah makan?” menjadi “mau menua bersama?”',
    'Di antara banyak kebetulan, kami memilih satu kepastian: melangkah bersama. Dan kamu adalah bagian dari cerita ini.'
  ],
  storyPhotos: ['assets/fotobareng1.jpeg', 'assets/fotobareng2.jpeg', 'assets/fotobareng3.jpeg'],
  gallery: ['assets/fotogallery1.jpeg', 'assets/fotogallery2.jpeg', 'assets/fotogallery3.jpeg'],
  coverPhoto: 'assets/fotocover.jpeg',
  albumPhoto: 'assets/fotoalbum.jpeg',
  music: 'assets/our-song.mp3',
  musicTitle: 'Kasih Putih - Glenn Fredly (Instrumental)',
  // Kosongkan gift.account sampai nomor rekening asli siap. Kartu tidak tampil jika kosong.
  gift: { bank: 'Mandiri', account: '1290014275230', holder: 'Rassya Febriano Maklin' },
  // Format internasional: 628xxxxxxxxxx, tanpa + atau spasi. Jangan gunakan nomor contoh.
  whatsapp: '6285722071212',
  // Jalankan npm start untuk RSVP bersama. Hosting statis: demo lokal / WhatsApp jika dikonfigurasi.
  rsvpEndpoint: 'api/rsvp',
  storageKey: 'rassya-bunga-2026',
  maxGuests: 4
};
