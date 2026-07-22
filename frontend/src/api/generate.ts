/** Pattern generation API — submit + poll. */

import type { GenerationParams } from '../store/types';
import type { GenerateResponse, TaskStatus, ComfyUIHealth, NaturalLanguageResponse } from './types';
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

/** Convert backend snake_case parsed_params → frontend camelCase. */
export function fromSnakeCase(raw: NaturalLanguageResponse['parsed_params']): GenerationParams {
  return {
    category: raw.category as GenerationParams['category'],
    styleStrength: raw.style_strength,
    customPrompt: raw.prompt,
    themeTags: raw.theme_tags,
    colorSchemeId: raw.color_scheme_id,
    sizePreset: raw.size_preset as GenerationParams['sizePreset'],
    customWidth: raw.custom_width,
    customHeight: raw.custom_height,
    generationCount: raw.count,
    seed: raw.seed,
  };
}

/** Submit a generation request → get back a task_id. */
export async function submitGeneration(
  params: GenerationParams,
): Promise<GenerateResponse> {
  return apiPost<GenerateResponse>('/generate', toSnakeCase(params));
}

/** Submit natural language → LLM parses → enqueue → return task_id + parsed params. */
export async function submitNaturalLanguage(
  prompt: string,
  count: number = 2,
): Promise<NaturalLanguageResponse> {
  return apiPost<NaturalLanguageResponse>('/generate/natural', { prompt, count });
}

/** Poll task status until done / failed. */
export async function pollTaskStatus(taskId: string): Promise<TaskStatus> {
  return apiGet<TaskStatus>(`/generate/${taskId}`);
}

/** Check ComfyUI connectivity. */
export async function checkComfyUIHealth(): Promise<ComfyUIHealth> {
  return apiGet<ComfyUIHealth>('/comfyui/health');
}
