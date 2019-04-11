import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/auth/user.service';
import { Lesson } from 'src/app/model/lesson';
import { HistoryService } from '../history/history.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user$: Observable<User>
  lessons$: Observable<Lesson[]>

  constructor(private userService: UserService, private historyService: HistoryService) { }

  ngOnInit() {
    this.user$ = this.userService.getUser()
    this.lessons$ = this.historyService.getLessons()
  }

}
