import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './dashboard/home/home.component';
import { BookingComponent } from './dashboard/booking/booking.component';
import { AuthGuard } from './auth/auth-guard.service';
import { HistoryComponent } from './dashboard/history/history.component';
import { PrenotationComponent } from './dashboard/prenotation/prenotation.component';
import { SubjectsComponent } from './dashboard/subjects/subjects.component';
import { TeachersComponent } from './dashboard/teachers/teachers.component';
import { CoursesComponent } from './dashboard/courses/courses.component';
import { AuthGuardAdminService } from './auth/auth-guard-admin.service';

const routes: Routes = [
  { path: "login", component: LoginComponent },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [ AuthGuard, AuthGuardAdminService ],
    children: [
      { path: "home", component: HomeComponent },
      { path: "booking", component: BookingComponent },
      { path: "history", component: HistoryComponent },
      { path: "prenotation", component: PrenotationComponent },
      { path: "subjects", component: SubjectsComponent },
      { path: "teachers", component: TeachersComponent },
      { path: "courses", component: CoursesComponent},
      { path: "", redirectTo: "home", pathMatch: "full" }
    ]
  },
  { path: "", redirectTo: "dashboard", pathMatch: "full" },
  { path: "**", redirectTo: "dashboard", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
