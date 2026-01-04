import {Component, OnInit, inject, signal, computed, ViewChild} from '@angular/core';


import Swal from 'sweetalert2';
import {UsuarioService} from '../../core/services/usuario.service';
import {UsuarioDTO, UsuarioRequest} from '../../core/models/usuario.model';
import {PageEvent} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';

@Component({
  selector: 'app-usuarios-list',
  standalone: false,
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css']
})
export class UsuariosListComponent implements OnInit {
  private usuarioService = inject(UsuarioService);

  // Usamos las signals del servicio
  usuarios = this.usuarioService.usuarios;
  loading = this.usuarioService.loading;
  error = this.usuarioService.error;

  @ViewChild(MatSort) sort!: MatSort;
  // Signals
  displayedColumns = signal([
    'id',
    'nombre',
    'email'
  ]);
  pageSize = signal(10);
  pageIndex = signal(0);
  sortField = signal('id');
  sortDirection = signal('asc');
  selectedCategoria = signal<number | null>(null);
  stockBajoFilter = signal(false);
  totalItems = signal(0);

  // Signals locales del componente
  searchTerm = signal<string>('');
  showModal = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  usuarioSeleccionado = signal<UsuarioDTO | null>(null);
  usuarioForm = signal<UsuarioRequest>({
    nombre: '',
    email: '',
    password: '',
    rol: 'USUARIO'
  });

  // Computed signals para datos derivados
  usuariosFiltrados = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const usuarios = this.usuarios();

    if (!term.trim()) return usuarios;

    return usuarios.filter(usuario =>
      usuario.nombre.toLowerCase().includes(term) ||
      usuario.email.toLowerCase().includes(term) ||
      usuario.rol.toLowerCase().includes(term)
    );
  });

  totalUsuarios = computed(() => this.usuarios().length);
  usuariosAdmins = computed(() => this.usuarios().filter(u => u.rol === 'ADMIN').length);
  usuariosNormales = computed(() => this.usuarios().filter(u => u.rol === 'USUARIO').length);

  constructor() {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.loadUsuarios().subscribe({
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
      }
    });
  }

  abrirModalCrear(): void {
    this.usuarioForm.set({
      nombre: '',
      email: '',
      password: '',
      rol: 'USUARIO'
    });
    this.isEditing.set(false);
    this.usuarioSeleccionado.set(null);
    this.showModal.set(true);
  }

  abrirModalEditar(usuario: UsuarioDTO): void {
    this.usuarioSeleccionado.set(usuario);
    this.usuarioForm.set({
      nombre: usuario.nombre,
      email: usuario.email,
      password: '', // No mostrar la contraseña actual
      rol: usuario.rol
    });
    this.isEditing.set(true);
    this.showModal.set(true);
  }

  cerrarModal(): void {
    this.showModal.set(false);
    this.usuarioSeleccionado.set(null);
    this.usuarioForm.set({
      nombre: '',
      email: '',
      password: '',
      rol: 'USUARIO'
    });
  }

  guardarUsuario(): void {
    if (!this.validarFormulario()) return;

    const usuarioData = this.usuarioForm();

    if (this.isEditing() && this.usuarioSeleccionado()?.id) {
      // Actualizar usuario existente
      this.usuarioService.updateUsuario(this.usuarioSeleccionado()!.id, usuarioData)
        .subscribe({
          next: () => {
            Swal.fire('Éxito', 'Usuario actualizado correctamente', 'success');
            this.cerrarModal();
          },
          error: (error) => {
            console.error('Error al actualizar usuario:', error);
            Swal.fire('Error', 'No se pudo actualizar el usuario', 'error');
          }
        });
    } else {
      // Crear nuevo usuario
      this.usuarioService.createUsuario(usuarioData)
        .subscribe({
          next: () => {
            Swal.fire('Éxito', 'Usuario creado correctamente', 'success');
            this.cerrarModal();
          },
          error: (error) => {
            console.error('Error al crear usuario:', error);
            Swal.fire('Error', 'No se pudo crear el usuario', 'error');
          }
        });
    }
  }

  eliminarUsuario(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.deleteUsuario(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'Usuario eliminado correctamente', 'success');
          },
          error: (error) => {
            console.error('Error al eliminar usuario:', error);
            Swal.fire('Error', 'No se pudo eliminar el usuario', 'error');
          }
        });
      }
    });
  }

  cambiarRol(usuario: UsuarioDTO): void {
    const nuevoRol = usuario.rol === 'ADMIN' ? 'USUARIO' : 'ADMIN';

    Swal.fire({
      title: 'Cambiar rol',
      text: `¿Cambiar rol de ${usuario.nombre} a ${nuevoRol}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const updateData: UsuarioRequest = {
          nombre: usuario.nombre,
          email: usuario.email,
          password: '', // Contraseña vacía (no se cambia)
          rol: nuevoRol
        };

        this.usuarioService.updateUsuario(usuario.id, updateData).subscribe({
          next: () => {
            Swal.fire('Éxito', 'Rol actualizado correctamente', 'success');
          },
          error: (error) => {
            console.error('Error al cambiar rol:', error);
            Swal.fire('Error', 'No se pudo cambiar el rol', 'error');
          }
        });
      }
    });
  }

  validarFormulario(): boolean {
    const form = this.usuarioForm();

    if (!form.nombre.trim()) {
      Swal.fire('Error', 'El nombre es requerido', 'warning');
      return false;
    }

    if (!form.email.trim()) {
      Swal.fire('Error', 'El email es requerido', 'warning');
      return false;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      Swal.fire('Error', 'Ingresa un email válido', 'warning');
      return false;
    }

    if (!this.isEditing() && !form.password) {
      Swal.fire('Error', 'La contraseña es requerida para nuevos usuarios', 'warning');
      return false;
    }

    if (form.password && form.password.length < 6) {
      Swal.fire('Error', 'La contraseña debe tener al menos 6 caracteres', 'warning');
      return false;
    }

    return true;
  }

  getRolClass(rol: string): string {
    return rol === 'ADMIN' ? 'rol-admin' : 'rol-usuario';
  }

  // Método para actualizar el formulario desde el template
  actualizarFormulario<T extends keyof UsuarioRequest>(campo: T, valor: UsuarioRequest[T]): void {
    this.usuarioForm.update(form => ({
      ...form,
      [campo]: valor
    }));
  }

  onPageChange(event: PageEvent) {
    this.pageSize.set(event.pageSize);
    this.pageIndex.set(event.pageIndex);

  }
  onSortChange(sort: Sort) {
    this.sortField.set(sort.active);
    this.sortDirection.set(sort.direction);

  }



  // Helper para template
  min = Math.min;
}
