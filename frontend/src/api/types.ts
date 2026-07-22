/** API request types — mirrors backend Pydantic schemas. */

export interface TaskStatus {
  task_id: string;
  status: 'queued' | 'processing' | 'done' | 'failed';
  progress: number; // 0-100
  estimated_time: number; // seconds
  images: GeneratedImageItem[] | null;
  error: string | null;
}

export interface GeneratedImageItem {
  id: string;
  url: string;
  category: string;
  style_strength: number;
}

export interface GenerateResponse {
  task_id: string;
  status: string;
  estimated_time: number;
}

export interface ComfyUIHealth {
  connected: boolean;
  endpoint: string;
  note?: string;
  error?: string;
}

/** Natural language generation — parsed params come back from LLM. */
export interface NaturalLanguageResponse {
  task_id: string;
  status: string;
  estimated_time: number;
  parsed_params: {
    category: string;
    style_strength: number;
    prompt: string;
    theme_tags: string[];
    color_scheme_id: string;
    size_preset: string;
    custom_width: number | null;
    custom_height: number | null;
    count: number;
    seed: number | null;
  };
}
