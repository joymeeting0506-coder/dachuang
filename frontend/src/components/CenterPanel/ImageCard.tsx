import { useAppStore } from '../../store/useAppStore';

export default function ImageCard({ imageId }: { imageId: string }) {
  const generatedImages = useAppStore((s) => s.generatedImages);
  const selectedImageId = useAppStore((s) => s.selectedImageId);
  const comparisonMode = useAppStore((s) => s.comparisonMode);
  const checkedImageIds = useAppStore((s) => s.checkedImageIds);
  const selectImage = useAppStore((s) => s.selectImage);
  const openLightbox = useAppStore((s) => s.openLightbox);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const reeditFromImage = useAppStore((s) => s.reeditFromImage);
  const exportImage = useAppStore((s) => s.exportImage);
  const toggleImageCheck = useAppStore((s) => s.toggleImageCheck);

  const img = generatedImages.find((i) => i.id === imageId);
  if (!img) return null;

  const isSelected = selectedImageId === imageId;
  const isChecked = checkedImageIds.has(imageId);

  return (
    <div
      className={`image-card group ${isSelected ? 'ring-2 ring-vermilion-500 ring-offset-2 ring-offset-cream-100' : ''}`}
      onClick={() => selectImage(imageId)}
    >
      <img
        src={img.dataUrl}
        alt={`Generated pattern ${imageId}`}
        className="w-full aspect-square object-cover"
        loading="lazy"
      />

      {/* Comparison checkbox */}
      {comparisonMode && (
        <div className="absolute top-3 left-3 z-20">
          <button
            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${
              isChecked
                ? 'bg-vermilion-500 border-vermilion-500 text-white'
                : 'bg-white/80 border-gray-300 hover:border-vermilion-400'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              toggleImageCheck(imageId);
            }}
          >
            {isChecked && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center pb-3 gap-2">
        <button
          className="bg-white/90 backdrop-blur-sm text-vermilion-700 rounded-lg px-3 py-1.5 text-xs font-medium flex items-center gap-1 hover:bg-white transition-all cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(imageId);
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill={img.isFavorited ? '#C43B3B' : 'none'} stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          收藏
        </button>
        <button
          className="bg-white/90 backdrop-blur-sm text-vermilion-700 rounded-lg px-3 py-1.5 text-xs font-medium flex items-center gap-1 hover:bg-white transition-all cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            reeditFromImage(imageId);
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
          二次编辑
        </button>
        <button
          className="bg-white/90 backdrop-blur-sm text-vermilion-700 rounded-lg px-3 py-1.5 text-xs font-medium flex items-center gap-1 hover:bg-white transition-all cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            exportImage(imageId, 'png');
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          导出
        </button>
      </div>

      {/* Click to enlarge indicator — bottom right */}
      <button
        className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer hover:bg-white"
        onClick={(e) => {
          e.stopPropagation();
          openLightbox(imageId);
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5E1E1E" strokeWidth="2">
          <polyline points="15 3 21 3 21 9" />
          <polyline points="9 21 3 21 3 15" />
          <line x1="21" y1="3" x2="14" y2="10" />
          <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
      </button>
    </div>
  );
}
