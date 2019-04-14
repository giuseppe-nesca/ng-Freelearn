import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'src/app/model/subject';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {

  readonly _baseUrl: string = "http://localhost:8080"

  readonly _getSubjectsUrl = this._baseUrl + "/subjects/getSubjects"
  readonly _submitSubjectURL = this._baseUrl + "/admin/subject/insert"

  private subjects$: BehaviorSubject<Subject[]> = new BehaviorSubject(new Array(new Subject(-1, "")))

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

  insertSubjectRequest(subjectName: string){
    let urlEncodedRequest: string = `subjectName=${subjectName}`
    return this.httpClient.post(this._submitSubjectURL,
      urlEncodedRequest,
      {
        headers: new HttpHeaders({ 'Content-Type':  'application/x-www-form-urlencoded' }),
        withCredentials: true,
        responseType: 'text'
      }
    )
  }
  
}
