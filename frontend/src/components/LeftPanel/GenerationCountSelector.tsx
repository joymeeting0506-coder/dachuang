import { useAppStore } from '../../store/useAppStore';
import { MAX_GENERATION_COUNT } from '../../store/constants';

export default function GenerationCountSelector() {
  const count = useAppStore((s) => s.params.generationCount);
  const setParams = useAppStore((s) => s.setParams);

  return (
    <div>
      <label className="control-label">生成数量</label>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4].map((n) => (
          <button
            key={n}
            className={`w-10 h-10 rounded-lg text-sm font-semibold border transition-all duration-200 cursor-pointer ${
              count === n
                ? 'bg-vermilion-500 text-white border-vermilion-500 shadow-sm'
                : 'bg-cream-50 text-vermilion-800 border-[#E8DDD0] hover:border-gold-400'
            }`}
            onClick={() => setParams({ generationCount: n })}
          >
            {n}
          </button>
        ))}
      </div>
      {count === MAX_GENERATION_COUNT && (
        <p className="text-[10px] text-gold-500 mt-1">多图对比模式（2×2 网格布局）</p>
      )}
    </div>
  );
}
