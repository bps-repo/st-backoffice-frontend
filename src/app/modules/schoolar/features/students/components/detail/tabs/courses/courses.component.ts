import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/core/models/course';
import { CourseService } from 'src/app/core/services/course.service';
import {
    GlobalTableComponent,
    TableColumn,
} from 'src/app/shared/components/global-table/global-table.component';

@Component({
    selector: 'app-courses',
    standalone: true,
    imports: [GlobalTableComponent, CommonModule],
    templateUrl: './courses.component.html',
    styleUrl: './courses.component.scss',
})
export class CoursesComponent implements OnInit {
    columns: TableColumn[] = [];

    courses: Course[] = [];

    constructor(private courseService: CourseService) {}
    ngOnInit() {
        this.loadCourses();
        this.loadColumns();
    }

    private loadCourses() {
        this.courseService.getCourses().subscribe((courses) => {
            this.courses = courses;
        });
    }

    private loadColumns() {
        this.columns = [
            {
                field: 'name',
                header: 'Nome',
            },
            {
                field: 'level',
                header: 'Nível',
            },
            {
                field: 'start',
                header: 'Data de Início',
            },
            {
                field: 'end',
                header: 'Data de Fim',
            },
            {
                field: 'status',
                header: 'Estado',
            },
            {
                field: 'actions',
                header: 'Acções',
            },
        ];
    }
}
