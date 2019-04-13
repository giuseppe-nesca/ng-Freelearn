import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, throwError } from 'rxjs';
import { Subject } from 'src/app/model/subject';
import { Teacher } from 'src/app/model/teacher';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  readonly _baseUrl: string = "http://localhost:8080/tweb"

  readonly _getSubjectsUrl = this._baseUrl + "/subjects/getSubjects"
  readonly _getTeachersUrl = this._baseUrl + "/teachers/getTeacher"
  readonly _getTeacherAviablilityUrl = this._baseUrl + "/teacher/isAviable"
  readonly _submitBookingUrl = this._baseUrl + "/booking"

  private subjects$: BehaviorSubject<Subject[]> = new BehaviorSubject(new Array(new Subject(-1, "")))
  private teachers$: BehaviorSubject<Teacher[]> = new BehaviorSubject(new Array(new Teacher(-1, "", "")))
  private aviableSlots$: BehaviorSubject<boolean[]> = new BehaviorSubject<boolean[]>(new Array(false, false, false))
  
  constructor(private httpClient: HttpClient) { }

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

  getTeachers(id?: number) {
    if (!id) return this.teachers$.asObservable()
    let urlEncodedRequest: string = `subjectID=${id}`
    this.httpClient.post(
      this._getTeachersUrl, 
      urlEncodedRequest,
      {
        headers: new HttpHeaders({ 'Content-Type':  'application/x-www-form-urlencoded' }),
        withCredentials: true,
      }
    ).subscribe(
      res => {
        let obj: Teacher[] = JSON.parse(JSON.stringify(res))
        let teachers: Teacher[] = new Array()
        obj.forEach(x => { teachers.push(new Teacher(x.id, x.name, x.surname)) })
        this.teachers$.next(teachers)
      },
      err => { console.log(err) /*TODO*/ } 
    )
    return this.teachers$.asObservable()
  }

  
  getAviableSlots(id?: number, date?: string) {
    if (!id && !date) {
      return this.aviableSlots$.asObservable()
    } else {
      if (!id || !date){
        throwError(new Error("bad parameters")) //TODO
        return
      }
    }
    
    let urlEncodedRequest: string = `teacherID=${id}&date=${date}`
    this.httpClient.post(
      this._getTeacherAviablilityUrl, 
      urlEncodedRequest,
      {
        headers: new HttpHeaders({ 'Content-Type':  'application/x-www-form-urlencoded' }),
        withCredentials: true,
      }
    ).subscribe(
      (res: boolean[]) => this.aviableSlots$.next(res)
    ) //TODO handle errors
    return this.aviableSlots$.asObservable()
  }

  getBookRequest(teacherID: number, subjectID: number, date: string, slot: number){
    let urlEncodedRequest: string = `teacherID=${teacherID}&subjectID=${subjectID}&date=${date}&slot=${slot}`
    return this.httpClient.post(this._submitBookingUrl,
      urlEncodedRequest,
      {
      headers: new HttpHeaders({ 'Content-Type':  'application/x-www-form-urlencoded' }),
      withCredentials: true,
      responseType: 'text'
      })
  }
}
