// src/services/comunicado.service.ts
import api from './api';
import type { Comunicado, Paginated } from '../types';

export const comunicadoService = {
  list: (page = 1, q = '') => {
    const params: Record<string, string> = { page: String(page) };
    if (q) params.q = q;
    const qs = new URLSearchParams(params).toString();
    return api.get<Paginated<Comunicado>>(`/comunicados?${qs}`);
  },

  show: (id: number) => api.get<Comunicado>(`/comunicados/${id}`),

  // payload can be FormData (for file) or plain object
  create: (payload: any) => api.post('/comunicados', payload),

  update: (id: number, payload: any) => {
    // If FormData with _method=PUT sent, you might use post; but here support put/post both:
    // prefer post when payload is FormData with _method=PUT
    if (payload instanceof FormData) {
      return api.post(`/comunicados/${id}`, payload);
    }
    return api.put(`/comunicados/${id}`, payload);
  },

  destroy: (id: number) => api.delete(`/comunicados/${id}`),

  restore: (id: number) => api.post(`/comunicados/${id}/restore`),

  forceDelete: (id: number) => api.delete(`/comunicados/${id}/force`),
};
