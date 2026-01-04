import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Movimiento, MovimientoRequest } from '../models/movimiento.model';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {
  private apiService = inject(ApiService);

  // Signals
  private movimientosState = signal<Movimiento[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // Computed
  movimientos = computed(() => this.movimientosState());
  loading = computed(() => this.loadingState());
  error = computed(() => this.errorState());

  // Cargar movimientos
  loadMovimientos(): Observable<Movimiento[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    return this.apiService.get<Movimiento[]>('/movimientos').pipe(
      tap(movimientos => {
        this.movimientosState.set(movimientos);
        this.loadingState.set(false);
      }),
      catchError(error => {
        this.errorState.set('Error al cargar movimientos');
        this.loadingState.set(false);
        return of([]);
      })
    );
  }

  // Registrar movimiento
  registrarMovimiento(movimiento: MovimientoRequest): Observable<Movimiento> {
    this.loadingState.set(true);

    return this.apiService.post<Movimiento>('/movimientos', movimiento).pipe(
      tap(nuevoMovimiento => {
        this.movimientosState.update(movimientos => [nuevoMovimiento, ...movimientos]);
        this.loadingState.set(false);
      }),
      catchError(error => {
        this.loadingState.set(false);
        throw error;
      })
    );
  }

  // Movimientos por producto
  getMovimientosByProducto(productoId: number): Observable<Movimiento[]> {
    return this.apiService.get<Movimiento[]>(`/movimientos/producto/${productoId}`);
  }

  // Movimientos por usuario
  getMovimientosByUsuario(usuarioId: number): Observable<Movimiento[]> {
    return this.apiService.get<Movimiento[]>(`/movimientos/usuario/${usuarioId}`);
  }

  // Eliminar movimiento
  deleteMovimiento(id: number): Observable<void> {
    this.loadingState.set(true);

    return this.apiService.delete<void>(`/movimientos/${id}`).pipe(
      tap(() => {
        this.movimientosState.update(movimientos =>
          movimientos.filter(m => m.id !== id)
        );
        this.loadingState.set(false);
      }),
      catchError(error => {
        this.loadingState.set(false);
        throw error;
      })
    );
  }
}
