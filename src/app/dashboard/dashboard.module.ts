import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from '../material/material.module';
import { HeaderComponent } from '../header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewNotificationComponent } from './components/new-notification/new-notification.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashBoardMainComponent } from './components/main/main.component';
import { HttpClientModule } from '@angular/common/http';
import { ActiveNotificationsComponent } from './components/active-notifications/active-notifications.component';
import { ClientsComponent } from './components/clients/clients.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    DashboardComponent,
    NewNotificationComponent,
    DashBoardMainComponent,
    ActiveNotificationsComponent,
    ClientsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule
  ],
  exports: []
})
export class DashboardModule { }
