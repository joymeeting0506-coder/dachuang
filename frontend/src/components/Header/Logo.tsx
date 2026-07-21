export default function Logo() {
  return (
    <div className="flex items-center gap-3 select-none">
      {/* Heritage Pattern Logo SVG */}
      <svg
        width="36"
        height="36"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Outer octagonal border — traditional Chinese window pattern */}
        <rect
          x="4" y="4" width="40" height="40" rx="4"
          fill="#C43B3B" stroke="#8C2424" strokeWidth="1"
          transform="rotate(45 24 24)"
        />
        {/* Inner decorative ring */}
        <circle cx="24" cy="24" r="16" fill="#FFF8F0" stroke="#C9A96E" strokeWidth="1.5" />
        {/* Four-petal flower pattern */}
        <ellipse cx="24" cy="16" rx="6" ry="8" fill="#C43B3B" opacity="0.85" />
        <ellipse cx="24" cy="32" rx="6" ry="8" fill="#C43B3B" opacity="0.85" />
        <ellipse cx="16" cy="24" rx="8" ry="6" fill="#DE6060" opacity="0.7" />
        <ellipse cx="32" cy="24" rx="8" ry="6" fill="#DE6060" opacity="0.7" />
        {/* Center dot — gold accent */}
        <circle cx="24" cy="24" r="3.5" fill="#C9A96E" />
        {/* Corner small dots */}
        <circle cx="16" cy="16" r="1.5" fill="#C9A96E" />
        <circle cx="32" cy="16" r="1.5" fill="#C9A96E" />
        <circle cx="16" cy="32" r="1.5" fill="#C9A96E" />
        <circle cx="32" cy="32" r="1.5" fill="#C9A96E" />
      </svg>
      {/* App Title */}
      <div className="flex flex-col leading-tight">
        <h1 className="text-[17px] font-bold text-vermilion-800 font-serif tracking-wide m-0">
          非遗纹样 AI 生成平台
        </h1>
        <span className="text-[10px] text-gold-500 tracking-widest font-sans uppercase">
          Intangible Cultural Heritage
        </span>
      </div>
    </div>
  );
}
