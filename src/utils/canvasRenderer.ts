import {
  CutoutShape,
  PhotoState,
  PlacedSticker,
  RibbonStyle,
  StickerType,
  TextOverlayState,
  TwibbonTemplate,
} from '../types/twibbon';

export interface RenderOptions {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  template: TwibbonTemplate;
  photoImg: HTMLImageElement | null;
  customFrameImg: HTMLImageElement | null;
  photoState: PhotoState;
  textState: TextOverlayState;
  stickers: PlacedSticker[];
  selectedStickerId: string | null;
  showGrid: boolean;
  isExporting: boolean;
}

/**
 * Helper to trace the cutout path in 1080x1080 coordinate space
 */
export function traceCutoutPath(
  ctx: CanvasRenderingContext2D,
  shape: CutoutShape,
  cx: number,
  cy: number,
  radius: number
) {
  ctx.beginPath();
  if (shape === 'circle') {
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  } else if (shape === 'squircle') {
    const size = radius * 1.92;
    const half = size / 2;
    const r = radius * 0.38;
    ctx.roundRect(cx - half, cy - half, size, size, r);
  } else if (shape === 'shield') {
    const w = radius * 1.9;
    const h = radius * 2.02;
    const topY = cy - h * 0.48;
    const botY = cy + h * 0.52;
    ctx.moveTo(cx, topY);
    ctx.bezierCurveTo(cx + w * 0.3, topY, cx + w * 0.5, topY + 20, cx + w * 0.5, topY + h * 0.12);
    ctx.bezierCurveTo(
      cx + w * 0.5,
      cy + h * 0.15,
      cx + w * 0.28,
      botY - h * 0.12,
      cx,
      botY
    );
    ctx.bezierCurveTo(
      cx - w * 0.28,
      botY - h * 0.12,
      cx - w * 0.5,
      cy + h * 0.15,
      cx - w * 0.5,
      topY + h * 0.12
    );
    ctx.bezierCurveTo(cx - w * 0.5, topY + 20, cx - w * 0.3, topY, cx, topY);
  } else if (shape === 'arch') {
    const w = radius * 1.86;
    const h = radius * 1.98;
    const left = cx - w / 2;
    const right = cx + w / 2;
    const bot = cy + h * 0.48;
    const topPeak = cy - h * 0.52;
    const archStart = cy - h * 0.08;
    ctx.moveTo(left, bot);
    ctx.lineTo(left, archStart);
    ctx.bezierCurveTo(left, topPeak + 70, cx - 70, topPeak + 20, cx, topPeak);
    ctx.bezierCurveTo(cx + 70, topPeak + 20, right, topPeak + 70, right, archStart);
    ctx.lineTo(right, bot);
    ctx.quadraticCurveTo(cx, bot + 25, left, bot);
  } else if (shape === 'hexagon') {
    const sides = 6;
    const r = radius * 1.04;
    for (let i = 0; i < sides; i++) {
      const angle = (i * Math.PI) / 3 - Math.PI / 6;
      const px = cx + r * Math.cos(angle);
      const py = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
  }
  ctx.closePath();
}

/**
 * Draw a 5-pointed star
 */
function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number,
  fill: string,
  stroke?: string,
  lineWidth = 3
) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

/**
 * Auto-fitting text helper
 */
function fillFittedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  initialFontSize: number,
  minFontSize: number,
  fontWeight: string,
  fontFamily: string,
  fillStyle: string,
  strokeStyle?: string,
  strokeWidth = 0
) {
  let fontSize = initialFontSize;
  ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}", sans-serif`;
  while (ctx.measureText(text).width > maxWidth && fontSize > minFontSize) {
    fontSize -= 1.5;
    ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}", sans-serif`;
  }
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (strokeStyle && strokeWidth > 0) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = strokeWidth;
    ctx.lineJoin = 'round';
    ctx.strokeText(text, x, y);
  }
  ctx.fillStyle = fillStyle;
  ctx.fillText(text, x, y);
}

/**
 * Draw individual vector educational sticker centered at (0,0) in local coordinates
 */
export function drawStickerVector(ctx: CanvasRenderingContext2D, type: StickerType) {
  ctx.save();
  switch (type) {
    case 'widodo-official': {
      // Official Widodo Guru SD Red-Gold-White Crest Badge
      ctx.beginPath();
      ctx.arc(0, 0, 68, 0, Math.PI * 2);
      ctx.fillStyle = '#D92D20';
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, 58, 0, Math.PI * 2);
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Open Book & Star inside
      drawStar(ctx, 0, -24, 5, 16, 7, '#FBBF24', '#FFFFFF', 1.5);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 17px "Fredoka", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('WIDODO', 0, 4);
      ctx.fillStyle = '#FDE68A';
      ctx.font = '700 14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('GURU SD', 0, 22);

      // Bottom mini ribbon
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.roundRect(-48, 34, 96, 22, 11);
      ctx.fill();
      ctx.fillStyle = '#1E293B';
      ctx.font = '800 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('PENDIDIKAN SD', 0, 46);
      break;
    }

    case 'tut-wuri': {
      // Simbol Pendidikan Pentagon Crest
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const x = Math.cos(angle) * 66;
        const y = Math.sin(angle) * 66;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = '#0284C7';
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#F59E0B';
      ctx.stroke();

      // Golden Wings & Book motif
      drawStar(ctx, 0, -22, 5, 18, 8, '#FBBF24');
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(-30, 0, 60, 26, 6);
      ctx.fill();
      ctx.strokeStyle = '#0284C7';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 26);
      ctx.stroke();

      ctx.fillStyle = '#FEF08A';
      ctx.font = '800 11px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('INSAN CENDEKIA', 0, 42);
      break;
    }

    case 'merah-putih': {
      // Waving Merah Putih Ribbon Rosette
      // Ribbon tails
      ctx.fillStyle = '#D92D20';
      ctx.beginPath();
      ctx.moveTo(-28, 30);
      ctx.lineTo(-45, 82);
      ctx.lineTo(-22, 70);
      ctx.lineTo(-8, 84);
      ctx.lineTo(-5, 30);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(5, 30);
      ctx.lineTo(8, 84);
      ctx.lineTo(22, 70);
      ctx.lineTo(45, 82);
      ctx.lineTo(28, 30);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Rosette circle
      ctx.beginPath();
      ctx.arc(0, 0, 52, 0, Math.PI * 2);
      ctx.fillStyle = '#F59E0B';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // Red upper half
      ctx.beginPath();
      ctx.arc(0, 0, 42, Math.PI, 0);
      ctx.closePath();
      ctx.fillStyle = '#D92D20';
      ctx.fill();

      // White lower half
      ctx.beginPath();
      ctx.arc(0, 0, 42, 0, Math.PI);
      ctx.closePath();
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      ctx.fillStyle = '#1E293B';
      ctx.font = '800 12px "Fredoka", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('INDONESIA', 0, 18);
      break;
    }

    case 'juara-1': {
      // Gold Star Medal
      ctx.fillStyle = '#D92D20';
      ctx.beginPath();
      ctx.moveTo(-26, -65);
      ctx.lineTo(26, -65);
      ctx.lineTo(16, -20);
      ctx.lineTo(-16, -20);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 15, 50, 0, Math.PI * 2);
      ctx.fillStyle = '#F59E0B';
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#FEF08A';
      ctx.stroke();

      drawStar(ctx, 0, 10, 5, 28, 13, '#FFFBEB', '#D97706', 2);
      ctx.fillStyle = '#78350F';
      ctx.font = '800 14px "Fredoka", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('JUARA', 0, 48);
      break;
    }

    case 'buku-pensil': {
      // Cheerful Book & Pencil Badge
      ctx.beginPath();
      ctx.arc(0, 0, 56, 0, Math.PI * 2);
      ctx.fillStyle = '#FEF3C7';
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#F59E0B';
      ctx.stroke();

      // Book base
      ctx.fillStyle = '#1D4ED8';
      ctx.beginPath();
      ctx.roundRect(-38, -8, 76, 40, 8);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(-32, -14, 64, 38, 6);
      ctx.fill();
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(0, 24);
      ctx.stroke();

      // Pencil diagonal
      ctx.save();
      ctx.rotate(-0.45);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(-10, -45, 20, 52);
      ctx.fillStyle = '#F87171';
      ctx.fillRect(-10, -55, 20, 10);
      ctx.fillStyle = '#FDE68A';
      ctx.beginPath();
      ctx.moveTo(-10, 7);
      ctx.lineTo(10, 7);
      ctx.lineTo(0, 24);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      break;
    }

    case 'piala-emas': {
      // Golden Trophy Cup
      ctx.beginPath();
      ctx.arc(0, 0, 58, 0, Math.PI * 2);
      ctx.fillStyle = '#1E293B';
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#F59E0B';
      ctx.stroke();

      // Cup
      ctx.fillStyle = '#FBBF24';
      ctx.beginPath();
      ctx.moveTo(-28, -32);
      ctx.lineTo(28, -32);
      ctx.quadraticCurveTo(26, 12, 0, 16);
      ctx.quadraticCurveTo(-26, 12, -28, -32);
      ctx.closePath();
      ctx.fill();

      // Stem & Base
      ctx.fillRect(-6, 14, 12, 18);
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.roundRect(-24, 30, 48, 12, 4);
      ctx.fill();

      drawStar(ctx, 0, -12, 5, 13, 6, '#FFFFFF');
      break;
    }

    case 'anak-hebat': {
      // Pill sticker "AKU ANAK HEBAT"
      ctx.beginPath();
      ctx.roundRect(-78, -34, 156, 68, 34);
      ctx.fillStyle = '#16A34A';
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      drawStar(ctx, -48, 0, 5, 18, 8, '#FACC15');
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 16px "Fredoka", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('AKU ANAK', 14, -7);
      ctx.fillStyle = '#FEF08A';
      ctx.font = '800 19px "Fredoka", sans-serif';
      ctx.fillText('HEBAT!', 14, 15);
      break;
    }

    case 'guru-inspiratif': {
      // Pill sticker "GURU INSPIRATIF"
      ctx.beginPath();
      ctx.roundRect(-82, -34, 164, 68, 34);
      ctx.fillStyle = '#1D4ED8';
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#F59E0B';
      ctx.stroke();

      drawStar(ctx, -52, 0, 5, 18, 8, '#FBBF24');
      ctx.fillStyle = '#FDE68A';
      ctx.font = '700 14px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PENDIDIK TELADAN', 14, -8);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 16px "Fredoka", sans-serif';
      ctx.fillText('GURU INSPIRATIF', 14, 14);
      break;
    }

    case 'topi-wisuda': {
      // Mortarboard Graduation Cap
      ctx.fillStyle = '#1E293B';
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, -38);
      ctx.lineTo(68, -8);
      ctx.lineTo(0, 22);
      ctx.lineTo(-68, -8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Cap skull base
      ctx.beginPath();
      ctx.moveTo(-36, 8);
      ctx.lineTo(-36, 32);
      ctx.quadraticCurveTo(0, 48, 36, 32);
      ctx.lineTo(36, 8);
      ctx.closePath();
      ctx.fillStyle = '#334155';
      ctx.fill();
      ctx.stroke();

      // Gold Tassel
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, -8);
      ctx.quadraticCurveTo(45, 5, 52, 38);
      ctx.stroke();
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(52, 40, 8, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'tunas-pramuka': {
      // Scout / Pramuka Badge
      ctx.beginPath();
      ctx.arc(0, 0, 56, 0, Math.PI * 2);
      ctx.fillStyle = '#78350F';
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#F59E0B';
      ctx.stroke();

      drawStar(ctx, 0, -24, 5, 14, 6, '#FBBF24');
      ctx.fillStyle = '#FEF3C7';
      ctx.font = '800 15px "Fredoka", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PRAMUKA', 0, 6);
      ctx.fillStyle = '#FDE68A';
      ctx.font = '700 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('SIAGA & PENGGALANG', 0, 24);
      break;
    }
  }
  ctx.restore();
}

/**
 * Main High-Resolution Twibbon Renderer (1080x1080 coordinate system scaled to target width/height)
 */
export function renderTwibbonCanvas(options: RenderOptions) {
  const {
    ctx,
    width,
    height,
    template,
    photoImg,
    customFrameImg,
    photoState,
    textState,
    stickers,
    selectedStickerId,
    showGrid,
    isExporting,
  } = options;

  const scaleFactor = width / 1080;
  ctx.save();
  ctx.clearRect(0, 0, width, height);
  ctx.scale(scaleFactor, scaleFactor);

  // Resolve colors and styles with user overrides
  const primaryColor = textState.primaryColorOverride || template.primaryColor;
  const secondaryColor = textState.secondaryColorOverride || template.secondaryColor;
  const accentColor = textState.accentColorOverride || template.accentColor;
  const cutoutShape = textState.cutoutShapeOverride || template.cutoutShape;
  const ribbonStyle = textState.ribbonStyleOverride || template.ribbonStyle;

  const holeCenterX = 540;
  const holeCenterY = 485;
  const holeRadius = 328;

  // =========================================================================
  // LAYER 1 & 2: PHOTO BACKGROUND + USER PHOTO
  // =========================================================================
  ctx.save();
  // If user has a photo or chose a solid background fill, draw it
  if (photoImg || isExporting) {
    ctx.fillStyle = photoState.bgColor || '#F8FAFC';
    ctx.fillRect(0, 0, 1080, 1080);
  }

  if (photoImg) {
    ctx.save();
    // Apply photo filters
    let b = photoState.brightness;
    let c = photoState.contrast;
    let s = photoState.saturation;
    let extraFilter = '';

    if (photoState.filterPreset === 'cerah') {
      b += 12;
      c += 8;
      s += 18;
    } else if (photoState.filterPreset === 'hangat') {
      b += 5;
      s += 15;
      extraFilter = 'sepia(18%)';
    } else if (photoState.filterPreset === 'tajam') {
      c += 22;
      s += 10;
    } else if (photoState.filterPreset === 'bw') {
      s = 0;
      c += 12;
    }

    ctx.filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%) ${extraFilter}`.trim();

    // Transform around the cutout center
    ctx.translate(holeCenterX + photoState.x, holeCenterY + photoState.y);
    ctx.rotate((photoState.rotation * Math.PI) / 180);
    ctx.scale(photoState.flipH ? -photoState.scale : photoState.scale, photoState.scale);

    // Fit photo nicely into base dimension (~740px) before user scale
    const imgAspect = photoImg.width / photoImg.height;
    const baseSize = 740;
    let drawW = baseSize;
    let drawH = baseSize;
    if (imgAspect > 1) {
      drawH = baseSize;
      drawW = baseSize * imgAspect;
    } else {
      drawW = baseSize;
      drawH = baseSize / imgAspect;
    }

    ctx.drawImage(photoImg, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
  }
  ctx.restore();

  // =========================================================================
  // LAYER 3: TWIBBON FRAME OVERLAY (WITH TRANSPARENT CUTOUT)
  // =========================================================================
  if (customFrameImg) {
    // If user uploaded their own custom transparent PNG frame
    ctx.drawImage(customFrameImg, 0, 0, 1080, 1080);
  } else {
    // Draw Procedural High-Res Indonesian SD Frame using an offscreen mask or even-odd / composite
    const frameCanvas = document.createElement('canvas');
    frameCanvas.width = 1080;
    frameCanvas.height = 1080;
    const fCtx = frameCanvas.getContext('2d');

    if (fCtx) {
      // 3A. Fill Base Frame Canvas with Rich Gradient
      const bgGrad = fCtx.createLinearGradient(0, 0, 1080, 1080);
      bgGrad.addColorStop(0, primaryColor);
      bgGrad.addColorStop(0.55, secondaryColor);
      bgGrad.addColorStop(1, primaryColor);
      fCtx.fillStyle = bgGrad;
      fCtx.fillRect(0, 0, 1080, 1080);

      // 3B. Draw Thematic Pattern & Ornaments on Frame Background
      drawThematicPattern(fCtx, template.patternType, primaryColor, secondaryColor, accentColor);

      // 3C. Outer Border Frame & Corner Ornaments
      fCtx.save();
      fCtx.strokeStyle = 'rgba(255, 255, 255, 0.32)';
      fCtx.lineWidth = 6;
      fCtx.strokeRect(28, 28, 1024, 1024);

      fCtx.strokeStyle = accentColor;
      fCtx.lineWidth = 4;
      fCtx.strokeRect(40, 40, 1000, 1000);
      fCtx.restore();

      // 3D. Punch Out the Transparent Cutout Hole!
      fCtx.save();
      fCtx.globalCompositeOperation = 'destination-out';
      traceCutoutPath(fCtx, cutoutShape, holeCenterX, holeCenterY, holeRadius);
      fCtx.fill();
      fCtx.restore();

      // 3E. Draw Multi-Layer Decorative Ring Around Cutout Hole
      fCtx.save();
      // Drop shadow into hole & frame
      fCtx.shadowColor = 'rgba(15, 23, 42, 0.35)';
      fCtx.shadowBlur = 24;
      fCtx.shadowOffsetY = 8;
      traceCutoutPath(fCtx, cutoutShape, holeCenterX, holeCenterY, holeRadius + 14);
      fCtx.strokeStyle = '#FFFFFF';
      fCtx.lineWidth = 22;
      fCtx.stroke();
      fCtx.restore();

      // Gold/Accent inner ring
      fCtx.save();
      traceCutoutPath(fCtx, cutoutShape, holeCenterX, holeCenterY, holeRadius + 4);
      fCtx.strokeStyle = accentColor;
      fCtx.lineWidth = 9;
      fCtx.stroke();
      fCtx.restore();

      // Dotted academic ring outside
      fCtx.save();
      fCtx.setLineDash([12, 10]);
      traceCutoutPath(fCtx, cutoutShape, holeCenterX, holeCenterY, holeRadius + 32);
      fCtx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
      fCtx.lineWidth = 4;
      fCtx.stroke();
      fCtx.restore();

      // Composite the frame onto main canvas
      ctx.drawImage(frameCanvas, 0, 0);
    }
  }

  // =========================================================================
  // LAYER 4: TOP HEADER & BOTTOM IDENTITY RIBBON + DYNAMIC TYPOGRAPHY
  // =========================================================================
  const fontFam = textState.fontFamily || 'Fredoka';

  // 4A. Top Campaign Header
  if (textState.showTopHeader) {
    ctx.save();
    // Top Badge Pill (e.g. "AKU SIAP MASUK SD!")
    if (template.badgeText) {
      ctx.fillStyle = accentColor;
      ctx.shadowColor = 'rgba(0,0,0,0.2)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.roundRect(330, 36, 420, 42, 21);
      ctx.fill();
      ctx.shadowBlur = 0;

      fillFittedText(
        ctx,
        template.badgeText.toUpperCase(),
        540,
        58,
        390,
        22,
        14,
        '800',
        fontFam,
        '#1E293B'
      );
    }

    // Main Top Title
    if (textState.topTitle.trim()) {
      fillFittedText(
        ctx,
        textState.topTitle.toUpperCase(),
        540,
        106,
        920,
        38,
        20,
        '800',
        fontFam,
        '#FFFFFF',
        'rgba(15, 23, 42, 0.65)',
        8
      );
    }

    // Subtitle
    if (textState.subtitle.trim()) {
      fillFittedText(
        ctx,
        textState.subtitle,
        540,
        142,
        880,
        21,
        13,
        '600',
        'Plus Jakarta Sans',
        '#FEF08A',
        'rgba(15, 23, 42, 0.5)',
        4
      );
    }
    ctx.restore();
  }

  // 4B. Bottom Name, Role & School Ribbon Banner
  if (textState.showBottomBanner) {
    drawBottomIdentityBanner(
      ctx,
      ribbonStyle,
      primaryColor,
      secondaryColor,
      accentColor,
      textState,
      fontFam
    );
  }

  // 4C. Official "Widodo Guru SD" Brand Crest Watermark (Top-Left or Bottom-Right subtle badge)
  if (textState.showWidodoWatermark) {
    ctx.save();
    const wx = 540;
    const wy = 1044;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.beginPath();
    ctx.roundRect(wx - 175, wy - 18, 350, 32, 16);
    ctx.fill();
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    drawStar(ctx, wx - 148, wy - 2, 5, 9, 4, accentColor);
    drawStar(ctx, wx + 148, wy - 2, 5, 9, 4, accentColor);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 14px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('KREASI RESMI • WIDODO GURU SD', wx, wy - 1);
    ctx.restore();
  }

  // =========================================================================
  // LAYER 5: EDUCATIONAL STICKERS & BADGES
  // =========================================================================
  stickers.forEach((sticker) => {
    ctx.save();
    ctx.translate(sticker.x, sticker.y);
    ctx.rotate((sticker.rotation * Math.PI) / 180);
    ctx.scale(sticker.scale, sticker.scale);

    // Drop shadow for sticker
    ctx.shadowColor = 'rgba(15, 23, 42, 0.28)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;

    drawStickerVector(ctx, sticker.type);

    // Selection indicator if selected and not exporting
    if (!isExporting && sticker.id === selectedStickerId) {
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#D92D20';
      ctx.lineWidth = 3.5;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.roundRect(-86, -86, 172, 172, 16);
      ctx.stroke();
    }
    ctx.restore();
  });

  // =========================================================================
  // LAYER 6: OPTIONAL ALIGNMENT GRID (EDITOR ONLY, NEVER EXPORTED)
  // =========================================================================
  if (showGrid && !isExporting) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);

    // Crosshairs on cutout center
    ctx.beginPath();
    ctx.moveTo(holeCenterX, 150);
    ctx.lineTo(holeCenterX, 820);
    ctx.moveTo(200, holeCenterY);
    ctx.lineTo(880, holeCenterY);
    ctx.stroke();

    // Thirds grid
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.beginPath();
    ctx.moveTo(360, 0);
    ctx.lineTo(360, 1080);
    ctx.moveTo(720, 0);
    ctx.lineTo(720, 1080);
    ctx.moveTo(0, 360);
    ctx.lineTo(1080, 360);
    ctx.moveTo(0, 720);
    ctx.lineTo(1080, 720);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

/**
 * Draw Thematic Indonesian SD Patterns onto the Frame Background
 */
function drawThematicPattern(
  ctx: CanvasRenderingContext2D,
  patternType: TwibbonTemplate['patternType'],
  primaryColor: string,
  secondaryColor: string,
  accentColor: string
) {
  ctx.save();

  if (patternType === 'merah-putih-wave') {
    // Dynamic Red-White-Gold Waves for MPLS / PPDB
    ctx.fillStyle = '#FFFFFF';
    ctx.globalAlpha = 0.14;
    for (let r = 400; r <= 760; r += 60) {
      ctx.beginPath();
      ctx.arc(540, 485, r, 0, Math.PI * 2);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 14;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Top-left & Top-right Merah Putih waving swooshes
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(0, 260);
    ctx.quadraticCurveTo(180, 160, 380, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.moveTo(0, 210);
    ctx.quadraticCurveTo(150, 130, 310, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    // Bottom corner waves
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.moveTo(1080, 760);
    ctx.quadraticCurveTo(890, 910, 720, 1080);
    ctx.lineTo(1080, 1080);
    ctx.closePath();
    ctx.fill();

    // Cheerful Stars
    drawStar(ctx, 110, 420, 5, 22, 10, accentColor);
    drawStar(ctx, 970, 420, 5, 22, 10, accentColor);
    drawStar(ctx, 145, 620, 5, 16, 7, '#FFFFFF');
    drawStar(ctx, 935, 620, 5, 16, 7, '#FFFFFF');
  } else if (patternType === 'batik-guru') {
    // Geometric Kawung / Batik Nusantara pattern for Hari Guru Nasional
    ctx.strokeStyle = accentColor;
    ctx.globalAlpha = 0.22;
    ctx.lineWidth = 3;
    const gridSize = 90;
    for (let x = 0; x <= 1080; x += gridSize) {
      for (let y = 0; y <= 1080; y += gridSize) {
        ctx.beginPath();
        ctx.arc(x, y, gridSize / 2, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    // Gold corner ornaments
    const corners = [
      [0, 0],
      [1080, 0],
      [0, 1080],
      [1080, 1080],
    ];
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 170, 0, Math.PI * 2);
      ctx.fillStyle = accentColor;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, 145, 0, Math.PI * 2);
      ctx.fillStyle = secondaryColor;
      ctx.fill();
    });
  } else if (patternType === 'gold-laurel') {
    // Prestasi & Juara Kelas — Golden rays & laurel stars
    ctx.save();
    ctx.translate(540, 485);
    ctx.fillStyle = accentColor;
    ctx.globalAlpha = 0.14;
    for (let i = 0; i < 24; i++) {
      ctx.rotate((Math.PI * 2) / 24);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-35, -800);
      ctx.lineTo(35, -800);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // Laurel star arc on left and right of frame
    for (let i = -3; i <= 3; i++) {
      const angleLeft = Math.PI + i * 0.2;
      const lx = 540 + Math.cos(angleLeft) * 395;
      const ly = 485 + Math.sin(angleLeft) * 395;
      drawStar(ctx, lx, ly, 5, 18, 8, accentColor, '#FFFFFF', 2);

      const angleRight = i * 0.2;
      const rx = 540 + Math.cos(angleRight) * 395;
      const ry = 485 + Math.sin(angleRight) * 395;
      drawStar(ctx, rx, ry, 5, 18, 8, accentColor, '#FFFFFF', 2);
    }
  } else if (patternType === 'hardiknas-rays') {
    // Patriotic Sunburst + Merah Putih Flag Sweep
    ctx.save();
    ctx.translate(540, 485);
    for (let i = 0; i < 36; i++) {
      ctx.rotate((Math.PI * 2) / 36);
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(251,191,36,0.12)';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-25, -800);
      ctx.lineTo(25, -800);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // White lower wave
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.beginPath();
    ctx.moveTo(0, 780);
    ctx.quadraticCurveTo(540, 920, 1080, 780);
    ctx.lineTo(1080, 1080);
    ctx.lineTo(0, 1080);
    ctx.closePath();
    ctx.fill();
  } else if (patternType === 'nusantara-shield') {
    // Modern Geometric Polygons for PPDB
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(450, 0);
    ctx.lineTo(0, 450);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(1080, 0);
    ctx.lineTo(630, 0);
    ctx.lineTo(1080, 450);
    ctx.closePath();
    ctx.fill();

    // Accent dots along sides
    ctx.fillStyle = accentColor;
    for (let y = 260; y <= 720; y += 55) {
      ctx.beginPath();
      ctx.arc(92, y, 9, 0, Math.PI * 2);
      ctx.arc(988, y, 9, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (patternType === 'pramuka-scout') {
    // Scout Scarf Red-White Stripes in Corners
    ctx.lineWidth = 28;
    ctx.strokeStyle = '#D92D20';
    ctx.beginPath();
    ctx.moveTo(-40, 260);
    ctx.lineTo(260, -40);
    ctx.moveTo(820, 1120);
    ctx.lineTo(1120, 820);
    ctx.stroke();

    ctx.strokeStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(-40, 290);
    ctx.lineTo(290, -40);
    ctx.moveTo(790, 1120);
    ctx.lineTo(1120, 790);
    ctx.stroke();

    // Rope-like border accents
    drawStar(ctx, 115, 485, 5, 24, 10, accentColor, '#FFFFFF', 2);
    drawStar(ctx, 965, 485, 5, 24, 10, accentColor, '#FFFFFF', 2);
  } else if (patternType === 'ceria-confetti') {
    // Joyful Confetti & Stars for Graduation / Naik Kelas
    const colors = ['#FBBF24', '#F87171', '#38BDF8', '#4ADE80', '#FFFFFF', '#C084FC'];
    for (let i = 0; i < 48; i++) {
      const angle = (i * 137.5 * Math.PI) / 180;
      const dist = 390 + (i % 5) * 45;
      const cx = 540 + Math.cos(angle) * dist;
      const cy = 485 + Math.sin(angle) * dist;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.fillStyle = colors[i % colors.length];
      if (i % 3 === 0) {
        drawStar(ctx, 0, 0, 5, 16, 7, colors[i % colors.length]);
      } else if (i % 2 === 0) {
        ctx.fillRect(-12, -6, 24, 12);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, 9, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  } else if (patternType === 'islamic-arch') {
    // Hanging Lanterns & Eight-Pointed Rub el Hizb Stars
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 4;
    const lanternX = [115, 185, 895, 965];
    lanternX.forEach((lx, idx) => {
      const ly = idx % 2 === 0 ? 280 : 220;
      ctx.beginPath();
      ctx.moveTo(lx, 40);
      ctx.lineTo(lx, ly);
      ctx.stroke();

      // Lantern body
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(lx + 24, ly + 28);
      ctx.lineTo(lx + 16, ly + 68);
      ctx.lineTo(lx - 16, ly + 68);
      ctx.lineTo(lx - 24, ly + 28);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.arc(lx, ly + 42, 10, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  ctx.restore();
}

/**
 * Draw the Bottom Identity Banner (Student/Teacher Name, Class/Role, School Name)
 */
function drawBottomIdentityBanner(
  ctx: CanvasRenderingContext2D,
  ribbonStyle: RibbonStyle,
  primaryColor: string,
  secondaryColor: string,
  accentColor: string,
  textState: TextOverlayState,
  fontFam: string
) {
  ctx.save();

  const centerX = 540;
  const bannerY = 855;

  // Shadow for banner
  ctx.shadowColor = 'rgba(15, 23, 42, 0.38)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;

  if (ribbonStyle === 'curved-ribbon') {
    // Ribbon ends (tails)
    ctx.fillStyle = secondaryColor;
    ctx.beginPath();
    ctx.moveTo(100, bannerY + 20);
    ctx.lineTo(55, bannerY - 5);
    ctx.lineTo(80, bannerY + 45);
    ctx.lineTo(50, bannerY + 90);
    ctx.lineTo(140, bannerY + 85);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(980, bannerY + 20);
    ctx.lineTo(1025, bannerY - 5);
    ctx.lineTo(1000, bannerY + 45);
    ctx.lineTo(1030, bannerY + 90);
    ctx.lineTo(940, bannerY + 85);
    ctx.closePath();
    ctx.fill();

    // Main White & Gold Card Plate
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(115, bannerY - 32, 850, 118, 28);
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = accentColor;
    ctx.stroke();
  } else if (ribbonStyle === 'modern-pill') {
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(105, bannerY - 32, 870, 118, 59);
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = primaryColor;
    ctx.stroke();

    // Inner accent border
    ctx.lineWidth = 3;
    ctx.strokeStyle = accentColor;
    ctx.beginPath();
    ctx.roundRect(115, bannerY - 22, 850, 98, 49);
    ctx.stroke();
  } else if (ribbonStyle === 'academic-crest') {
    // Shield-like academic nameplate
    ctx.fillStyle = '#FFFBEB';
    ctx.beginPath();
    ctx.moveTo(140, bannerY - 32);
    ctx.lineTo(940, bannerY - 32);
    ctx.lineTo(975, bannerY + 27);
    ctx.lineTo(940, bannerY + 86);
    ctx.lineTo(140, bannerY + 86);
    ctx.lineTo(105, bannerY + 27);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = accentColor;
    ctx.stroke();
  } else {
    // 'classic-banner'
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(95, bannerY - 32, 890, 118, 16);
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = accentColor;
    ctx.stroke();
  }

  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Draw Person Name (Student / Teacher Name)
  const displayPersonName = textState.personName.trim() || 'Nama Siswa / Guru SD';
  fillFittedText(
    ctx,
    displayPersonName,
    centerX,
    bannerY + 6,
    780,
    38,
    20,
    '800',
    fontFam,
    primaryColor
  );

  // Draw Role / Class Pill inside banner
  const displayRole = textState.roleOrClass.trim() || 'Kelas / Jabatan Sekolah';
  fillFittedText(
    ctx,
    displayRole,
    centerX,
    bannerY + 52,
    760,
    23,
    14,
    '700',
    'Plus Jakarta Sans',
    '#334155'
  );

  // Draw School Name Pill below main banner
  if (textState.schoolName.trim()) {
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.roundRect(190, bannerY + 100, 700, 44, 22);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    fillFittedText(
      ctx,
      textState.schoolName.toUpperCase(),
      centerX,
      bannerY + 123,
      650,
      20,
      12,
      '800',
      'Plus Jakarta Sans',
      '#FFFFFF'
    );
  }

  ctx.restore();
}
