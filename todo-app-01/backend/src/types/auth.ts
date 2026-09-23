export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  username: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  token?: string;
}