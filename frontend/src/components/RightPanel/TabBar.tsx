import type { RightPanelTab } from '../../store/types';

interface TabBarProps {
  activeTab: RightPanelTab;
  onTabChange: (tab: RightPanelTab) => void;
}

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="flex border-b border-[#E8DDD0] shrink-0">
      <button
        className={`flex-1 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
          activeTab === 'detail'
            ? 'text-vermilion-600 border-b-2 border-vermilion-500 bg-vermilion-50/50'
            : 'text-gray-400 hover:text-vermilion-700 hover:bg-cream-50'
        }`}
        onClick={() => onTabChange('detail')}
      >
        当前详情
      </button>
      <button
        className={`flex-1 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer border-l border-[#E8DDD0] ${
          activeTab === 'history'
            ? 'text-vermilion-600 border-b-2 border-vermilion-500 bg-vermilion-50/50'
            : 'text-gray-400 hover:text-vermilion-700 hover:bg-cream-50'
        }`}
        onClick={() => onTabChange('history')}
      >
        历史记录
      </button>
    </div>
  );
}
