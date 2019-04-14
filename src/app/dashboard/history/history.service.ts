import { Injectable } from '@angular/core';
import { Lesson } from 'src/app/model/lesson';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Global } from 'src/app/model/global';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  readonly _getLessonsURL = this.global._baseUrl + "/lessons/user"
  readonly _submitLessonURL = this.global._baseUrl + "/lessons/delete"

  private lessons$: BehaviorSubject<Lesson[]> = new BehaviorSubject(new Array())

  constructor(private global: Global, private httpClient: HttpClient) { }

  getLessons(){
    this.httpClient.get(
      this._getLessonsURL,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded'}),
        withCredentials: true,
      }
    ).subscribe(
      res => {
        let obj: Lesson[] = JSON.parse(JSON.stringify(res))
        let lessons: Lesson[] = new Array<Lesson>()
        obj.forEach(x => {
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
