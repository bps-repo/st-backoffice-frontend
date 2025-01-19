import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Lesson } from 'src/app/core/models/lesson';
import {
    TableColumn,
    GlobalTableComponent,
} from 'src/app/shared/components/table-with-filters/table-with-filters.component';
import { LESSONS, LESSONS_BY_STUDENT } from 'src/app/shared/constants/lessons';
@Component({
    selector: 'app-classes',
    standalone: true,
    imports: [GlobalTableComponent, CommonModule],
    templateUrl: './classes.component.html',
    styleUrl: './classes.component.scss',
})
export class ClassesComponent implements OnInit {
    lessons: Lesson[] = LESSONS_BY_STUDENT;
    columns: TableColumn[] = [];
    globalFilterFields: string[] = [];
    constructor() {}

    ngOnInit(): void {
        this.columns = [
            { field: 'date', header: 'Data' },
            { field: 'class', header: 'Turma' },
            { field: 'time', header: 'Hora' },
            { field: 'teacher', header: 'Professor' },
            { field: 'level', header: 'Nível' },
            { field: 'description', header: 'Descrição' },
            { field: 'status', header: 'Estado' },
        ];
        this.globalFilterFields = [
            'date',
            'class',
            'time',
            'teacher',
            'level',
            'description',
        ];
    }
}
