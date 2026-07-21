import { useAppStore } from '../../store/useAppStore';

export default function GenerateButton() {
  const phase = useAppStore((s) => s.phase);
  const generateImages = useAppStore((s) => s.generateImages);

  return (
    <button
      className="btn-primary w-full py-3 text-[15px] animate-pulse-ring"
      disabled={phase === 'generating'}
      onClick={generateImages}
    >
      {phase === 'generating' ? (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin-slow">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.3" />
            <path d="M12 2a10 10 0 019.95 9" />
          </svg>
          AI 生成中...
        </>
      ) : (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          立即生成
        </>
      )}
    </button>
  );
}
