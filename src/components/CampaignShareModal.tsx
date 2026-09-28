import React, { useState } from 'react';
import {
  Check,
  Copy,
  Download,
  Megaphone,
  MessageCircle,
  Send,
  X,
} from 'lucide-react';
import { CustomTwibbonFrame } from '../types/twibbon';

interface CampaignShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  frame: CustomTwibbonFrame | null;
  onNotify: (msg: string) => void;
}

export const CampaignShareModal: React.FC<CampaignShareModalProps> = ({
  isOpen,
  onClose,
  frame,
  onNotify,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !frame) return null;

  const title = frame.campaignTitle.trim() || frame.name;
  const subtitle = frame.campaignSubtitle.trim() || 'Yuk ikut ramaikan kampanye ini!';
  const organizer = frame.organizerName.trim() || 'Widodo Guru SD';
  const tags = frame.hashtags.trim() || '#WidodoGuruSD #Twibbon';

  const invitationText = `📣 *AJAKAN PASANG TWIBBON* 📣

*${title}*
_"${subtitle}"_

Halo Bapak/Ibu, Ananda, & Sahabat semua! 👋
Yuk ikut menyemarakkan kampanye *"${frame.name}"* dari *${organizer}* dengan memasang Twibbon berikut di foto profil media sosialmu! 🎉

🖼️ *Cara Ikutan:*
1. Simpan / unduh file bingkai PNG yang dibagikan
2. Buka Studio Twibbon *Widodo Guru SD*
3. Pilih menu "Kelola Twibbon Saya" ➜ "Buat Twibbon Baru", lalu unggah bingkainya
4. Pasang fotomu, atur posisi, unduh & bagikan!

Ayo tunjukkan dukunganmu! 💪✨
${tags}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(invitationText);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = invitationText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    onNotify('Teks ajakan kampanye berhasil disalin!');
    setTimeout(() => setCopied(false), 2500);
  };

  const dataUrlToFile = async (dataUrl: string, filename: string): Promise<File> => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: 'image/png' });
  };

  const cleanFileName = `Twibbon-${frame.name.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-')}.png`;

  const handleDownloadFrame = () => {
    const link = document.createElement('a');
    link.download = cleanFileName;
    link.href = frame.dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onNotify('File bingkai PNG kampanye berhasil diunduh untuk dibagikan!');
  };

  const handleNativeShare = async () => {
    try {
      const file = await dataUrlToFile(frame.dataUrl, cleanFileName);
      const nav = navigator as Navigator & {
        canShare?: (data?: ShareData) => boolean;
      };
      if (nav.canShare && nav.canShare({ files: [file] })) {
        await nav.share({
          files: [file],
          title: title,
          text: invitationText,
        });
        onNotify('Kampanye dibagikan!');
      } else if (navigator.share) {
        await navigator.share({ title, text: invitationText });
        onNotify('Ajakan kampanye dibagikan!');
      } else {
        handleDownloadFrame();
      }
    } catch {
      // User cancelled share or unsupported — no-op
    }
  };

  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(invitationText)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-[#FFFDF9] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-[#15803D] to-[#0F766E] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <Megaphone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold">Bagikan Kampanye Twibbon</h3>
              <p className="text-xs text-emerald-50">
                Ajak banyak orang memasang bingkai buatanmu!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-white/80 transition hover:bg-white/15 hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 gap-6 overflow-y-auto p-6 md:grid-cols-12">
          {/* Left: Frame preview + distribute buttons */}
          <div className="flex flex-col md:col-span-5">
            <div className="aspect-square w-full overflow-hidden rounded-2xl border-2 border-slate-200 bg-checkerboard shadow-md">
              <img
                src={frame.dataUrl}
                alt={frame.name}
                className="h-full w-full object-contain"
              />
            </div>
            <h4 className="mt-3 font-display text-sm font-bold text-slate-800">
              {frame.name}
            </h4>
            <p className="text-xs text-slate-500">Penyelenggara: {organizer}</p>

            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleNativeShare}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1D4ED8] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                Bagikan Bingkai + Ajakan
              </button>
              <button
                type="button"
                onClick={handleDownloadFrame}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
              >
                <Download className="h-4 w-4 text-[#D92D20]" />
                Unduh File Bingkai PNG
              </button>
            </div>
          </div>

          {/* Right: Invitation caption */}
          <div className="flex flex-col md:col-span-7">
            <span className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              Teks Ajakan Kampanye (siap tempel di WA / IG / FB):
            </span>
            <textarea
              readOnly
              value={invitationText}
              rows={12}
              className="w-full flex-1 rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 text-xs leading-relaxed text-slate-700 focus:outline-none"
            />

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
                    <Check className="h-4 w-4" /> Tersalin!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> Salin Ajakan
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleWhatsApp}
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
