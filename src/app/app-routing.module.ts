import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { AuthGuard } from './authentication/guard/auth.guard';
import { MainComponent } from './main/main.component';

const routes: Routes = [
    {
        path: "dashboard",
        component: MainComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: "",
                loadChildren: () => import("./dashboard/dashboard.module").then(m => m.DashboardModule),
            }
        ]
    },
    {
        path: "login",
        pathMatch: 'full',
        loadChildren: () => import("./authentication/authentication.module").then(m => m.AuthenticationModule)
    },
    {
        path: "**",
        redirectTo: "dashboard"
    }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }