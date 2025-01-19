import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Lesson } from 'src/app/core/models/lesson';
import {
    GlobalTableComponent,
    TableColumn,
} from 'src/app/shared/components/global-table/global-table.component';

import { LESSONS, LESSONS_BY_STUDENT } from 'src/app/shared/constants/lessons';
@Component({
    selector: 'app-classes',
    standalone: true,
    imports: [GlobalTableComponent, CommonModule],
    templateUrl: './classes.component.html',
    styleUrl: './classes.component.scss',
})
export class ClassesComponent implements OnInit {
    @ViewChild('statusTemplate', { static: true })
    statusTemplate?: TemplateRef<any>;

    statusColor: Map<string, string> = new Map([
        ['presente', 'bg-green-500'],
        ['ausente', 'bg-red-500'],
        ['warning', 'bg-yellow-400'],
    ]);

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
            {
                field: 'status',
                header: 'Estado',
                customTemplate: this.statusTemplate,
            },
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

    getStatusClass(status: string): string {
        return this.statusColor.get(status) || '';
    }
}
