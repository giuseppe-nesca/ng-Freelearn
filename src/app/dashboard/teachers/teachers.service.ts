import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Teacher } from 'src/app/model/teacher';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Global } from 'src/app/model/global';
import { ErrorService } from 'src/app/error.service';

@Injectable({
  providedIn: 'root'
})
export class TeachersService {

  readonly _getTeacherUrl = this.global._baseUrl + "/teachers/getTeacher"
  readonly _submitTeacherURL = this.global._baseUrl + "/admin/teacher/insert"
  readonly _deleteTeachertUrl = this.global._baseUrl + "/admin/teacher/delete"

  private teachers$: BehaviorSubject<Teacher[]> = new BehaviorSubject(new Array(new Teacher(-1, "", "")))

  constructor(private errorService: ErrorService, private global:Global, private httpClient: HttpClient) { }

  getTeachers(){
    this.httpClient.get(this._getTeacherUrl).subscribe(
      res => {
        let obj: Teacher[] = JSON.parse(JSON.stringify(res))
        let teachers: Teacher[] = new Array()
        obj.forEach(x => { teachers.push(new Teacher(x.id, x.name, x.surname))})
        this.teachers$.next(teachers)
      },
      (err: HttpErrorResponse) => {
        this.errorService.showErrorMessage(err.error, "error")
      }
    )
    return this.teachers$.asObservable()
  }

  insertTeacherRequest(teacherName: string, teacherSurname: string){
    let urlEncodedRequest: string = `teacherSurname=${teacherSurname}&teacherName=${teacherName}`
    return this.httpClient.post(this._submitTeacherURL,
        urlEncodedRequest,
        {
          headers: new HttpHeaders({ 'Content-Type':  'application/x-www-form-urlencoded' }),
          withCredentials: true,
          responseType: 'text'
        }
    )
  }

  deleteTeacher(teacherID: number){
    let urlEncodedRequest: string = `teacherID=${teacherID}`
    return this.httpClient.post(this._deleteTeachertUrl,
      urlEncodedRequest,
      {
      headers: new HttpHeaders({ 'Content-Type':  'application/x-www-form-urlencoded' }),
      withCredentials: true,
      responseType: "text"
      }
    )
  }
  
}
