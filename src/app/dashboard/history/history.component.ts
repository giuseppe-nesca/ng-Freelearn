import { Component, OnInit } from '@angular/core';
import { Lesson } from 'src/app/model/lesson';
import { HistoryService } from './history.service';
import { ErrorService } from 'src/app/error.service';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  today: Date = new Date
  lessons$: Observable<Lesson[]>

  constructor(private historyService: HistoryService, private errorService: ErrorService) { }

  ngOnInit() {
    this.lessons$ = this.historyService.getLessons()
  }

  delete(lessonID: number){
    this.historyService.deleteLesson(lessonID).subscribe(
      res => {
        this.historyService.getLessons()
        this.errorService.openSnackBar("Booking deleted correctly", "ok")
      },
      (err: HttpErrorResponse) => {
        this.errorService.showErrorMessage(err.error, "error")
      }
    )
  }
}
