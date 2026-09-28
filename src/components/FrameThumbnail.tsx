import React, { useEffect, useRef } from 'react';
import { TwibbonTemplate } from '../types/twibbon';
import { renderTwibbonCanvas } from '../utils/canvasRenderer';
import { Check, Sparkles } from 'lucide-react';

interface FrameThumbnailProps {
  template: TwibbonTemplate;
  isSelected: boolean;
  onSelect: (template: TwibbonTemplate) => void;
}

export const FrameThumbnail: React.FC<FrameThumbnailProps> = ({
  template,
  isSelected,
  onSelect,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    renderTwibbonCanvas({
      ctx,
      width: 216,
      height: 216,
      template,
      photoImg: null,
      customFrameImg: null,
      photoState: {
        src: null,
        label: '',
        scale: 1,
        rotation: 0,
        x: 0,
        y: 0,
        flipH: false,
        brightness: 100,
        contrast: 100,
        saturation: 100,
        filterPreset: 'normal',
        bgColor: '#F8FAFC',
      },
      textState: {
        topTitle: template.defaultTopTitle,
        subtitle: template.defaultSubtitle,
        personName: 'Widodo, S.Pd.',
        roleOrClass: 'Guru SD Inspiratif',
        schoolName: template.defaultSchoolName,
        fontFamily: 'Fredoka',
        primaryColorOverride: null,
        secondaryColorOverride: null,
        accentColorOverride: null,
        cutoutShapeOverride: null,
        ribbonStyleOverride: null,
        showWidodoWatermark: true,
        showTopHeader: true,
        showBottomBanner: true,
      },
      stickers: [],
      selectedStickerId: null,
      showGrid: false,
      isExporting: false,
    });
  }, [template]);

  return (
    <button
      type="button"
      onClick={() => onSelect(template)}
      className={`group relative flex flex-col rounded-2xl border-2 p-2.5 text-left transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'border-[#D92D20] bg-[#FFF5F5] shadow-md ring-2 ring-[#D92D20]/20'
          : 'border-[#E2E8F0] bg-white hover:border-[#F59E0B] hover:shadow-sm'
      }`}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-checkerboard border border-slate-200/80">
        <canvas
          ref={canvasRef}
          width={216}
          height={216}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />

        {template.popular && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-[#F59E0B] px-2 py-0.5 text-[10px] font-bold text-slate-900 shadow-sm">
            <Sparkles className="h-2.5 w-2.5" />
            Populer
          </span>
        )}

        {isSelected && (
          <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#D92D20] text-white shadow-md">
            <Check className="h-3.5 w-3.5 stroke-[3]" />
          </div>
        )}
      </div>

      <div className="mt-2.5 flex flex-col">
        <span className="line-clamp-1 font-display text-sm font-semibold text-slate-800 group-hover:text-[#D92D20]">
          {template.name}
        </span>
        <span className="mt-0.5 line-clamp-1 text-[11px] text-slate-500">
          {template.badgeText}
        </span>
      </div>
    </button>
  );
};
