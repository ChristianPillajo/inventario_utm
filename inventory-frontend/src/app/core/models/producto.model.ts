export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stockActual: number;
  categoriaId: number;
  categoriaNombre: string;
  fechaCreacion: string;
}

export interface ProductoRequest {
  nombre: string;
  descripcion: string;
  precio: number;
  stockActual: number;
  categoriaId: number;
}
