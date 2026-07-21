import { useAppStore } from '../../store/useAppStore';

export default function LoadingState() {
  // Read real progress from store (driven by backend API polling)
  const progress = useAppStore((s) => s.taskProgress);
  const eta = useAppStore((s) => s.taskEstimatedTime);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 animate-fade-slide-in">
      {/* Spinning pattern animation */}
      <div className="relative w-32 h-32 mb-8">
        {/* Outer ring */}
        <svg className="animate-spin-slow w-full h-full" viewBox="0 0 128 128" fill="none">
          {/* Octagonal mandala */}
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const x = 64 + 40 * Math.cos(angle);
            const y = 64 + 40 * Math.sin(angle);
            return (
              <ellipse
                key={i}
                cx={x}
                cy={y}
                rx="12"
                ry="18"
                fill="none"
                stroke={i % 2 === 0 ? '#C43B3B' : '#C9A96E'}
                strokeWidth="2"
                opacity={0.3 + i * 0.06}
                transform={`rotate(${i * 45} ${x} ${y})`}
              />
            );
          })}
          <circle cx="64" cy="64" r="20" fill="none" stroke="#C43B3B" strokeWidth="3" strokeDasharray="8 4" />
          <circle cx="64" cy="64" r="8" fill="#C43B3B" opacity="0.6">
            <animate attributeName="r" values="6;10;6" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </svg>
        {/* Inner pulse */}
        <div className="absolute inset-0 rounded-full animate-pulse-ring" />
      </div>

      {/* Status text */}
      <h3 className="text-lg font-serif font-bold text-vermilion-800 mb-1">AI 正在生成纹样...</h3>
      <p className="text-sm text-gray-400 mb-6">
        正在通过 ComfyUI 融合非遗风格与你的创意
      </p>

      {/* Progress bar */}
      <div className="w-72 max-w-full">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>生成进度</span>
          <span className="font-mono text-gold-500">{progress}%</span>
        </div>
        <div className="h-2 bg-[#E8DDD0] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-vermilion-500 to-vermilion-400 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        {eta > 0 && (
          <p className="text-[10px] text-gray-400 text-center mt-2">
            预计剩余 <span className="font-mono text-gold-500">{eta}</span> 秒
          </p>
        )}
      </div>
    </div>
  );
}
