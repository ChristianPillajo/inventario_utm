import {Component, Input, model, signal} from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: false,
  styleUrls: ['navbar.component.css']
})
export class NavbarComponent {
  title = signal('Sistema de Inventario');
  isMenuOpen = signal(false);
  user = signal({
    name: 'Administrador',
    role: 'ADMIN'
  });
  @Input() sidebarOpen!: boolean;
  toggleSidebar = model(undefined);


  toggleMenu() {
    this.isMenuOpen.update(value => !value);
  }

  logout() {
    console.log('Cerrar sesión');
    // Aquí implementarías la lógica de logout
  }
}
