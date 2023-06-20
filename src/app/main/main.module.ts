import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { MaterialModule } from '../material/material.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';



@NgModule({
  declarations: [
    FooterComponent,
    MainComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    DashboardModule,
    MaterialModule,
    RouterModule
  ],
  exports: [
    MainComponent
  ]
})
export class MainModule { }
