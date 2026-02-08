/**
 * API Client — couche HTTP centralisée pour communiquer avec le backend Django.
 * Utilise fetch natif, gère le JWT (access + refresh) via localStorage.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// ── Storage keys ──────────────────────────────────────────────
const ACCESS_TOKEN_KEY = 'oaib_access_token';
const REFRESH_TOKEN_KEY = 'oaib_refresh_token';

// ── Token helpers ─────────────────────────────────────────────
export const tokenStore = {
  getAccess: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  set: (access: string, refresh: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

// ── Types ─────────────────────────────────────────────────────
export interface ApiError {
  status: number;
  message: string;
  detail?: string;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  ok: true;
  data: T;
  error: null;
}

export interface ApiErrorResponse {
  ok: false;
  data: null;
  error: ApiError;
}

export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;

// ── Helpers ───────────────────────────────────────────────────
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

async function refreshAccessToken(): Promise<string | null> {
  const refresh = tokenStore.getRefresh();
  if (!refresh) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) {
      tokenStore.clear();
      return null;
    }

    const data = await res.json();
    const newAccess = data.access as string;
    // Si le backend renvoie aussi un nouveau refresh token
    const newRefresh = (data.refresh as string) || refresh;
    tokenStore.set(newAccess, newRefresh);
    return newAccess;
  } catch {
    tokenStore.clear();
    return null;
  }
}

async function parseErrorBody(res: Response): Promise<ApiError> {
  let body: Record<string, unknown> = {};
  try {
    body = await res.json();
  } catch {
    // pas de JSON dans la réponse
  }

  // DRF renvoie souvent { "detail": "..." } ou { "field": ["error1", "error2"] }
  const detail = typeof body.detail === 'string' ? body.detail : undefined;
  const nonFieldErrors = Array.isArray(body.non_field_errors)
    ? (body.non_field_errors as string[]).join('. ')
    : undefined;

  // Collecter les erreurs de champ
  const errors: Record<string, string[]> = {};
  for (const [key, val] of Object.entries(body)) {
    if (key === 'detail' || key === 'non_field_errors') continue;
    if (Array.isArray(val)) {
      errors[key] = val.map(String);
    }
  }

  return {
    status: res.status,
    message: detail || nonFieldErrors || res.statusText || 'Erreur inconnue',
    detail,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
}

// ── Core request function ─────────────────────────────────────
interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  auth?: boolean; // default true
  isFormData?: boolean;
}

async function request<T>(
  endpoint: string,
  opts: RequestOptions = {},
): Promise<ApiResult<T>> {
  const { method = 'GET', body, headers = {}, auth = true, isFormData = false } = opts;

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const reqHeaders: Record<string, string> = { ...headers };
  if (!isFormData) {
    reqHeaders['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = tokenStore.getAccess();
    if (token) {
      reqHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const fetchOpts: RequestInit = {
    method,
    headers: reqHeaders,
  };

  if (body !== undefined) {
    fetchOpts.body = isFormData ? (body as FormData) : JSON.stringify(body);
  }

  let res: Response;
  try {
    res = await fetch(url, fetchOpts);
  } catch {
    return {
      ok: false,
      data: null,
      error: { status: 0, message: 'Erreur réseau. Vérifiez votre connexion.' },
    };
  }

  // ── Token expired → essayer de rafraîchir ──
  if (res.status === 401 && auth && tokenStore.getRefresh()) {
    if (!isRefreshing) {
      isRefreshing = true;
      const newToken = await refreshAccessToken();
      isRefreshing = false;

      if (newToken) {
        onRefreshed(newToken);
        // Rejouer la requête avec le nouveau token
        reqHeaders['Authorization'] = `Bearer ${newToken}`;
        const retryRes = await fetch(url, { ...fetchOpts, headers: reqHeaders });
        if (retryRes.ok) {
          const data = retryRes.status === 204 ? (null as T) : ((await retryRes.json()) as T);
          return { ok: true, data, error: null };
        }
        return { ok: false, data: null, error: await parseErrorBody(retryRes) };
      } else {
        // Refresh échoué → forcer la déconnexion
        window.dispatchEvent(new CustomEvent('auth:logout'));
        return {
          ok: false,
          data: null,
          error: { status: 401, message: 'Session expirée, veuillez vous reconnecter.' },
        };
      }
    } else {
      // Une autre requête rafraîchit déjà → attendre
      return new Promise(resolve => {
        addRefreshSubscriber(async (token: string) => {
          reqHeaders['Authorization'] = `Bearer ${token}`;
          const retryRes = await fetch(url, { ...fetchOpts, headers: reqHeaders });
          if (retryRes.ok) {
            const data = retryRes.status === 204 ? (null as T) : ((await retryRes.json()) as T);
            resolve({ ok: true, data, error: null });
          } else {
            resolve({ ok: false, data: null, error: await parseErrorBody(retryRes) });
          }
        });
      });
    }
  }

  // ── Réponse normale ──
  if (res.ok) {
    const data = res.status === 204 ? (null as T) : ((await res.json()) as T);
    return { ok: true, data, error: null };
  }

  return { ok: false, data: null, error: await parseErrorBody(res) };
}

// ── Public API ────────────────────────────────────────────────
export const api = {
  get: <T>(endpoint: string, opts?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...opts, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, opts?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...opts, method: 'POST', body }),

  put: <T>(endpoint: string, body?: unknown, opts?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...opts, method: 'PUT', body }),

  patch: <T>(endpoint: string, body?: unknown, opts?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...opts, method: 'PATCH', body }),

  delete: <T = void>(endpoint: string, opts?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...opts, method: 'DELETE' }),

  upload: <T>(endpoint: string, formData: FormData, opts?: Omit<RequestOptions, 'method' | 'body' | 'isFormData'>) =>
    request<T>(endpoint, { ...opts, method: 'POST', body: formData, isFormData: true }),
};

export default api;
