import {Component, OnInit, inject, signal, ViewChild, computed} from '@angular/core';

import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import {  PageEvent } from '@angular/material/paginator';
import {  Sort, MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import {ProductoService} from '../../core/services/producto.service';
import {CategoriaService} from '../../core/services/categoria.service';
import {Categoria} from '../../core/models/categoria.model';
import {Producto} from '../../core/models/producto.model';
import {ProductoFormComponent} from '../productos-form/producto-form.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'app-productos-list',
  standalone: false,
  templateUrl: './productos-list.component.html',
  styleUrls: ['productos-list.component.css']
})
export class ProductosListComponent implements OnInit {
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  @ViewChild(MatSort) sort!: MatSort;

  // Signals
  displayedColumns = signal([
    'id',
    'nombre',
    'categoria',
    'precio',
    'stock',
    'valorInventario',
    'acciones'
  ]);
  searchTerm = signal('');
  pageSize = signal(10);
  pageIndex = signal(0);
  sortField = signal('id');
  sortDirection = signal('asc');
  selectedCategoria = signal<number | null>(null);
  stockBajoFilter = signal(false);

  // Computed signals
  productos = this.productoService.productos;
  loading = this.productoService.loading;
  error = this.productoService.error;

  // Signals locales
  categorias = signal<Categoria[]>([]);
  filteredProductos = signal<Producto[]>([]);
  totalItems = signal(0);
  totalValorInventario = signal(0);

  ngOnInit() {
    this.loadProductos();
    this.loadCategorias();
  }

  loadProductos() {
    this.productoService.loadProductos().subscribe({
      next: () => {
        this.applyFilters();
        this.calculateTotalValorInventario();
      },
      error: (err) => {
        this.showError('Error al cargar productos');
      }
    });
  }

  loadCategorias() {
    this.categoriaService.loadCategorias().subscribe({
      next: (categorias) => {
        this.categorias.set(categorias);
      },
      error: () => {
        this.showError('Error al cargar categorías');
      }
    });
  }

  applyFilters() {
    let filtered = this.productos();

    // Filtro de búsqueda
    const term = this.searchTerm().toLowerCase();
    if (term) {
      filtered = filtered.filter(producto =>
        producto.nombre.toLowerCase().includes(term) ||
        producto.descripcion?.toLowerCase().includes(term) ||
        producto.categoriaNombre.toLowerCase().includes(term)
      );
    }

    // Filtro por categoría
    if (this.selectedCategoria()) {
      filtered = filtered.filter(producto =>
        producto.categoriaId === this.selectedCategoria()
      );
    }

    // Filtro por stock bajo
    if (this.stockBajoFilter()) {
      filtered = filtered.filter(producto => producto.stockActual < 10);
    }

    // Ordenamiento
    filtered = this.sortData(filtered);

    // Actualizar datos paginados
    this.totalItems.set(filtered.length);
    const startIndex = this.pageIndex() * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    this.filteredProductos.set(filtered.slice(startIndex, endIndex));
  }

  sortData(data: Producto[]): Producto[] {
    const field = this.sortField();
    const direction = this.sortDirection();

    return data.sort((a, b) => {
      let valueA: any = (a as any)[field];
      let valueB: any = (b as any)[field];

      // Para campos especiales
      if (field === 'valorInventario') {
        valueA = a.precio * a.stockActual;
        valueB = b.precio * b.stockActual;
      }

      // Para fechas
      if (field === 'fechaCreacion') {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }

      // Para strings
      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) {
        return direction === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  calculateTotalValorInventario() {
    const total = this.productos().reduce((sum, producto) => {
      return sum + (producto.precio * producto.stockActual);
    }, 0);
    this.totalValorInventario.set(total);
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
    this.pageIndex.set(0);
    this.applyFilters();
  }

  onCategoriaChange(categoriaId: number | null) {
    this.selectedCategoria.set(categoriaId);
    this.pageIndex.set(0);
    this.applyFilters();
  }

  toggleStockBajoFilter() {
    this.stockBajoFilter.update(value => !value);
    this.pageIndex.set(0);
    this.applyFilters();
  }

  onPageChange(event: PageEvent) {
    this.pageSize.set(event.pageSize);
    this.pageIndex.set(event.pageIndex);
    this.applyFilters();
  }

  onSortChange(sort: Sort) {
    this.sortField.set(sort.active);
    this.sortDirection.set(sort.direction);
    this.applyFilters();
  }

   openCreateDialog() {
     const dialogRef = this.dialog.open(ProductoFormComponent, {
       width: '700px',
       maxHeight: '90vh',
       data: {
         mode: 'create',
         producto: null
       }
     });

     dialogRef.afterClosed().subscribe(result => {
       if (result) {
         this.loadProductos();
       }
     });
   }

   openEditDialog(producto: Producto) {
     const dialogRef = this.dialog.open(ProductoFormComponent, {
       width: '700px',
       maxHeight: '90vh',
       data: {
         mode: 'edit',
         producto: producto
       }
     });

     dialogRef.afterClosed().subscribe(result => {
       if (result) {
         this.loadProductos();
       }
     });
   }

  verDetalle(productoId: number) {
    this.router.navigate(['/productos', productoId]);
  }

  deleteProducto(id: number) {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      backdrop: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.deleteProducto(id).subscribe({
          next: () => {
            this.showSuccess('Producto eliminado correctamente');
            this.loadProductos();
          },
          error: (err) => {
            this.showError('Error al eliminar producto');
          }
        });
      }
    });
  }

  ajustarStock(producto: Producto, incremento: number) {
    if (incremento < 0 && producto.stockActual < Math.abs(incremento)) {
      this.showError('Stock insuficiente');
      return;
    }

    Swal.fire({
      title: `¿${incremento > 0 ? 'Agregar' : 'Quitar'} ${Math.abs(incremento)} unidades?`,
      text: `Stock actual: ${producto.stockActual} → ${producto.stockActual + incremento}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.updateStock(producto.id, incremento).subscribe({
          next: () => {
            this.showSuccess('Stock actualizado correctamente');
            this.loadProductos();
          },
          error: (err) => {
            this.showError('Error al actualizar stock');
          }
        });
      }
    });
  }

  getStockStatus(stock: number): string {
    if (stock === 0) return 'agotado';
    if (stock < 5) return 'bajo';
    if (stock < 10) return 'medio';
    return 'normal';
  }

  cantidadStockBajo = computed(() =>
    this.productos().filter(p => p.stockActual < 5).length
  );

  getStockColor(stock: number): string {
    if (stock === 0) return 'warn';
    if (stock < 5) return 'accent';
    if (stock < 10) return 'primary';
    return 'basic';
  }

  getStockIcon(stock: number): string {
    if (stock === 0) return 'block';
    if (stock < 5) return 'warning';
    if (stock < 10) return 'info';
    return 'check_circle';
  }

  exportToExcel() {
    // Implementar exportación
    this.showSuccess('Exportación iniciada');
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  exportarPDF() {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text('Reporte de Productos - Inventario', 14, 15);

    const productos = this.filteredProductos();

    const body = productos.map(p => [
      p.id,
      p.nombre,
      p.categoriaNombre,
      p.precio,
      p.stockActual,
      (p.precio * p.stockActual).toFixed(2)
    ]);

    autoTable(doc, {
      startY: 25,
      head: [[
        'ID',
        'Producto',
        'Categoría',
        'Precio',
        'Stock',
        'Valor Inventario'
      ]],
      body
    });

    doc.save('reporte-productos.pdf');
  }


  // Helper para template
  min = Math.min;
}
