import type { Category, ColorScheme } from './types';

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'paper_cut', label: '剪纸' },
  { value: 'dunhuang', label: '敦煌' },
  { value: 'miao_embroidery', label: '苗绣' },
  { value: 'silk', label: '丝绸' },
];

export const THEME_TAGS: string[] = [
  '龙凤呈祥', '花开富贵', '祥云瑞气', '福禄寿喜',
  '鱼跃龙门', '松鹤延年', '梅兰竹菊', '麒麟送子',
  '鸳鸯戏水', '蝙蝠如意', '荷花清韵', '锦鲤好运',
];

export const COLOR_SCHEMES: ColorScheme[] = [
  {
    id: 'classic-vermillion',
    name: '朱砂古韵',
    colors: ['#C43B3B', '#D4A76A', '#2C2C2C', '#FFF8F0', '#8C2424'],
  },
  {
    id: 'dunhuang-mural',
    name: '敦煌壁画',
    colors: ['#B5633A', '#2E8B8B', '#DAA520', '#F5DEB3', '#483C32'],
  },
  {
    id: 'blue-white',
    name: '青花瓷韵',
    colors: ['#1E3A5F', '#FFFFFF', '#4A7FB5', '#C4D8E8', '#0F2440'],
  },
  {
    id: 'miao-silver',
    name: '苗银风采',
    colors: ['#2C1810', '#C0C0C0', '#8B0000', '#1B3C5A', '#E8E0D5'],
  },
  {
    id: 'silk-brocade',
    name: '锦绣华彩',
    colors: ['#B8860B', '#8B0000', '#006400', '#FFD700', '#4A0E4E'],
  },
  {
    id: 'jade-green',
    name: '碧玉清雅',
    colors: ['#2E5E3E', '#F5F0E1', '#8FBC8F', '#C9A96E', '#1A3A2A'],
  },
];

export const DEFAULT_PARAMS = {
  category: 'paper_cut' as Category,
  styleStrength: 50,
  themeTags: [] as string[],
  customPrompt: '',
  colorSchemeId: 'classic-vermillion',
  sizePreset: 'square' as const,
  customWidth: null as number | null,
  customHeight: null as number | null,
  generationCount: 2,
  seed: null as number | null,
};

export const SIZE_PRESET_DIMENSIONS: Record<string, { width: number; height: number }> = {
  square: { width: 1024, height: 1024 },
  portrait: { width: 768, height: 1024 },
  landscape: { width: 1024, height: 768 },
};

export const MIN_DIMENSION = 64;
export const MAX_DIMENSION = 2048;
export const MAX_GENERATION_COUNT = 4;
export const MIN_GENERATION_COUNT = 1;
