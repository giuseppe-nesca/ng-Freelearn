import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { BookingService } from './booking.service';

import { Subject } from 'src/app/model/subject';
import { Teacher } from 'src/app/model/teacher';


@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  subjectFormGroup: FormGroup;
  teacherFormGroup: FormGroup;
  lessonFormGroup: FormGroup;

  subjects: Subject[]
  subjectOption: string[] = [];
  teachers: Teacher[]
  teacherOption: string[] = [];
  subjectFilteredOptions: Observable<string[]>;
  teacherFilteredOptions: Observable<string[]>;
  
  constructor(private _formBuilder: FormBuilder, private bookingService: BookingService) { }

  ngOnInit() {
    this._initSubjects()
    this._initTeachers()
    this.lessonFormGroup = this._formBuilder.group({
      lessonCtrl: ['', Validators.required]
    })
    this.bookingService.getSubjects().subscribe(
      (res: Subject[]) => {
        this.subjects = res
        this.subjectOption.splice(0, this.subjectOption.length)
        res.forEach(x => {
          this.subjectOption.push(x.name)
        })
        this._initSubjects()
      }
    )
    this.bookingService.getTeachers().subscribe(
      (res: Teacher[]) => {
        this.teachers = res
        this.teacherOption.splice(0, this.teacherOption.length)
        res.forEach(x => {
          this.teacherOption.push(x.surname)
        })
        this._initTeachers()
      }
    )
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
    switch(selectedIndex) {
      case 1: 
        this.bookingService.getTeachers(selectedSubjectIndex + 1)
        this._initTeachers()
        break;
    }
  }
}
