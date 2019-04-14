import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Subject } from 'src/app/model/subject';
import { Observable } from 'rxjs';
import { SubjectsService } from './subjects.service';
import { ErrorService } from 'src/app/error.service';
import { startWith, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss']
})
export class SubjectsComponent implements OnInit {

  get subject(): Subject {
    let name: string = this.subjectFormGroup.controls['subjectCtrl'].value
    return this.subjects.find(x => x.name == name)
  }

  subjectInsertName: string = "";

  subjectFormGroup: FormGroup
  subjects$: Observable<Subject[]>

  subjects: Subject[] = []
  subjectOption: string[] = []
  subjectFilteredOptions: Observable<string[]>

  constructor(private _formBuilder: FormBuilder, public dialog: MatDialog, private subjectsService: SubjectsService, private errorService: ErrorService, private router: Router) { }

  ngOnInit() {
    this.subjects$ = this.subjectsService.getSubjects()

    this._initSubjects()

    this.subjectsService.getSubjects().subscribe(
      (res: Subject[]) => {
        this.subjects = res
        this.subjectOption.splice(0, this.subjectOption.length)
        res.forEach( x => this.subjectOption.push(x.name) )
        this._initSubjects()
      },
      (err: HttpErrorResponse) => {
        this.errorService.showErrorMessage(err.error, "error")
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
    if (this.subjectInsertName){
      this.subjectsService.insertSubjectRequest(this.subjectInsertName).subscribe(
        (res) => {
          this.errorService.showErrorMessage("Subject inserted correctly")
          this.subjectsService.getSubjects()
          this.subjectInsertName = ""
        },
        (err: HttpErrorResponse) => {
          this.errorService.showErrorMessage(err.error, "error")
        }
      )
    } else {
      this.errorService.showErrorMessage("Please insert a valid subject", "ok")
    }
  }

  delete(subjectID: number){
    this.subjectsService.deleteSubject(subjectID).subscribe(
      res => {
        this.subjectsService.getSubjects()
        this.errorService.openSnackBar("Subject deleted correctly", "ok")
      },
      (err: HttpErrorResponse) => {
        this.errorService.showErrorMessage(err.error, "error")
      }
    )
  }

}
