import NaturalLanguageInput from './NaturalLanguageInput';
import CategoryDropdown from './CategoryDropdown';
import StyleStrengthSlider from './StyleStrengthSlider';
import ThemeTagsSelector from './ThemeTagsSelector';
import ColorSchemePicker from './ColorSchemePicker';
import SizePresetSelector from './SizePresetSelector';
import GenerationCountSelector from './GenerationCountSelector';
import SeedInput from './SeedInput';
import GenerateButton from './GenerateButton';

export default function LeftPanel() {
  return (
    <aside className="w-[25%] min-w-[280px] max-w-[360px] border-r border-[#E8DDD0] bg-cream-50 flex flex-col shrink-0">
      <div className="p-4 border-b border-[#E8DDD0]">
        <h2 className="section-title mb-0 pb-0 border-b-0">生成参数</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-5 panel-scroll">
        <NaturalLanguageInput />
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-[#E8DDD0]" />
          <span className="text-[10px] text-gray-400">或手动选择参数</span>
          <div className="flex-1 h-px bg-[#E8DDD0]" />
        </div>
        <CategoryDropdown />
        <StyleStrengthSlider />
        <ThemeTagsSelector />
        <ColorSchemePicker />
        <SizePresetSelector />
        <GenerationCountSelector />
        <SeedInput />
      </div>
      <div className="p-4 border-t border-[#E8DDD0]">
        <GenerateButton />
        <p className="text-[10px] text-gray-400 text-center mt-2">
          生成即表示同意 AI 生成内容使用条款
        </p>
      </div>
    </aside>
  );
}
