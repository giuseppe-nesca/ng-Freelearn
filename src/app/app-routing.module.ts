import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './dashboard/home/home.component';
import { BookingComponent } from './dashboard/booking/booking.component';
import { AuthGuard } from './auth/auth-guard.service';
import { HistoryComponent } from './dashboard/history/history.component';

const routes: Routes = [
  { path: "login", component: LoginComponent },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [ AuthGuard ],
    children: [
      { path: "home", component: HomeComponent },
      { path: "booking", component: BookingComponent },
      { path: "history", component: HistoryComponent },
      { path: "", redirectTo: "home", pathMatch: "full" }
    ]
  },
  { path: "", redirectTo: "dashboard", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
