export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password: string;
  rol: 'ADMIN' | 'USUARIO';
  fechaCreacion: string;
}

export interface UsuarioRequest {
  nombre: string;
  email: string;
  password: string;
  rol: string;
}

export interface UsuarioDTO {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  fechaCreacion: string;
}
