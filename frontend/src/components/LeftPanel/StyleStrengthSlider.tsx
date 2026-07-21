import { useAppStore } from '../../store/useAppStore';

export default function StyleStrengthSlider() {
  const strength = useAppStore((s) => s.params.styleStrength);
  const setParams = useAppStore((s) => s.setParams);

  const pct = strength;

  return (
    <div>
      <label className="control-label">
        风格强度 <span className="text-gold-500 font-mono text-xs ml-1">{pct}%</span>
      </label>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400 font-mono w-8 text-right">0</span>
        <input
          type="range"
          min="0"
          max="100"
          value={strength}
          onChange={(e) => setParams({ styleStrength: Number(e.target.value) })}
          className="slider-custom flex-1"
          style={{
            background: `linear-gradient(to right, #C43B3B 0%, #C43B3B ${pct}%, #E8DDD0 ${pct}%, #E8DDD0 100%)`,
          }}
        />
        <span className="text-xs text-gray-400 font-mono w-8">100</span>
      </div>
      <p className="text-[10px] text-gray-400 mt-1">控制 LoRA 权重，值越高风格特征越明显</p>
    </div>
  );
}
