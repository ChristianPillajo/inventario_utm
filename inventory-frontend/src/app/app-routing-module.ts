import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {ProductosListComponent} from './features/productos-list/productos-list.component';
import {ProductoFormComponent} from './features/productos-form/producto-form.component';
import {LoginComponent} from './login/login.component';
import {LayoutComponent} from './shared/layout/layout.component';
import {App} from './app';
import {UsuariosListComponent} from './features/usuario-list/usuario-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent, // Este es el layout con navbar/sidebar
    children: [
      { path: 'productos', component: ProductosListComponent },
      { path: 'productosForm', component: ProductoFormComponent },
      { path: 'usuarios', component: UsuariosListComponent },

      // Agrega aquí otras rutas que necesiten el layout
    ]
  },
  { path: '**', redirectTo: '/login' } // Redirige rutas no encontradas al login

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
