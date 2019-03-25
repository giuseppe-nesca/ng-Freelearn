import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'src/app/model/subject';
import { Teacher } from 'src/app/model/teacher';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  readonly _getSubjectsUrl = "http://localhost:8080/subjects/getSubjects"
  readonly _getTeachersUrl = "http://localhost:8080/teachers/getTeacher"

  private subjects$: BehaviorSubject<Subject[]> = new BehaviorSubject(new Array(new Subject(-1, "")))
  private teachers$: BehaviorSubject<Teacher[]> = new BehaviorSubject(new Array(new Teacher(-1, "", "")))
  
  constructor(private httpClient: HttpClient) { }

  getSubjects() {
    this.httpClient.get(this._getSubjectsUrl).subscribe(
      res => {
        let obj: Subject[] = JSON.parse(JSON.stringify(res))
        let subjects: Subject[] = new Array()
        obj.forEach(x => {
          subjects.push(new Subject(x.id, x.name))
        })
        this.subjects$.next(subjects)
      },
      err => {
        //TODO
        console.log(err)
      }
    )
    return this.subjects$.asObservable()
  }

  getTeachers(id?: number) {
    if (!id) {
      return this.teachers$.asObservable()
    }
    const urlEncodedRequest: string = `subjectID=${id}`
    this.httpClient.post(
      this._getTeachersUrl, 
      urlEncodedRequest,
      {
        headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
        }),
        withCredentials: true,
      }
      ).subscribe(
      res => {
        let obj: Teacher[] = JSON.parse(JSON.stringify(res))
        let teachers: Teacher[] = new Array()
        obj.forEach(x => {
          teachers.push(new Teacher(x.id, x.name, x.surname))
        })
        this.teachers$.next(teachers)
      },
      err => {
        //TODO
        console.log(err)
      }
    )
    return this.teachers$.asObservable()
  }
}
