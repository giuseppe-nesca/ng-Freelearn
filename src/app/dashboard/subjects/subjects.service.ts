import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'src/app/model/subject';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Global } from 'src/app/model/global';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {

  readonly _getSubjectsUrl = this.global._baseUrl + "/subjects/getSubjects"
  readonly _submitSubjectURL = this.global._baseUrl + "/admin/subject/insert"
  readonly _deleteSubjectUrl = this.global._baseUrl + "/admin/subject/delete"

  private subjects$: BehaviorSubject<Subject[]> = new BehaviorSubject(new Array(new Subject(-1, "")))

  constructor(private global: Global, private httpClient: HttpClient) { }

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

  deleteSubject(subjectID: number){
    let urlEncodedRequest: string = `subjectID=${subjectID}`
    return this.httpClient.post(this._deleteSubjectUrl,
      urlEncodedRequest,
      {
      headers: new HttpHeaders({ 'Content-Type':  'application/x-www-form-urlencoded' }),
      withCredentials: true,
      responseType: "text"
      }
    )
  }
  
}
