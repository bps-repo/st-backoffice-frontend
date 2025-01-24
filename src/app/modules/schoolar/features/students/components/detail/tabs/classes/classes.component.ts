import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Class } from 'src/app/core/models/class';
import {
    GlobalTableComponent,
    TableColumn,
} from 'src/app/shared/components/global-table/global-table.component';
import { CLASSES_BY_STUDENT } from 'src/app/shared/constants/classes';
import { STATUS_CLASSES } from 'src/app/shared/constants/status-class';
import { Utils } from 'src/app/shared/utils/status.service';
@Component({
    selector: 'app-classes',
    standalone: true,
    imports: [GlobalTableComponent, CommonModule],
    templateUrl: './classes.component.html',
    styleUrl: './classes.component.scss',
})
export class ClassesComponent implements OnInit {
    lessons: Class[] = CLASSES_BY_STUDENT;

    @ViewChild('statusTemplate', { static: true })
    statusTemplate?: TemplateRef<any>;

    columns: TableColumn[] = [];

    statusColor = STATUS_CLASSES;

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
            {
                field: 'status',
                header: 'Estado',
                customTemplate: this.statusTemplate,
            },
        ];
    }

    get statusClass() {
        return (status: string): { [key: string]: boolean } => {
            return Utils.StatusService.getStatusClass(this.statusColor, status);
        };
    }
}
