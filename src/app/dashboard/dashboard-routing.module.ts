import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { NewNotificationComponent } from './components/new-notification/new-notification.component';
import { DashboardComponent } from './dashboard.component';
import { DashBoardMainComponent } from './components/main/main.component';
import { AddClientComponent } from './components/add-client/add-client.component';
import { SingleClientComponent } from './components/single-client/single-client.component';
import { TextEditorComponent } from './components/text-editor/text-editor.component';

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
      },
      {
        path: "edit",
        component: TextEditorComponent
      }
    ]
   }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }