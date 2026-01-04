import { Component, Inject, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {ProductoService} from '../../core/services/producto.service';
import {CategoriaService} from '../../core/services/categoria.service';
import {Categoria} from '../../core/models/categoria.model';
import {ProductoRequest} from '../../core/models/producto.model';

@Component({
  selector: 'app-producto-form',
  templateUrl: './producto-form.component.html',
  standalone: false,
  styleUrls: []
})
export class ProductoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<ProductoFormComponent>);
  private data = inject(MAT_DIALOG_DATA);

  productoForm!: FormGroup;
  loading = signal(false);
  categorias = signal<Categoria[]>([]);
  loadingCategorias = signal(true);

  ngOnInit() {
    this.initForm();
    this.loadCategorias();
  }

  initForm() {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      descripcion: ['', [Validators.maxLength(1000)]],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      stockActual: [0, [Validators.required, Validators.min(0)]],
      categoriaId: ['', Validators.required]
    });

    if (this.data.mode === 'edit' && this.data.producto) {
      const producto = this.data.producto;
      this.productoForm.patchValue({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stockActual: producto.stockActual,
        categoriaId: producto.categoriaId
      });
    }
  }

  loadCategorias() {
    this.loadingCategorias.set(true);
    this.categoriaService.loadCategorias().subscribe({
      next: (categorias) => {
        this.categorias.set(categorias);
        this.loadingCategorias.set(false);
      },
      error: () => {
        this.loadingCategorias.set(false);
        this.snackBar.open('Error al cargar categorías', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  onSubmit() {
    if (this.productoForm.invalid) {
      this.markFormGroupTouched(this.productoForm);
      return;
    }

    this.loading.set(true);

    const productoRequest: ProductoRequest = {
      nombre: this.productoForm.value.nombre,
      descripcion: this.productoForm.value.descripcion,
      precio: this.productoForm.value.precio,
      stockActual: this.productoForm.value.stockActual,
      categoriaId: this.productoForm.value.categoriaId
    };

    if (this.data.mode === 'create') {
      this.createProducto(productoRequest);
    } else if (this.data.mode === 'edit') {
      this.updateProducto(productoRequest);
    }
  }

  createProducto(productoRequest: ProductoRequest) {
    this.productoService.createProducto(productoRequest).subscribe({
      next: () => {
        this.showSuccess('Producto creado exitosamente');
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.handleError(err);
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }

  updateProducto(productoRequest: ProductoRequest) {
    this.productoService.updateProducto(this.data.producto.id, productoRequest).subscribe({
      next: () => {
        this.showSuccess('Producto actualizado exitosamente');
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.handleError(err);
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }

  handleError(error: any) {
    this.loading.set(false);

    let errorMessage = 'Error al guardar producto';
    if (error.status === 400) {
      errorMessage = 'Datos inválidos';
    } else if (error.status === 404) {
      errorMessage = 'Categoría no encontrada';
    }

    this.snackBar.open(errorMessage, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  getTitle(): string {
    return this.data.mode === 'create' ? 'Nuevo Producto' : 'Editar Producto';
  }

  getButtonText(): string {
    return this.data.mode === 'create' ? 'Crear Producto' : 'Actualizar Producto';
  }
}
