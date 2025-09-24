// src/types/index.ts
export type User = {
  id: number;
  name: string;
  email: string;
  rol?: string;
  estado?: string;
  created_at?: string;
  updated_at?: string;
};

export type Formulario = {
  id?: number;
  user_id?: number | null;
  session_id?: string | null;
  nombres_apellidos: string;
  dni: string;
  ruc?: string | null;
  celular: string;
  direccion: string;
  asociacion?: string | null;
  propiedad?: boolean;
  titulo?: boolean;
  reg_publico?: boolean;
  charlas?: 'virtual' | 'presencial' | 'ninguno';
  adicional?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type Comunicado = {
  id?: number;
  titulo?: string;
  imagen?: string | null;
  descripcion?: string;
  fecha_publicacion?: string;
  hora_publicacion?: string;
  publicador?: string;
  entidad?: string;
  estado?: 'activo' | 'inactivo' | string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
};

/**
 * Generic paginated response from Laravel's paginate()
 */
export type Paginated<T> = {
  current_page: number;
  data: T[];
  first_page_url: string | null;
  from: number | null;
  last_page: number;
  last_page_url: string | null;
  links: Array<{ url: string | null; label: string; active: boolean; page?: number | null }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
};