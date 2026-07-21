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
