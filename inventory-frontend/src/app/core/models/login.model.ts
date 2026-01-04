// Solo este archivo en src/app/models/
export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}
