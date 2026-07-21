import { useAppStore } from '../../store/useAppStore';
import { generateRandomSeed } from '../../utils/formatTime';

export default function SeedInput() {
  const seed = useAppStore((s) => s.params.seed);
  const setParams = useAppStore((s) => s.setParams);

  const handleRandomize = () => {
    setParams({ seed: generateRandomSeed() });
  };

  return (
    <div>
      <label className="control-label">随机种子</label>
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="number"
            className="input-custom text-sm pr-8"
            placeholder="留空为随机种子"
            value={seed ?? ''}
            onChange={(e) => {
              const v = e.target.value;
              setParams({ seed: v === '' ? null : Number(v) });
            }}
          />
          {seed === null && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
              随机
            </span>
          )}
        </div>
        <button
          className="w-9 h-9 rounded-lg border border-[#E8DDD0] bg-cream-50 flex items-center justify-center cursor-pointer hover:border-gold-400 hover:bg-cream-200 transition-all duration-200"
          onClick={handleRandomize}
          title="随机生成种子"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M8 12h8M12 8v8" />
            <circle cx="12" cy="12" r="2" fill="#C9A96E" />
          </svg>
        </button>
      </div>
    </div>
  );
}
