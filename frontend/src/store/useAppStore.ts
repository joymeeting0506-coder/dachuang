import { create } from 'zustand';
import type {
  GenerationParams,
  GeneratedImage,
  AppPhase,
  RightPanelTab,
  CulturalTemplate,
  ImageFormat,
} from './types';
import { DEFAULT_PARAMS, MAX_GENERATION_COUNT, MIN_GENERATION_COUNT } from './constants';
import { createMockImages, getMockHistory } from './mockData';
import { submitGeneration, pollTaskStatus } from '../api/generate';
import type { GeneratedImageItem } from '../api/types';

/** Simple sleep helper (ms). */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface AppState {
  /* --- Workspace --- */
  phase: AppPhase;
  params: GenerationParams;
  generatedImages: GeneratedImage[];

  /* --- Task progress (from backend polling) --- */
  taskProgress: number; // 0-100
  taskError: string | null;
  taskEstimatedTime: number; // seconds

  /* --- Selection --- */
  selectedImageId: string | null;
  comparisonMode: boolean;
  checkedImageIds: Set<string>;

  /* --- Detail / History --- */
  rightPanelTab: RightPanelTab;
  favorites: GeneratedImage[];
  history: GeneratedImage[];

  /* --- Lightbox --- */
  lightboxImageId: string | null;

  /* --- Cultural Product Preview --- */
  culturalPreviewActive: boolean;
  culturalTemplateId: CulturalTemplate | null;

  /* --- Actions --- */
  setParams: (partial: Partial<GenerationParams>) => void;
  resetParams: () => void;
  setPhase: (phase: AppPhase) => void;
  generateImages: () => Promise<void>;
  selectImage: (id: string | null) => void;
  toggleComparisonMode: () => void;
  toggleImageCheck: (id: string) => void;
  setRightPanelTab: (tab: RightPanelTab) => void;
  toggleFavorite: (id: string) => void;
  setRating: (id: string, rating: number) => void;
  reeditFromImage: (id: string) => void;
  exportImage: (id: string, format: ImageFormat) => void;
  exportAllImages: (format: ImageFormat) => void;
  saveProject: () => void;
  openLightbox: (id: string) => void;
  closeLightbox: () => void;
  toggleCulturalPreview: (templateId?: CulturalTemplate) => void;
  loadFromHistory: (image: GeneratedImage) => void;
  dismissError: () => void;
}

/** Convert backend image item → frontend GeneratedImage. */
function apiImageToStore(
  img: GeneratedImageItem,
  params: GenerationParams,
): GeneratedImage {
  return {
    id: img.id,
    dataUrl: img.url,
    params: { ...params },
    timestamp: Date.now(),
    rating: 0,
    isFavorited: false,
    category: params.category,
  };
}

export const useAppStore = create<AppState>((set, get) => ({
  /* --- Initial State --- */
  phase: 'idle',
  params: { ...DEFAULT_PARAMS },
  generatedImages: [],
  taskProgress: 0,
  taskError: null,
  taskEstimatedTime: 0,
  selectedImageId: null,
  comparisonMode: false,
  checkedImageIds: new Set<string>(),
  rightPanelTab: 'detail',
  favorites: [],
  history: getMockHistory(),
  lightboxImageId: null,
  culturalPreviewActive: false,
  culturalTemplateId: null,

  /* --- Param Management --- */
  setParams: (partial) => {
    const state = get();
    const newParams = { ...state.params, ...partial };
    if (newParams.generationCount < MIN_GENERATION_COUNT) newParams.generationCount = MIN_GENERATION_COUNT;
    if (newParams.generationCount > MAX_GENERATION_COUNT) newParams.generationCount = MAX_GENERATION_COUNT;
    if (newParams.styleStrength < 0) newParams.styleStrength = 0;
    if (newParams.styleStrength > 100) newParams.styleStrength = 100;
    set({ params: newParams });
  },

  resetParams: () => set({ params: { ...DEFAULT_PARAMS }, generatedImages: [], selectedImageId: null, phase: 'idle' }),

  setPhase: (phase) => set({ phase }),

  /* --- Generation (real API via ComfyUI backend) --- */
  generateImages: async () => {
    const { params } = get();
    set({
      phase: 'generating',
      generatedImages: [],
      selectedImageId: null,
      taskError: null,
      taskProgress: 0,
      taskEstimatedTime: 0,
    });

    try {
      // 1. Submit generation request
      const { task_id, estimated_time } = await submitGeneration(params);
      set({ taskEstimatedTime: estimated_time });

      // 2. Poll until done
      let task = await pollTaskStatus(task_id);
      const pollInterval = 1500; // 1.5s
      const maxPolls = 120; // 3 min timeout

      for (let polls = 0; polls < maxPolls; polls++) {
        if (task.status === 'done' || task.status === 'failed') break;
        await sleep(pollInterval);
        task = await pollTaskStatus(task_id);
        const progress = task.progress ?? 0;
        set({
          taskProgress: progress,
          taskEstimatedTime: task.estimated_time ?? 0,
        });
      }

      // 3. Handle result
      if (task.status === 'done' && task.images && task.images.length > 0) {
        const images = task.images.map((img) => apiImageToStore(img, params));
        const { history } = get();
        const newHistory = [...images, ...history].slice(0, 50);
        set({
          phase: 'done',
          generatedImages: images,
          selectedImageId: images[0]?.id ?? null,
          history: newHistory,
          rightPanelTab: 'detail',
          taskProgress: 100,
          taskEstimatedTime: 0,
        });
      } else if (task.status === 'failed') {
        set({
          phase: 'error',
          taskError: task.error || 'AI 生成失败，请重试',
          taskProgress: 0,
        });
      } else {
        // Timeout or unexpected
        set({
          phase: 'error',
          taskError: '生成超时，请检查 ComfyUI 是否正常运行',
          taskProgress: 0,
        });
      }
    } catch (err) {
      set({
        phase: 'error',
        taskError:
          err instanceof Error ? err.message : '网络请求失败，请确认后端已启动',
        taskProgress: 0,
      });
    }
  },

  /* --- Selection --- */
  selectImage: (id) => set({ selectedImageId: id, rightPanelTab: 'detail' }),

  toggleComparisonMode: () => {
    const { comparisonMode } = get();
    set({ comparisonMode: !comparisonMode, checkedImageIds: new Set<string>() });
  },

  toggleImageCheck: (id) => {
    const { checkedImageIds } = get();
    const next = new Set(checkedImageIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    set({ checkedImageIds: next });
  },

  setRightPanelTab: (tab) => set({ rightPanelTab: tab }),

  /* --- Favorites & Rating --- */
  toggleFavorite: (id) => {
    const updateImage = (imgs: GeneratedImage[]): GeneratedImage[] =>
      imgs.map((img) => (img.id === id ? { ...img, isFavorited: !img.isFavorited } : img));

    const generatedImages = updateImage(get().generatedImages);
    const history = updateImage(get().history);

    const img = [...generatedImages, ...history].find((i) => i.id === id);
    if (!img) return;

    const favorites = get().favorites;
    const isNowFav = !img.isFavorited; // it WAS the opposite before update
    const newFavs = isNowFav
      ? [...favorites, { ...img, isFavorited: true }]
      : favorites.filter((f) => f.id !== id);

    set({ generatedImages, history, favorites: newFavs });
  },

  setRating: (id, rating) => {
    const updateImage = (imgs: GeneratedImage[]): GeneratedImage[] =>
      imgs.map((img) => (img.id === id ? { ...img, rating } : img));

    set({
      generatedImages: updateImage(get().generatedImages),
      history: updateImage(get().history),
      favorites: updateImage(get().favorites),
    });
  },

  /* --- Re-edit: fill params from image --- */
  reeditFromImage: (id) => {
    const img = [...get().generatedImages, ...get().history].find((i) => i.id === id);
    if (!img) return;
    set({ params: { ...img.params }, phase: 'idle', generatedImages: [], selectedImageId: null });
  },

  /* --- Export --- */
  exportImage: (id, format) => {
    const img = [...get().generatedImages, ...get().history, ...get().favorites].find((i) => i.id === id);
    if (!img) return;
    downloadImage(img.dataUrl, format, `非遗纹样_${img.params.category}_${Date.now()}`);
  },

  exportAllImages: (format) => {
    const { generatedImages } = get();
    generatedImages.forEach((img, i) => {
      setTimeout(() => downloadImage(img.dataUrl, format, `非遗纹样_${img.params.category}_${i + 1}`), i * 200);
    });
  },

  /* --- Save Project --- */
  saveProject: () => {
    const { params, generatedImages, favorites, history } = get();
    const data = JSON.stringify({ params, generatedImages, favorites, history, savedAt: Date.now() });
    localStorage.setItem('heritage-pattern-project', data);
    // Could show a toast notification here
  },

  /* --- Lightbox --- */
  openLightbox: (id) => set({ lightboxImageId: id }),
  closeLightbox: () => set({ lightboxImageId: null }),

  /* --- Cultural Preview --- */
  toggleCulturalPreview: (templateId) => {
    const { culturalPreviewActive, culturalTemplateId } = get();
    if (!templateId) {
      set({ culturalPreviewActive: !culturalPreviewActive, culturalTemplateId: null });
    } else if (culturalTemplateId === templateId && culturalPreviewActive) {
      set({ culturalPreviewActive: false, culturalTemplateId: null });
    } else {
      set({ culturalPreviewActive: true, culturalTemplateId: templateId });
    }
  },

  /* --- Load from History --- */
  loadFromHistory: (image) => {
    set({
      generatedImages: [image],
      selectedImageId: image.id,
      phase: 'done',
      rightPanelTab: 'detail',
    });
  },

  /* --- Dismiss error --- */
  dismissError: () => set({ phase: 'idle', taskError: null }),
}));

/* ===== Utility: download image via Canvas API ===== */
function downloadImage(dataUrl: string, format: 'png' | 'jpg', filename: string) {
  const canvas = document.createElement('canvas');
  const img = new Image();
  img.src = dataUrl;
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;

    if (format === 'jpg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);

    const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    }, mimeType, 0.95);
  };
}
