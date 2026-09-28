export type FrameCategory = 'semua' | 'ppdb' | 'nasional' | 'prestasi' | 'kegiatan';

export type CutoutShape = 'circle' | 'squircle' | 'shield' | 'arch' | 'hexagon';

export type RibbonStyle = 'curved-ribbon' | 'modern-pill' | 'classic-banner' | 'academic-crest';

export type FramePatternType =
  | 'merah-putih-wave'
  | 'batik-guru'
  | 'gold-laurel'
  | 'pramuka-scout'
  | 'islamic-arch'
  | 'ceria-confetti'
  | 'nusantara-shield'
  | 'hardiknas-rays';

export interface TwibbonTemplate {
  id: string;
  name: string;
  category: Exclude<FrameCategory, 'semua'>;
  badgeText: string;
  defaultTopTitle: string;
  defaultSubtitle: string;
  defaultSchoolName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  cutoutShape: CutoutShape;
  ribbonStyle: RibbonStyle;
  patternType: FramePatternType;
  description: string;
  popular?: boolean;
}

export interface CustomTwibbonFrame {
  id: string;
  name: string;
  campaignTitle: string;
  campaignSubtitle: string;
  category: Exclude<FrameCategory, 'semua'>;
  organizerName: string;
  hashtags: string;
  dataUrl: string; // The transparent PNG frame as a data URL
  showTextByDefault: boolean;
  createdAt: number;
  updatedAt: number;
}

export type FilterPreset = 'normal' | 'cerah' | 'hangat' | 'tajam' | 'bw';

export interface PhotoState {
  src: string | null;
  label: string;
  scale: number;
  rotation: number;
  x: number;
  y: number;
  flipH: boolean;
  brightness: number;
  contrast: number;
  saturation: number;
  filterPreset: FilterPreset;
  bgColor: string;
}

export interface TextOverlayState {
  topTitle: string;
  subtitle: string;
  personName: string;
  roleOrClass: string;
  schoolName: string;
  fontFamily: 'Fredoka' | 'Plus Jakarta Sans' | 'Georgia';
  primaryColorOverride: string | null;
  secondaryColorOverride: string | null;
  accentColorOverride: string | null;
  cutoutShapeOverride: CutoutShape | null;
  ribbonStyleOverride: RibbonStyle | null;
  showWidodoWatermark: boolean;
  showTopHeader: boolean;
  showBottomBanner: boolean;
}

export type StickerType =
  | 'widodo-official'
  | 'tut-wuri'
  | 'merah-putih'
  | 'juara-1'
  | 'buku-pensil'
  | 'piala-emas'
  | 'anak-hebat'
  | 'guru-inspiratif'
  | 'topi-wisuda'
  | 'tunas-pramuka';

export interface StickerCatalogItem {
  type: StickerType;
  label: string;
  category: string;
  defaultX: number;
  defaultY: number;
}

export interface PlacedSticker {
  id: string;
  type: StickerType;
  label: string;
  x: number; // in 1080x1080 space
  y: number; // in 1080x1080 space
  scale: number;
  rotation: number;
}
