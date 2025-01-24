import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Course } from 'src/app/core/models/course';
import { CourseService } from 'src/app/core/services/course.service';
import {
    GlobalTableComponent,
    TableColumn,
} from 'src/app/shared/components/global-table/global-table.component';
import { STATUS_CLASSES } from 'src/app/shared/constants/status-class';
import { Utils } from 'src/app/shared/utils/status.service';

@Component({
    selector: 'app-courses',
    standalone: true,
    imports: [GlobalTableComponent, CommonModule, ButtonModule, TooltipModule],
    templateUrl: './courses.component.html',
})
export class CoursesComponent implements OnInit {
    @ViewChild('actionsTemplate', { static: true })
    actionsTemplate?: TemplateRef<any>;

    @ViewChild('statusTemplate', { static: true })
    statusTemplate?: TemplateRef<any>;

    statusColor: Map<string, string> = STATUS_CLASSES;

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

    viewCourse(course: Course) {}

    editCourse(course: Course) {}

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
                customTemplate: this.statusTemplate,
            },
            {
                field: '#',
                header: 'Acções',
                customTemplate: this.actionsTemplate,
            },
        ];
    }

    get statusClass() {
        return (status: string): { [key: string]: boolean } => {
            return Utils.StatusService.getStatusClass(this.statusColor, status);
        };
    }
}
