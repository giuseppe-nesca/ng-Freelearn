import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { BookingService } from './booking.service';
import { DatePipe, formatDate } from '@angular/common';

import { Subject } from 'src/app/model/subject';
import { Teacher } from 'src/app/model/teacher';


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

  subjectFormGroup: FormGroup;
  teacherFormGroup: FormGroup;
  lessonFormGroup: FormGroup;
  slotFormGroup: FormGroup;

  todayDate: Date = new Date();
  slotOption: Boolean[] = [true, true, false]

  subjects: Subject[]
  subjectOption: string[] = [];
  teachers: Teacher[]
  teacherOption: string[] = [];
  subjectFilteredOptions: Observable<string[]>;
  teacherFilteredOptions: Observable<string[]>;

  constructor(private _formBuilder: FormBuilder, private bookingService: BookingService) { }

  dateFilter = (date: Date): boolean => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
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
  }

  private _initLesson() {
    this.lessonFormGroup = this._formBuilder.group({
      dateCtrl: ['', Validators.required],
      slotCtrl: ['', Validators.required]
    })
  }

  private _initSubjects() {
    this.subjectFormGroup = this._formBuilder.group({
      subjectCtrl: ['', [Validators.required, this._forbiddenNameValidator(this.subjectOption)]]
    });

    this.subjectFilteredOptions = this.subjectFormGroup.controls['subjectCtrl'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value, this.subjectOption))
      );
  }

  private _initTeachers() {
    this.teacherFormGroup = this._formBuilder.group({
      teacherCtrl: ['', [Validators.required, this._forbiddenNameValidator(this.teacherOption)]]
    });
    this.teacherFilteredOptions = this.teacherFormGroup.controls['teacherCtrl'].valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value, this.teacherOption))
    );
  }
  private _filter(value: string, options: string[]): string[] {
     var filterValue = value.toLowerCase();
     return options.filter(option => option.toLowerCase().includes(filterValue));
  }
  private _forbiddenNameValidator(whitelist: string[]): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const forbidden = !(whitelist.includes(control.value))
      return forbidden ? {'forbiddenName': {value: control.value}} : null;
    };
  }

  private selectionChange(event) {
    console.log("oooooooooooooooooooooooooo ")
    let selectedIndex: number = (event.selectedIndex)
    let selectedSubject: string = this.subjectFormGroup.controls['subjectCtrl'].value
    let selectedSubjectIndex: number = this.subjects.map(s => s.name).indexOf(selectedSubject)
    let selectedDate: string = this.lessonFormGroup.controls['dateCtrl'].value
    let selectedSlot: string = this.lessonFormGroup.controls['slotCtrl'].value
    switch(selectedIndex) {
      case 1: 
        this.bookingService.getTeachers(selectedSubjectIndex + 1)
        this._initTeachers()
        break;
      case 3:
        console.log(`selectedDate = ${this.date}`, `selectedSlot = ${selectedSlot}`)
    }
  }
}
