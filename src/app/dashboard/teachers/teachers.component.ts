import { Component, OnInit } from '@angular/core';
import { TeachersService } from './teachers.service';
import { FormBuilder, FormGroup, AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ErrorService } from 'src/app/error.service';
import { Router } from '@angular/router';
import { Teacher } from 'src/app/model/teacher';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss']
})
export class TeachersComponent implements OnInit {

  teacherInsertSurname: string = "";
  teacherDeleteSurname: string = "";
  teacherInsertName: string = "";
  teacherDeleteName: string = "";

  teacherFormGroup: FormGroup
  teachers$: Observable<Teacher[]>

  teachers: Teacher[] = []
  teacherOption: string[] = []
  teacherFilteredOptions: Observable<string[]>

  constructor(private teachersService: TeachersService, private _formBuilder: FormBuilder, public dialog: MatDialog, private errorService: ErrorService, private router: Router) { }

  ngOnInit() {
    this.teachers$ = this.teachersService.getTeachers()

    this._initTeachers()

    this.teachersService.getTeachers().subscribe(
      (res: Teacher[]) => {
        this.teachers = res
        this.teacherOption.splice(0, this.teacherOption.length)
        res.forEach( x => this.teacherOption.push(x.name, x.surname))
        this._initTeachers()
      },
      (err: HttpErrorResponse) => {
        this.errorService.showErrorMessage(err.error, "error")
      }
    )
  }

  private _initTeachers(){
    this.teacherFormGroup = this._formBuilder.group({
      teacherCtrl: ['', [Validators.required, this._forbiddenNameValidator(this.teacherOption)]]
    })

    this.teacherFilteredOptions = this.teacherFormGroup.controls['teacherCtrl'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value, this.teacherOption))
      )
  }

  private _forbiddenNameValidator(whitelist: string[]): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const forbidden = !(whitelist.includes(control.value))
      return forbidden ? {'forbiddenName': {value: control.value}} : null
    }
  }

  private _filter(value: string, options: string[]): string[] {
    if (!value) return options
     var filterValue = value.toLowerCase()
     return options.filter(option => option.toLowerCase().includes(filterValue))
  }

  insert(){
    if (this.teacherInsertName && this.teacherInsertSurname){
      this.teachersService.insertTeacherRequest(this.teacherInsertName, this.teacherInsertSurname).subscribe(
        res => {
          this.errorService.openSnackBar("Teacher correctly added!", "ok")
          this.teachersService.getTeachers()
          this.teacherInsertName = ""
          this.teacherInsertSurname = ""
        },
        (err: HttpErrorResponse) => {
          this.errorService.showErrorMessage(err.error, "error")
        }
      )
    } else {
      this.errorService.showErrorMessage("Please insert a valid teacher", "retry")
    }
  }

  delete(teacherID: number){
    this.teachersService.deleteTeacher(teacherID).subscribe(
      res => {
        this.teachersService.getTeachers()
        this.errorService.openSnackBar("Teacher correctly deleted!", "ok")
      },
      (err: HttpErrorResponse) => {
        this.errorService.showErrorMessage(err.error, "error")
      }
    )
  }

}
