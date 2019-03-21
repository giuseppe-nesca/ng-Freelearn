import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'src/app/model/Subject';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  readonly _getSubjectsUrl = "http://localhost:8080/subjects/getSubjects"

  private subjects$: BehaviorSubject<Subject[]> = new BehaviorSubject(new Array(new Subject(-1, "")))
  
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
        console.log(err)
      }
    )
    return this.subjects$.asObservable()
  }
}
