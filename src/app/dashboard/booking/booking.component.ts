import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable, Subject, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  subjectFormGroup: FormGroup;
  teacherFormGroup: FormGroup;
  lessonFormGroup: FormGroup;

  subjectOption: string[] = ['One', 'Two', 'Three'];
  teacherOption: string[] = ['Four', 'Five', 'Six'];
  subjectFilteredOptions: Observable<string[]>;
  teacherFilteredOptions: Observable<string[]>;
  
  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit() {
    //Gestione form
    this.subjectFormGroup = this._formBuilder.group({
      subjectCtrl: ['', [Validators.required, this._forbiddenNameValidator(this.subjectOption)]]
    });
    this.teacherFormGroup = this._formBuilder.group({
      teacherCtrl: ['', [Validators.required, this._forbiddenNameValidator(this.teacherOption)]]
    });
    this.lessonFormGroup = this._formBuilder.group({
      lessonCtrl: ['', Validators.required]
    })
    //Gestione filtri
    this.subjectFilteredOptions = this.subjectFormGroup.controls['subjectCtrl'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value, this.subjectOption))
      );
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
}
