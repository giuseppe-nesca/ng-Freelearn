import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { BookingService } from './booking.service';
import { formatDate } from '@angular/common';

import { Subject } from 'src/app/model/subject';
import { Teacher } from 'src/app/model/teacher';
import { ErrorService } from 'src/app/error.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

export interface SubmitData{
  request: any,
  error: boolean
}

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  get dateSys() {
    var date: Date = this.lessonFormGroup.get("dateCtrl").value
    return formatDate(date, "yyyy-MM-dd", 'en-US')
  }

  get date() {
    var date: Date = this.lessonFormGroup.get("dateCtrl").value
    if (!date) return ''
    return formatDate(date, "dd/MM/yyyy", 'en-US')
  }

  get slot(): string {
    return this.lessonFormGroup.controls['slotCtrl'].value
  }

  get subject(): Subject {
    let name: string = this.subjectFormGroup.controls['subjectCtrl'].value
    return this.subjects.find(x => x.name == name)
  }

  get teacher(): Teacher {
    let surname: string = this.teacherFormGroup.controls['teacherCtrl'].value
    return this.teachers.find(x => x.surname == surname)
  }

  subjectFormGroup: FormGroup
  teacherFormGroup: FormGroup
  lessonFormGroup: FormGroup
  slotFormGroup: FormGroup

  todayDate: Date = new Date()
  slotOption: boolean[] = [true, true, true]

  subjects: Subject[] = []
  subjectOption: string[] = []
  subjectFilteredOptions: Observable<string[]>

  teachers: Teacher[] = []
  teacherOption: string[] = []
  teacherFilteredOptions: Observable<string[]>

  constructor(private _formBuilder: FormBuilder, public dialog: MatDialog, private bookingService: BookingService, private errorService: ErrorService, private router: Router) { }

  dateFilter = (date: Date): boolean => {
    const day = date.getDay()
    return day !== 0 && day !== 6
  }

  ngOnInit() {
    this._initSubjects()
    this._initTeachers()
    this._initLesson()

    this.bookingService.getSubjects().subscribe(
      (res: Subject[]) => {
        this.subjects = res
        this.subjectOption.splice(0, this.subjectOption.length)
        res.forEach( x => this.subjectOption.push(x.name) )
        this._initSubjects()
      }
    )

    this.bookingService.getTeachers().subscribe(
      (res: Teacher[]) => {
        this.teachers = res
        this.teacherOption.splice(0, this.teacherOption.length)
        res.forEach( x => this.teacherOption.push(x.surname) )
        this._initTeachers()
      }
    )
    
    this.bookingService.getAviableSlots().subscribe(
      (res: boolean[]) => {
        for (let i in [1,2,3]) this.slotOption[i] = res[i]
      }
    )
  }

  private _initSubjects() {
    this.subjectFormGroup = this._formBuilder.group({
      subjectCtrl: ['', [Validators.required, this._forbiddenNameValidator(this.subjectOption)]]
    })

    this.subjectFilteredOptions = this.subjectFormGroup.controls['subjectCtrl'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value, this.subjectOption))
      )
  }

  private _initTeachers() {
    this.teacherFormGroup = this._formBuilder.group({
      teacherCtrl: ['', [Validators.required, this._forbiddenNameValidator(this.teacherOption)]]
    })

    this.teacherFilteredOptions = this.teacherFormGroup.controls['teacherCtrl'].valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value, this.teacherOption))
    )
  }

  private _initLesson() {
    this.lessonFormGroup = this._formBuilder.group({
      dateCtrl: ['', Validators.required],
      slotCtrl: ['', Validators.required]
    })
  }

  private _filter(value: string, options: string[]): string[] {
    if (!value) return options
     var filterValue = value.toLowerCase()
     return options.filter(option => option.toLowerCase().includes(filterValue))
  }

  private _forbiddenNameValidator(whitelist: string[]): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const forbidden = !(whitelist.includes(control.value))
      return forbidden ? {'forbiddenName': {value: control.value}} : null
    }
  }

  private selectionChange(event) {
    let selectedIndex: number = (event.selectedIndex)
    //TODO
    // let selectedSubject: string = this.subjectFormGroup.controls['subjectCtrl'].value
    // let selectedSubjectIndex: number = this.subjects.map(s => s.name).indexOf(selectedSubject)
    let selectedSubject: Subject = this.subject
    let selectedDate: string = this.lessonFormGroup.controls['dateCtrl'].value
    let selectedSlot: string = this.lessonFormGroup.controls['slotCtrl'].value
    switch(selectedIndex) {
      case 1: 
        this.bookingService.getTeachers(selectedSubject.id)
        this._initTeachers()
        break
    }
  }

  reset() {
    this._initSubjects()
    this._initTeachers()
    this._initLesson()
  }
  
  submit(){
    let message: string = "Sucessfully booked! Check your prenotations in history"
    this.bookingService.getBookRequest(this.teacher.id, this.subject.id, this.dateSys, + this.slot).subscribe(
      res => {
        console.log("dialog", res)
        // this.errorService.showErrorMessage("Booked")
        this.dialog.open(SubmitDialogComponent, {
          width: '250px',
          data: {
            request: { request: message, error: false }
          }
        })
      },
      (err: HttpErrorResponse) => {
        console.log("dialog", err)
        switch (err.status) {
          case 401:
            this.errorService.showErrorMessage("autentication failed")
            this.router.navigateByUrl('/login')
            break;
          default:
          this.dialog.open(SubmitDialogComponent, {
            width: '250px',
            data: {
              request: { request: err.error, error: true }
            }
          })
         }
      }
    )



    //OLD
    // const dialogRef = this.dialog.open(SubmitDialogComponent, {
    //   width: '250px',
    //   data: {request: this.bookingService.getBookRequest(this.teacher.id, this.subject.id, this.dateSys, + this.slot)}
    // })
  }
  
  updateDate(event) {
    this.bookingService.getAviableSlots(this.teacher.id, this.dateSys)
  }

  checkLessons(){
    if (this.date != "" && !this.slot){
      this.errorService.showErrorMessage("Select a valid Slot")
    }
  }
}

@Component({
  selector: 'submit-dialog',
  template: `
  <h1 mat-dialog-title>Booking</h1>
  <div mat-dialog-content>
    <p style="color:Tomato;" *ngIf=error>{{errorMessage}}</p>
    <p *ngIf=!error>{{message}}</p>
  </div>
  <div mat-dialog-actions>
    <button mat-button (click)="onNoClick()">No Thanks</button>
    <button mat-button [mat-dialog-close]="data.animal" cdkFocusInitial>Ok</button>
  </div>
  `,
})
export class SubmitDialogComponent implements OnInit {

  error: boolean = false;
  errorMessage:string = ""
  message: string = "Sucessfully booked!\n Check your prenotations in history"
 
  constructor(
    public dialogRef: MatDialogRef<SubmitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SubmitData,
    private errorService: ErrorService,
    private router: Router) {}
  
  ngOnInit() {
    console.log("data: ", this.data )
    if (this.data.request.error) {
      this.error = true
      this.errorMessage = this.data.request.request
    } else {
      this.error = false
      this.message = this.data.request.request
    }

    // OLD
    // this.data.request.subscribe(
    //   (res: Observable<any>) => {
    //     console.log("dialog", res)
    //     this.error = false
    //   },
    //   (err: HttpErrorResponse) => {
    //     console.log("dialog", err)
    //     // this.errorService.showErrorMessage(err.error)
    //     switch (err.status) {
    //       case 401:
    //         this.router.navigateByUrl('/login')
    //     }
    //     this.error = true
    //     this.errorMessage = err.error
    //   }
    // )
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}