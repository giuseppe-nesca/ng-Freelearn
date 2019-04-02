import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Lesson } from 'src/app/model/lesson';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from 'src/app/model/user';

@Injectable({
  providedIn: 'root'
})
export class PrenotationService {

  readonly _getLessonsUrl = "http://localhost:8080/admin/lessons"
  readonly _getUsersUrl = "http://localhost:8080/admin/users"

  private lessons$: BehaviorSubject<Lesson[]> = new BehaviorSubject(Array())
  private users$: BehaviorSubject<User[]> = new BehaviorSubject(Array())

  constructor(private httpClient: HttpClient) { }

  getLessonsAdmin(){
    this.httpClient.get(
      this._getLessonsUrl,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded'}),
        withCredentials: true
      }
    ).subscribe(
      res => {
        let obj: Lesson[] = JSON.parse(JSON.stringify(res))
        let lessons: Lesson[] = new Array<Lesson>()
        obj.forEach(x =>{
          lessons.push(new Lesson(
            // @ts-ignore
            x.id, x.userID, x.courseID, x.date, x.slot, x.status, x.done, x.subjectID, x.teacherID, x.subjectString, x.teacherString
          ))
        })
        this.lessons$.next(lessons)
      },
      err => console.log(err)
    )
    return this.lessons$.asObservable()
  }

  getUsersAdmin(){
    this.httpClient.get(
      this._getUsersUrl,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded'}),
        withCredentials: true
      }
     ).subscribe(
       res => {
         let obj: User[] = JSON.parse(JSON.stringify(res))
         let users: User[] = new Array<User>()
         obj.forEach(x =>{
           users.push(new User(
             // @ts-ignore
             x.id, x.name, x.surname
           ))
         })
         this.users$.next(users)
       },
       err => console.log(err)
     )
     return this.users$.asObservable()
  }
}
