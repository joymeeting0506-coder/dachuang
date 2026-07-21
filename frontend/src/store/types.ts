/* ===== Core Types for 非遗纹样 AI 生成平台 ===== */

export type Category = 'paper_cut' | 'dunhuang' | 'miao_embroidery' | 'silk';

export const CATEGORY_LABELS: Record<Category, string> = {
  paper_cut: '剪纸',
  dunhuang: '敦煌',
  miao_embroidery: '苗绣',
  silk: '丝绸',
};

export type SizePreset = 'square' | 'portrait' | 'landscape';

export const SIZE_PRESET_LABELS: Record<SizePreset, string> = {
  square: '方形 1:1',
  portrait: '竖版 3:4',
  landscape: '横版 4:3',
};

export type ImageFormat = 'png' | 'jpg';

export type AppPhase = 'idle' | 'generating' | 'done' | 'error';

export interface GenerationParams {
  category: Category;
  styleStrength: number;       // 0-100
  themeTags: string[];
  customPrompt: string;
  colorSchemeId: string;
  sizePreset: SizePreset;
  customWidth: number | null;
  customHeight: number | null;
  generationCount: number;     // 1-4
  seed: number | null;         // null = random
}

export interface GeneratedImage {
  id: string;
  dataUrl: string;
  params: GenerationParams;
  timestamp: number;
  rating: number;              // 0-5 (0 = unrated)
  isFavorited: boolean;
  category: Category;
}

export interface ColorScheme {
  id: string;
  name: string;
  colors: string[];            // hex colors
}

export type RightPanelTab = 'detail' | 'history';

export type CulturalTemplate = 'bookmark' | 'canvas-bag' | 'postcard' | 'phone-case';

export const CULTURAL_TEMPLATE_LABELS: Record<CulturalTemplate, string> = {
  bookmark: '书签',
  'canvas-bag': '帆布包',
  postcard: '明信片',
  'phone-case': '手机壳',
};
