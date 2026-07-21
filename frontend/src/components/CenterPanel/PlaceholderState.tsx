export default function PlaceholderState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8 animate-fade-slide-in">
      {/* Decorative pattern border */}
      <div className="w-48 h-48 rounded-full border-2 border-dashed border-gold-300 flex items-center justify-center mb-8 relative">
        <div className="absolute inset-4 rounded-full border border-[#E8DDD0]" />
        <div className="absolute inset-8 rounded-full border border-[#E8DDD0]/50" />
        {/* Center icon */}
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="16" y="16" width="32" height="32" rx="6" fill="#FDF2F2" stroke="#C43B3B" strokeWidth="1.5" transform="rotate(45 32 32)" />
          <circle cx="32" cy="32" r="8" fill="none" stroke="#C9A96E" strokeWidth="1.5" />
          <circle cx="32" cy="32" r="3" fill="#C43B3B" />
        </svg>
      </div>
      <h3 className="text-lg font-serif font-bold text-vermilion-800 mb-2">选择参数后点击生成</h3>
      <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
        在左侧面板调整类别、风格强度、主题等参数，<br />
        点击「立即生成」即可创建独特的非遗纹样
      </p>
      {/* Quick categories */}
      <div className="flex gap-2 mt-6">
        {['剪纸', '敦煌', '苗绣', '丝绸'].map((cat) => (
          <span
            key={cat}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-cream-200 text-vermilion-700 border border-[#E8DDD0]"
          >
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
}
