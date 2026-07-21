/** Lightweight fetch wrapper for the backend API.
 *
 * In dev mode (localhost): requests go through the Vite proxy
 *   /api/*  →  http://localhost:7860/api/*
 *
 * In production: reads VITE_API_BASE from build-time env or window.* config,
 *   e.g. https://your-tunnel.trycloudflare.com/api
 */

const BASE: string =
  (typeof window !== 'undefined' && (window as any).__API_BASE__) ||
  import.meta.env.VITE_API_BASE ||
  '/api';

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let resp: Response;
  try {
    resp = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      ...options,
    });
  } catch (err) {
    throw new ApiError(
      `无法连接到服务器，请确认后端已启动 (${err instanceof Error ? err.message : String(err)})`,
      0,
    );
  }

  if (!resp.ok) {
    const body = await resp.text().catch(() => '');
    throw new ApiError(
      body || `请求失败 (HTTP ${resp.status})`,
      resp.status,
    );
  }

  // 204 No Content
  if (resp.status === 204) return undefined as T;

  return resp.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function apiGet<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'GET' });
}

export { ApiError };
