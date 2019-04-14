import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Lesson } from 'src/app/model/lesson';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from 'src/app/model/user';
import { Global } from 'src/app/model/global';

@Injectable({
  providedIn: 'root'
})
export class PrenotationService {

  readonly _getLessonsUrl = this.global._baseUrl + "/admin/lessons"
  readonly _getUsersUrl = this.global._baseUrl + "/admin/users"
  readonly _submitLessonURL = this.global._baseUrl + "/lessons/delete"

  private lessons$: BehaviorSubject<Lesson[]> = new BehaviorSubject(Array())
  private users$: BehaviorSubject<User[]> = new BehaviorSubject(Array())

  constructor(private global: Global, private httpClient: HttpClient) { }

  getLessonsAdmin(){
    this.httpClient.get(
      this._getLessonsUrl,
      {
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

  deleteLesson(lessonID: number){
    let urlEncodedRequest: string = `lessonID=${lessonID}`
    return this.httpClient.post(this._submitLessonURL,
      urlEncodedRequest,
      {
      headers: new HttpHeaders({ 'Content-Type':  'application/x-www-form-urlencoded' }),
      withCredentials: true
      }
    )
  }
}
