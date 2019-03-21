import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { BookingService } from './booking.service';

import { Subject } from 'src/app/model/Subject';


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
  subjectOption: string[] = ['One', 'Two', 'Three'];
  teacherOption: string[] = ['Four', 'Five', 'Six'];
  subjectFilteredOptions: Observable<string[]>;
  teacherFilteredOptions: Observable<string[]>;
  
  constructor(private _formBuilder: FormBuilder, private bookingService: BookingService) { }

  ngOnInit() {
    this._initSubject()
    this._initTeacher()
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
        this._initSubject()
      }
    )
  }
  private _initSubject() {
    this.subjectFormGroup = this._formBuilder.group({
      subjectCtrl: ['', [Validators.required, this._forbiddenNameValidator(this.subjectOption)]]
    });
    this.subjectFilteredOptions = this.subjectFormGroup.controls['subjectCtrl'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value, this.subjectOption))
      );
  }
  private _initTeacher() {
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
      console.log(`control.value = ${control.value}`)
      const forbidden = !(whitelist.includes(control.value))
      console.log(`forbidden = ${forbidden}`)
      return forbidden ? {'forbiddenName': {value: control.value}} : null;
    };
  }
  private _refreshSubject() {
    this.bookingService.getSubjects()
  }
}
