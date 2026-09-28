import React, { useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw, X, AlertCircle } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  useEffect(() => {
    if (!isOpen) return;

    let stream: MediaStream | null = null;
    setError(null);

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 1080 }, height: { ideal: 1080 } },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        setError(
          'Tidak dapat mengakses kamera. Pastikan izin kamera telah diaktifkan di browser Anda atau gunakan tombol Unggah Foto dari perangkat.'
        );
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, facingMode]);

  if (!isOpen) return null;

  const handleSnap = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    const canvas = document.createElement('canvas');
    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;

    if (facingMode === 'user') {
      ctx.translate(size, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);
    const dataUrl = canvas.toDataURL('image/png');
    onCapture(dataUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D92D20]/10 text-[#D92D20]">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-slate-900">
                Ambil Foto Kamera
              </h3>
              <p className="text-xs text-slate-500">
                Posisikan wajah di tengah lingkaran
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          {error ? (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-red-50 p-6 text-center text-red-700">
              <AlertCircle className="mb-2 h-10 w-10 text-red-500" />
              <p className="text-xs leading-relaxed">{error}</p>
            </div>
          ) : (
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-900">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`h-full w-full object-cover ${
                  facingMode === 'user' ? '-scale-x-100' : ''
                }`}
              />
              {/* Circular guide overlay */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-3/4 w-3/4 rounded-full border-2 border-dashed border-white/70 shadow-[0_0_0_9999px_rgba(15,23,42,0.35)]" />
              </div>
            </div>
          )}

          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() =>
                setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
              }
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Putar Kamera
            </button>

            <button
              type="button"
              disabled={!!error}
              onClick={handleSnap}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#D92D20] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#B91C1C] disabled:opacity-50 cursor-pointer"
            >
              <Camera className="h-4 w-4" />
              Jepret & Gunakan Foto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
