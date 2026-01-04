import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Usuario, UsuarioRequest, UsuarioDTO } from '../models/usuario.model';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiService = inject(ApiService);

  // Estado global con Signals
  private usuariosState = signal<UsuarioDTO[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // Computed signals para el template
  usuarios = computed(() => this.usuariosState());
  loading = computed(() => this.loadingState());
  error = computed(() => this.errorState());

  // Cargar todos los usuarios
  loadUsuarios(): Observable<UsuarioDTO[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    return this.apiService.get<UsuarioDTO[]>('/usuarios').pipe(
      tap(usuarios => {
        this.usuariosState.set(usuarios);
        this.loadingState.set(false);
      }),
      catchError(error => {
        this.errorState.set('Error al cargar usuarios');
        this.loadingState.set(false);
        return of([]);
      })
    );
  }

  // Obtener usuario por ID
  getUsuarioById(id: number): Observable<UsuarioDTO> {
    return this.apiService.get<UsuarioDTO>(`/usuarios/${id}`);
  }

  // Crear usuario
  createUsuario(usuario: UsuarioRequest): Observable<UsuarioDTO> {
    this.loadingState.set(true);

    return this.apiService.post<UsuarioDTO>('/usuarios', usuario).pipe(
      tap(nuevoUsuario => {
        // Actualizar el estado con el nuevo usuario
        this.usuariosState.update(usuarios => [...usuarios, nuevoUsuario]);
        this.loadingState.set(false);
      }),
      catchError(error => {
        this.loadingState.set(false);
        throw error;
      })
    );
  }

  // Actualizar usuario
  updateUsuario(id: number, usuario: UsuarioRequest): Observable<UsuarioDTO> {
    this.loadingState.set(true);

    return this.apiService.put<UsuarioDTO>(`/usuarios/${id}`, usuario).pipe(
      tap(usuarioActualizado => {
        // Actualizar en el estado
        this.usuariosState.update(usuarios =>
          usuarios.map(u => u.id === id ? usuarioActualizado : u)
        );
        this.loadingState.set(false);
      }),
      catchError(error => {
        this.loadingState.set(false);
        throw error;
      })
    );
  }

  // Eliminar usuario
  deleteUsuario(id: number): Observable<void> {
    this.loadingState.set(true);

    return this.apiService.delete<void>(`/usuarios/${id}`).pipe(
      tap(() => {
        // Remover del estado
        this.usuariosState.update(usuarios =>
          usuarios.filter(u => u.id !== id)
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
