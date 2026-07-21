import { useAppStore } from '../../store/useAppStore';
import { COLOR_SCHEMES } from '../../store/constants';

export default function ColorSchemePicker() {
  const colorSchemeId = useAppStore((s) => s.params.colorSchemeId);
  const setParams = useAppStore((s) => s.setParams);

  return (
    <div>
      <label className="control-label">颜色方案</label>
      <div className="space-y-2">
        {COLOR_SCHEMES.map((scheme) => (
          <button
            key={scheme.id}
            className={`w-full flex items-center gap-2.5 p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
              colorSchemeId === scheme.id
                ? 'border-vermilion-500 bg-vermilion-50 shadow-sm'
                : 'border-[#E8DDD0] bg-cream-50 hover:border-gold-400'
            }`}
            onClick={() => setParams({ colorSchemeId: scheme.id })}
          >
            {/* Color swatches */}
            <div className="flex gap-1 shrink-0">
              {scheme.colors.map((color, i) => (
                <span
                  key={i}
                  className="color-swatch"
                  style={{
                    backgroundColor: color,
                    borderColor: colorSchemeId === scheme.id && i === 0 ? '#C43B3B' : 'transparent',
                    width: i === 0 ? 28 : 20,
                    height: i === 0 ? 28 : 20,
                  }}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-vermilion-900 truncate">{scheme.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
