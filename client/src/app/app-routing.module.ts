import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../app/Components/Login/login/login.component';
import { AuthGuard } from './guards/guards/auth.guard';
import { EquipoComponent } from './Components/Equipo/equipo/equipo.component';
import { AdministrarComponent } from './Components/Administrar/administrar/administrar.component';
import { DuenoComponent } from './Components/Dueño/dueno/dueno.component';
import { RegistrarClubComponent } from './Components/registrar-club/registrar-club/registrar-club.component';
import { InicioComponent } from './Components/inicio/inicio/inicio.component';

import { DashboardComponent} from './Components/Dashboards/dashboard/dashboard.component';
import { LayoutComponent } from './Components/Layout/layout/layout.component';

import { GestionEquiposComponent} from './Components/PaginasDashboard/gestion-equipos/gestion-equipos.component';
import { GestionJugadoresComponent} from './Components/PaginasDashboard/gestion-jugadores/gestion-jugadores.component';
import { GestionPerfilComponent} from './Components/PaginasDashboard/gestion-perfil/gestion-perfil.component';
import { GestionSistemaComponent} from './Components/PaginasDashboard/gestion-sistema/gestion-sistema.component';

const routes: Routes = [
  { path: 'equipo', component: EquipoComponent, canActivate: [AuthGuard], data: { roles: ['administrador_equipo'] } },
  { path: 'administrar', component: AdministrarComponent, canActivate: [AuthGuard], data: { roles: ['administrador_equipo'] } },
  { path: 'dueno', component: DuenoComponent, canActivate: [AuthGuard], data: { roles: ['administrador_sistema'] } },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'Rclub', component: RegistrarClubComponent},
  { path: 'inicio', component: InicioComponent},
  { path: 'Dashboar', component: DashboardComponent},
   
  {
    path: 'dashboard',
    component: LayoutComponent,
    children: [
      { path: 'Equipos', component: GestionEquiposComponent },
      { path: 'Jugadores', component: GestionJugadoresComponent },
      { path: 'Perfil', component: GestionPerfilComponent },
      { path: 'Sistema', component: GestionSistemaComponent },
      { path: 'Club', component: DuenoComponent },
      { path: '', redirectTo: 'Perfil', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
