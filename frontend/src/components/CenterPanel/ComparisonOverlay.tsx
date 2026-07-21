import { useAppStore } from '../../store/useAppStore';

export default function ComparisonOverlay() {
  const comparisonMode = useAppStore((s) => s.comparisonMode);
  const checkedImageIds = useAppStore((s) => s.checkedImageIds);
  const generatedImages = useAppStore((s) => s.generatedImages);

  if (!comparisonMode || checkedImageIds.size < 2) return null;

  const checkedImages = generatedImages.filter((img) => checkedImageIds.has(img.id));

  return (
    <div className="border-t border-[#E8DDD0] bg-cream-50 p-4 animate-fade-slide-in">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-serif font-bold text-vermilion-800">
          对比视图 · {checkedImages.length} 张图片
        </h4>
        <span className="text-[10px] text-gray-400">拖动滚动条查看细节差异</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 panel-scroll">
        {checkedImages.map((img) => (
          <div key={img.id} className="shrink-0 w-48">
            <img
              src={img.dataUrl}
              alt="Comparison"
              className="w-full aspect-square object-cover rounded-lg border border-[#E8DDD0]"
            />
            <p className="text-[10px] text-gray-500 text-center mt-1">
              种子: {img.params.seed ?? '随机'} | 强度: {img.params.styleStrength}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
