// ── Scan Objects ──────────────────────────────────────
export const SCAN_OBJECTS = {
  plastic: {
    name: 'Botol Plastik PET',
    icon: 'fa-bottle-water',
    impactScore: 4,
    impactLabel: 'Tinggi',
    decomposeTime: '450 Tahun',
    carbon: '82g CO₂',
    carbonPct: 82,
    fact: 'Botol plastik PET membutuhkan 450 tahun untuk terurai di alam bebas dan dapat mencemari lautan selama berabad-abad.',
    points: 30,
  },
  paper: {
    name: 'Koran / Kertas',
    icon: 'fa-newspaper',
    impactScore: 1,
    impactLabel: 'Rendah',
    decomposeTime: '2–6 Minggu',
    carbon: '10g CO₂',
    carbonPct: 10,
    fact: 'Kertas dan koran terurai dengan relatif cepat. Mendaur ulang 1 ton kertas dapat menyelamatkan 17 pohon.',
    points: 20,
  },
  battery: {
    name: 'Baterai AA',
    icon: 'fa-battery-full',
    impactScore: 5,
    impactLabel: 'Sangat Tinggi',
    decomposeTime: '100+ Tahun',
    carbon: '150g CO₂',
    carbonPct: 95,
    fact: 'Baterai mengandung merkuri, timbal, dan kadmium yang sangat berbahaya jika bocor ke tanah atau air.',
    points: 40,
  },
  can: {
    name: 'Kaleng Aluminium',
    icon: 'fa-cube',
    impactScore: 3,
    impactLabel: 'Sedang',
    decomposeTime: '80–200 Tahun',
    carbon: '60g CO₂',
    carbonPct: 60,
    fact: 'Aluminium dapat didaur ulang tanpa batas dan mendaur ulang kaleng menghemat 95% energi dibanding produksi baru.',
    points: 25,
  },
  glass: {
    name: 'Botol Kaca',
    icon: 'fa-wine-bottle',
    impactScore: 2,
    impactLabel: 'Rendah–Sedang',
    decomposeTime: '1 Juta Tahun',
    carbon: '40g CO₂',
    carbonPct: 40,
    fact: 'Kaca membutuhkan waktu hingga 1 juta tahun untuk terurai, namun dapat didaur ulang tanpa batas tanpa kehilangan kualitas.',
    points: 25,
  },
  plastic_bag: {
    name: 'Kantong Plastik',
    icon: 'fa-bag-shopping',
    impactScore: 4,
    impactLabel: 'Tinggi',
    decomposeTime: '500 Tahun',
    carbon: '70g CO₂',
    carbonPct: 70,
    fact: 'Kantong plastik digunakan rata-rata hanya 12 menit, namun butuh 500 tahun untuk terurai dan sering berakhir di lautan.',
    points: 20,
  },
  cardboard: {
    name: 'Kardus',
    icon: 'fa-box',
    impactScore: 1,
    impactLabel: 'Rendah',
    decomposeTime: '2 Bulan',
    carbon: '15g CO₂',
    carbonPct: 15,
    fact: 'Kardus adalah salah satu material paling mudah didaur ulang. Mendaur ulang kardus menghemat 25% energi produksi.',
    points: 15,
  },
  tisu: {
    name: 'Tisu Bekas',
    icon: 'fa-scroll',
    impactScore: 2,
    impactLabel: 'Rendah–Sedang',
    decomposeTime: '2–6 Minggu',
    carbon: '5g CO₂',
    carbonPct: 5,
    fact: 'Tisu bekas TIDAK bisa didaur ulang karena serat kertasnya sudah terlalu pendek dan terkontaminasi. Buang ke sampah organik.',
    points: 10,
  },
  styrofoam: {
    name: 'Styrofoam',
    icon: 'fa-box-open',
    impactScore: 5,
    impactLabel: 'Sangat Tinggi',
    decomposeTime: '500+ Tahun',
    carbon: '120g CO₂',
    carbonPct: 90,
    fact: 'Styrofoam tidak bisa terurai secara biologis. Membakarnya menghasilkan racun berbahaya. Indonesia hasilkan 1,3 juta ton styrofoam per tahun.',
    points: 35,
  },
  sisa_makanan: {
    name: 'Sisa Makanan',
    icon: 'fa-utensils',
    impactScore: 3,
    impactLabel: 'Sedang',
    decomposeTime: '2–6 Minggu',
    carbon: '25g CO₂',
    carbonPct: 25,
    fact: 'Sisa makanan yang membusuk di TPA menghasilkan gas metana — 25x lebih kuat dari CO₂. Kompos adalah solusi terbaik.',
    points: 15,
  },
};

// ── Daily Facts ───────────────────────────────────────
export const DAILY_FACTS = [
  'Setiap tahun, manusia membuang lebih dari 2,12 miliar ton sampah. 99% barang yang dibeli dibuang dalam 6 bulan!',
  'Daur ulang satu kaleng aluminium menghemat energi yang cukup untuk menjalankan TV selama 3 jam.',
  'Indonesia adalah penyumbang sampah plastik ke laut terbesar ke-2 di dunia setelah Tiongkok.',
  'Satu pohon menghasilkan oksigen yang cukup untuk 2 orang dewasa selama setahun penuh.',
  'Kertas yang didaur ulang menggunakan 60% lebih sedikit energi dibanding kertas baru.',
  'Setiap menit, satu juta botol plastik dibeli di seluruh dunia — dan sebagian besar berakhir di tempat pembuangan.',
  'Plastik membutuhkan 400–1.000 tahun untuk terurai. Hampir semua plastik yang pernah diproduksi masih ada di bumi.',
  'Mendaur ulang 1 ton kertas bisa menyelamatkan 17 pohon, 7.000 galon air, dan 463 galon minyak.',
  'Baterai bekas yang dibuang sembarangan bisa mencemari hingga 600.000 liter air tanah.',
  'Jika semua orang di Indonesia berhenti menggunakan sedotan plastik, kita bisa mengurangi 93 juta sedotan per hari.',
  'Sampah elektronik (e-waste) adalah jenis sampah yang tumbuh paling cepat — mencapai 50 juta ton per tahun.',
  'Kantong plastik rata-rata digunakan hanya 12 menit, namun butuh 500 tahun untuk terurai di alam.',
];

// ── Nav Pages ─────────────────────────────────────────
export const NAV_ITEMS = [
  { page: 'home',      icon: 'fa-house',      label: 'Beranda' },
  { page: 'scan',      icon: 'fa-camera',     label: 'Scan' },
  { page: 'recycle',   icon: 'fa-recycle',    label: 'Daur Ulang' },
  { page: 'dashboard', icon: 'fa-chart-line', label: 'Statistik' },
  { page: 'eduhub',    icon: 'fa-book-open',  label: 'EduHub' },
];

// ── Recycle Cards ─────────────────────────────────────
export const RECYCLE_CARDS = [
  {
    id: 'plastic-pet', cat: 'plastic', headerClass: 'plastic-bg',
    icon: 'fa-bottle-water', badge: 'Dapat Didaur Ulang', badgeType: 'recyclable',
    title: 'Botol Plastik PET',
    desc: 'Bersihkan dan pisahkan tutup botol sebelum mendaur ulang.',
    steps: ['Bilas botol hingga bersih', 'Lepas label dan tutup botol', 'Gepengkan untuk menghemat ruang', 'Masukkan ke tempat sampah daur ulang plastik'],
    time: '450 tahun terurai', carbon: '82g CO₂',
  },
  {
    id: 'paper', cat: 'paper', headerClass: 'paper-bg',
    icon: 'fa-newspaper', badge: 'Dapat Didaur Ulang', badgeType: 'recyclable',
    title: 'Kertas & Koran',
    desc: 'Kertas adalah material yang paling mudah didaur ulang.',
    steps: ['Pastikan kertas dalam kondisi kering', 'Lepas bagian yang tidak bisa didaur ulang', 'Lipat atau gulung untuk menghemat ruang', 'Kumpulkan ke pengepul kertas atau bank sampah'],
    time: '2–6 minggu terurai', carbon: '10g CO₂',
  },
  {
    id: 'battery', cat: 'battery', headerClass: 'battery-bg',
    icon: 'fa-battery-full', badge: 'Limbah Berbahaya', badgeType: 'hazardous',
    title: 'Baterai Bekas',
    desc: 'Baterai mengandung bahan kimia berbahaya, jangan dibuang sembarangan!',
    steps: ['Jangan buang ke tempat sampah biasa', 'Simpan di wadah tertutup yang aman', 'Kumpulkan baterai bekas sebanyak mungkin', 'Serahkan ke pusat daur ulang elektronik resmi'],
    time: '100+ tahun terurai', carbon: '150g CO₂',
  },
  {
    id: 'can', cat: 'can', headerClass: 'can-bg',
    icon: 'fa-cube', badge: 'Dapat Didaur Ulang', badgeType: 'recyclable',
    title: 'Kaleng Aluminium',
    desc: 'Aluminium dapat didaur ulang tanpa batas dan menghemat 95% energi.',
    steps: ['Bilas kaleng hingga bersih', 'Remukkan kaleng untuk menghemat ruang', 'Pisahkan dari jenis sampah lain', 'Jual ke pengepul atau bank sampah setempat'],
    time: '80–200 tahun terurai', carbon: '60g CO₂',
  },
  {
    id: 'plastic-hdpe', cat: 'plastic', headerClass: 'glass-bg',
    icon: 'fa-wine-bottle', badge: 'Dapat Didaur Ulang', badgeType: 'recyclable',
    title: 'Plastik HDPE',
    desc: 'Plastik keras seperti ember, pipa, dan kemasan deterjen.',
    steps: ['Bersihkan dari sisa produk', 'Identifikasi nomor daur ulang (2-HDPE)', 'Pisahkan dari plastik jenis lain', 'Antar ke pusat daur ulang plastik'],
    time: '500+ tahun terurai', carbon: '95g CO₂',
  },
  {
    id: 'cardboard', cat: 'paper', headerClass: 'organic-bg',
    icon: 'fa-box', badge: 'Dapat Didaur Ulang', badgeType: 'recyclable',
    title: 'Kardus & Karton',
    desc: 'Kardus adalah bahan yang sangat bernilai untuk industri daur ulang kertas.',
    steps: ['Buka dan ratakan kardus', 'Lepaskan selotip dan staples', 'Pastikan kardus dalam kondisi kering', 'Ikat dengan tali dan serahkan ke pengepul'],
    time: '2 bulan terurai', carbon: '15g CO₂',
  },
];

// ── Activity Log ──────────────────────────────────────
export const ACTIVITIES = [
  { id: 1, icon: 'fa-bottle-water', iconClass: 'plastic', name: 'Botol Plastik PET',  time: '2 jam lalu',        points: '+30 EP' },
  { id: 2, icon: 'fa-newspaper',    iconClass: 'paper',   name: 'Koran Bekas',         time: '5 jam lalu',        points: '+20 EP' },
  { id: 3, icon: 'fa-battery-full', iconClass: 'battery', name: 'Baterai AA',          time: 'Kemarin, 14:30',    points: '+40 EP' },
  { id: 4, icon: 'fa-cube',         iconClass: 'can',     name: 'Kaleng Aluminium',    time: 'Kemarin, 10:15',    points: '+25 EP' },
];

// ── Badges ────────────────────────────────────────────
export const BADGES = [
  { id: 1, icon: 'fa-leaf',      name: 'Eco Starter',   earned: true },
  { id: 2, icon: 'fa-earth-asia',name: 'Earth Saver',   earned: true },
  { id: 3, icon: 'fa-recycle',   name: 'Recycler',      earned: true },
  { id: 4, icon: 'fa-fire',      name: 'Streak 7 Hari', earned: true },
  { id: 5, icon: 'fa-star',      name: '10 Scan',       earned: true },
  { id: 6, icon: 'fa-trophy',    name: 'Carbon Hero',   earned: true },
  { id: 7, icon: 'fa-crown',     name: 'Eco Master',    earned: false },
  { id: 8, icon: 'fa-gem',       name: 'Legend',        earned: false },
];

// ── Weekly Chart Data ─────────────────────────────────
export const WEEKLY_CHART = [
  { day: 'Sen', scan: 60, co2: 40 },
  { day: 'Sel', scan: 80, co2: 60 },
  { day: 'Rab', scan: 45, co2: 30 },
  { day: 'Kam', scan: 90, co2: 70 },
  { day: 'Jum', scan: 70, co2: 55 },
  { day: 'Sab', scan: 100, co2: 85 },
  { day: 'Min', scan: 55, co2: 45, active: true },
];

// ── Category Breakdown ────────────────────────────────
export const CATEGORY_BREAKDOWN = [
  { icon: 'fa-bottle-water', label: 'Plastik', pct: 70, color: '#52B788', count: '33 scan' },
  { icon: 'fa-newspaper',    label: 'Kertas',  pct: 40, color: '#40BFB0', count: '19 scan' },
  { icon: 'fa-battery-full', label: 'Baterai', pct: 20, color: '#f4a261', count: '9 scan'  },
  { icon: 'fa-cube',         label: 'Kaleng',  pct: 30, color: '#a8dadc', count: '14 scan' },
];

// ── EduHub Articles ───────────────────────────────────
export const ARTICLES = {
  featured: {
    tag: 'Lingkungan', tagClass: 'green',
    title: 'Krisis Plastik: Mengapa Kita Harus Bertindak Sekarang?',
    desc: 'Setiap menit, satu truk sampah plastik dibuang ke lautan. Indonesia menyumbang 620.000 ton sampah plastik ke laut setiap tahunnya. Pelajari dampaknya dan apa yang bisa kita lakukan.',
    readTime: '5 menit baca',
    views: '2.4K dilihat',
    url: 'https://waste4change.com/blog/global-plastic-treaty-solusi-baru-permasalahan-sampah-plastik-dunia-dan-indonesia/',
  },
  small: [
    {
      gradClass: 'teal-gradient',
      icon: 'fa-recycle',
      tag: 'Daur Ulang', tagClass: 'teal',
      title: '7 Cara Mudah Daur Ulang di Rumah',
      time: '3 menit baca',
      url: 'https://timesindonesia.co.id/gaya-hidup/547827/ramah-lingkungan-dimulai-dari-rumah-inspirasi-daur-ulang-yang-mudah-dilakukan',
    },
    {
      gradClass: 'gold-gradient',
      icon: 'fa-solar-panel',
      tag: 'Energi', tagClass: 'gold',
      title: 'Energi Terbarukan: Masa Depan Indonesia',
      time: '8 menit baca',
      url: 'https://mongabay.co.id/specials/2025/11/setengah-hati-beralih-ke-energi-terbarukan/',
    },
    {
      gradClass: 'purple-gradient',
      icon: 'fa-water',
      tag: 'Air', tagClass: 'purple',
      title: 'Krisis Air Bersih: Fakta yang Perlu Kamu Tahu',
      time: '4 menit baca',
      url: 'https://lestari.kompas.com/read/2024/05/19/132340886/krisis-air-dunia-disebut-menyedihkan-kondisi-indonesia-lebih-baik',
    },
    {
      gradClass: 'green-gradient',
      icon: 'fa-tree',
      tag: 'Hutan', tagClass: 'green',
      title: 'Deforestasi Indonesia: Data dan Solusi',
      time: '6 menit baca',
      url: 'https://www.mongabay.co.id/2024/03/15/mentawai-sulit-air-bersih-hutan-harus-terjaga/',
    },
  ],
};

// ── EduHub Videos ─────────────────────────────────────
// YouTube video IDs — embed via https://www.youtube.com/embed/{youtubeId}
export const VIDEOS = [
  {
    gradClass: 'green-gradient',
    title: 'Jejak Karbon: Apa Itu dan Bagaimana Kita Membuatnya?',
    duration: '3:16',
    views: '15.2K',
    youtubeId: 'a9yO-K8mwL0', // BBC News: Carbon footprint explained
    thumb: 'https://img.youtube.com/vi/a9yO-K8mwL0/hqdefault.jpg',
  },
  {
    gradClass: 'teal-gradient',
    title: 'Jejak Karbon: Dari Mana Asalnya?',
    duration: '8:21',
    views: '9.7K',
    youtubeId: 'wbR-5mHI6bo',
    thumb: 'https://img.youtube.com/vi/wbR-5mHI6bo/hqdefault.jpg',
  },
  {
    gradClass: 'gold-gradient',
    title: 'Plastik vs Alam: Fakta Mengejutkan',
    duration: '15:05',
    views: '22.1K',
    youtubeId: 'RS7IzU2VJIQ', // Plastic pollution documentary
    thumb: 'https://img.youtube.com/vi/RS7IzU2VJIQ/hqdefault.jpg',
  },
  {
    gradClass: 'purple-gradient',
    title: 'Zero Waste Lifestyle untuk Pemula',
    duration: '6:48',
    views: '31.5K',
    youtubeId: 'pF72px2R3Hg', // Zero waste beginner guide
    thumb: 'https://img.youtube.com/vi/pF72px2R3Hg/hqdefault.jpg',
  },
  {
    gradClass: 'green-gradient',
    title: 'Bank Sampah: Solusi Lokal Indonesia',
    duration: '9:12',
    views: '8.3K',
    youtubeId: 'OasbYWF4_S8', // Bank sampah Indonesia
    thumb: 'https://img.youtube.com/vi/OasbYWF4_S8/hqdefault.jpg',
  },
  {
    gradClass: 'teal-gradient',
    title: 'Bahaya Mikroplastik dalam Tubuh Kita',
    duration: '42:18',
    views: '44.7K',
    youtubeId: '55e1UMKIhc8', // DW Documentary: Nano and microplastics danger (confirmed)
    thumb: 'https://img.youtube.com/vi/55e1UMKIhc8/hqdefault.jpg',
  },
];

// ── EduHub Tips ───────────────────────────────────────
export const TIPS = [
  {
    iconClass: 'green', icon: 'fa-bag-shopping',
    title: 'Bawa Tas Belanja Sendiri',
    desc: 'Kurangi kantong plastik dengan tas kain. Satu tas kain bisa menggantikan 700 kantong plastik selama pemakaiannya.',
  },
  {
    iconClass: 'teal', icon: 'fa-bottle-water',
    title: 'Gunakan Botol Minum Reusable',
    desc: 'Satu botol minum reusable bisa mencegah 156 botol plastik sekali pakai per tahun. Pilih stainless steel atau kaca.',
  },
  {
    iconClass: 'gold', icon: 'fa-lightbulb',
    title: 'Ganti ke Lampu LED',
    desc: 'Lampu LED menggunakan 75% lebih sedikit energi dan bertahan 25x lebih lama dibanding lampu pijar biasa.',
  },
  {
    iconClass: 'purple', icon: 'fa-bicycle',
    title: 'Pilih Transportasi Ramah Lingkungan',
    desc: 'Bersepeda 10 km per hari bisa menghemat hingga 1,3 ton CO₂ per tahun dibanding menggunakan kendaraan bermotor.',
  },
  {
    iconClass: 'green', icon: 'fa-utensils',
    title: 'Kurangi Makanan Terbuang',
    desc: 'Rencanakan belanja mingguan dan simpan makanan dengan benar. Food waste menyumbang 8% emisi gas rumah kaca global.',
  },
  {
    iconClass: 'teal', icon: 'fa-plug',
    title: 'Cabut Charger Saat Tidak Dipakai',
    desc: 'Charger yang terpasang tanpa perangkat tetap mengonsumsi listrik (vampire power) — bisa 10% dari tagihan listrikmu.',
  },
  {
    iconClass: 'gold', icon: 'fa-faucet',
    title: 'Hemat Air Setiap Hari',
    desc: 'Matikan keran saat sikat gigi menghemat 12 liter per menit. Mandi 5 menit lebih singkat hemat 50 liter air.',
  },
  {
    iconClass: 'purple', icon: 'fa-seedling',
    title: 'Mulai Kompos Rumahan',
    desc: 'Sisa sayuran dan buah bisa dijadikan kompos dalam 4–6 minggu. Kompos mengurangi sampah organik hingga 30%.',
  },
  {
    iconClass: 'green', icon: 'fa-shirt',
    title: 'Kurangi Fast Fashion',
    desc: 'Industri fashion menyumbang 10% emisi karbon global. Beli pakaian berkualitas, rawat, dan donasikan bila tidak dipakai.',
  },
  {
    iconClass: 'teal', icon: 'fa-print',
    title: 'Minimalisir Cetak Dokumen',
    desc: 'Sebelum mencetak, tanya dirimu: apakah bisa digital? Gunakan kertas bolak-balik jika memang harus dicetak.',
  },
];