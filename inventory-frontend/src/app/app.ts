import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {filter} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit{
 // protected readonly title = signal('inventory-frontend');
  private router = inject(Router);


  // State con Signals
  sidebarOpen = signal(true);
  currentPageTitle = signal('Dashboard');
  isLoading = signal(false);

  // Computed signals
  sidebarWidth = computed(() => this.sidebarOpen() ? '250px' : '70px');
  mainContentMargin = computed(() => this.sidebarOpen() ? '250px' : '70px');

  ngOnInit() {
    // Configurar listener para cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updatePageTitle(event.url);
    });
  }

  toggleSidebar() {
    this.sidebarOpen.update(value => !value);
  }

  updatePageTitle(url: string) {
    const titleMap: {[key: string]: string} = {
      '/dashboard': 'Dashboard',
      '/productos': 'Gestión de Productos',
      '/categorias': 'Gestión de Categorías',
      '/movimientos': 'Registro de Movimientos',
      '/usuarios': 'Gestión de Usuarios',
      '/reportes': 'Reportes y Estadísticas'
    };

    this.currentPageTitle.set(titleMap[url] || 'Dashboard');
  }

  showLoading() {
    this.isLoading.set(true);
  }

  hideLoading() {
    this.isLoading.set(false);
  }
}
