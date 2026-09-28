/**
 * Load a File into an HTMLImageElement
 */
export function fileToImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Gagal memuat gambar'));
      img.src = result;
    };
    reader.onerror = () => reject(new Error('Gagal membaca file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Normalize any uploaded transparent PNG frame into a centered, contained
 * 1080x1080 PNG data URL — preserving the alpha channel (transparency).
 */
export function normalizeFrameToDataUrl(
  img: HTMLImageElement,
  targetSize = 1080
): string {
  const canvas = document.createElement('canvas');
  canvas.width = targetSize;
  canvas.height = targetSize;
  const ctx = canvas.getContext('2d');
  if (!ctx) return img.src;

  ctx.clearRect(0, 0, targetSize, targetSize);

  const imgAspect = img.width / img.height;

  // If already square (or close), just stretch to fill the square canvas.
  if (Math.abs(imgAspect - 1) < 0.02) {
    ctx.drawImage(img, 0, 0, targetSize, targetSize);
  } else {
    // Otherwise contain it within the square, centered, keeping transparency.
    let drawW = targetSize;
    let drawH = targetSize;
    if (imgAspect > 1) {
      drawW = targetSize;
      drawH = targetSize / imgAspect;
    } else {
      drawH = targetSize;
      drawW = targetSize * imgAspect;
    }
    const dx = (targetSize - drawW) / 2;
    const dy = (targetSize - drawH) / 2;
    ctx.drawImage(img, dx, dy, drawW, drawH);
  }

  return canvas.toDataURL('image/png');
}

/**
 * Build a small thumbnail data URL (for library cards) to save memory.
 */
export function makeThumbnail(dataUrl: string, size = 240): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}
