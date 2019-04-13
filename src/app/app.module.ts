import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './dashboard/home/home.component';
import { BookingComponent, SubmitDialogComponent } from './dashboard/booking/booking.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainNavComponent } from './dashboard/main-nav/main-nav.component';
import { HistoryComponent } from './dashboard/history/history.component';
import { PrenotationComponent } from './dashboard/prenotation/prenotation.component';
import { SubjectsComponent } from './dashboard/subjects/subjects.component';
import { TeachersComponent } from './dashboard/teachers/teachers.component';
import { CoursesComponent } from './dashboard/courses/courses.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HomeComponent,
    BookingComponent,
    HistoryComponent,
    MainNavComponent,
    PrenotationComponent,
    SubmitDialogComponent,
    PrenotationComponent,
    SubjectsComponent,
    TeachersComponent,
    CoursesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  entryComponents: [
    SubmitDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
