import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import { SidebarComponent } from './shared/components/sidebar.component/sidebar.component';
import {NavbarComponent} from './shared/components/navbar.component/navbar.component';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {MatChip} from '@angular/material/chips';
import {MatDivider, MatList, MatListItem} from '@angular/material/list';
import {MatPaginator} from '@angular/material/paginator';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatOption, MatSelect} from '@angular/material/select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatToolbar} from '@angular/material/toolbar';
import {MatBadge} from '@angular/material/badge';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatButton, MatIconButton, MatMiniFabButton} from '@angular/material/button';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {MatTooltip} from '@angular/material/tooltip';
import {ProductosListComponent} from './features/productos-list/productos-list.component';
import {ProductoFormComponent} from './features/productos-form/producto-form.component';
import {LoginComponent} from './login/login.component';
import {LayoutComponent} from './shared/layout/layout.component';
import {UsuariosListComponent} from './features/usuario-list/usuario-list.component';

@NgModule({
  declarations: [
    App,
    NavbarComponent,
    SidebarComponent,
    ProductosListComponent,
    ProductoFormComponent,
    LoginComponent,
    LayoutComponent,
    UsuariosListComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatProgressSpinner,
    MatIcon,
    MatCard,
    MatCardContent,
    MatChip,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatDivider,
    MatList,
    MatListItem,
    MatPaginator,
    MatTable,
    MatSort,
    MatFormField,
    MatLabel,
    MatDialogActions,
    MatError,
    MatSelect,
    MatOption,
    ReactiveFormsModule,
    MatDialogContent,
    MatToolbar,
    MatBadge,
    MatMenuTrigger,
    MatMenu,
    MatIconButton,
    MatMenuItem,
    MatDialogTitle,
    MatInput,
    MatButton,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    MatTooltip,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatMiniFabButton,
    MatIconModule,
    MatDialogClose,
    FormsModule
  ],
  providers: [
    provideHttpClient(withFetch())
  ],
  bootstrap: [App]
})
export class AppModule { }
