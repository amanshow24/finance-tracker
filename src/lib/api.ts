const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface ApiEntry {
  _id?: string;
  id?: string;
  userId?: string;
  user_id?: string;
  title: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date: string;
  notes?: string | null;
  createdAt?: string;
  created_at?: string;
}

export interface FinanceEntry {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date: string;
  notes: string | null;
  created_at: string;
}

export interface ApiResponse<T = any> {
  ok: boolean;
  status: number;
  data: T | null;
  error: { message: string } | null;
}

export const getToken = () => {
  return localStorage.getItem('finance-tracker-token');
};

const buildHeaders = (customHeaders: Record<string, string> = {}) => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customHeaders,
  };
};

export const apiFetch = async <T = any>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: buildHeaders(options.headers as Record<string, string>),
    });

    const text = await response.text();
    let data: any = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
      error: response.ok ? null : { message: data?.error || response.statusText },
    };
  } catch (fetchError: any) {
    return {
      ok: false,
      status: 0,
      data: null,
      error: { message: fetchError?.message || 'Network request failed' },
    };
  }
};

export const normalizeEntry = (entry: ApiEntry): FinanceEntry => ({
  id: entry.id || entry._id || '',
  user_id: entry.user_id || entry.userId || '',
  title: entry.title,
  amount: entry.amount,
  category: entry.category,
  type: entry.type,
  date: entry.date,
  notes: entry.notes ?? null,
  created_at: entry.created_at || entry.createdAt || '',
});
