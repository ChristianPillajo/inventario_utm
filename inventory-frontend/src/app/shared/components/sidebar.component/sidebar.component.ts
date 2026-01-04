import { Component, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['sidebar.component.css']
})
export class SidebarComponent {
  private router = inject(Router);

  menuItems = signal<MenuItem[]>([

    { icon: '', label: 'Productos', route: '/productos' },
    { icon: '', label: 'Usuarios', route: '/usuarios' }

  ]);

  // Señal para ruta activa
  activeRoute = signal<string>('');

  constructor() {
    // Escuchar cambios de ruta
    this.router.events.subscribe(() => {
      this.activeRoute.set(this.router.url);
    });
  }

  // Verificar si un ítem está activo
 // isActive(route: string): boolean {
   // return this.activeRoute() === route || this.activeRoute().startsWith(route);
  //}

  // Navegar a una ruta
  navigateTo(route: string): void {
    console.log(route);
   this.router.navigate([route]);

  }

  // Obtener estadísticas (puedes personalizar)
  getBadgeCount(route: string): number {
    switch(route) {
      case '/productos':
        return 0; // Aquí puedes conectar con un servicio para contar
      case '/categorias':
        return 0;
      default:
        return 0;
    }
  }
}
