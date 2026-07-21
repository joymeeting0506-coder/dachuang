/** Pattern generation API — submit + poll. */

import type { GenerationParams } from '../store/types';
import type { GenerateResponse, TaskStatus, ComfyUIHealth } from './types';
import { apiPost, apiGet } from './client';

/** Convert frontend camelCase GenerationParams → backend snake_case. */
function toSnakeCase(params: GenerationParams): Record<string, unknown> {
  return {
    category: params.category,
    style_strength: params.styleStrength,
    prompt: params.customPrompt,
    theme_tags: params.themeTags,
    color_scheme_id: params.colorSchemeId,
    size_preset: params.sizePreset,
    custom_width: params.customWidth,
    custom_height: params.customHeight,
    count: params.generationCount,
    seed: params.seed,
  };
}

/** Submit a generation request → get back a task_id. */
export async function submitGeneration(
  params: GenerationParams,
): Promise<GenerateResponse> {
  return apiPost<GenerateResponse>('/generate', toSnakeCase(params));
}

/** Poll task status until done / failed. */
export async function pollTaskStatus(taskId: string): Promise<TaskStatus> {
  return apiGet<TaskStatus>(`/generate/${taskId}`);
}

/** Check ComfyUI connectivity. */
export async function checkComfyUIHealth(): Promise<ComfyUIHealth> {
  return apiGet<ComfyUIHealth>('/comfyui/health');
}
