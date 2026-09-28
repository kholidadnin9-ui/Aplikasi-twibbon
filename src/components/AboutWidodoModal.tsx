import React from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Download,
  HeartHandshake,
  ImagePlus,
  Sparkles,
  X,
} from 'lucide-react';

interface AboutWidodoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutWidodoModal: React.FC<AboutWidodoModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-[#FFFDF9] shadow-2xl">
        {/* Top Banner */}
        <div className="relative bg-gradient-to-r from-[#D92D20] via-[#B91C1C] to-[#1E3A8A] px-6 py-6 text-white">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 rounded-xl bg-white/15 p-2 text-white transition hover:bg-white/25 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-[#F59E0B] bg-white text-[#D92D20] shadow-lg">
              <BookOpen className="h-8 w-8 stroke-[2.5]" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F59E0B] px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-950">
                <Sparkles className="h-3 w-3" />
                Platform Edukasi Kreatif SD
              </span>
              <h2 className="mt-1 font-display text-2xl font-bold tracking-tight">
                Widodo Guru SD — Studio Twibbon
              </h2>
              <p className="text-xs text-red-100">
                Sahabat Digital Guru, Siswa, & Orang Tua Sekolah Dasar Indonesia
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 overflow-y-auto p-6">
          {/* Mission Card */}
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4">
            <div className="flex items-start gap-3">
              <HeartHandshake className="mt-0.5 h-6 w-6 shrink-0 text-[#D97706]" />
              <div>
                <h4 className="font-display text-sm font-bold text-slate-900">
                  Tentang Inisiatif Widodo Guru SD
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  <strong>Widodo Guru SD</strong> hadir untuk memudahkan Bapak/Ibu Guru SD,
                  siswa-siswi, serta paguyuban wali murid dalam membuat bingkai kampanye sekolah
                  (PPDB, MPLS, Hari Guru Nasional, Apresiasi Bintang Kelas, hingga Kegiatan Pramuka)
                  secara <strong>cepat, tajam (Full HD), bebas iklan mengganggu, dan langsung dari browser</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* 3-Step Guide */}
          <div>
            <h4 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-slate-500">
              3 Langkah Mudah Membuat Twibbon:
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-[#D92D20]">
                  <Award className="h-5 w-5" />
                </div>
                <div className="font-display text-sm font-bold text-slate-800">
                  1. Pilih Bingkai SD
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Pilih dari 8 tema resmi Widodo Guru SD atau unggah bingkai PNG transparan milik sekolah Anda sendiri.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#1D4ED8]">
                  <ImagePlus className="h-5 w-5" />
                </div>
                <div className="font-display text-sm font-bold text-slate-800">
                  2. Pasang Foto & Nama
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Unggah foto atau gunakan kamera selfie, geser/perbesar langsung di kanvas, lalu ketik Nama, Kelas, dan Sekolah.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#16A34A]">
                  <Download className="h-5 w-5" />
                </div>
                <div className="font-display text-sm font-bold text-slate-800">
                  3. Unduh & Bagikan
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Unduh hasil PNG beresolusi tinggi (1080×1080 px) dan salin teks caption otomatis untuk grup WhatsApp kelas!
                </p>
              </div>
            </div>
          </div>

          {/* Key Features List */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h4 className="mb-2.5 font-display text-sm font-bold text-slate-800">
              Keunggulan Studio Twibbon Widodo Guru SD:
            </h4>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {[
                'Privasi Aman 100%: Foto diproses langsung di perangkat Anda',
                'Pita Nama Otomatis: Ukuran huruf menyesuaikan panjang nama',
                '10 Stiker Edukasi SD yang bisa digeser & diatur ukurannya',
                'Mendukung Unggah Bingkai PNG Transparan Kustom',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#16A34A]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-3.5">
          <span className="text-xs font-medium text-slate-500">
            © Studio Edukasi Widodo Guru SD • Merdeka Belajar
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#D92D20] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#B91C1C] cursor-pointer"
          >
            Mulai Berkarya Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};
