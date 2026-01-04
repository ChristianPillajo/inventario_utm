export interface Movimiento {
  id: number;
  productoId: number;
  productoNombre: string;
  tipo: 'ENTRADA' | 'SALIDA';
  cantidad: number;
  usuarioId: number;
  usuarioNombre: string;
  fechaMovimiento: string;
  observacion: string;
}

export interface MovimientoRequest {
  productoId: number;
  tipo: string;
  cantidad: number;
  usuarioId: number;
  observacion: string;
}
