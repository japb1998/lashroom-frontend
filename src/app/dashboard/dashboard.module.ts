import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from '../material/material.module';
import { HeaderComponent } from '../header/header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NewNotificationComponent } from './components/new-notification/new-notification.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashBoardMainComponent } from './components/main/main.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    DashboardComponent,
    NewNotificationComponent,
    DashBoardMainComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    HttpClientModule
  ],
  exports: []
})
export class DashboardModule { }
