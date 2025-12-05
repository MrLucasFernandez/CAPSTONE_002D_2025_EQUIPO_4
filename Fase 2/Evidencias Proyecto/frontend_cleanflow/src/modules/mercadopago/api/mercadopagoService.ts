import { apiRequest } from '@api/apiClient';

export interface CreatePreferenceResponse {
  init_point?: string;
  sandbox_init_point?: string;
  preferenceId?: string;
  [key: string]: any;
}

export async function createPreference(idBoleta: string, idBodega: number): Promise<CreatePreferenceResponse> {
  return apiRequest<CreatePreferenceResponse>(`/mercadopago/crear/${encodeURIComponent(idBoleta)}`, {
    method: 'POST',
    body: { idBodega },
  });
}
