import { useAppStore } from '../../store/useAppStore';
import TabBar from './TabBar';
import CurrentDetailTab from './CurrentDetailTab';
import HistoryTab from './HistoryTab';
import type { RightPanelTab } from '../../store/types';

export default function RightPanel() {
  const rightPanelTab = useAppStore((s) => s.rightPanelTab);
  const setRightPanelTab = useAppStore((s) => s.setRightPanelTab);

  return (
    <aside className="w-[25%] min-w-[260px] max-w-[340px] border-l border-[#E8DDD0] bg-cream-50 flex flex-col shrink-0">
      <TabBar activeTab={rightPanelTab} onTabChange={(tab: RightPanelTab) => setRightPanelTab(tab)} />
      {rightPanelTab === 'detail' ? <CurrentDetailTab /> : <HistoryTab />}
    </aside>
  );
}
