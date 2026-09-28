import React, { useState } from 'react';
import {
  Check,
  Copy,
  Download,
  MessageCircle,
  Sparkles,
  X,
  Share2,
} from 'lucide-react';
import { TextOverlayState, TwibbonTemplate } from '../types/twibbon';

interface ShareCaptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewDataUrl: string | null;
  template: TwibbonTemplate;
  textState: TextOverlayState;
  onDownloadPng: (highRes?: boolean) => void;
}

type CaptionStyle = 'formal' | 'ceria' | 'widodo';

export const ShareCaptionModal: React.FC<ShareCaptionModalProps> = ({
  isOpen,
  onClose,
  previewDataUrl,
  template,
  textState,
  onDownloadPng,
}) => {
  const [captionStyle, setCaptionStyle] = useState<CaptionStyle>('formal');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const personName = textState.personName.trim() || 'Warga Sekolah SD';
  const roleOrClass = textState.roleOrClass.trim() || 'Keluarga Besar Sekolah Dasar';
  const schoolName = textState.schoolName.trim() || template.defaultSchoolName;
  const topTitle = textState.topTitle.trim() || template.defaultTopTitle;
  const subtitle = textState.subtitle.trim() || template.defaultSubtitle;

  const generateCaption = (style: CaptionStyle): string => {
    if (style === 'formal') {
      return `✨ *${topTitle}* ✨\n\nAssalamu'alaikum Wr. Wb. / Salam Sejahtera,\n\nSaya *${personName}* (${roleOrClass}) dari *${schoolName}* siap menyemarakkan dan mendukung penuh:\n📌 *"${topTitle}"*\n_"${subtitle}"_\n\nMari bersama-sama mewujudkan lingkungan Sekolah Dasar yang cerdas, berkarakter mulia, dan penuh semangat belajar!\n\n🎨 Dibuat dengan Studio Twibbon *Widodo Guru SD*\n#WidodoGuruSD #SekolahDasar #PendidikanIndonesia #AnakSDHebat #MerdekaBelajar`;
    }
    if (style === 'ceria') {
      return `🎒🌟 *${template.badgeText}* 🌟🎒\n\nHalo teman-teman, Bapak/Ibu Guru, dan Ayah/Bunda! 👋\nKenalin, aku *${personName}* (${roleOrClass}) dari *${schoolName}*! 🏫🇮🇩\n\nAku bangga ikut meramaikan *${topTitle}*!\n"${subtitle}" 🚀📚\n\nYuk ikut pasang foto terbaikmu di Twibbon *Widodo Guru SD* dan bagikan semangat positif ke grup kelas kita! 🎉✨\n\n#WidodoGuruSD #BintangKelasSD #SDNegeri #SemangatSekolah #GenerasiEmas`;
    }
    return `📚 *PESAN EDUKASI • WIDODO GURU SD* 📚\n\n"Setiap anak Sekolah Dasar adalah bintang yang memiliki cahayanya masing-masing. Tugas kita sebagai pendidik dan orang tua adalah menyalakan semangat belajar mereka."\n\nSaya *${personName}* (${roleOrClass} — *${schoolName}*) turut menyukseskan:\n🏅 *${topTitle}*\n\nSalam hangat pendidikan Indonesia,\n*Widodo Guru SD — Sahabat Kreatif Guru & Siswa SD*\n#WidodoGuruSD #GuruSDIndonesia #TutWuriHandayani #KaryaGuruSD`;
  };

  const activeCaption = generateCaption(captionStyle);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeCaption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback copy
      const textarea = document.createElement('textarea');
      textarea.value = activeCaption;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(activeCaption);
    window.open(`https://wa.me/?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fadeIn">
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-[#FFFDF9] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D92D20]/10 text-[#D92D20]">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900">
                Bagikan Twibbon & Salin Caption WA
              </h3>
              <p className="text-xs text-slate-500">
                Kreasi Resmi Studio Pendidikan • Widodo Guru SD
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 gap-6 overflow-y-auto p-6 md:grid-cols-12">
          {/* Left: Preview & Download options */}
          <div className="flex flex-col items-center md:col-span-5">
            <div className="aspect-square w-full max-w-[260px] overflow-hidden rounded-2xl border-2 border-slate-200 bg-checkerboard shadow-md">
              {previewDataUrl ? (
                <img
                  src={previewDataUrl}
                  alt="Pratinjau Twibbon Widodo Guru SD"
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-slate-400">
                  Memuat pratinjau...
                </div>
              )}
            </div>

            <div className="mt-4 flex w-full flex-col gap-2">
              <button
                type="button"
                onClick={() => onDownloadPng(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D92D20] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#B91C1C] cursor-pointer"
              >
                <Download className="h-4 w-4" />
                Unduh PNG Standar (1080×1080)
              </button>
              <button
                type="button"
                onClick={() => onDownloadPng(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#F59E0B]" />
                Unduh Cetak Ultra HD (2160×2160)
              </button>
            </div>
          </div>

          {/* Right: Caption Generator */}
          <div className="flex flex-col md:col-span-7">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Pilih Gaya Caption Media Sosial / WA:
              </span>
            </div>

            <div className="mb-3 grid grid-cols-3 gap-2">
              {[
                { id: 'formal', label: 'Formal Sekolah' },
                { id: 'ceria', label: 'Ceria & Siswa' },
                { id: 'widodo', label: 'Khas Pak Widodo' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCaptionStyle(tab.id as CaptionStyle)}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold transition cursor-pointer ${
                    captionStyle === tab.id
                      ? 'border-[#D92D20] bg-[#FFF5F5] text-[#D92D20]'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative flex-1">
              <textarea
                readOnly
                value={activeCaption}
                rows={9}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 text-xs leading-relaxed text-slate-700 focus:outline-none"
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleCopy}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition cursor-pointer ${
                  copied
                    ? 'bg-[#16A34A] text-white'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Caption Berhasil Disalin!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Salin Teks Caption
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#16A34A] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 cursor-pointer"
              >
                <MessageCircle className="h-4 w-4" />
                Kirim ke WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
