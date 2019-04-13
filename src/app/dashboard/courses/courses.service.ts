import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Course } from 'src/app/model/course';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  readonly _getCoursesUrl = "http://localhost:8080/courses/getCourses"
  
  private courses$: BehaviorSubject<Course[]> = new BehaviorSubject(new Array(new Course(-1, -1, "", "", -1, "")))

  constructor(private httpClient: HttpClient) { }

  getCourses(){
    this.httpClient.get(this._getCoursesUrl).subscribe(
      res => {
        let obj: Course[] = JSON.parse(JSON.stringify(res))
        let courses: Course[] = new Array()
        obj.forEach(x => { courses.push(new Course(x.id, x.teacherID, x.teacherName, x.teacherSurname, x.subjectID, x.subjectName))})
        this.courses$.next(courses)
      },
      err => { console.log(err) /* TODO*/ }
    )
    return this.courses$.asObservable()
  }
}
