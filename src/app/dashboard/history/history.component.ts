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
}
