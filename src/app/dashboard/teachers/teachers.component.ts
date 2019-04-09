import { Component, OnInit } from '@angular/core';
import { TeachersService } from './teachers.service';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss']
})
export class TeachersComponent implements OnInit {

  constructor(private teachersService: TeachersService) { }

  ngOnInit() {
  }

}
