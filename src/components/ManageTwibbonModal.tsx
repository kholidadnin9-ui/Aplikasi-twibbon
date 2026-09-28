import React, { useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  FolderOpen,
  ImageUp,
  Layers,
  Pencil,
  Plus,
  Share2,
  Sparkles,
  Trash2,
  Upload,
  Wand2,
  X,
} from 'lucide-react';
import { CustomTwibbonFrame, FrameCategory } from '../types/twibbon';
import { fileToImage, normalizeFrameToDataUrl } from '../utils/imageProcessing';

type ManageView = 'list' | 'form';

interface FrameFormState {
  id: string | null;
  name: string;
  campaignTitle: string;
  campaignSubtitle: string;
  category: Exclude<FrameCategory, 'semua'>;
  organizerName: string;
  hashtags: string;
  dataUrl: string;
  showTextByDefault: boolean;
}

const EMPTY_FORM: FrameFormState = {
  id: null,
  name: '',
  campaignTitle: '',
  campaignSubtitle: '',
  category: 'kegiatan',
  organizerName: 'Widodo Guru SD',
  hashtags: '#WidodoGuruSD #Twibbon #SekolahDasar',
  dataUrl: '',
  showTextByDefault: false,
};

const CATEGORY_OPTIONS: { id: Exclude<FrameCategory, 'semua'>; label: string }[] = [
  { id: 'ppdb', label: 'PPDB / MPLS' },
  { id: 'nasional', label: 'Hari Guru & Nasional' },
  { id: 'prestasi', label: 'Prestasi & Kelulusan' },
  { id: 'kegiatan', label: 'Kegiatan Kelas' },
];

interface ManageTwibbonModalProps {
  isOpen: boolean;
  onClose: () => void;
  frames: CustomTwibbonFrame[];
  activeCustomFrameId: string | null;
  onCreate: (data: Omit<CustomTwibbonFrame, 'id' | 'createdAt' | 'updatedAt'>) => boolean;
  onUpdate: (
    id: string,
    updates: Partial<Omit<CustomTwibbonFrame, 'id' | 'createdAt'>>
  ) => boolean;
  onDelete: (id: string) => void;
  onUse: (frame: CustomTwibbonFrame) => void;
  onShareCampaign: (frame: CustomTwibbonFrame) => void;
  onNotify: (msg: string) => void;
}

export const ManageTwibbonModal: React.FC<ManageTwibbonModalProps> = ({
  isOpen,
  onClose,
  frames,
  activeCustomFrameId,
  onCreate,
  onUpdate,
  onDelete,
  onUse,
  onShareCampaign,
  onNotify,
}) => {
  const [view, setView] = useState<ManageView>('list');
  const [form, setForm] = useState<FrameFormState>(EMPTY_FORM);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isEditing = form.id !== null;

  const sortedFrames = useMemo(
    () => [...frames].sort((a, b) => b.updatedAt - a.updatedAt),
    [frames]
  );

  if (!isOpen) return null;

  const openCreateForm = () => {
    setForm(EMPTY_FORM);
    setView('form');
  };

  const openEditForm = (frame: CustomTwibbonFrame) => {
    setForm({
      id: frame.id,
      name: frame.name,
      campaignTitle: frame.campaignTitle,
      campaignSubtitle: frame.campaignSubtitle,
      category: frame.category,
      organizerName: frame.organizerName,
      hashtags: frame.hashtags,
      dataUrl: frame.dataUrl,
      showTextByDefault: frame.showTextByDefault,
    });
    setView('form');
  };

  const handlePickFile = async (file: File) => {
    if (!file.type.includes('png')) {
      onNotify('Mohon unggah file dengan format PNG transparan (.png)');
      return;
    }
    setIsProcessing(true);
    try {
      const img = await fileToImage(file);
      const normalized = normalizeFrameToDataUrl(img, 1080);
      setForm((prev) => ({
        ...prev,
        dataUrl: normalized,
        name: prev.name || file.name.replace(/\.png$/i, ''),
      }));
    } catch {
      onNotify('Gagal memproses gambar. Coba file PNG lain.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveForm = () => {
    if (!form.dataUrl) {
      onNotify('Silakan unggah gambar bingkai PNG terlebih dahulu.');
      return;
    }
    if (!form.name.trim()) {
      onNotify('Beri nama untuk Twibbon Anda.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      campaignTitle: form.campaignTitle.trim(),
      campaignSubtitle: form.campaignSubtitle.trim(),
      category: form.category,
      organizerName: form.organizerName.trim() || 'Widodo Guru SD',
      hashtags: form.hashtags.trim(),
      dataUrl: form.dataUrl,
      showTextByDefault: form.showTextByDefault,
    };

    let ok = false;
    if (isEditing && form.id) {
      ok = onUpdate(form.id, payload);
      if (ok) onNotify(`Twibbon "${payload.name}" berhasil diperbarui!`);
    } else {
      ok = onCreate(payload);
      if (ok) onNotify(`Twibbon "${payload.name}" berhasil disimpan ke koleksi!`);
    }

    if (ok) {
      setForm(EMPTY_FORM);
      setView('list');
    }
  };

  const handleConfirmDelete = (id: string) => {
    const frame = frames.find((f) => f.id === id);
    onDelete(id);
    setConfirmDeleteId(null);
    onNotify(`Twibbon "${frame?.name ?? ''}" telah dihapus.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-[#FFFDF9] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            {view === 'form' ? (
              <button
                type="button"
                onClick={() => {
                  setView('list');
                  setForm(EMPTY_FORM);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 cursor-pointer"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D92D20]/10 text-[#D92D20]">
                <Layers className="h-5 w-5" />
              </div>
            )}
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900">
                {view === 'form'
                  ? isEditing
                    ? 'Edit Twibbon Kustom'
                    : 'Buat Twibbon Baru'
                  : 'Kelola Twibbon Saya'}
              </h3>
              <p className="text-xs text-slate-500">
                {view === 'form'
                  ? 'Unggah bingkai PNG transparan & lengkapi detail kampanye'
                  : 'Tambah, edit, hapus & bagikan bingkai kampanye Anda'}
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

        {/* ================= LIST VIEW ================= */}
        {view === 'list' && (
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Action bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-3.5">
              <div className="flex items-center gap-2 text-sm">
                <FolderOpen className="h-4 w-4 text-[#1D4ED8]" />
                <span className="font-semibold text-slate-700">
                  {frames.length} Twibbon Tersimpan
                </span>
                <span className="text-xs text-slate-400">
                  (tersimpan di perangkat ini)
                </span>
              </div>
              <button
                type="button"
                onClick={openCreateForm}
                className="inline-flex items-center gap-2 rounded-xl bg-[#D92D20] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#B91C1C] cursor-pointer"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
                Buat Twibbon Baru
              </button>
            </div>

            {/* Grid */}
            <div className="custom-scrollbar flex-1 overflow-y-auto p-6">
              {sortedFrames.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-[#D92D20]">
                    <ImageUp className="h-8 w-8" />
                  </div>
                  <h4 className="font-display text-lg font-bold text-slate-800">
                    Belum Ada Twibbon Kustom
                  </h4>
                  <p className="mt-1 max-w-sm text-sm text-slate-500">
                    Unggah desain bingkai PNG transparan Anda sendiri untuk membuat
                    kampanye Twibbon sekolah, lomba, atau acara komunitas.
                  </p>
                  <button
                    type="button"
                    onClick={openCreateForm}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#D92D20] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#B91C1C] cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    Buat Twibbon Pertama Saya
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {sortedFrames.map((frame) => (
                    <div
                      key={frame.id}
                      className={`group relative flex flex-col overflow-hidden rounded-2xl border-2 bg-white transition ${
                        activeCustomFrameId === frame.id
                          ? 'border-[#D92D20] ring-2 ring-[#D92D20]/20'
                          : 'border-slate-200 hover:border-[#F59E0B]'
                      }`}
                    >
                      <div className="relative aspect-square w-full bg-checkerboard">
                        <img
                          src={frame.dataUrl}
                          alt={frame.name}
                          className="h-full w-full object-contain"
                        />
                        {activeCustomFrameId === frame.id && (
                          <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-[#D92D20] px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                            Aktif
                          </span>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col p-3">
                        <span className="inline-block w-fit rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          {CATEGORY_OPTIONS.find((c) => c.id === frame.category)?.label ??
                            frame.category}
                        </span>
                        <h5 className="mt-1.5 line-clamp-1 font-display text-sm font-bold text-slate-800">
                          {frame.name}
                        </h5>
                        <p className="line-clamp-1 text-[11px] text-slate-500">
                          {frame.campaignTitle || 'Tanpa judul kampanye'}
                        </p>

                        {/* Primary use button */}
                        <button
                          type="button"
                          onClick={() => onUse(frame)}
                          className="mt-2.5 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#1D4ED8] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-blue-800 cursor-pointer"
                        >
                          <Wand2 className="h-3.5 w-3.5" />
                          Pakai Twibbon Ini
                        </button>

                        {/* Secondary actions */}
                        <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                          <button
                            type="button"
                            onClick={() => onShareCampaign(frame)}
                            className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 py-1.5 text-[11px] font-semibold text-[#15803D] transition hover:bg-emerald-50 cursor-pointer"
                            title="Bagikan Kampanye"
                          >
                            <Share2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditForm(frame)}
                            className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-50 cursor-pointer"
                            title="Edit Twibbon"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(frame.id)}
                            className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 py-1.5 text-[11px] font-semibold text-red-600 transition hover:bg-red-50 cursor-pointer"
                            title="Hapus Twibbon"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Delete confirmation overlay */}
                      {confirmDeleteId === frame.id && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/95 p-4 text-center backdrop-blur-xs">
                          <AlertTriangle className="h-8 w-8 text-red-500" />
                          <p className="text-xs font-semibold text-slate-700">
                            Hapus Twibbon "{frame.name}" secara permanen?
                          </p>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                            >
                              Batal
                            </button>
                            <button
                              type="button"
                              onClick={() => handleConfirmDelete(frame.id)}
                              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 cursor-pointer"
                            >
                              Ya, Hapus
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= FORM VIEW (ADD / EDIT) ================= */}
        {view === 'form' && (
          <div className="custom-scrollbar grid flex-1 grid-cols-1 gap-6 overflow-y-auto p-6 md:grid-cols-12">
            {/* Left: Upload / Preview */}
            <div className="flex flex-col md:col-span-5">
              <label className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                Gambar Bingkai (PNG Transparan)
              </label>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) handlePickFile(file);
                }}
                onClick={() => fileInputRef.current?.click()}
                className="relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-checkerboard transition hover:border-[#D92D20]"
              >
                {form.dataUrl ? (
                  <img
                    src={form.dataUrl}
                    alt="Pratinjau bingkai"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center px-6 text-center">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D92D20]/10 text-[#D92D20]">
                      <Upload className="h-7 w-7" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">
                      {isProcessing ? 'Memproses...' : 'Klik atau Seret File PNG'}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Gunakan PNG transparan 1080×1080 px dengan lubang foto di tengah
                    </p>
                  </div>
                )}
                {form.dataUrl && (
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-slate-900/75 px-3 py-1 text-[11px] font-semibold text-white">
                    Klik untuk ganti gambar
                  </span>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handlePickFile(file);
                  e.target.value = '';
                }}
              />
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-[11px] leading-relaxed text-amber-900">
                <span className="font-bold">Tips:</span> Buat bagian tengah gambar
                (tempat wajah) menjadi transparan agar foto pengguna terlihat. Gambar
                otomatis disesuaikan ke ukuran 1080×1080 px.
              </div>
            </div>

            {/* Right: Metadata Form */}
            <div className="flex flex-col gap-4 md:col-span-7">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Nama Twibbon <span className="text-[#D92D20]">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Contoh: HUT Sekolah ke-50"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#D92D20] focus:outline-none focus:ring-2 focus:ring-[#D92D20]/15"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Kategori Kampanye
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, category: cat.id }))}
                      className={`rounded-xl border px-3 py-2 text-xs font-semibold transition cursor-pointer ${
                        form.category === cat.id
                          ? 'border-[#D92D20] bg-[#FFF5F5] text-[#D92D20]'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Judul Kampanye
                </label>
                <input
                  type="text"
                  value={form.campaignTitle}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, campaignTitle: e.target.value }))
                  }
                  placeholder="Contoh: Ayo Sukseskan HUT Sekolah!"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-[#D92D20] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Slogan / Ajakan Kampanye
                </label>
                <input
                  type="text"
                  value={form.campaignSubtitle}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, campaignSubtitle: e.target.value }))
                  }
                  placeholder="Contoh: Pasang fotomu & bagikan semangatnya!"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-[#D92D20] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Penyelenggara
                  </label>
                  <input
                    type="text"
                    value={form.organizerName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, organizerName: e.target.value }))
                    }
                    placeholder="Nama sekolah / panitia"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-[#D92D20] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Tagar (Hashtag)
                  </label>
                  <input
                    type="text"
                    value={form.hashtags}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, hashtags: e.target.value }))
                    }
                    placeholder="#Twibbon #Sekolah"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-[#D92D20] focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.showTextByDefault}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, showTextByDefault: e.target.checked }))
                  }
                  className="h-4 w-4 rounded accent-[#D92D20]"
                />
                <span>
                  Tampilkan juga teks & pita nama otomatis Widodo Guru SD di atas
                  bingkai ini
                </span>
              </label>

              <div className="mt-auto flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setView('list');
                    setForm(EMPTY_FORM);
                  }}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveForm}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#D92D20] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#B91C1C] cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  {isEditing ? 'Simpan Perubahan' : 'Simpan Twibbon'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
