import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';

export default function NaturalLanguageInput() {
  const [text, setText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const phase = useAppStore((s) => s.phase);
  const generateFromNaturalLanguage = useAppStore((s) => s.generateFromNaturalLanguage);
  const isGenerating = phase === 'generating';

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleGenerate = () => {
    if (!text.trim() || isGenerating) return;
    generateFromNaturalLanguage(text.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  if (!isExpanded) {
    return (
      <button
        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 border-dashed border-gold-300 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 transition-all duration-300 cursor-pointer group"
        onClick={() => setIsExpanded(true)}
      >
        <span className="text-lg">✨</span>
        <span className="text-sm font-medium text-gold-800 group-hover:text-gold-900">
          AI 智能生成 — 用自然语言描述你想要的纹样
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="ml-auto text-gold-400"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-gold-300 bg-gradient-to-b from-amber-50 to-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gold-200/50">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">🤖</span>
          <span className="text-xs font-semibold text-gold-800">AI 智能理解</span>
          <span className="text-[10px] text-gold-500 bg-gold-100 px-1.5 py-0.5 rounded-full">DeepSeek</span>
        </div>
        <button
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          onClick={() => setIsExpanded(false)}
        >
          ✕ 收起
        </button>
      </div>

      {/* Input area */}
      <div className="p-3 space-y-2">
        <textarea
          ref={textareaRef}
          className="w-full min-h-[64px] max-h-[120px] px-3 py-2 text-sm rounded-lg border border-[#E8DDD0] bg-white resize-none outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-300 placeholder-gray-400 transition-all"
          placeholder="描述你想要的纹样，例如：&#10;红色剪纸风格的凤凰图案，要对称构图，颜色浓重一些…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isGenerating}
          rows={3}
        />

        <div className="flex items-center justify-between">
          <span className="text-[10px] text-gray-400">
            按 Enter 发送，Shift+Enter 换行
          </span>
          <div className="flex items-center gap-2">
            <button
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => {
                setText('');
                setIsExpanded(false);
              }}
              disabled={isGenerating}
            >
              取消
            </button>
            <button
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-gold-500 text-white hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              onClick={handleGenerate}
              disabled={!text.trim() || isGenerating}
            >
              {isGenerating ? (
                <>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="animate-spin"
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.3" />
                    <path d="M12 2a10 10 0 019.95 9" />
                  </svg>
                  生成中...
                </>
              ) : (
                <>
                  <span>✨</span>
                  AI 理解并生成
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
