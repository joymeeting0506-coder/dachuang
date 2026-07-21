import { useAppStore } from '../../store/useAppStore';

export default function ActionButtons() {
  const saveProject = useAppStore((s) => s.saveProject);
  const exportAllImages = useAppStore((s) => s.exportAllImages);
  const resetParams = useAppStore((s) => s.resetParams);
  const generatedImages = useAppStore((s) => s.generatedImages);
  const phase = useAppStore((s) => s.phase);

  return (
    <div className="flex items-center gap-3">
      <button
        className="btn-secondary text-sm"
        onClick={saveProject}
        title="保存当前项目到本地"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
        保存项目
      </button>

      <button
        className="btn-ghost text-sm"
        onClick={() => exportAllImages('png')}
        disabled={generatedImages.length === 0 || phase === 'generating'}
        title="导出全部生成图片"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        导出全部
      </button>

      <button
        className="btn-ghost text-sm"
        onClick={resetParams}
        title="重置所有参数"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="1 4 1 10 7 10" />
          <polyline points="23 20 23 14 17 14" />
          <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
        </svg>
        重置参数
      </button>
    </div>
  );
}
