import { formatTime } from '../../utils/formatTime';
import { CATEGORY_LABELS } from '../../store/types';
import type { GeneratedImage } from '../../store/types';

export default function HistoryThumbnail({ image, onClick }: { image: GeneratedImage; onClick: () => void }) {
  return (
    <button
      className="w-full flex items-center gap-3 p-2 rounded-lg border border-[#E8DDD0] bg-cream-50 hover:border-vermilion-400 hover:bg-vermilion-50 transition-all duration-200 cursor-pointer text-left"
      onClick={onClick}
    >
      <img
        src={image.dataUrl}
        alt="History thumbnail"
        className="w-12 h-12 rounded-md object-cover shrink-0 border border-[#E8DDD0]"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[11px] font-medium text-vermilion-800 truncate">
            {CATEGORY_LABELS[image.category]}
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cream-200 text-vermilion-700 shrink-0">
            {image.params.styleStrength}%
          </span>
        </div>
        <p className="text-[10px] text-gray-400">{formatTime(image.timestamp)}</p>
      </div>
      {image.isFavorited && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="#C9A96E" stroke="#B8944F" strokeWidth="1.5" className="shrink-0">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )}
    </button>
  );
}
