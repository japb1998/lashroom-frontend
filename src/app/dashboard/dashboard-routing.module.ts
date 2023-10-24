import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { NewNotificationComponent } from './components/new-notification/new-notification.component';
import { DashboardComponent } from './dashboard.component';
import { DashBoardMainComponent } from './components/main/main.component';
import { AddClientComponent } from './components/add-client/add-client.component';
import { SingleClientComponent } from './components/single-client/single-client.component';
import { ClientsComponent } from './components/clients/clients.component';
import { ActiveNotificationsComponent } from './components/active-notifications/active-notifications.component';
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
        path: 'clients',
        component: ClientsComponent
      },
      {
        path: 'notifications',
        component: ActiveNotificationsComponent
      },
      {
        path: 'client',
        children: [
          {
            path: ':id',
            component: SingleClientComponent
          }
        ]
      },
      {
        path: 'new-notification',
        children: [
          {
            path: ':id',
            component: NewNotificationComponent
          },
          {
            path: '**',
            component: NewNotificationComponent
          }
        ]
      },
      {
        path: 'new-client',
        component: AddClientComponent
      }
    ]
   }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }