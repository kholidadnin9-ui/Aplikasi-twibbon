import React, { useCallback, useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Camera,
  Check,
  Download,
  FlipHorizontal,
  Frame,
  Grid,
  HelpCircle,
  ImagePlus,
  Move,
  Palette,
  RefreshCw,
  RotateCcw,
  RotateCw,
  Share2,
  Sliders,
  Sparkles,
  Sticker,
  Trash2,
  Type,
  Upload,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  FRAME_CATEGORIES,
  SAMPLE_PORTRAITS,
  STICKER_CATALOG,
  TWIBBON_TEMPLATES,
} from './data/twibbonData';
import {
  CustomTwibbonFrame,
  CutoutShape,
  FilterPreset,
  FrameCategory,
  PhotoState,
  PlacedSticker,
  RibbonStyle,
  StickerCatalogItem,
  TextOverlayState,
  TwibbonTemplate,
} from './types/twibbon';
import { renderTwibbonCanvas } from './utils/canvasRenderer';
import { FrameThumbnail } from './components/FrameThumbnail';
import { StickerPreviewIcon } from './components/StickerPreviewIcon';
import { ShareCaptionModal } from './components/ShareCaptionModal';
import { CameraModal } from './components/CameraModal';
import { AboutWidodoModal } from './components/AboutWidodoModal';
import { ManageTwibbonModal } from './components/ManageTwibbonModal';
import { CampaignShareModal } from './components/CampaignShareModal';
import {
  addCustomFrame,
  deleteCustomFrame,
  estimateStorageUsageMB,
  loadCustomFrames,
  StorageQuotaError,
  updateCustomFrame,
} from './utils/customFrameStorage';
import { normalizeFrameToDataUrl } from './utils/imageProcessing';
import { Layers, FolderPlus } from 'lucide-react';

type InspectorTab = 'bingkai' | 'foto' | 'teks' | 'stiker';

export function App() {
  // Active Template & Category
  const [selectedCategory, setSelectedCategory] = useState<FrameCategory>('semua');
  const [activeTemplate, setActiveTemplate] = useState<TwibbonTemplate>(TWIBBON_TEMPLATES[0]);
  const [activeTab, setActiveTab] = useState<InspectorTab>('bingkai');

  // Loaded HTMLImageElements for Canvas
  const [photoImg, setPhotoImg] = useState<HTMLImageElement | null>(null);
  const [customFrameImg, setCustomFrameImg] = useState<HTMLImageElement | null>(null);
  const [customFrameName, setCustomFrameName] = useState<string | null>(null);

  // Photo Adjustment State
  const [photoState, setPhotoState] = useState<PhotoState>({
    src: SAMPLE_PORTRAITS[0].dataUrl,
    label: SAMPLE_PORTRAITS[0].label,
    scale: 1.02,
    rotation: 0,
    x: 0,
    y: 12,
    flipH: false,
    brightness: 100,
    contrast: 100,
    saturation: 100,
    filterPreset: 'normal',
    bgColor: '#EFF6FF',
  });

  // Text & Identity Banner State
  const [textState, setTextState] = useState<TextOverlayState>({
    topTitle: TWIBBON_TEMPLATES[0].defaultTopTitle,
    subtitle: TWIBBON_TEMPLATES[0].defaultSubtitle,
    personName: SAMPLE_PORTRAITS[0].personName,
    roleOrClass: SAMPLE_PORTRAITS[0].role,
    schoolName: TWIBBON_TEMPLATES[0].defaultSchoolName,
    fontFamily: 'Fredoka',
    primaryColorOverride: null,
    secondaryColorOverride: null,
    accentColorOverride: null,
    cutoutShapeOverride: null,
    ribbonStyleOverride: null,
    showWidodoWatermark: true,
    showTopHeader: true,
    showBottomBanner: true,
  });

  // Placed Educational Stickers
  const [stickers, setStickers] = useState<PlacedSticker[]>([
    {
      id: 'initial-widodo-badge',
      type: 'widodo-official',
      label: 'Lencana Widodo Guru SD',
      x: 912,
      y: 215,
      scale: 0.92,
      rotation: 6,
    },
    {
      id: 'initial-buku-pensil',
      type: 'buku-pensil',
      label: 'Buku & Pensil Ceria',
      x: 168,
      y: 695,
      scale: 0.95,
      rotation: -6,
    },
  ]);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);

  // Canvas & Interaction Refs
  const mainCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const customFrameInputRef = useRef<HTMLInputElement | null>(null);

  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [isDraggingCanvas, setIsDraggingCanvas] = useState<boolean>(false);
  const [dragTarget, setDragTarget] = useState<'photo' | 'sticker'>('photo');
  const dragStartRef = useRef<{
    clientX: number;
    clientY: number;
    startX: number;
    startY: number;
  }>({ clientX: 0, clientY: 0, startX: 0, startY: 0 });
  const [isDragOverFile, setIsDragOverFile] = useState<boolean>(false);

  // Custom Twibbon Library (CRUD) State
  const [customFrames, setCustomFrames] = useState<CustomTwibbonFrame[]>([]);
  const [activeCustomFrameId, setActiveCustomFrameId] = useState<string | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState<boolean>(false);
  const [campaignShareFrame, setCampaignShareFrame] = useState<CustomTwibbonFrame | null>(
    null
  );

  // Modals & Notifications
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [sharePreviewUrl, setSharePreviewUrl] = useState<string | null>(null);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState<boolean>(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  // Load custom Twibbon library from localStorage on mount
  useEffect(() => {
    setCustomFrames(loadCustomFrames());
  }, []);

  // ---- Custom Twibbon Library CRUD Handlers ----
  const handleCreateCustomFrame = useCallback(
    (data: Omit<CustomTwibbonFrame, 'id' | 'createdAt' | 'updatedAt'>): boolean => {
      try {
        setCustomFrames((prev) => addCustomFrame(prev, data));
        return true;
      } catch (err) {
        if (err instanceof StorageQuotaError) {
          triggerToast(
            'Penyimpanan perangkat penuh. Hapus beberapa Twibbon lama untuk menyimpan yang baru.'
          );
        } else {
          triggerToast('Gagal menyimpan Twibbon. Coba lagi.');
        }
        return false;
      }
    },
    [triggerToast]
  );

  const handleUpdateCustomFrame = useCallback(
    (
      id: string,
      updates: Partial<Omit<CustomTwibbonFrame, 'id' | 'createdAt'>>
    ): boolean => {
      try {
        setCustomFrames((prev) => updateCustomFrame(prev, id, updates));
        return true;
      } catch (err) {
        if (err instanceof StorageQuotaError) {
          triggerToast('Penyimpanan perangkat penuh saat menyimpan perubahan.');
        } else {
          triggerToast('Gagal memperbarui Twibbon. Coba lagi.');
        }
        return false;
      }
    },
    [triggerToast]
  );

  const handleDeleteCustomFrame = useCallback(
    (id: string) => {
      setCustomFrames((prev) => deleteCustomFrame(prev, id));
      setActiveCustomFrameId((prev) => {
        if (prev === id) {
          setCustomFrameImg(null);
          setCustomFrameName(null);
          return null;
        }
        return prev;
      });
    },
    []
  );

  // Apply a saved custom frame to the canvas
  const handleUseCustomFrame = useCallback(
    (frame: CustomTwibbonFrame) => {
      const img = new Image();
      img.onload = () => {
        setCustomFrameImg(img);
        setCustomFrameName(frame.name);
        setActiveCustomFrameId(frame.id);
        setTextState((prev) => ({
          ...prev,
          topTitle: frame.showTextByDefault ? frame.campaignTitle : '',
          subtitle: frame.showTextByDefault ? frame.campaignSubtitle : '',
          showTopHeader: frame.showTextByDefault,
          showBottomBanner: frame.showTextByDefault,
          showWidodoWatermark: false,
        }));
        setIsManageModalOpen(false);
        triggerToast(`Twibbon "${frame.name}" siap digunakan!`);
      };
      img.src = frame.dataUrl;
    },
    [triggerToast]
  );

  // Save the currently-uploaded transient PNG frame straight into the library
  const handleSaveCurrentUploadToLibrary = useCallback(async () => {
    if (!customFrameImg) return;
    try {
      const normalized = normalizeFrameToDataUrl(customFrameImg, 1080);
      const baseName = (customFrameName || 'Twibbon Kustom Saya').replace(/\.png$/i, '');
      const created = handleCreateCustomFrame({
        name: baseName,
        campaignTitle: '',
        campaignSubtitle: '',
        category: 'kegiatan',
        organizerName: 'Widodo Guru SD',
        hashtags: '#WidodoGuruSD #Twibbon #SekolahDasar',
        dataUrl: normalized,
        showTextByDefault: false,
      });
      if (created) {
        triggerToast(`"${baseName}" tersimpan ke koleksi Twibbon Saya!`);
      }
    } catch {
      triggerToast('Gagal menyimpan bingkai ke koleksi.');
    }
  }, [customFrameImg, customFrameName, handleCreateCustomFrame, triggerToast]);

  // Load Photo Image whenever photoState.src changes
  useEffect(() => {
    if (!photoState.src) {
      setPhotoImg(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setPhotoImg(img);
    };
    img.src = photoState.src;
  }, [photoState.src]);

  // Re-render Main 1080x1080 Canvas whenever any state changes
  useEffect(() => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    renderTwibbonCanvas({
      ctx,
      width: 1080,
      height: 1080,
      template: activeTemplate,
      photoImg,
      customFrameImg,
      photoState,
      textState,
      stickers,
      selectedStickerId,
      showGrid,
      isExporting: false,
    });
  }, [
    activeTemplate,
    photoImg,
    customFrameImg,
    photoState,
    textState,
    stickers,
    selectedStickerId,
    showGrid,
  ]);

  // Select Template Handler
  const handleSelectTemplate = (template: TwibbonTemplate) => {
    setActiveTemplate(template);
    setCustomFrameImg(null);
    setCustomFrameName(null);
    setActiveCustomFrameId(null);
    setTextState((prev) => ({
      ...prev,
      topTitle: template.defaultTopTitle,
      subtitle: template.defaultSubtitle,
      schoolName: template.defaultSchoolName,
      primaryColorOverride: null,
      secondaryColorOverride: null,
      accentColorOverride: null,
      cutoutShapeOverride: null,
      ribbonStyleOverride: null,
    }));
    triggerToast(`Bingkai "${template.name}" diterapkan`);
  };

  // Upload User Photo Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadPhotoFile(file);
    e.target.value = '';
  };

  const loadPhotoFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      triggerToast('Mohon pilih file gambar (JPG, PNG, atau WebP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setPhotoState((prev) => ({
          ...prev,
          src: result,
          label: file.name,
          scale: 1,
          rotation: 0,
          x: 0,
          y: 0,
        }));
        triggerToast('Foto berhasil dimuat! Geser pada kanvas untuk mengatur posisi.');
      }
    };
    reader.readAsDataURL(file);
  };

  // Upload Custom PNG Frame Handler
  const handleCustomFrameUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        const img = new Image();
        img.onload = () => {
          setCustomFrameImg(img);
          setCustomFrameName(file.name);
          setActiveCustomFrameId(null);
          triggerToast(`Bingkai PNG Kustom "${file.name}" berhasil dipasang!`);
        };
        img.src = result;
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Switch Sample Portrait
  const handleSelectSamplePortrait = (sample: (typeof SAMPLE_PORTRAITS)[0]) => {
    setPhotoState((prev) => ({
      ...prev,
      src: sample.dataUrl,
      label: sample.label,
      scale: 1.02,
      rotation: 0,
      x: 0,
      y: 12,
      flipH: false,
    }));
    setTextState((prev) => ({
      ...prev,
      personName: sample.personName,
      roleOrClass: sample.role,
    }));
    triggerToast(`Contoh foto "${sample.label}" diterapkan`);
  };

  // Canvas Pointer Down (Smart Hit-Testing for Stickers vs Photo Panning)
  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = 1080 / rect.width;
    const scaleY = 1080 / rect.height;
    const canvasX = (e.clientX - rect.left) * scaleX;
    const canvasY = (e.clientY - rect.top) * scaleY;

    // Check if user clicked on any sticker (topmost first)
    for (let i = stickers.length - 1; i >= 0; i--) {
      const st = stickers[i];
      const dist = Math.hypot(canvasX - st.x, canvasY - st.y);
      if (dist <= 78 * st.scale) {
        setSelectedStickerId(st.id);
        setDragTarget('sticker');
        setIsDraggingCanvas(true);
        dragStartRef.current = {
          clientX: e.clientX,
          clientY: e.clientY,
          startX: st.x,
          startY: st.y,
        };
        e.currentTarget.setPointerCapture(e.pointerId);
        return;
      }
    }

    // Otherwise deselect sticker and drag photo
    setSelectedStickerId(null);
    setDragTarget('photo');
    setIsDraggingCanvas(true);
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startX: photoState.x,
      startY: photoState.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingCanvas) return;
    const canvas = mainCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const factor = 1080 / rect.width;
    const dx = (e.clientX - dragStartRef.current.clientX) * factor;
    const dy = (e.clientY - dragStartRef.current.clientY) * factor;

    if (dragTarget === 'sticker' && selectedStickerId) {
      setStickers((prev) =>
        prev.map((st) =>
          st.id === selectedStickerId
            ? {
                ...st,
                x: Math.max(60, Math.min(1020, Math.round(dragStartRef.current.startX + dx))),
                y: Math.max(60, Math.min(1020, Math.round(dragStartRef.current.startY + dy))),
              }
            : st
        )
      );
    } else {
      setPhotoState((prev) => ({
        ...prev,
        x: Math.round(dragStartRef.current.startX + dx),
        y: Math.round(dragStartRef.current.startY + dy),
      }));
    }
  };

  const handleCanvasPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDraggingCanvas) {
      setIsDraggingCanvas(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore if pointer not captured
      }
    }
  };

  // Mouse Wheel Zoom on Canvas
  const handleCanvasWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.06 : -0.06;
    setPhotoState((prev) => ({
      ...prev,
      scale: Number(Math.max(0.25, Math.min(3.0, prev.scale + delta)).toFixed(2)),
    }));
  };

  // Add Educational Sticker
  const handleAddSticker = (item: StickerCatalogItem) => {
    const newSticker: PlacedSticker = {
      id: `sticker-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: item.type,
      label: item.label,
      x: item.defaultX + Math.round((Math.random() - 0.5) * 30),
      y: item.defaultY + Math.round((Math.random() - 0.5) * 30),
      scale: 0.95,
      rotation: 0,
    };
    setStickers((prev) => [...prev, newSticker]);
    setSelectedStickerId(newSticker.id);
    triggerToast(`Stiker "${item.label}" ditambahkan! Geser di kanvas untuk memindahkan.`);
  };

  // Export High-Resolution PNG (1080x1080 or 2160x2160 Ultra HD)
  const generateCleanDataUrl = (highRes = false): string => {
    const exportCanvas = document.createElement('canvas');
    const targetSize = highRes ? 2160 : 1080;
    exportCanvas.width = targetSize;
    exportCanvas.height = targetSize;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return '';

    renderTwibbonCanvas({
      ctx,
      width: targetSize,
      height: targetSize,
      template: activeTemplate,
      photoImg,
      customFrameImg,
      photoState,
      textState,
      stickers,
      selectedStickerId: null,
      showGrid: false,
      isExporting: true,
    });

    return exportCanvas.toDataURL('image/png', 1.0);
  };

  const handleDownloadPng = (highRes = false) => {
    const dataUrl = generateCleanDataUrl(highRes);
    if (!dataUrl) return;

    const cleanName = (textState.personName || 'Siswa-Guru-SD')
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .replace(/-+/g, '-');
    const link = document.createElement('a');
    link.download = `Twibbon-Widodo-Guru-SD-${cleanName}${highRes ? '-UltraHD' : ''}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Trigger celebratory confetti!
    confetti({
      particleCount: 75,
      spread: 65,
      origin: { y: 0.6 },
      colors: ['#D92D20', '#F59E0B', '#1D4ED8', '#16A34A', '#FFFFFF'],
    });

    triggerToast(
      `Twibbon (${highRes ? '2160×2160 Ultra HD' : '1080×1080 HD'}) berhasil diunduh!`
    );
  };

  const handleOpenShareModal = () => {
    const url = generateCleanDataUrl(false);
    setSharePreviewUrl(url);
    setIsShareModalOpen(true);
  };

  const filteredTemplates =
    selectedCategory === 'semua'
      ? TWIBBON_TEMPLATES
      : TWIBBON_TEMPLATES.filter((t) => t.category === selectedCategory);

  const selectedSticker = stickers.find((s) => s.id === selectedStickerId) || null;

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFDF9] text-[#1E293B]">
      {/* Hidden File Inputs */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handlePhotoUpload}
        className="hidden"
      />
      <input
        ref={customFrameInputRef}
        type="file"
        accept="image/png"
        onChange={handleCustomFrameUpload}
        className="hidden"
      />

      {/* =====================================================================
          TOP BRAND HEADER (WIDODO GURU SD)
      ===================================================================== */}
      <header className="sticky top-0 z-30 border-b border-[#E2E8F0] bg-[#FFFDF9]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6">
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D92D20] to-[#B91C1C] text-white shadow-md ring-2 ring-[#F59E0B]/70">
              <BookOpen className="h-6 w-6 stroke-[2.4]" />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#F59E0B] text-[9px] font-black text-slate-900 shadow-xs">
                ★
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                  Widodo Guru SD
                </h1>
                <span className="hidden rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-800 sm:inline-block">
                  Edisi Sekolah Dasar
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 sm:text-xs">
                Studio Kreator Twibbon Pendidikan & Kampanye Sekolah
              </p>
            </div>
          </div>

          {/* Right: Quick Actions & Export CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsAboutModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
              title="Panduan & Tentang Widodo Guru SD"
            >
              <HelpCircle className="h-4 w-4 text-[#1D4ED8]" />
              <span className="hidden md:inline">Panduan</span>
            </button>

            <button
              type="button"
              onClick={() => setIsManageModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#1D4ED8]/30 bg-blue-50/80 px-3 py-2 text-xs font-bold text-[#1D4ED8] transition hover:bg-blue-100 cursor-pointer"
              title="Kelola koleksi Twibbon kustom Anda"
            >
              <Layers className="h-4 w-4" />
              <span className="hidden md:inline">Twibbon Saya</span>
              {customFrames.length > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#1D4ED8] px-1 text-[10px] font-bold text-white">
                  {customFrames.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={handleOpenShareModal}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#16A34A]/30 bg-emerald-50/80 px-3.5 py-2 text-xs font-bold text-[#15803D] transition hover:bg-emerald-100 cursor-pointer"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Salin Caption WA</span>
            </button>

            <button
              type="button"
              onClick={() => handleDownloadPng(false)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#D92D20] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-[#D92D20]/20 transition hover:bg-[#B91C1C] active:scale-[0.99] sm:px-5 sm:text-sm cursor-pointer"
            >
              <Download className="h-4 w-4 stroke-[2.5]" />
              <span>Unduh Twibbon</span>
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================================
          MAIN STUDIO WORKSPACE (12-COLUMN SPLIT DESKTOP)
      ===================================================================== */}
      <main className="mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-1 gap-6 p-4 sm:p-6 lg:grid-cols-12">
        {/* ===================================================================
            LEFT / CENTER COLUMN: INTERACTIVE TWIBBON CANVAS STAGE (7 COLS)
        =================================================================== */}
        <section className="flex flex-col lg:col-span-7">
          <div className="flex flex-1 flex-col items-center justify-between rounded-3xl border border-[#E2E8F0] bg-studio-desk p-4 shadow-xs sm:p-6">
            {/* Top Stage Status Bar & Sample Portrait Switcher */}
            <div className="mb-4 flex w-full flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-800 shadow-2xs border border-slate-200/80">
                  <Sparkles className="h-3.5 w-3.5 text-[#D92D20]" />
                  {customFrameName ? `PNG Kustom: ${customFrameName}` : activeTemplate.name}
                </span>
              </div>

              {/* Sample Portraits Switcher for instant testing */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-500 mr-1">
                  Contoh Foto:
                </span>
                {SAMPLE_PORTRAITS.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectSamplePortrait(sample)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
                      photoState.label === sample.label
                        ? 'bg-[#1D4ED8] text-white shadow-2xs'
                        : 'bg-white/90 text-slate-700 hover:bg-white border border-slate-200/80'
                    }`}
                  >
                    {sample.label.split(' ')[0]} {sample.label.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive 1:1 Canvas Container */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOverFile(true);
              }}
              onDragLeave={() => setIsDragOverFile(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOverFile(false);
                const file = e.dataTransfer.files?.[0];
                if (file) loadPhotoFile(file);
              }}
              className={`relative aspect-square w-full max-w-[520px] overflow-hidden rounded-2xl bg-checkerboard shadow-[0_12px_32px_-8px_rgba(30,41,59,0.16)] transition-all ${
                isDragOverFile
                  ? 'ring-4 ring-[#D92D20] scale-[1.01]'
                  : 'border-2 border-white ring-1 ring-slate-300/80'
              }`}
            >
              <canvas
                ref={mainCanvasRef}
                width={1080}
                height={1080}
                onPointerDown={handleCanvasPointerDown}
                onPointerMove={handleCanvasPointerMove}
                onPointerUp={handleCanvasPointerUp}
                onPointerCancel={handleCanvasPointerUp}
                onWheel={handleCanvasWheel}
                className={`h-full w-full touch-none select-none object-contain ${
                  isDraggingCanvas ? 'cursor-grabbing' : 'cursor-grab'
                }`}
              />

              {/* Drag & Drop Overlay Hint */}
              {isDragOverFile && (
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 text-white backdrop-blur-xs">
                  <Upload className="mb-2 h-12 w-12 animate-bounce text-[#F59E0B]" />
                  <p className="font-display text-lg font-bold">
                    Lepaskan Foto untuk Memasang di Twibbon
                  </p>
                </div>
              )}

              {/* Live Canvas HUD Pill (Bottom-Left) */}
              <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-slate-900/75 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-xs">
                <Move className="h-3 w-3 text-[#F59E0B]" />
                <span>Geser kanvas untuk atur posisi</span>
              </div>

              {/* Zoom & Resolution Readout (Bottom-Right) */}
              <div className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-slate-900/75 px-3 py-1 font-mono-num text-[11px] font-semibold text-amber-300 backdrop-blur-xs">
                1080×1080 • {Math.round(photoState.scale * 100)}%
              </div>
            </div>

            {/* Floating Canvas Action Toolbar */}
            <div className="mt-4 flex w-full max-w-[540px] flex-wrap items-center justify-center gap-2 rounded-2xl border border-slate-200/90 bg-white p-2 shadow-xs">
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#D92D20] px-3.5 py-2 text-xs font-bold text-white shadow-2xs transition hover:bg-[#B91C1C] cursor-pointer"
              >
                <ImagePlus className="h-4 w-4" />
                <span>Unggah Foto</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCameraModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 cursor-pointer"
              >
                <Camera className="h-4 w-4 text-[#1D4ED8]" />
                <span>Kamera</span>
              </button>

              <div className="h-5 w-[1px] bg-slate-200 hidden sm:block" />

              <button
                type="button"
                onClick={() =>
                  setPhotoState((prev) => ({
                    ...prev,
                    scale: Number(Math.min(3.0, prev.scale + 0.12).toFixed(2)),
                  }))
                }
                className="rounded-xl border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-100 cursor-pointer"
                title="Perbesar Foto"
              >
                <ZoomIn className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() =>
                  setPhotoState((prev) => ({
                    ...prev,
                    scale: Number(Math.max(0.25, prev.scale - 0.12).toFixed(2)),
                  }))
                }
                className="rounded-xl border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-100 cursor-pointer"
                title="Perkecil Foto"
              >
                <ZoomOut className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() =>
                  setPhotoState((prev) => ({
                    ...prev,
                    rotation: (prev.rotation + 90) % 360,
                  }))
                }
                className="rounded-xl border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-100 cursor-pointer"
                title="Putar 90 Derajat"
              >
                <RotateCw className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() =>
                  setPhotoState((prev) => ({
                    ...prev,
                    flipH: !prev.flipH,
                  }))
                }
                className={`rounded-xl border p-2 transition cursor-pointer ${
                  photoState.flipH
                    ? 'border-[#D92D20] bg-red-50 text-[#D92D20]'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
                title="Balik Horizontal (Cermin)"
              >
                <FlipHorizontal className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowGrid((prev) => !prev)}
                className={`rounded-xl border p-2 transition cursor-pointer ${
                  showGrid
                    ? 'border-[#F59E0B] bg-amber-50 text-amber-700'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
                title="Tampilkan Garis Bantu Proporsi"
              >
                <Grid className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() =>
                  setPhotoState((prev) => ({
                    ...prev,
                    scale: 1,
                    rotation: 0,
                    x: 0,
                    y: 0,
                    flipH: false,
                    brightness: 100,
                    contrast: 100,
                    saturation: 100,
                    filterPreset: 'normal',
                  }))
                }
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-2.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 cursor-pointer"
                title="Reset Posisi Foto"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>
        </section>

        {/* ===================================================================
            RIGHT COLUMN: 4-TAB CUSTOMIZATION INSPECTOR PANEL (5 COLS)
        =================================================================== */}
        <aside className="flex flex-col lg:col-span-5">
          <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white shadow-xs">
            {/* 4-Tab Navigation Header */}
            <div className="grid grid-cols-4 border-b border-slate-200 bg-slate-50/70 p-1.5 gap-1">
              {[
                { id: 'bingkai', label: 'Bingkai', icon: Frame },
                { id: 'foto', label: 'Atur Foto', icon: Sliders },
                { id: 'teks', label: 'Teks & Nama', icon: Type },
                { id: 'stiker', label: 'Stiker SD', icon: Sticker },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as InspectorTab)}
                    className={`flex flex-col items-center justify-center gap-1 rounded-2xl py-2.5 px-2 text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#D92D20] text-white shadow-sm'
                        : 'text-slate-600 hover:bg-white hover:text-slate-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="truncate text-[11px] sm:text-xs">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Body Content */}
            <div className="custom-scrollbar flex-1 overflow-y-auto p-5 sm:p-6 max-h-[680px]">
              {/* =============================================================
                  TAB 1: BINGKAI (FRAMES & SHAPE/COLOR CUSTOMIZATION)
              ============================================================= */}
              {activeTab === 'bingkai' && (
                <div className="space-y-6">
                  {/* Category Filter Pills */}
                  <div>
                    <div className="mb-2.5 flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Kategori Tema Sekolah Dasar
                      </label>
                      <span className="text-[11px] font-semibold text-[#D92D20]">
                        {filteredTemplates.length} Desain
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {FRAME_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                            selectedCategory === cat.id
                              ? 'bg-slate-900 text-white shadow-2xs'
                              : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2-Column Frame Thumbnail Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {filteredTemplates.map((template) => (
                      <FrameThumbnail
                        key={template.id}
                        template={template}
                        isSelected={!customFrameImg && activeTemplate.id === template.id}
                        onSelect={handleSelectTemplate}
                      />
                    ))}
                  </div>

                  {/* Cutout Shape & Frame Color Customizer */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-[#D92D20]" />
                        <h4 className="font-display text-sm font-bold text-slate-800">
                          Kustomisasi Bentuk & Warna Bingkai
                        </h4>
                      </div>
                      {(textState.primaryColorOverride ||
                        textState.secondaryColorOverride ||
                        textState.accentColorOverride ||
                        textState.cutoutShapeOverride) && (
                        <button
                          type="button"
                          onClick={() =>
                            setTextState((prev) => ({
                              ...prev,
                              primaryColorOverride: null,
                              secondaryColorOverride: null,
                              accentColorOverride: null,
                              cutoutShapeOverride: null,
                            }))
                          }
                          className="text-[11px] font-semibold text-[#D92D20] hover:underline cursor-pointer"
                        >
                          Reset ke Default
                        </button>
                      )}
                    </div>

                    {/* Cutout Hole Shape */}
                    <div>
                      <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                        Bentuk Lubang Foto:
                      </span>
                      <div className="grid grid-cols-5 gap-1.5">
                        {(
                          [
                            { id: 'circle', label: 'Lingkaran' },
                            { id: 'squircle', label: 'Sudut Tumpul' },
                            { id: 'shield', label: 'Perisai' },
                            { id: 'arch', label: 'Kubah' },
                            { id: 'hexagon', label: 'Segi Enam' },
                          ] as { id: CutoutShape; label: string }[]
                        ).map((sh) => {
                          const currentShape =
                            textState.cutoutShapeOverride || activeTemplate.cutoutShape;
                          return (
                            <button
                              key={sh.id}
                              type="button"
                              onClick={() =>
                                setTextState((prev) => ({
                                  ...prev,
                                  cutoutShapeOverride: sh.id,
                                }))
                              }
                              className={`rounded-xl border py-2 px-1 text-center text-[11px] font-semibold transition cursor-pointer ${
                                currentShape === sh.id
                                  ? 'border-[#D92D20] bg-[#FFF5F5] text-[#D92D20]'
                                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {sh.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Color Pickers for Primary, Secondary, Accent */}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                          Warna Utama
                        </label>
                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5">
                          <input
                            type="color"
                            value={
                              textState.primaryColorOverride || activeTemplate.primaryColor
                            }
                            onChange={(e) =>
                              setTextState((prev) => ({
                                ...prev,
                                primaryColorOverride: e.target.value,
                              }))
                            }
                            className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent"
                          />
                          <span className="font-mono-num text-[11px] text-slate-600">
                            {(
                              textState.primaryColorOverride || activeTemplate.primaryColor
                            ).toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                          Warna Kedua
                        </label>
                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5">
                          <input
                            type="color"
                            value={
                              textState.secondaryColorOverride ||
                              activeTemplate.secondaryColor
                            }
                            onChange={(e) =>
                              setTextState((prev) => ({
                                ...prev,
                                secondaryColorOverride: e.target.value,
                              }))
                            }
                            className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent"
                          />
                          <span className="font-mono-num text-[11px] text-slate-600">
                            {(
                              textState.secondaryColorOverride ||
                              activeTemplate.secondaryColor
                            ).toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                          Warna Aksen Emas
                        </label>
                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5">
                          <input
                            type="color"
                            value={
                              textState.accentColorOverride || activeTemplate.accentColor
                            }
                            onChange={(e) =>
                              setTextState((prev) => ({
                                ...prev,
                                accentColorOverride: e.target.value,
                              }))
                            }
                            className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent"
                          />
                          <span className="font-mono-num text-[11px] text-slate-600">
                            {(
                              textState.accentColorOverride || activeTemplate.accentColor
                            ).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Twibbon Saya — Custom Library Quick Access */}
                  <div className="rounded-2xl border border-[#1D4ED8]/20 bg-blue-50/40 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-[#1D4ED8]" />
                        <h4 className="font-display text-sm font-bold text-slate-800">
                          Twibbon Saya (Koleksi Kustom)
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsManageModalOpen(true)}
                        className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-[#1D4ED8] px-3 py-1.5 text-xs font-bold text-white shadow-2xs transition hover:bg-blue-800 cursor-pointer"
                      >
                        <FolderPlus className="h-3.5 w-3.5" />
                        Kelola
                      </button>
                    </div>

                    {customFrames.length === 0 ? (
                      <p className="rounded-xl bg-white/70 px-3 py-3 text-[11px] leading-relaxed text-slate-500">
                        Belum ada Twibbon kustom. Klik{' '}
                        <span className="font-bold text-[#1D4ED8]">Kelola</span> untuk
                        mengunggah bingkai PNG buatanmu sendiri, lalu tambah, edit, hapus,
                        dan bagikan untuk kampanye!
                      </p>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {customFrames.slice(0, 6).map((frame) => (
                          <button
                            key={frame.id}
                            type="button"
                            onClick={() => handleUseCustomFrame(frame)}
                            className={`group relative overflow-hidden rounded-xl border-2 bg-checkerboard transition cursor-pointer ${
                              activeCustomFrameId === frame.id
                                ? 'border-[#D92D20] ring-2 ring-[#D92D20]/20'
                                : 'border-white hover:border-[#F59E0B]'
                            }`}
                            title={frame.name}
                          >
                            <div className="aspect-square w-full">
                              <img
                                src={frame.dataUrl}
                                alt={frame.name}
                                className="h-full w-full object-contain"
                              />
                            </div>
                            {activeCustomFrameId === frame.id && (
                              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#D92D20] text-white">
                                <Check className="h-2.5 w-2.5 stroke-[3]" />
                              </span>
                            )}
                            <span className="absolute inset-x-0 bottom-0 truncate bg-slate-900/70 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                              {frame.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                    {customFrames.length > 6 && (
                      <button
                        type="button"
                        onClick={() => setIsManageModalOpen(true)}
                        className="mt-2 w-full text-center text-[11px] font-semibold text-[#1D4ED8] hover:underline cursor-pointer"
                      >
                        Lihat semua {customFrames.length} Twibbon →
                      </button>
                    )}
                    {customFrames.length > 0 && (
                      <p className="mt-2 text-center text-[10px] text-slate-400">
                        Tersimpan di perangkat ini • ±{estimateStorageUsageMB(customFrames)} MB
                        terpakai
                      </p>
                    )}
                  </div>

                  {/* Custom PNG Frame Upload Option */}
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h4 className="font-display text-xs font-bold text-slate-800">
                          Unggah Cepat Bingkai PNG
                        </h4>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                          Coba langsung file PNG transparan (1080×1080 px) tanpa menyimpannya ke koleksi.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => customFrameInputRef.current?.click()}
                        className="shrink-0 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs transition hover:bg-slate-100 cursor-pointer"
                      >
                        Unggah PNG
                      </button>
                    </div>
                    {customFrameImg && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900 border border-amber-200">
                          <span className="truncate font-medium">
                            Menggunakan: {customFrameName}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setCustomFrameImg(null);
                              setCustomFrameName(null);
                              setActiveCustomFrameId(null);
                            }}
                            className="ml-2 font-bold text-[#D92D20] hover:underline cursor-pointer"
                          >
                            Hapus PNG
                          </button>
                        </div>
                        {activeCustomFrameId === null && (
                          <button
                            type="button"
                            onClick={handleSaveCurrentUploadToLibrary}
                            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#16A34A] px-3 py-2 text-xs font-bold text-white shadow-2xs transition hover:bg-green-700 cursor-pointer"
                          >
                            <FolderPlus className="h-3.5 w-3.5" />
                            Simpan Bingkai Ini ke "Twibbon Saya"
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* =============================================================
                  TAB 2: ATUR FOTO (PHOTO TRANSFORM & FILTERS)
              ============================================================= */}
              {activeTab === 'foto' && (
                <div className="space-y-6">
                  {/* Photo Source Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-[#D92D20] py-3 px-4 text-xs font-bold text-white shadow-sm transition hover:bg-[#B91C1C] cursor-pointer"
                    >
                      <Upload className="h-4 w-4" />
                      Pilih Foto dari HP/Laptop
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCameraModalOpen(true)}
                      className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-xs font-bold text-slate-700 transition hover:bg-slate-100 cursor-pointer"
                    >
                      <Camera className="h-4 w-4 text-[#1D4ED8]" />
                      Ambil Kamera Selfie
                    </button>
                  </div>

                  {/* Scale, Rotation & Position Sliders */}
                  <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-sm font-bold text-slate-800">
                        Ukuran & Posisi Foto
                      </h4>
                      <button
                        type="button"
                        onClick={() =>
                          setPhotoState((prev) => ({
                            ...prev,
                            scale: 1,
                            rotation: 0,
                            x: 0,
                            y: 0,
                            flipH: false,
                          }))
                        }
                        className="text-xs font-semibold text-[#D92D20] hover:underline cursor-pointer"
                      >
                        Atur Ulang Posisi
                      </button>
                    </div>

                    {/* Zoom Slider */}
                    <div>
                      <div className="mb-1.5 flex justify-between text-xs">
                        <span className="font-semibold text-slate-700">
                          Perbesar / Zoom Foto
                        </span>
                        <span className="font-mono-num font-bold text-[#D92D20]">
                          {Math.round(photoState.scale * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.25"
                        max="3.0"
                        step="0.02"
                        value={photoState.scale}
                        onChange={(e) =>
                          setPhotoState((prev) => ({
                            ...prev,
                            scale: parseFloat(e.target.value),
                          }))
                        }
                        className="studio-slider w-full"
                      />
                    </div>

                    {/* Rotation Slider */}
                    <div>
                      <div className="mb-1.5 flex justify-between text-xs">
                        <span className="font-semibold text-slate-700">
                          Putar Kemiringan Foto
                        </span>
                        <span className="font-mono-num font-bold text-slate-700">
                          {photoState.rotation}°
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        step="1"
                        value={photoState.rotation}
                        onChange={(e) =>
                          setPhotoState((prev) => ({
                            ...prev,
                            rotation: parseInt(e.target.value, 10),
                          }))
                        }
                        className="studio-slider w-full"
                      />
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setPhotoState((prev) => ({
                              ...prev,
                              rotation: prev.rotation - 90,
                            }))
                          }
                          className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                        >
                          <RotateCcw className="h-3.5 w-3.5" /> -90°
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setPhotoState((prev) => ({ ...prev, rotation: 0 }))
                          }
                          className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                        >
                          0° Lurus
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setPhotoState((prev) => ({
                              ...prev,
                              rotation: prev.rotation + 90,
                            }))
                          }
                          className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                        >
                          <RotateCw className="h-3.5 w-3.5" /> +90°
                        </button>
                      </div>
                    </div>

                    {/* X & Y Fine Offset Sliders */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <div className="mb-1 flex justify-between text-[11px]">
                          <span className="font-semibold text-slate-600">Geser Kiri/Kanan</span>
                          <span className="font-mono-num text-slate-500">{photoState.x}px</span>
                        </div>
                        <input
                          type="range"
                          min="-400"
                          max="400"
                          step="2"
                          value={photoState.x}
                          onChange={(e) =>
                            setPhotoState((prev) => ({
                              ...prev,
                              x: parseInt(e.target.value, 10),
                            }))
                          }
                          className="studio-slider w-full"
                        />
                      </div>
                      <div>
                        <div className="mb-1 flex justify-between text-[11px]">
                          <span className="font-semibold text-slate-600">Geser Atas/Bawah</span>
                          <span className="font-mono-num text-slate-500">{photoState.y}px</span>
                        </div>
                        <input
                          type="range"
                          min="-400"
                          max="400"
                          step="2"
                          value={photoState.y}
                          onChange={(e) =>
                            setPhotoState((prev) => ({
                              ...prev,
                              y: parseInt(e.target.value, 10),
                            }))
                          }
                          className="studio-slider w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Color Filter Presets & Brightness/Contrast/Saturation */}
                  <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-sm font-bold text-slate-800">
                        Filter & Pencahayaan Foto
                      </h4>
                      <button
                        type="button"
                        onClick={() =>
                          setPhotoState((prev) => ({
                            ...prev,
                            brightness: 100,
                            contrast: 100,
                            saturation: 100,
                            filterPreset: 'normal',
                          }))
                        }
                        className="text-xs font-semibold text-[#D92D20] hover:underline cursor-pointer"
                      >
                        Normal
                      </button>
                    </div>

                    {/* Filter Presets */}
                    <div className="grid grid-cols-5 gap-1.5">
                      {(
                        [
                          { id: 'normal', label: 'Asli' },
                          { id: 'cerah', label: 'Cerah' },
                          { id: 'hangat', label: 'Hangat' },
                          { id: 'tajam', label: 'Tajam' },
                          { id: 'bw', label: 'Hitam Putih' },
                        ] as { id: FilterPreset; label: string }[]
                      ).map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() =>
                            setPhotoState((prev) => ({
                              ...prev,
                              filterPreset: preset.id,
                            }))
                          }
                          className={`rounded-xl border py-2 px-1 text-[11px] font-semibold transition cursor-pointer ${
                            photoState.filterPreset === preset.id
                              ? 'border-[#D92D20] bg-[#FFF5F5] text-[#D92D20]'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    {/* Brightness */}
                    <div>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="font-semibold text-slate-700">Kecerahan</span>
                        <span className="font-mono-num text-slate-600">
                          {photoState.brightness}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="60"
                        max="150"
                        value={photoState.brightness}
                        onChange={(e) =>
                          setPhotoState((prev) => ({
                            ...prev,
                            brightness: parseInt(e.target.value, 10),
                          }))
                        }
                        className="studio-slider w-full"
                      />
                    </div>

                    {/* Contrast */}
                    <div>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="font-semibold text-slate-700">Kontras</span>
                        <span className="font-mono-num text-slate-600">
                          {photoState.contrast}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="60"
                        max="150"
                        value={photoState.contrast}
                        onChange={(e) =>
                          setPhotoState((prev) => ({
                            ...prev,
                            contrast: parseInt(e.target.value, 10),
                          }))
                        }
                        className="studio-slider w-full"
                      />
                    </div>

                    {/* Saturation */}
                    <div>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="font-semibold text-slate-700">Ketajaman Warna</span>
                        <span className="font-mono-num text-slate-600">
                          {photoState.saturation}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="180"
                        value={photoState.saturation}
                        onChange={(e) =>
                          setPhotoState((prev) => ({
                            ...prev,
                            saturation: parseInt(e.target.value, 10),
                          }))
                        }
                        className="studio-slider w-full"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* =============================================================
                  TAB 3: TEKS & NAMA (IDENTITY & SCHOOL BANNER)
              ============================================================= */}
              {activeTab === 'teks' && (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-amber-200/80 bg-amber-50/60 p-3.5 text-xs text-slate-700">
                    <span className="font-bold text-slate-900">
                      💡 Pita Nama Otomatis:
                    </span>{' '}
                    Ketik Nama Siswa/Guru, Kelas/Jabatan, dan Nama Sekolah di bawah ini. Ukuran teks akan menyesuaikan secara proporsional di dalam pita Twibbon.
                  </div>

                  {/* Student / Teacher Identity Inputs */}
                  <div className="space-y-3.5">
                    <div>
                      <label className="mb-1.5 flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>Nama Lengkap Siswa / Guru SD</span>
                        <span className="text-[11px] font-normal text-slate-400">
                          Tampil di Pita Utama
                        </span>
                      </label>
                      <input
                        type="text"
                        value={textState.personName}
                        onChange={(e) =>
                          setTextState((prev) => ({ ...prev, personName: e.target.value }))
                        }
                        placeholder="Contoh: Widodo, S.Pd.SD / Ananda Putri"
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#D92D20] focus:outline-none focus:ring-2 focus:ring-[#D92D20]/15"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>Kelas / Jabatan / Prestasi</span>
                        <span className="text-[11px] font-normal text-slate-400">
                          Sub-baris Pita
                        </span>
                      </label>
                      <input
                        type="text"
                        value={textState.roleOrClass}
                        onChange={(e) =>
                          setTextState((prev) => ({ ...prev, roleOrClass: e.target.value }))
                        }
                        placeholder="Contoh: Siswa Kelas 4A / Guru Kelas VI"
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-[#D92D20] focus:outline-none focus:ring-2 focus:ring-[#D92D20]/15"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>Nama Sekolah Dasar / Komunitas</span>
                        <span className="text-[11px] font-normal text-slate-400">
                          Lencana Bawah
                        </span>
                      </label>
                      <input
                        type="text"
                        value={textState.schoolName}
                        onChange={(e) =>
                          setTextState((prev) => ({ ...prev, schoolName: e.target.value }))
                        }
                        placeholder="Contoh: SD Negeri 1 Nusantara • Widodo Guru SD"
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-[#D92D20] focus:outline-none focus:ring-2 focus:ring-[#D92D20]/15"
                      />
                    </div>
                  </div>

                  <hr className="border-slate-200" />

                  {/* Campaign Headline Inputs */}
                  <div className="space-y-3.5">
                    <h4 className="font-display text-sm font-bold text-slate-800">
                      Judul & Slogan Kampanye (Bagian Atas)
                    </h4>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600">
                        Judul Utama Atas
                      </label>
                      <input
                        type="text"
                        value={textState.topTitle}
                        onChange={(e) =>
                          setTextState((prev) => ({ ...prev, topTitle: e.target.value }))
                        }
                        placeholder="Judul Kampanye..."
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 focus:border-[#D92D20] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600">
                        Slogan / Sub-Judul
                      </label>
                      <input
                        type="text"
                        value={textState.subtitle}
                        onChange={(e) =>
                          setTextState((prev) => ({ ...prev, subtitle: e.target.value }))
                        }
                        placeholder="Slogan pendidikan..."
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 focus:border-[#D92D20] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Ribbon Style & Typography Pickers */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-4">
                    <div>
                      <span className="mb-1.5 block text-xs font-bold text-slate-700">
                        Bentuk Pita Nama Bawah:
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {(
                          [
                            { id: 'curved-ribbon', label: 'Pita Melengkung' },
                            { id: 'modern-pill', label: 'Kapsul Modern' },
                            { id: 'academic-crest', label: 'Perisai Cendekia' },
                            { id: 'classic-banner', label: 'Spanduk Klasik' },
                          ] as { id: RibbonStyle; label: string }[]
                        ).map((rb) => {
                          const currentRibbon =
                            textState.ribbonStyleOverride || activeTemplate.ribbonStyle;
                          return (
                            <button
                              key={rb.id}
                              type="button"
                              onClick={() =>
                                setTextState((prev) => ({
                                  ...prev,
                                  ribbonStyleOverride: rb.id,
                                }))
                              }
                              className={`rounded-xl border py-2 px-3 text-xs font-semibold transition cursor-pointer ${
                                currentRibbon === rb.id
                                  ? 'border-[#D92D20] bg-[#FFF5F5] text-[#D92D20]'
                                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {rb.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <span className="mb-1.5 block text-xs font-bold text-slate-700">
                        Gaya Huruf (Font):
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {(
                          [
                            { id: 'Fredoka', label: 'Fredoka Ceria' },
                            { id: 'Plus Jakarta Sans', label: 'Jakarta Formal' },
                            { id: 'Georgia', label: 'Serif Klasik' },
                          ] as {
                            id: TextOverlayState['fontFamily'];
                            label: string;
                          }[]
                        ).map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() =>
                              setTextState((prev) => ({
                                ...prev,
                                fontFamily: f.id,
                              }))
                            }
                            className={`rounded-xl border py-2 px-2 text-xs font-semibold transition cursor-pointer ${
                              textState.fontFamily === f.id
                                ? 'border-[#D92D20] bg-[#FFF5F5] text-[#D92D20]'
                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Visibility Checkboxes */}
                    <div className="space-y-2 pt-1">
                      <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={textState.showTopHeader}
                          onChange={(e) =>
                            setTextState((prev) => ({
                              ...prev,
                              showTopHeader: e.target.checked,
                            }))
                          }
                          className="h-4 w-4 rounded accent-[#D92D20]"
                        />
                        <span>Tampilkan Judul & Slogan Atas</span>
                      </label>

                      <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={textState.showBottomBanner}
                          onChange={(e) =>
                            setTextState((prev) => ({
                              ...prev,
                              showBottomBanner: e.target.checked,
                            }))
                          }
                          className="h-4 w-4 rounded accent-[#D92D20]"
                        />
                        <span>Tampilkan Pita Nama & Sekolah Bawah</span>
                      </label>

                      <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={textState.showWidodoWatermark}
                          onChange={(e) =>
                            setTextState((prev) => ({
                              ...prev,
                              showWidodoWatermark: e.target.checked,
                            }))
                          }
                          className="h-4 w-4 rounded accent-[#D92D20]"
                        />
                        <span>Tampilkan Lencana "Kreasi Resmi • Widodo Guru SD"</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* =============================================================
                  TAB 4: STIKER EDUKASI SD (EDUCATIONAL STICKERS & BADGES)
              ============================================================= */}
              {activeTab === 'stiker' && (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-blue-200/80 bg-blue-50/60 p-3.5 text-xs text-slate-700">
                    <span className="font-bold text-[#1D4ED8]">
                      ✨ Stiker Tematik SD:
                    </span>{' '}
                    Klik stiker di bawah untuk menambahkan ke kanvas. Anda dapat langsung menggeser posisi stiker di atas kanvas!
                  </div>

                  {/* Active Selected Sticker Controls */}
                  {selectedSticker && (
                    <div className="rounded-2xl border-2 border-[#D92D20]/30 bg-[#FFF5F5]/60 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-display text-xs font-bold text-[#D92D20]">
                          Stiker Aktif: {selectedSticker.label}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setStickers((prev) =>
                              prev.filter((s) => s.id !== selectedSticker.id)
                            );
                            setSelectedStickerId(null);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700 hover:bg-red-200 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Hapus
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="mb-1 flex justify-between text-[11px]">
                            <span className="font-semibold text-slate-700">Ukuran Stiker</span>
                            <span className="font-mono-num text-slate-600">
                              {Math.round(selectedSticker.scale * 100)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.4"
                            max="1.8"
                            step="0.05"
                            value={selectedSticker.scale}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              setStickers((prev) =>
                                prev.map((s) =>
                                  s.id === selectedSticker.id ? { ...s, scale: val } : s
                                )
                              );
                            }}
                            className="studio-slider w-full"
                          />
                        </div>

                        <div>
                          <div className="mb-1 flex justify-between text-[11px]">
                            <span className="font-semibold text-slate-700">Putar Sudut</span>
                            <span className="font-mono-num text-slate-600">
                              {selectedSticker.rotation}°
                            </span>
                          </div>
                          <input
                            type="range"
                            min="-45"
                            max="45"
                            step="1"
                            value={selectedSticker.rotation}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              setStickers((prev) =>
                                prev.map((s) =>
                                  s.id === selectedSticker.id ? { ...s, rotation: val } : s
                                )
                              );
                            }}
                            className="studio-slider w-full"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sticker Catalog Grid */}
                  <div>
                    <div className="mb-2.5 flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Koleksi Lencana & Stiker Widodo Guru SD
                      </label>
                      {stickers.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setStickers([]);
                            setSelectedStickerId(null);
                          }}
                          className="text-[11px] font-semibold text-red-600 hover:underline cursor-pointer"
                        >
                          Bersihkan Semua ({stickers.length})
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2">
                      {STICKER_CATALOG.map((item) => (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => handleAddSticker(item)}
                          className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2.5 text-left transition hover:border-[#F59E0B] hover:bg-amber-50/30 hover:shadow-2xs cursor-pointer"
                        >
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100">
                            <StickerPreviewIcon type={item.type} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="inline-block rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                              {item.category}
                            </span>
                            <p className="mt-1 truncate font-display text-xs font-bold text-slate-800 group-hover:text-[#D92D20]">
                              {item.label}
                            </p>
                            <span className="text-[10px] font-semibold text-[#1D4ED8]">
                              + Pasang Stiker
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Inspector Bottom Footer CTA */}
            <div className="border-t border-slate-200 bg-slate-50/80 px-5 py-3.5 flex items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                <span className="font-bold text-slate-900">Siap dibagikan?</span> Hasil tajam
                1080×1080px
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenShareModal}
                  className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 cursor-pointer"
                >
                  Caption WA
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadPng(false)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#D92D20] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#B91C1C] cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  Simpan PNG
                </button>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* =====================================================================
          TOAST NOTIFICATION
      ===================================================================== */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#16A34A] text-white">
            <Check className="h-3.5 w-3.5 stroke-[3]" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =====================================================================
          MODALS (SHARE & CAPTION, CAMERA SELFIE, ABOUT WIDODO GURU SD)
      ===================================================================== */}
      <ShareCaptionModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        previewDataUrl={sharePreviewUrl}
        template={activeTemplate}
        textState={textState}
        onDownloadPng={handleDownloadPng}
      />

      <CameraModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={(dataUrl) => {
          setPhotoState((prev) => ({
            ...prev,
            src: dataUrl,
            label: 'Foto Kamera Selfie',
            scale: 1,
            rotation: 0,
            x: 0,
            y: 0,
            flipH: false,
          }));
          triggerToast('Foto kamera berhasil dipasang ke Twibbon!');
        }}
      />

      <AboutWidodoModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      <ManageTwibbonModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        frames={customFrames}
        activeCustomFrameId={activeCustomFrameId}
        onCreate={handleCreateCustomFrame}
        onUpdate={handleUpdateCustomFrame}
        onDelete={handleDeleteCustomFrame}
        onUse={handleUseCustomFrame}
        onShareCampaign={(frame) => setCampaignShareFrame(frame)}
        onNotify={triggerToast}
      />

      <CampaignShareModal
        isOpen={campaignShareFrame !== null}
        onClose={() => setCampaignShareFrame(null)}
        frame={campaignShareFrame}
        onNotify={triggerToast}
      />
    </div>
  );
}

export default App;
