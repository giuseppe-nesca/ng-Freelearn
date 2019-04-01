import { Injectable } from '@angular/core';
import { Lesson } from 'src/app/model/lesson';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  readonly _getLessonsURL = "http://localhost:8080/lessons/user"
  readonly _submitLessonURL = "http://localhost:8080/lessons/delete"

  private lessons$: BehaviorSubject<Lesson[]> = new BehaviorSubject(new Array())

  constructor(private httpClient: HttpClient) { }

  getLessons(){
    this.httpClient.get(
      this._getLessonsURL,
      {
        withCredentials: true,
      }
    ).subscribe(
      res => {
        let obj: Lesson[] = JSON.parse(JSON.stringify(res))
        let lessons: Lesson[] = new Array<Lesson>()
        obj.forEach(x => {
          lessons.push(new Lesson(
            // @ts-ignore
            x.id, x.userID, x.courseID, x.date, x.slot, x.status, x.done, x.subjectID, x.teacherID, x.subjectString, x.teacherString //TODO
          ))
          console.log("lessons :", lessons)
        })
        this.lessons$.next(lessons)
      },
      err => console.log(err) //TODO
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
