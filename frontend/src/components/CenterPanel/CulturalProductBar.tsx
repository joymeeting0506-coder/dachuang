import { useAppStore } from '../../store/useAppStore';
import { CULTURAL_TEMPLATE_LABELS } from '../../store/types';
import type { CulturalTemplate } from '../../store/types';

const TEMPLATES: { id: CulturalTemplate; icon: string }[] = [
  { id: 'bookmark', icon: '📑' },
  { id: 'canvas-bag', icon: '🛍️' },
  { id: 'postcard', icon: '💌' },
  { id: 'phone-case', icon: '📱' },
];

const TEMPLATE_STYLES: Record<CulturalTemplate, React.CSSProperties> = {
  bookmark: {
    aspectRatio: '1/3',
    maxWidth: '120px',
    borderRadius: '6px 6px 0 0',
    transform: 'perspective(500px) rotateY(-2deg)',
    boxShadow: '2px 4px 12px rgba(0,0,0,0.15)',
  },
  'canvas-bag': {
    aspectRatio: '3/4',
    maxWidth: '200px',
    borderRadius: '8px',
    transform: 'perspective(600px) rotateX(2deg)',
    boxShadow: '3px 5px 16px rgba(0,0,0,0.12)',
  },
  postcard: {
    aspectRatio: '1.6/1',
    maxWidth: '280px',
    borderRadius: '6px',
    transform: 'perspective(800px) rotateY(-5deg) rotateX(1deg)',
    boxShadow: '2px 6px 18px rgba(0,0,0,0.2)',
  },
  'phone-case': {
    aspectRatio: '0.48/1',
    maxWidth: '140px',
    borderRadius: '14px',
    transform: 'perspective(700px) rotateY(-8deg)',
    boxShadow: '4px 8px 24px rgba(0,0,0,0.25)',
    border: '3px solid #333',
  },
};

export default function CulturalProductBar() {
  const culturalPreviewActive = useAppStore((s) => s.culturalPreviewActive);
  const culturalTemplateId = useAppStore((s) => s.culturalTemplateId);
  const toggleCulturalPreview = useAppStore((s) => s.toggleCulturalPreview);
  const selectedImageId = useAppStore((s) => s.selectedImageId);
  const generatedImages = useAppStore((s) => s.generatedImages);
  const history = useAppStore((s) => s.history);

  const allImgs = [...generatedImages, ...history];
  const selectedImg = allImgs.find((i) => i.id === selectedImageId);

  return (
    <div className="border-t border-[#E8DDD0] shrink-0">
      {/* Toggle bar */}
      <div className="flex items-center justify-center gap-1 px-4 py-2">
        <button
          className={`text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
            !culturalPreviewActive
              ? 'bg-cream-200 text-vermilion-700 border border-[#E8DDD0]'
              : 'bg-vermilion-500 text-white'
          }`}
          onClick={() => toggleCulturalPreview()}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          文创预览
        </button>
      </div>

      {/* Preview panel */}
      {culturalPreviewActive && (
        <div className="p-4 bg-cream-100 border-t border-[#E8DDD0] animate-fade-slide-in">
          {/* Template selector */}
          <div className="flex justify-center gap-2 mb-4">
            {TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  culturalTemplateId === tpl.id
                    ? 'bg-vermilion-500 text-white shadow-sm'
                    : 'bg-cream-50 text-vermilion-800 border border-[#E8DDD0] hover:border-gold-400'
                }`}
                onClick={() => toggleCulturalPreview(tpl.id)}
              >
                {tpl.icon} {CULTURAL_TEMPLATE_LABELS[tpl.id]}
              </button>
            ))}
          </div>

          {/* Preview area */}
          <div className="flex justify-center items-center min-h-[180px]">
            {culturalTemplateId && selectedImg ? (
              <div
                className="relative overflow-hidden bg-white flex items-center justify-center"
                style={TEMPLATE_STYLES[culturalTemplateId]}
              >
                {/* Product template placeholder background */}
                <div className="absolute inset-[8%] rounded-sm overflow-hidden flex items-center justify-center border border-dashed border-gray-200">
                  <img
                    src={selectedImg.dataUrl}
                    alt="Pattern on product"
                    className="w-full h-full object-cover"
                    style={{ opacity: 0.9 }}
                  />
                </div>
                {/* Product frame overlay */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.05) 100%)',
                }} />
              </div>
            ) : (
              <div className="text-center text-gray-400 text-sm">
                <p>选择产品模板并选中一张纹样图片</p>
                <p className="text-xs mt-1">即可预览实物效果</p>
              </div>
            )}
          </div>

          {/* Helper text */}
          {culturalTemplateId && (
            <p className="text-[10px] text-gray-400 text-center mt-3">
              此为预览合成效果，导出时将使用高分辨率渲染
            </p>
          )}
        </div>
      )}
    </div>
  );
}
