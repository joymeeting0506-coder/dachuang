import { useAppStore } from '../../store/useAppStore';
import { THEME_TAGS } from '../../store/constants';

export default function ThemeTagsSelector() {
  const themeTags = useAppStore((s) => s.params.themeTags);
  const customPrompt = useAppStore((s) => s.params.customPrompt);
  const setParams = useAppStore((s) => s.setParams);

  const toggleTag = (tag: string) => {
    if (themeTags.includes(tag)) {
      setParams({ themeTags: themeTags.filter((t) => t !== tag) });
    } else {
      setParams({ themeTags: [...themeTags, tag] });
    }
  };

  return (
    <div>
      <label className="control-label">主题选择 / 提示词</label>
      {/* Tag chips */}
      <div className="flex flex-wrap gap-1.5 mb-2.5">
        {THEME_TAGS.map((tag) => (
          <button
            key={tag}
            className={`tag-chip ${themeTags.includes(tag) ? 'active' : ''}`}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      {/* Custom prompt input */}
      <textarea
        className="input-custom resize-none h-16 text-sm"
        placeholder="输入自定义提示词，描述你想要的纹样风格、元素..."
        value={customPrompt}
        onChange={(e) => setParams({ customPrompt: e.target.value })}
      />
    </div>
  );
}
