import { Component, OnInit } from '@angular/core';
import { CoursesService } from './courses.service';
import { Observable } from 'rxjs';
import { Course } from 'src/app/model/course';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Teacher } from 'src/app/model/teacher';
import { Subject } from 'src/app/model/subject';
import { MatDialog } from '@angular/material';
import { ErrorService } from 'src/app/error.service';
import { Router } from '@angular/router';
import { startWith, map } from 'rxjs/operators';
import { errorHandler } from '@angular/platform-browser/src/browser';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

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

  courses$: Observable<Course[]>

  subjects: Subject[] = []
  subjectOption: string[] = []
  subjectFilteredOptions: Observable<string[]>

  teachers: Teacher[] = []
  teacherOption: string[] = []
  teacherFilteredOptions: Observable<string[]>

  courses: Course[] = []
  courseOption: string[] = []

  constructor(private coursesService: CoursesService, private _formBuilder: FormBuilder, public dialog: MatDialog, private errorService: ErrorService, private router: Router) { }

  ngOnInit() {
    this._initSubjects()
    this._initTeachers()

    this.courses$ = this.coursesService.getCourses()

    this.coursesService.getSubjects().subscribe(
      (res: Subject[]) => {
        this.subjects = res
        this.subjectOption.splice(0, this.subjectOption.length)
        res.forEach( x => this.subjectOption.push(x.name) )
        this._initSubjects()
      }
    )

    this.coursesService.getTeachers().subscribe(
      (res: Teacher[]) => {
        this.teachers = res
        this.teacherOption.splice(0, this.teacherOption.length)
        res.forEach( x => this.teacherOption.push(x.surname) )
        this._initTeachers()
      }
    )

    this.coursesService.getCourses().subscribe(
      (res: Course[]) => {
        this.courses = res
        this.courseOption.splice(0, this.courseOption.length)
        res.forEach( x => this.courseOption.push(x.subjectName, x.teacherName, x.teacherSurname))
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

  insert(){
    if (this.subjectFormGroup.valid && this.teacherFormGroup.valid){
      this.coursesService.insertCourseRequest(this.subject.id, this.teacher.id).subscribe(
        res => {
          this.errorService.openSnackBar("Course sucesfully added", "ok")
          this.courses$ = this.coursesService.getCourses()
          this.subjectFormGroup.reset()
          this.teacherFormGroup.reset()
        },
        (err: HttpErrorResponse) => {
          switch (err.status) {
            case 401:
              this.errorService.showErrorMessage("autentication failed")
              this.router.navigateByUrl('/login')
              break;
            case 400:
              this.errorService.showErrorMessage("Course Already exist!")
              break;
           }
        }
      )
    } else {
      this.errorService.showErrorMessage("Please insert a valid subject and a valid teacher", "retry")
    }
  }

  delete(courseID: number){
    this.coursesService.deleteCourse(courseID).subscribe(
      res => {
        this.coursesService.getCourses()
        this.errorService.openSnackBar("Course correctly deleted!", "ok")
      },
      (err: HttpErrorResponse) => {
        this.coursesService.getCourses()
        switch (err.status){
          case 400:
            this.errorService.showErrorMessage(err.error, "retry")
            break;
          case 401:
            this.errorService.authErrorMessage()
            break;
        }
      }
    )
  }
}
