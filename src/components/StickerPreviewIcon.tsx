import React, { useEffect, useRef } from 'react';
import { StickerType } from '../types/twibbon';
import { drawStickerVector } from '../utils/canvasRenderer';

interface StickerPreviewIconProps {
  type: StickerType;
}

export const StickerPreviewIcon: React.FC<StickerPreviewIconProps> = ({ type }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 120, 120);
    ctx.save();
    ctx.translate(60, 60);
    ctx.scale(0.62, 0.62);
    drawStickerVector(ctx, type);
    ctx.restore();
  }, [type]);

  return (
    <canvas
      ref={canvasRef}
      width={120}
      height={120}
      className="h-14 w-14 object-contain transition-transform duration-200 group-hover:scale-110"
    />
  );
};
