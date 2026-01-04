import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Categoria, CategoriaRequest } from '../models/categoria.model';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiService = inject(ApiService);

  // Signals
  private categoriasState = signal<Categoria[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // Computed
  categorias = computed(() => this.categoriasState());
  loading = computed(() => this.loadingState());
  error = computed(() => this.errorState());

  // Cargar categorías
  loadCategorias(): Observable<Categoria[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    return this.apiService.get<Categoria[]>('/categorias').pipe(
      tap(categorias => {
        this.categoriasState.set(categorias);
        this.loadingState.set(false);
      }),
      catchError(error => {
        this.errorState.set('Error al cargar categorías');
        this.loadingState.set(false);
        return of([]);
      })
    );
  }

  // Crear categoría
  createCategoria(categoria: CategoriaRequest): Observable<Categoria> {
    this.loadingState.set(true);

    return this.apiService.post<Categoria>('/categorias', categoria).pipe(
      tap(nuevaCategoria => {
        this.categoriasState.update(categorias => [...categorias, nuevaCategoria]);
        this.loadingState.set(false);
      }),
      catchError(error => {
        this.loadingState.set(false);
        throw error;
      })
    );
  }

  // Actualizar categoría
  updateCategoria(id: number, categoria: CategoriaRequest): Observable<Categoria> {
    this.loadingState.set(true);

    return this.apiService.put<Categoria>(`/categorias/${id}`, categoria).pipe(
      tap(categoriaActualizada => {
        this.categoriasState.update(categorias =>
          categorias.map(c => c.id === id ? categoriaActualizada : c)
        );
        this.loadingState.set(false);
      }),
      catchError(error => {
        this.loadingState.set(false);
        throw error;
      })
    );
  }

  // Eliminar categoría
  deleteCategoria(id: number): Observable<void> {
    this.loadingState.set(true);

    return this.apiService.delete<void>(`/categorias/${id}`).pipe(
      tap(() => {
        this.categoriasState.update(categorias =>
          categorias.filter(c => c.id !== id)
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
