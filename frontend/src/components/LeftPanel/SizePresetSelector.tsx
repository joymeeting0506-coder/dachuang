import { useAppStore } from '../../store/useAppStore';
import { SIZE_PRESET_DIMENSIONS, MIN_DIMENSION, MAX_DIMENSION } from '../../store/constants';
import { SIZE_PRESET_LABELS } from '../../store/types';
import type { SizePreset } from '../../store/types';

export default function SizePresetSelector() {
  const sizePreset = useAppStore((s) => s.params.sizePreset);
  const customWidth = useAppStore((s) => s.params.customWidth);
  const customHeight = useAppStore((s) => s.params.customHeight);
  const setParams = useAppStore((s) => s.setParams);

  const presets: SizePreset[] = ['square', 'portrait', 'landscape'];

  const effectiveWidth = customWidth ?? SIZE_PRESET_DIMENSIONS[sizePreset].width;
  const effectiveHeight = customHeight ?? SIZE_PRESET_DIMENSIONS[sizePreset].height;

  return (
    <div>
      <label className="control-label">尺寸设置</label>
      {/* Preset buttons */}
      <div className="flex gap-2 mb-3">
        {presets.map((preset) => (
          <button
            key={preset}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all duration-200 cursor-pointer ${
              sizePreset === preset
                ? 'bg-vermilion-500 text-white border-vermilion-500'
                : 'bg-cream-50 text-vermilion-800 border-[#E8DDD0] hover:border-gold-400'
            }`}
            onClick={() => setParams({ sizePreset: preset, customWidth: null, customHeight: null })}
          >
            {SIZE_PRESET_LABELS[preset]}
          </button>
        ))}
      </div>
      {/* Custom dimensions */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label className="text-[10px] text-gray-400 block mb-0.5">宽度 (px)</label>
          <input
            type="number"
            className="input-custom text-sm text-center"
            min={MIN_DIMENSION}
            max={MAX_DIMENSION}
            value={effectiveWidth}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (v >= MIN_DIMENSION && v <= MAX_DIMENSION) {
                setParams({ customWidth: v });
              }
            }}
          />
        </div>
        <span className="text-gray-300 mt-4">×</span>
        <div className="flex-1">
          <label className="text-[10px] text-gray-400 block mb-0.5">高度 (px)</label>
          <input
            type="number"
            className="input-custom text-sm text-center"
            min={MIN_DIMENSION}
            max={MAX_DIMENSION}
            value={effectiveHeight}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (v >= MIN_DIMENSION && v <= MAX_DIMENSION) {
                setParams({ customHeight: v });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
