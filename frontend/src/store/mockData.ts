import type { GeneratedImage, Category, GenerationParams } from './types';
import { DEFAULT_PARAMS } from './constants';

/* SVG data URLs for mock pattern images — colorful traditional Chinese patterns */
const MOCK_PATTERNS: Record<Category, string[]> = {
  paper_cut: [
    generateMockPatternSVG('paper_cut', '#C43B3B', 1),
    generateMockPatternSVG('paper_cut', '#A82E2E', 2),
  ],
  dunhuang: [
    generateMockPatternSVG('dunhuang', '#B5633A', 1),
    generateMockPatternSVG('dunhuang', '#2E8B8B', 2),
  ],
  miao_embroidery: [
    generateMockPatternSVG('miao_embroidery', '#2C1810', 1),
    generateMockPatternSVG('miao_embroidery', '#8B0000', 2),
  ],
  silk: [
    generateMockPatternSVG('silk', '#B8860B', 1),
    generateMockPatternSVG('silk', '#006400', 2),
  ],
};

function generateMockPatternSVG(category: Category, primaryColor: string, variant: number): string {
  const colors = [primaryColor, '#C9A96E', '#FFF8F0', '#2C2C2C', '#D4B87A'];
  const patterns: Record<string, string> = {
    paper_cut: `
      <circle cx="256" cy="256" r="200" fill="none" stroke="${colors[0]}" stroke-width="3"/>
      <circle cx="256" cy="256" r="160" fill="none" stroke="${colors[1]}" stroke-width="2"/>
      <circle cx="256" cy="256" r="120" fill="none" stroke="${colors[0]}" stroke-width="1.5"/>
      ${Array.from({length: 12}, (_, i) => {
        const angle = (i * 30) * Math.PI / 180;
        const x = 256 + 140 * Math.cos(angle);
        const y = 256 + 140 * Math.sin(angle);
        return `<circle cx="${x}" cy="${y}" r="20" fill="${colors[i % 2 === 0 ? 0 : 1]}" opacity="0.7"/>`;
      }).join('\n')}
      ${Array.from({length: 8}, (_, i) => {
        const angle = (i * 45) * Math.PI / 180;
        const x = 256 + 80 * Math.cos(angle);
        const y = 256 + 80 * Math.sin(angle);
        return `<path d="M${x},${y} Q${256},${256} ${x+20},${y-20}" fill="none" stroke="${colors[3]}" stroke-width="1.5"/>`;
      }).join('\n')}
      <circle cx="256" cy="256" r="15" fill="${colors[0]}"/>
    `,
    dunhuang: `
      <rect x="56" y="56" width="400" height="400" rx="20" fill="${colors[4]}" opacity="0.08"/>
      ${Array.from({length:8}, (_, i) => {
        const x = 56 + i * 57;
        return `<line x1="${x}" y1="56" x2="${x}" y2="456" stroke="${colors[1]}" stroke-width="0.5" opacity="0.3"/>`;
      }).join('\n')}
      ${Array.from({length:8}, (_, i) => {
        const y = 56 + i * 57;
        return `<line x1="56" y1="${y}" x2="456" y2="${y}" stroke="${colors[1]}" stroke-width="0.5" opacity="0.3"/>`;
      }).join('\n')}
      <ellipse cx="256" cy="180" rx="120" ry="80" fill="none" stroke="${colors[0]}" stroke-width="4"/>
      <ellipse cx="256" cy="180" rx="80" ry="50" fill="${colors[1]}" opacity="0.15"/>
      <path d="M136 280 Q256 380 376 280" fill="none" stroke="${colors[0]}" stroke-width="3"/>
      ${Array.from({length:5}, (_, i) => {
        const x = 136 + i * 60;
        const y = 340 + (i % 2 === 0 ? 0 : 30);
        return `<circle cx="${x}" cy="${y}" r="12" fill="${colors[0]}" opacity="0.6"/>`;
      }).join('\n')}
      <circle cx="256" cy="400" r="25" fill="${colors[1]}" opacity="0.5"/>
    `,
    miao_embroidery: `
      ${Array.from({length:6}, (_, row) => {
        return Array.from({length:6}, (_, col) => {
          const x = 76 + col * 72;
          const y = 76 + row * 72;
          const shape = (row + col) % 3;
          if (shape === 0) return `<rect x="${x-16}" y="${y-16}" width="32" height="32" fill="none" stroke="${colors[0]}" stroke-width="2" transform="rotate(${45*(row+col)} ${x} ${y})"/>`;
          if (shape === 1) return `<circle cx="${x}" cy="${y}" r="16" fill="none" stroke="${colors[1]}" stroke-width="2"/>`;
          return `<polygon points="${x},${y-18} ${x+16},${y+10} ${x-16},${y+10}" fill="none" stroke="${colors[0]}" stroke-width="2"/>`;
        }).join('\n');
      }).join('\n')}
      ${Array.from({length:25}, (_, i) => {
        const row = Math.floor(i / 5);
        const col = i % 5;
        const x = 76 + col * 72;
        const y = 76 + row * 72;
        return `<circle cx="${x}" cy="${y}" r="3" fill="${colors[3]}"/>`;
      }).join('\n')}
    `,
    silk: `
      <defs>
        <linearGradient id="silk${variant}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${colors[0]}" stop-opacity="0.1"/>
          <stop offset="50%" stop-color="${colors[1]}" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="${colors[0]}" stop-opacity="0.1"/>
        </linearGradient>
      </defs>
      <rect width="512" height="512" fill="url(#silk${variant})"/>
      ${Array.from({length:5}, (_, i) => {
        const y = 80 + i * 90;
        const amplitude = 30 + i * 10;
        return `<path d="M20 ${y} Q128 ${y-amplitude} 256 ${y} Q384 ${y+amplitude} 492 ${y}" fill="none" stroke="${colors[0]}" stroke-width="${2+i*0.5}" opacity="${0.3 + i*0.12}"/>`;
      }).join('\n')}
      ${Array.from({length:8}, (_, i) => {
        const x = 50 + i * 55;
        const y = 30 + i * 60;
        return `<ellipse cx="${x}" cy="${y}" rx="20" ry="30" fill="none" stroke="${colors[1]}" stroke-width="1.5" opacity="0.5" transform="rotate(${30*i} ${x} ${y})"/>`;
      }).join('\n')}
      ${Array.from({length:6}, (_, i) => {
        const x1 = 30 + i * 80;
        return `<circle cx="${x1}" cy="460" r="15" fill="${colors[0]}" opacity="0.4"/>`;
      }).join('\n')}
      <text x="256" y="270" text-anchor="middle" font-family="serif" font-size="28" fill="${colors[0]}" opacity="0.15">${variant === 1 ? '锦' : '绣'}</text>
    `,
  };

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <rect width="512" height="512" fill="${colors[2]}"/>
    <rect width="512" height="512" fill="${colors[4]}" opacity="0.03"/>
    ${patterns[category] || patterns.paper_cut}
  </svg>`;

  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

function generateId(): string {
  return `img_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function createMockImages(params: GenerationParams, count: number): GeneratedImage[] {
  const now = Date.now();
  const patterns = MOCK_PATTERNS[params.category] || MOCK_PATTERNS.paper_cut;

  return Array.from({ length: count }, (_, i) => ({
    id: generateId(),
    dataUrl: patterns[i % patterns.length],
    params: { ...params },
    timestamp: now - (count - 1 - i) * 1000,
    rating: 0,
    isFavorited: false,
    category: params.category,
  }));
}

export function getMockHistory(): GeneratedImage[] {
  const now = Date.now();
  const categories: Category[] = ['paper_cut', 'dunhuang', 'miao_embroidery', 'silk', 'paper_cut', 'dunhuang'];
  return categories.map((cat, i) => {
    const params: GenerationParams = {
      ...DEFAULT_PARAMS,
      category: cat,
      styleStrength: 30 + Math.floor(Math.random() * 50),
      themeTags: [['龙凤呈祥', '花开富贵', '祥云瑞气'][i % 3]],
      seed: 1000 + i * 42,
      generationCount: 1 + (i % 3),
    };
    return {
      id: generateId(),
      dataUrl: MOCK_PATTERNS[cat][0],
      params,
      timestamp: now - (5 - i) * 3600000 - Math.floor(Math.random() * 1800000),
      rating: i < 3 ? 4 + (i % 2) : 0,
      isFavorited: i < 2,
      category: cat,
    };
  });
}
