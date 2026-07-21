import { useAppStore } from '../../store/useAppStore';

export default function ImageLightbox() {
  const lightboxImageId = useAppStore((s) => s.lightboxImageId);
  const closeLightbox = useAppStore((s) => s.closeLightbox);
  const allImages = [
    ...useAppStore((s) => s.generatedImages),
    ...useAppStore((s) => s.history),
    ...useAppStore((s) => s.favorites),
  ];

  const img = allImages.find((i) => i.id === lightboxImageId);
  if (!img || !lightboxImageId) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center animate-fade-slide-in"
      onClick={closeLightbox}
    >
      {/* Close button */}
      <button
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer"
        onClick={closeLightbox}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Image */}
      <img
        src={img.dataUrl}
        alt="Pattern full view"
        className="max-w-[85vw] max-h-[85vh] object-contain rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Info overlay */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-xs flex items-center gap-4">
        <span>类别：{img.params.category}</span>
        <span>种子：{img.params.seed ?? '随机'}</span>
        <span>风格强度：{img.params.styleStrength}%</span>
      </div>
    </div>
  );
}
