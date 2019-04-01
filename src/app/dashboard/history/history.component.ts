import { Component, OnInit } from '@angular/core';
import { Lesson } from 'src/app/model/lesson';
import { HistoryService } from './history.service';
import { ErrorService } from 'src/app/error.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  today: Date = new Date
  lessons: Lesson[] = []

  constructor(private historyService: HistoryService, private errorService: ErrorService) { }

  ngOnInit() {
    this.historyService.getLessons().subscribe(
      (res: Lesson[]) => {
        this.lessons = res
      }
    )
  }

  delete(lessonID: number){
    this.historyService.deleteLesson(lessonID).subscribe(
      res => console.log("cancellata"),
      err => {
        switch (err.status){
          case 400:
            this.errorService.showErrorMessage(err.body, "ok")
            break
          case 401:
            this.errorService.authErrorMessage()

        }
      }
    )
  }
}
