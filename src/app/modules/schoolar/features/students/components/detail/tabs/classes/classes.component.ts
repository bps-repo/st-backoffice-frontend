import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Class } from 'src/app/core/models/class';
import { Lesson } from 'src/app/core/models/lesson';
import {
    GlobalTableComponent,
    TableColumn,
} from 'src/app/shared/components/global-table/global-table.component';
import { CLASSES_BY_STUDENT } from 'src/app/shared/constants/classes';

import { LESSONS, LESSONS_BY_STUDENT } from 'src/app/shared/constants/lessons';
@Component({
    selector: 'app-classes',
    standalone: true,
    imports: [GlobalTableComponent, CommonModule],
    templateUrl: './classes.component.html',
    styleUrl: './classes.component.scss',
})
export class ClassesComponent implements OnInit {
    lessons: Class[] = CLASSES_BY_STUDENT;

    columns: TableColumn[] = [];

    globalFilterFields: string[] = [];
    constructor() {}

    ngOnInit(): void {
        this.columns = [
            { field: 'name', filterType: 'text', header: 'Nome' },
            { field: 'teacher', header: 'Professor', filterType: 'text' },
            { field: 'timetable', header: 'Horário', filterType: 'date' },
            { field: 'start_at', header: 'Início', filterType: 'date' },
            { field: 'end_at', header: 'Término', filterType: 'text' },
            { field: 'description', header: 'Descrição' },
            { field: 'status', header: 'Estado' },
        ];
    }
}
