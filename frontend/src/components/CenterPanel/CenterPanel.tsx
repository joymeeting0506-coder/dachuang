import { useAppStore } from '../../store/useAppStore';
import PlaceholderState from './PlaceholderState';
import LoadingState from './LoadingState';
import ResultGrid from './ResultGrid';
import ImageLightbox from './ImageLightbox';
import ComparisonOverlay from './ComparisonOverlay';
import CulturalProductBar from './CulturalProductBar';

export default function CenterPanel() {
  const phase = useAppStore((s) => s.phase);
  const comparisonMode = useAppStore((s) => s.comparisonMode);
  const toggleComparisonMode = useAppStore((s) => s.toggleComparisonMode);
  const generatedImages = useAppStore((s) => s.generatedImages);
  const taskError = useAppStore((s) => s.taskError);
  const dismissError = useAppStore((s) => s.dismissError);

  return (
    <main className="flex-1 flex flex-col bg-cream-100 min-w-0">
      {/* Toolbar row */}
      {phase === 'done' && generatedImages.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#E8DDD0] bg-cream-50 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-vermilion-800">
              生成结果 · {generatedImages.length} 张图片
            </span>
          </div>
          <div className="flex items-center gap-2">
            {generatedImages.length >= 2 && (
              <button
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  comparisonMode
                    ? 'bg-vermilion-500 text-white'
                    : 'bg-cream-100 text-vermilion-700 border border-[#E8DDD0] hover:border-gold-400'
                }`}
                onClick={toggleComparisonMode}
              >
                对比模式
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content area */}
      <div className="flex-1 flex flex-col overflow-y-auto panel-scroll">
        {phase === 'idle' && <PlaceholderState />}
        {phase === 'generating' && <LoadingState />}
        {phase === 'done' && <ResultGrid />}
        {phase === 'error' && (
          <div className="flex-1 flex flex-col items-center justify-center px-8 animate-fade-slide-in">
            <div className="w-16 h-16 rounded-full bg-vermilion-100 flex items-center justify-center mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C43B3B" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h3 className="text-lg font-serif font-bold text-vermilion-800 mb-1">生成失败</h3>
            <p className="text-sm text-gray-500 mb-6 text-center max-w-sm">{taskError || '未知错误'}</p>
            <button className="btn-primary text-sm" onClick={dismissError}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
              </svg>
              返回重试
            </button>
          </div>
        )}
      </div>

      {/* Comparison overlay */}
      <ComparisonOverlay />

      {/* Cultural product preview bar */}
      {phase === 'done' && <CulturalProductBar />}

      {/* Lightbox */}
      <ImageLightbox />
    </main>
  );
}
