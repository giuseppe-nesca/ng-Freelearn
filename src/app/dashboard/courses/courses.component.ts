import { Component, OnInit } from '@angular/core';
import { CoursesService } from './courses.service';
import { Observable } from 'rxjs';
import { Course } from 'src/app/model/course';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  courses$: Observable<Course[]>

  courses: Course[] = []
  courseOption: string[] = []

  constructor(private coursesService: CoursesService) { }

  ngOnInit() {
    this.courses$ = this.coursesService.getCourses()

    this.coursesService.getCourses().subscribe(
      (res: Course[]) => {
        this.courses = res
        this.courseOption.splice(0, this.courseOption.length)
        res.forEach( x => this.courseOption.push(x.subjectName, x.teacherName, x.teacherSurname))
      }
    )
  }

}
