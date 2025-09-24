// src/services/formulario.service.ts
import api from './api';
import type { Formulario, Paginated } from '../types';

export const formularioService = {
  // list(page, q, perPage, mine)
  list: (page = 1, q = '', perPage?: number, mine = false) => {
    const params: Record<string, string> = { page: String(page) };
    if (q) params.q = q;
    if (perPage) params.per_page = String(perPage);
    if (mine) params.mine = '1';
    const qs = new URLSearchParams(params).toString();
    return api.get<Paginated<Formulario>>(`/formularios?${qs}`);
  },

  show: (id: number) => api.get<Formulario>(`/formularios/${id}`),

  create: (payload: Partial<Formulario>) => api.post('/formularios', payload),

  update: (id: number, payload: Partial<Formulario>) => api.put(`/formularios/${id}`, payload),

  destroy: (id: number) => api.delete(`/formularios/${id}`),
};
