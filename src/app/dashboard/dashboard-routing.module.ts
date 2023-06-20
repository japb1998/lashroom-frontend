import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { NewNotificationComponent } from './components/new-notification/new-notification.component';
import { DashboardComponent } from './dashboard.component';
import { DashBoardMainComponent } from './components/main/main.component';

const routes: Routes = [
   {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: DashBoardMainComponent
      },
      {
        path: 'new-notification',
        component: NewNotificationComponent
      },
    ]
   }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }