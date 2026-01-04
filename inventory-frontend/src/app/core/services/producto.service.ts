import { Injectable, signal, computed, inject } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { ApiService } from './api.service';
import { Producto, ProductoRequest } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiService = inject(ApiService);

  // Estado con Signals
  private productosState = signal<Producto[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);
  private selectedProductoState = signal<Producto | null>(null);

  // Computed signals
  productos = computed(() => this.productosState());
  loading = computed(() => this.loadingState());
  error = computed(() => this.errorState());
  selectedProducto = computed(() => this.selectedProductoState());

  // Cargar todos los productos
  loadProductos(): Observable<Producto[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    return this.apiService.get<Producto[]>('/productos').pipe(
      tap(productos => {
        this.productosState.set(productos);
        this.loadingState.set(false);
      }),
      catchError(error => {
        this.errorState.set('Error al cargar productos');
        this.loadingState.set(false);
        return of([]);
      })
    );
  }

  // Obtener producto por ID
  getProductoById(id: number): Observable<Producto> {
    this.loadingState.set(true);
    return this.apiService.get<Producto>(`/productos/${id}`).pipe(
      tap(producto => {
        this.selectedProductoState.set(producto);
        this.loadingState.set(false);
      }),
      catchError(error => {
        this.errorState.set('Error al cargar producto');
        this.loadingState.set(false);
        throw error;
      })
    );
  }

  // Crear producto
  createProducto(producto: ProductoRequest): Observable<Producto> {
    this.loadingState.set(true);

    return this.apiService.post<Producto>('/productos', producto).pipe(
      tap(nuevoProducto => {
        this.productosState.update(productos => [...productos, nuevoProducto]);
        this.loadingState.set(false);
      }),
      catchError(error => {
        this.loadingState.set(false);
        throw error;
      })
    );
  }

  // Actualizar producto
  updateProducto(id: number, producto: ProductoRequest): Observable<Producto> {
    this.loadingState.set(true);

    return this.apiService.put<Producto>(`/productos/${id}`, producto).pipe(
      tap(productoActualizado => {
        this.productosState.update(productos =>
          productos.map(p => p.id === id ? productoActualizado : p)
        );
        if (this.selectedProductoState()?.id === id) {
          this.selectedProductoState.set(productoActualizado);
        }
        this.loadingState.set(false);
      }),
      catchError(error => {
        this.loadingState.set(false);
        throw error;
      })
    );
  }

  // Eliminar producto
  deleteProducto(id: number): Observable<void> {
    this.loadingState.set(true);

    return this.apiService.delete<void>(`/productos/${id}`).pipe(
      tap(() => {
        this.productosState.update(productos =>
          productos.filter(p => p.id !== id)
        );
        if (this.selectedProductoState()?.id === id) {
          this.selectedProductoState.set(null);
        }
        this.loadingState.set(false);
      }),
      catchError(error => {
        this.loadingState.set(false);
        throw error;
      })
    );
  }

  // Actualizar stock (ajuste rápido)
  updateStock(id: number, cantidad: number): Observable<Producto> {
    this.loadingState.set(true);

    return this.apiService.patch<Producto>(`/productos/${id}/stock?cantidad=${cantidad}`, null).pipe(
      tap(productoActualizado => {
        this.productosState.update(productos =>
          productos.map(p => p.id === id ? productoActualizado : p)
        );
        if (this.selectedProductoState()?.id === id) {
          this.selectedProductoState.set(productoActualizado);
        }
        this.loadingState.set(false);
      }),
      catchError(error => {
        this.loadingState.set(false);
        throw error;
      })
    );
  }

  // Obtener productos por categoría
  getProductosByCategoria(categoriaId: number): Observable<Producto[]> {
    return this.apiService.get<Producto[]>(`/productos/categoria/${categoriaId}`);
  }

  // Obtener productos con stock bajo
  getProductosBajoStock(stockMinimo: number = 5): Observable<Producto[]> {
    return this.apiService.get<Producto[]>(`/productos/bajo-stock?stockMinimo=${stockMinimo}`);
  }

  // Filtrar productos localmente
  filterProductos(searchTerm: string): Producto[] {
    if (!searchTerm) return this.productos();

    return this.productos().filter(producto =>
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.categoriaNombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}
