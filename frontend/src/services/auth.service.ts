// src/services/auth.service.ts
import api from './api';
import type { User } from '../types';

type LoginResponse = {
  token: string;
  user?: User;
};

export const authService = {
  /**
   * Login: { email, password } => returns response with token
   */
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/login', { email, password }),

  /**
   * Register: payload { name, email, password, password_confirmation?, rol? }
   */
  register: (payload: Record<string, any>) =>
    api.post('/register', payload),

  /**
   * Logout: send request to backend (if configured). Backend should revoke token.
   */
  logout: () => api.post('/logout'),

  /**
   * Get current profile: GET /profile
   */
  profile: () => api.get<User>('/profile'),
};
