import { useAppStore } from '../../store/useAppStore';
import { CATEGORY_LABELS } from '../../store/types';
import StarRating from './StarRating';

export default function CurrentDetailTab() {
  const selectedImageId = useAppStore((s) => s.selectedImageId);
  const generatedImages = useAppStore((s) => s.generatedImages);
  const setRating = useAppStore((s) => s.setRating);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const reeditFromImage = useAppStore((s) => s.reeditFromImage);
  const exportImage = useAppStore((s) => s.exportImage);

  const img = generatedImages.find((i) => i.id === selectedImageId);
  if (!img) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-center">
        <p className="text-sm text-gray-400">选择一张图片查看详情</p>
      </div>
    );
  }

  const p = img.params;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 panel-scroll animate-fade-slide-in">
      {/* Preview thumbnail */}
      <div className="card-panel">
        <label className="control-label mb-2">预览</label>
        <img
          src={img.dataUrl}
          alt="Selected pattern"
          className="w-full rounded-lg border border-[#E8DDD0]"
        />
      </div>

      {/* Parameter info */}
      <div className="card-panel">
        <label className="control-label mb-2">生成参数</label>
        <div className="space-y-1.5 text-xs">
          <ParamRow label="类别" value={CATEGORY_LABELS[p.category]} />
          <ParamRow label="风格强度" value={`${p.styleStrength}%`} />
          <ParamRow label="颜色方案" value={p.colorSchemeId} />
          <ParamRow label="尺寸" value={`${p.customWidth ?? 1024} × ${p.customHeight ?? 1024} px`} />
          <ParamRow label="主题标签" value={p.themeTags.length > 0 ? p.themeTags.join('、') : '无'} />
          <ParamRow label="自定义提示词" value={p.customPrompt || '无'} />
          <ParamRow label="随机种子" value={p.seed?.toString() ?? '随机'} />
          <ParamRow label="生成时间" value={new Date(img.timestamp).toLocaleString('zh-CN')} />
        </div>
      </div>

      {/* Rating */}
      <div className="card-panel">
        <label className="control-label mb-2">评分</label>
        <StarRating
          rating={img.rating}
          onChange={(r) => setRating(img.id, r)}
        />
      </div>

      {/* Action buttons */}
      <div className="space-y-2">
        <button
          className="btn-secondary w-full text-sm"
          onClick={() => exportImage(img.id, 'png')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          导出 PNG
        </button>
        <button
          className="btn-secondary w-full text-sm"
          onClick={() => exportImage(img.id, 'jpg')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          导出 JPG
        </button>
        <button
          className="btn-secondary w-full text-sm"
          onClick={() => reeditFromImage(img.id)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
          二次编辑
        </button>
        <button
          className={`w-full text-sm py-2 rounded-lg font-medium border transition-all cursor-pointer ${
            img.isFavorited
              ? 'bg-gold-400/15 text-gold-600 border-gold-400'
              : 'btn-secondary'
          }`}
          onClick={() => toggleFavorite(img.id)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={img.isFavorited ? '#C9A96E' : 'none'} stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          {img.isFavorited ? '已收藏' : '加入收藏'}
        </button>
      </div>
    </div>
  );
}

function ParamRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-gray-500">{label}</span>
      <span className="text-vermilion-900 font-medium text-right max-w-[55%] truncate">{value}</span>
    </div>
  );
}
