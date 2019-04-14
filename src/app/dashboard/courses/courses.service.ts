import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Course } from 'src/app/model/course';
import { Global } from 'src/app/model/global';
import { Subject } from 'src/app/model/subject';
import { Teacher } from 'src/app/model/teacher';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  readonly _getCoursesUrl = this.global._baseUrl + "/courses/getCourses"
  readonly _getSubjectsUrl = this.global._baseUrl + "/subjects/getSubjects"
  readonly _getTeachersUrl = this.global._baseUrl + "/teachers/getTeacher"
  readonly _submitCourseUrl = this.global._baseUrl + "/admin/course/insert"
  readonly _deleteCourseUrl = this.global._baseUrl + "/admin/course/delete"
  
  private courses$: BehaviorSubject<Course[]> = new BehaviorSubject(new Array(new Course(-1, -1, "", "", -1, "")))
  private subjects$: BehaviorSubject<Subject[]> = new BehaviorSubject(new Array(new Subject(-1, "")))
  private teachers$: BehaviorSubject<Teacher[]> = new BehaviorSubject(new Array(new Teacher(-1, "", "")))
  
  constructor(private global: Global, private httpClient: HttpClient) { }

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

  getSubjects() {
    this.httpClient.get(this._getSubjectsUrl).subscribe(
      res => {
        let obj: Subject[] = JSON.parse(JSON.stringify(res))
        let subjects: Subject[] = new Array()
        obj.forEach(x => { subjects.push(new Subject(x.id, x.name)) })
        this.subjects$.next(subjects)
      },
      err => { console.log(err) /*TODO*/ }
    )
    return this.subjects$.asObservable()
  }

  getTeachers(){
    this.httpClient.get(this._getTeachersUrl).subscribe(
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

  insertCourseRequest(subjectID: number, teacherID: number){
    let urlEncodedRequest: string = `subjectID=${subjectID}&teacherID=${teacherID}`
    return this.httpClient.post(this._submitCourseUrl,
      urlEncodedRequest,
      {
        headers: new HttpHeaders({ 'Content-Type':  'application/x-www-form-urlencoded' }),
        withCredentials: true,
        responseType: 'text'
      }
    )
  }

  deleteCourse(courseID: number){
    let urlEncodedRequest: string = `courseID=${courseID}`
    return this.httpClient.post(this._deleteCourseUrl,
      urlEncodedRequest,
      {
      headers: new HttpHeaders({ 'Content-Type':  'application/x-www-form-urlencoded' }),
      withCredentials: true,
      responseType: "text"
      }
    )
  }

}
