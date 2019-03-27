import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { BookingService } from './booking.service';
import { formatDate } from '@angular/common';

import { Subject } from 'src/app/model/subject';
import { Teacher } from 'src/app/model/teacher';
import { ErrorService } from 'src/app/error.service';


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

  get slot(): string{
    return this.lessonFormGroup.controls['slotCtrl'].value
  }

  subjectFormGroup: FormGroup
  teacherFormGroup: FormGroup
  lessonFormGroup: FormGroup
  slotFormGroup: FormGroup

  todayDate: Date = new Date()
  slotOption: boolean[] = [true, true, false]

  subjects: Subject[] = []
  subjectOption: string[] = []
  subjectFilteredOptions: Observable<string[]>

  teachers: Teacher[] = []
  teacherOption: string[] = []
  teacherFilteredOptions: Observable<string[]>

  constructor(private _formBuilder: FormBuilder, private bookingService: BookingService, private errorService: ErrorService) { }

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
    let selectedSubject: string = this.subjectFormGroup.controls['subjectCtrl'].value
    let selectedSubjectIndex: number = this.subjects.map(s => s.name).indexOf(selectedSubject)
    let selectedDate: string = this.lessonFormGroup.controls['dateCtrl'].value
    let selectedSlot: string = this.lessonFormGroup.controls['slotCtrl'].value
    switch(selectedIndex) {
      case 1: 
        this.bookingService.getTeachers(selectedSubjectIndex + 1)
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
    //TODO
  }
  
  updateDate(event) {
    let selectedTeacher: string = this.teacherFormGroup.controls['teacherCtrl'].value
    let selectedTeacherID: number = this.teachers.map(t => t.surname).indexOf(selectedTeacher)
    this.bookingService.getAviableSlots(selectedTeacherID + 1, this.dateSys)
  }

  checkLessons(){
    if (this.date != "" && !this.slot){
      this.errorService.showErrorMessage("Select a valid Slot")
    }
  }
}
