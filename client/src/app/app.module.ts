import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxPayPalModule } from 'ngx-paypal';
import { ReactiveFormsModule } from '@angular/forms';

import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';




import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/Login/login/login.component';
import { AdministrarComponent } from './Components/Administrar/administrar/administrar.component';
import { EquipoComponent } from './Components/Equipo/equipo/equipo.component';
import { DuenoComponent } from './Components/Dueño/dueno/dueno.component';
import { RegistrarClubComponent } from './Components/registrar-club/registrar-club/registrar-club.component';
import { NavbarComponent } from './Components/NavBar/navbar/navbar.component';
import { InicioComponent } from './Components/inicio/inicio/inicio.component';

import { LayoutComponent } from './Components/Layout/layout/layout.component';
import { GestionPerfilComponent } from './Components/PaginasDashboard/gestion-perfil/gestion-perfil.component';
import { GestionEquiposComponent } from './Components/PaginasDashboard/gestion-equipos/gestion-equipos.component';
import { GestionJugadoresComponent } from './Components/PaginasDashboard/gestion-jugadores/gestion-jugadores.component';
import { GestionSistemaComponent } from './Components/PaginasDashboard/gestion-sistema/gestion-sistema.component';
import { MapaSitioComponent } from './Components/mapa-sitio/mapa-sitio.component';
import { BreadcrumbComponent } from './Components/breadcrumb/breadcrumb.component';
import { RouterModule } from '@angular/router';
import { EditarPerfilComponent } from './Components/editar-perfil/editar-perfil.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
     AdministrarComponent,
     EquipoComponent,
     DuenoComponent,
     RegistrarClubComponent,
     NavbarComponent,
     InicioComponent,

     LayoutComponent,
     GestionPerfilComponent,
     GestionEquiposComponent,
     GestionJugadoresComponent,
     GestionSistemaComponent,
     MapaSitioComponent,
     BreadcrumbComponent,
     EditarPerfilComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxPayPalModule,
RouterModule,
    ReactiveFormsModule, 
    RecaptchaModule,
    RecaptchaFormsModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
