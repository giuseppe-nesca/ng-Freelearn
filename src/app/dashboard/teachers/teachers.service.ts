import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Teacher } from 'src/app/model/teacher';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TeachersService {

  readonly _getTeacherUrl = "http://localhost:8080/teachers/getTeacher"
  readonly _submitTeacherURL = "http://localhost:8080/admin/teacher/insert"

  private teachers$: BehaviorSubject<Teacher[]> = new BehaviorSubject(new Array(new Teacher(-1, "", "")))

  constructor(private httpClient: HttpClient) { }

  getTeachers(){
    this.httpClient.get(this._getTeacherUrl).subscribe(
      res => {
        let obj: Teacher[] = JSON.parse(JSON.stringify(res))
        let teachers: Teacher[] = new Array()
        obj.forEach(x => { teachers.push(new Teacher(x.id, x.name, x.surname))})
        this.teachers$.next(teachers)
      },
      err => { console.log(err) /*TODO*/}
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
  
}
