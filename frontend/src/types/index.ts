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
  nombres_apellidos?: string;
  dni?: string;
  ruc?: string | null;
  celular?: string;
  direccion?: string;
  asociacion?: string | null;
  propiedad?: boolean | number;
  titulo?: boolean | number;
  reg_publico?: boolean | number;
  charlas?: 'virtual' | 'presencial' | 'ninguno' | string;
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

export type Paginated<T> = {
  data: T[];
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
};