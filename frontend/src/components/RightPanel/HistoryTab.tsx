import { useAppStore } from '../../store/useAppStore';
import HistoryThumbnail from './HistoryThumbnail';
import type { GeneratedImage } from '../../store/types';

export default function HistoryTab() {
  const history = useAppStore((s) => s.history);
  const favorites = useAppStore((s) => s.favorites);
  const loadFromHistory = useAppStore((s) => s.loadFromHistory);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 panel-scroll animate-fade-slide-in">
      {/* Favorites section */}
      {favorites.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-serif font-bold text-vermilion-800">
              收藏夹 · {favorites.length} 张
            </h4>
            <button
              className="text-[10px] text-gold-500 hover:text-gold-600 cursor-pointer"
              onClick={() => {
                favorites.forEach((f, i) => {
                  // Export each favorited image
                  const a = document.createElement('a');
                  a.href = f.dataUrl;
                  a.download = `收藏_${f.category}_${i + 1}.png`;
                  setTimeout(() => a.click(), i * 200);
                });
              }}
            >
              批量导出
            </button>
          </div>
          <div className="space-y-1.5">
            {favorites.map((img: GeneratedImage) => (
              <HistoryThumbnail
                key={img.id}
                image={img}
                onClick={() => loadFromHistory(img)}
              />
            ))}
          </div>
        </div>
      )}

      {/* History */}
      <div>
        <h4 className="text-xs font-serif font-bold text-vermilion-800 mb-2">
          生成历史 · {history.length} 条
        </h4>
        {history.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-8">
            暂无生成记录
          </p>
        ) : (
          <div className="space-y-1.5">
            {history.map((img: GeneratedImage) => (
              <HistoryThumbnail
                key={img.id}
                image={img}
                onClick={() => loadFromHistory(img)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
