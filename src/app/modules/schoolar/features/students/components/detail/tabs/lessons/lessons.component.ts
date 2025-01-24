import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Lesson } from 'src/app/core/models/lesson';
import {
    GlobalTableComponent,
    TableColumn,
} from 'src/app/shared/components/global-table/global-table.component';

import { LESSONS_BY_STUDENT } from 'src/app/shared/constants/lessons';
import { STATUS_CLASSES } from 'src/app/shared/constants/status-class';
import { Utils } from 'src/app/shared/utils/status.service';
@Component({
    selector: 'app-lessons',
    standalone: true,
    imports: [GlobalTableComponent, CommonModule],
    templateUrl: './lessons.component.html',
})
export class LessonsComponent implements OnInit {
    @ViewChild('statusTemplate', { static: true })
    statusTemplate?: TemplateRef<any>;

    statusColor: Map<string, string> = STATUS_CLASSES;

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

    get statusClass() {
        return (status: string): { [key: string]: boolean } => {
            return Utils.StatusService.getStatusClass(this.statusColor, status);
        };
    }
}
