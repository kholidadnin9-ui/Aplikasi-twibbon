import { FrameCategory, StickerCatalogItem, TwibbonTemplate } from '../types/twibbon';

export const FRAME_CATEGORIES: { id: FrameCategory; label: string; count?: number }[] = [
  { id: 'semua', label: 'Semua Bingkai' },
  { id: 'ppdb', label: 'PPDB / MPLS' },
  { id: 'nasional', label: 'Hari Guru & Nasional' },
  { id: 'prestasi', label: 'Prestasi & Kelulusan' },
  { id: 'kegiatan', label: 'Kegiatan Kelas' },
];

export const TWIBBON_TEMPLATES: TwibbonTemplate[] = [
  {
    id: 'mpls-ceria-sd',
    name: 'MPLS & PPDB Ceria SD',
    category: 'ppdb',
    badgeText: 'AKU SIAP MASUK SD!',
    defaultTopTitle: 'MPLS RAMAH & CERIA 2025/2026',
    defaultSubtitle: 'Hari Pertama Sekolah yang Menyenangkan & Penuh Semangat!',
    defaultSchoolName: 'SD Negeri Nusantara • Widodo Guru SD',
    primaryColor: '#D92D20',
    secondaryColor: '#1D4ED8',
    accentColor: '#F59E0B',
    cutoutShape: 'circle',
    ribbonStyle: 'curved-ribbon',
    patternType: 'merah-putih-wave',
    description: 'Bingkai resmi penyambutan siswa baru SD dengan warna Merah Putih & Lencana Cendekia.',
    popular: true,
  },
  {
    id: 'hari-guru-widodo',
    name: 'Spesial Hari Guru Nasional',
    category: 'nasional',
    badgeText: 'GURU HEBAT, INDONESIA KUAT',
    defaultTopTitle: 'SELAMAT HARI GURU NASIONAL',
    defaultSubtitle: 'Terima Kasih Guruku, Pelita Ilmu & Pembentuk Karakter Bangsa',
    defaultSchoolName: 'Keluarga Besar Widodo Guru SD',
    primaryColor: '#1E3A8A',
    secondaryColor: '#D92D20',
    accentColor: '#F59E0B',
    cutoutShape: 'circle',
    ribbonStyle: 'academic-crest',
    patternType: 'batik-guru',
    description: 'Desain elegan bermotif geometris Nusantara untuk apresiasi guru & pendidik SD.',
    popular: true,
  },
  {
    id: 'bintang-prestasi-juara',
    name: 'Bintang Prestasi & Juara Kelas',
    category: 'prestasi',
    badgeText: 'ANAK SD BERPRESTASI',
    defaultTopTitle: 'APRESIASI BINTANG PRESTASI SD',
    defaultSubtitle: 'Cerdas, Berkarakter Mulia, dan Membanggakan Orang Tua',
    defaultSchoolName: 'Komunitas Widodo Guru SD Indonesia',
    primaryColor: '#0F766E',
    secondaryColor: '#1E293B',
    accentColor: '#F59E0B',
    cutoutShape: 'shield',
    ribbonStyle: 'curved-ribbon',
    patternType: 'gold-laurel',
    description: 'Bingkai medali emas dan perisai kehormatan untuk juara lomba, olimpiade, & bintang kelas.',
    popular: true,
  },
  {
    id: 'hardiknas-kemerdekaan',
    name: 'Semarak Hardiknas & Kemerdekaan',
    category: 'nasional',
    badgeText: 'MERDEKA BELAJAR!',
    defaultTopTitle: 'SEMARAK PENDIDIKAN NASIONAL',
    defaultSubtitle: 'Bergerak Bersama Wujudkan Generasi Emas Indonesia',
    defaultSchoolName: 'Widodo Guru SD • Tut Wuri Handayani',
    primaryColor: '#B91C1C',
    secondaryColor: '#991B1B',
    accentColor: '#FBBF24',
    cutoutShape: 'circle',
    ribbonStyle: 'classic-banner',
    patternType: 'hardiknas-rays',
    description: 'Nuansa patriotik Merah Putih dengan sinar semangat pendidikan nasional.',
  },
  {
    id: 'ppdb-generasi-hebat',
    name: 'PPDB Generasi Cerdas Berkarakter',
    category: 'ppdb',
    badgeText: 'SISWA BARU HEBAT',
    defaultTopTitle: 'PENERIMAAN PESERTA DIDIK BARU',
    defaultSubtitle: 'Mari Bergabung Bersama Sekolah Dasar Ramah Anak',
    defaultSchoolName: 'SD Negeri Teladan • Widodo Guru SD',
    primaryColor: '#1D4ED8',
    secondaryColor: '#0284C7',
    accentColor: '#F59E0B',
    cutoutShape: 'squircle',
    ribbonStyle: 'modern-pill',
    patternType: 'nusantara-shield',
    description: 'Tampilan modern sudut tumpul dengan warna biru edukasi dan aksen kuning ceria.',
  },
  {
    id: 'pramuka-siaga-penggalang',
    name: 'Kegiatan Pramuka & Ekstrakurikuler',
    category: 'kegiatan',
    badgeText: 'PRAMUKA SD AKTIF',
    defaultTopTitle: 'SATYAKU KUDARMAKAN, DARMAKU KUBAKTIKAN',
    defaultSubtitle: 'Pramuka Siaga & Penggalang SD yang Mandiri, Disiplin & Peduli',
    defaultSchoolName: 'Gugus Depan SD • Widodo Guru SD',
    primaryColor: '#78350F',
    secondaryColor: '#B91C1C',
    accentColor: '#F59E0B',
    cutoutShape: 'hexagon',
    ribbonStyle: 'classic-banner',
    patternType: 'pramuka-scout',
    description: 'Tema coklat Pramuka lengkap dengan aksen setangan leher Merah Putih.',
  },
  {
    id: 'lulus-naik-kelas',
    name: 'Tasyakuran Kelulusan & Naik Kelas',
    category: 'prestasi',
    badgeText: 'LULUS & NAIK KELAS!',
    defaultTopTitle: 'SELAMAT & SUKSES KELULUSAN SD',
    defaultSubtitle: 'Teruslah Belajar dan Kejar Cita-Citamu Setinggi Langit!',
    defaultSchoolName: 'Alumni Hebat • Widodo Guru SD',
    primaryColor: '#4338CA',
    secondaryColor: '#D92D20',
    accentColor: '#FBBF24',
    cutoutShape: 'circle',
    ribbonStyle: 'curved-ribbon',
    patternType: 'ceria-confetti',
    description: 'Bingkai perayaan kelulusan kelas 6 atau kenaikan kelas penuh konfeti warna-warni.',
  },
  {
    id: 'ramadhan-pesantren-kilat',
    name: 'Pesantren Kilat & Hari Besar Islam',
    category: 'kegiatan',
    badgeText: 'ANAK SHOLEH & SHOLEHAH',
    defaultTopTitle: 'SEMARAK PESANTREN KILAT & HARI RAYA',
    defaultSubtitle: 'Menumbuhkan Akhlak Mulia, Kejujuran, dan Semangat Berbagi',
    defaultSchoolName: 'Keluarga Besar Widodo Guru SD',
    primaryColor: '#15803D',
    secondaryColor: '#065F46',
    accentColor: '#F59E0B',
    cutoutShape: 'arch',
    ribbonStyle: 'academic-crest',
    patternType: 'islamic-arch',
    description: 'Kubah arsitektur hijau zamrud & emas untuk kegiatan keagamaan dan Ramadhan di SD.',
  },
];

export const STICKER_CATALOG: StickerCatalogItem[] = [
  {
    type: 'widodo-official',
    label: 'Lencana Widodo Guru SD',
    category: 'Identitas',
    defaultX: 915,
    defaultY: 165,
  },
  {
    type: 'tut-wuri',
    label: 'Simbol Pendidikan',
    category: 'Resmi',
    defaultX: 165,
    defaultY: 165,
  },
  {
    type: 'merah-putih',
    label: 'Pita Merah Putih',
    category: 'Nasional',
    defaultX: 170,
    defaultY: 710,
  },
  {
    type: 'juara-1',
    label: 'Medali Bintang Juara',
    category: 'Prestasi',
    defaultX: 910,
    defaultY: 700,
  },
  {
    type: 'buku-pensil',
    label: 'Buku & Pensil Ceria',
    category: 'Edukasi',
    defaultX: 175,
    defaultY: 690,
  },
  {
    type: 'piala-emas',
    label: 'Piala Prestasi SD',
    category: 'Prestasi',
    defaultX: 905,
    defaultY: 685,
  },
  {
    type: 'anak-hebat',
    label: 'Pin "Aku Anak Hebat"',
    category: 'Semangat',
    defaultX: 895,
    defaultY: 220,
  },
  {
    type: 'guru-inspiratif',
    label: 'Pin "Guru Inspiratif"',
    category: 'Guru',
    defaultX: 195,
    defaultY: 220,
  },
  {
    type: 'topi-wisuda',
    label: 'Topi Lulusan SD',
    category: 'Kelulusan',
    defaultX: 540,
    defaultY: 185,
  },
  {
    type: 'tunas-pramuka',
    label: 'Lencana Pramuka',
    category: 'Kegiatan',
    defaultX: 905,
    defaultY: 200,
  },
];

// Cheerful SVG Sample Portraits (Data URLs) so users can test the Twibbon right away
export const SAMPLE_PORTRAITS: {
  id: string;
  label: string;
  role: string;
  personName: string;
  dataUrl: string;
}[] = [
  {
    id: 'pak-widodo',
    label: 'Pak Widodo (Guru SD)',
    personName: 'Widodo, S.Pd.SD.',
    role: 'Guru Kelas & Kreator Edukasi',
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <defs>
          <linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#DBEAFE"/>
            <stop offset="100%" stop-color="#EFF6FF"/>
          </linearGradient>
        </defs>
        <rect width="800" height="800" fill="url(#bg1)"/>
        <!-- Classroom chalkboard hint in background -->
        <rect x="80" y="90" width="640" height="320" rx="20" fill="#065F46" stroke="#D97706" stroke-width="14" opacity="0.85"/>
        <text x="400" y="175" font-family="sans-serif" font-size="34" font-weight="bold" fill="#FEF3C7" text-anchor="middle" opacity="0.8">BELAJAR DENGAN GEMBIRA</text>
        <path d="M150 220 L650 220" stroke="#A7F3D0" stroke-width="3" stroke-dasharray="10,10" opacity="0.5"/>
        <!-- Shoulders / Teacher Batik & Khaki Uniform -->
        <path d="M160 800 C160 580 270 520 400 520 C530 520 640 580 640 800 Z" fill="#B45309"/>
        <!-- Inner Shirt & Tie -->
        <polygon points="340,520 460,520 400,680" fill="#FFFFFF"/>
        <polygon points="385,545 415,545 422,670 400,700 378,670" fill="#D92D20"/>
        <!-- Collar -->
        <polygon points="330,515 400,565 365,595 310,540" fill="#FDE68A"/>
        <polygon points="470,515 400,565 435,595 490,540" fill="#FDE68A"/>
        <!-- Name Tag on Chest -->
        <rect x="465" y="625" width="110" height="36" rx="8" fill="#1E293B" stroke="#F59E0B" stroke-width="3"/>
        <text x="520" y="649" font-family="sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF" text-anchor="middle">WIDODO</text>
        <!-- Neck -->
        <rect x="355" y="450" width="90" height="95" rx="30" fill="#F3C69F"/>
        <!-- Head -->
        <ellipse cx="400" cy="345" rx="125" ry="140" fill="#FAD2B0"/>
        <!-- Ears -->
        <circle cx="272" cy="355" r="26" fill="#F3C69F"/>
        <circle cx="528" cy="355" r="26" fill="#F3C69F"/>
        <!-- Peci / Hair neat teacher look -->
        <path d="M275 310 C270 215 320 175 400 175 C480 175 530 215 525 310 C505 265 465 245 400 245 C335 245 295 265 275 310 Z" fill="#1E293B"/>
        <!-- Glasses -->
        <rect x="308" y="310" width="76" height="52" rx="14" fill="none" stroke="#1E293B" stroke-width="8"/>
        <rect x="416" y="310" width="76" height="52" rx="14" fill="none" stroke="#1E293B" stroke-width="8"/>
        <line x1="384" y1="332" x2="416" y2="332" stroke="#1E293B" stroke-width="8"/>
        <!-- Eyes -->
        <circle cx="346" cy="336" r="10" fill="#1E293B"/>
        <circle cx="454" cy="336" r="10" fill="#1E293B"/>
        <circle cx="349" cy="333" r="3.5" fill="#FFFFFF"/>
        <circle cx="457" cy="333" r="3.5" fill="#FFFFFF"/>
        <!-- Eyebrows -->
        <path d="M318 295 Q346 283 374 295" fill="none" stroke="#1E293B" stroke-width="7" stroke-linecap="round"/>
        <path d="M426 295 Q454 283 482 295" fill="none" stroke="#1E293B" stroke-width="7" stroke-linecap="round"/>
        <!-- Nose -->
        <path d="M400 340 L392 382 L412 385" fill="none" stroke="#D99B66" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- Warm Smile -->
        <path d="M350 412 Q400 455 450 412" fill="#FFFFFF" stroke="#B45309" stroke-width="6" stroke-linecap="round"/>
        <path d="M352 414 Q400 458 448 414 Z" fill="#FFFFFF"/>
      </svg>
    `)}`,
  },
  {
    id: 'siswa-sd-merah-putih',
    label: 'Budi (Siswa Seragam SD)',
    personName: 'Ananda Budi Pratama',
    role: 'Siswa Kelas 1A • SD Negeri 01',
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <defs>
          <linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#FEF3C7"/>
            <stop offset="100%" stop-color="#FDE68A"/>
          </linearGradient>
        </defs>
        <rect width="800" height="800" fill="url(#bg2)"/>
        <circle cx="160" cy="180" r="45" fill="#F59E0B" opacity="0.25"/>
        <circle cx="660" cy="220" r="65" fill="#D92D20" opacity="0.15"/>
        <!-- White SD Uniform Shirt -->
        <path d="M175 800 C175 585 275 530 400 530 C525 530 625 585 625 800 Z" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="6"/>
        <!-- Red SD Tie & Emblem -->
        <polygon points="382,555 418,555 428,720 400,755 372,720" fill="#D92D20"/>
        <!-- Shirt Pocket with SD Badge -->
        <rect x="465" y="630" width="76" height="86" rx="10" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="4"/>
        <circle cx="503" cy="673" r="22" fill="#D92D20"/>
        <circle cx="503" cy="673" r="12" fill="#F59E0B"/>
        <!-- Collar -->
        <polygon points="325,525 400,570 360,605 305,550" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="4"/>
        <polygon points="475,525 400,570 440,605 495,550" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="4"/>
        <!-- Neck -->
        <rect x="360" y="465" width="80" height="85" rx="25" fill="#F5CBA7"/>
        <!-- Head -->
        <ellipse cx="400" cy="360" rx="120" ry="130" fill="#FAD7B8"/>
        <!-- Ears -->
        <circle cx="278" cy="370" r="24" fill="#F5CBA7"/>
        <circle cx="522" cy="370" r="24" fill="#F5CBA7"/>
        <!-- Red-White SD Cap (Topi SD Merah Putih) -->
        <path d="M272 305 C272 200 330 165 400 165 C470 165 528 200 528 305 Z" fill="#D92D20"/>
        <path d="M265 292 Q400 265 535 292 L545 318 Q400 292 255 318 Z" fill="#FFFFFF"/>
        <circle cx="400" cy="232" r="24" fill="#F59E0B"/>
        <!-- Cheerful Eyes -->
        <circle cx="350" cy="355" r="13" fill="#1E293B"/>
        <circle cx="450" cy="355" r="13" fill="#1E293B"/>
        <circle cx="354" cy="350" r="4.5" fill="#FFFFFF"/>
        <circle cx="454" cy="350" r="4.5" fill="#FFFFFF"/>
        <!-- Rosy Cheeks -->
        <ellipse cx="320" cy="390" rx="18" ry="10" fill="#F87171" opacity="0.45"/>
        <ellipse cx="480" cy="390" rx="18" ry="10" fill="#F87171" opacity="0.45"/>
        <!-- Big Happy Smile -->
        <path d="M352 410 Q400 460 448 410 Z" fill="#FFFFFF" stroke="#1E293B" stroke-width="6" stroke-linejoin="round"/>
      </svg>
    `)}`,
  },
  {
    id: 'siswi-hijab-sd',
    label: 'Siti (Siswi Berprestasi)',
    personName: 'Siti Aisyah Putri',
    role: 'Juara 1 Lomba Cerdas Cermat • Kelas 5B',
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <defs>
          <linearGradient id="bg3" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#DCFCE7"/>
            <stop offset="100%" stop-color="#E0F2FE"/>
          </linearGradient>
        </defs>
        <rect width="800" height="800" fill="url(#bg3)"/>
        <!-- Red SD Uniform Skirt/Vest hint & White Hijab -->
        <path d="M165 800 C165 570 265 520 400 520 C535 520 635 570 635 800 Z" fill="#D92D20"/>
        <!-- White Hijab drape -->
        <path d="M225 350 C225 200 300 165 400 165 C500 165 575 200 575 350 C575 495 545 640 400 660 C255 640 225 495 225 350 Z" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="6"/>
        <!-- Inner Hijab cap -->
        <path d="M285 285 Q400 245 515 285 Q400 210 285 285 Z" fill="#F1F5F9"/>
        <!-- Face -->
        <ellipse cx="400" cy="365" rx="108" ry="118" fill="#FAD7B8"/>
        <!-- Eyes -->
        <circle cx="354" cy="355" r="12" fill="#1E293B"/>
        <circle cx="446" cy="355" r="12" fill="#1E293B"/>
        <circle cx="358" cy="351" r="4" fill="#FFFFFF"/>
        <circle cx="450" cy="351" r="4" fill="#FFFFFF"/>
        <!-- Eyebrows -->
        <path d="M332 325 Q354 315 376 325" fill="none" stroke="#1E293B" stroke-width="5" stroke-linecap="round"/>
        <path d="M424 325 Q446 315 468 325" fill="none" stroke="#1E293B" stroke-width="5" stroke-linecap="round"/>
        <!-- Cheeks -->
        <ellipse cx="326" cy="388" rx="16" ry="9" fill="#FB7185" opacity="0.45"/>
        <ellipse cx="474" cy="388" rx="16" ry="9" fill="#FB7185" opacity="0.45"/>
        <!-- Smile -->
        <path d="M362 412 Q400 448 438 412" fill="none" stroke="#be123c" stroke-width="6" stroke-linecap="round"/>
        <!-- Gold Medal Ribbon -->
        <path d="M330 560 L400 680 L470 560" fill="none" stroke="#D92D20" stroke-width="20" stroke-linecap="round"/>
        <circle cx="400" cy="695" r="38" fill="#F59E0B" stroke="#FEF08A" stroke-width="5"/>
        <text x="400" y="707" font-family="sans-serif" font-size="32" font-weight="bold" fill="#FFFFFF" text-anchor="middle">★</text>
      </svg>
    `)}`,
  },
];
