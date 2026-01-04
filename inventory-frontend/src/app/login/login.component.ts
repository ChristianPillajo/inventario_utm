import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../core/services/auth.service';


@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor ingresa email y contraseña';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Crear objeto de login
    const loginData = {
      email: this.email,
      password: this.password
    };

    // Usar el servicio real
    this.authService.login(loginData).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          // Redirigir al dashboard
          this.router.navigate(['/productos']);
        } else {
          this.errorMessage = 'Credenciales incorrectas';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error en el servidor. Usando modo demo.';

        // Modo demo si falla el backend
        this.authService.loginSimple(this.email, this.password).subscribe(() => {
          this.router.navigate(['/dashboard']);
        });
      }
    });
  }
}
