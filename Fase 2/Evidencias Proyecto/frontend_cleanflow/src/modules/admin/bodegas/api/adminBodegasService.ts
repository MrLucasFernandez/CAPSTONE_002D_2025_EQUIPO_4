import type { Bodega } from "@models/product";

const BASE_URL = import.meta.env.VITE_API_URL;

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // allow empty responses
  }

  if (!res.ok) {
    throw new Error(data?.message || `Error ${res.status}`);
  }

  return data as T;
}

export const fetchBodegas = (): Promise<Bodega[]> => apiRequest<Bodega[]>("/bodegas");

export const createBodega = (body: { nombre: string; direccion: string }) =>
  apiRequest<Bodega>("/bodegas", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const fetchBodegaById = (id: number): Promise<Bodega> =>
  apiRequest<Bodega>(`/bodegas/${id}`);

export const updateBodega = (id: number, body: { nombre: string; direccion: string }) =>
  apiRequest<Bodega>(`/bodegas/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
