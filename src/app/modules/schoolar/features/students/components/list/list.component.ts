import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    TableColumn,
    GlobalTableComponent,
} from 'src/app/shared/components/table-with-filters/table-with-filters.component';
import { STUDENTS } from 'src/app/shared/constants/representatives';
import { Student, StudentStatus } from 'src/app/core/models/student';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-list',
    standalone: true,
    imports: [GlobalTableComponent, CommonModule, DropdownModule],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
    @ViewChild('editTemplate', { static: true })
    editTemplate?: TemplateRef<any>;

    statusClass: Map<StudentStatus, string> = new Map([
        [StudentStatus.ACTIVE, 'bg-green-500'],
        [StudentStatus.INACTIVE, 'bg-red-500'],
        [StudentStatus.WARNING, 'bg-yellow-400'],
        [StudentStatus.REMOVED, 'bg-gray-500'],
        [StudentStatus.PLUNKED, 'bg-red-500'],
        [StudentStatus.PENDING, 'bg-blue-500'],
        [StudentStatus.FINISHED, 'bg-green-500'],
        [StudentStatus.SUSPENDED, 'bg-red-800'],
        [StudentStatus.QUIT, 'bg-red-400'],
    ]);

    students: Student[] = STUDENTS;

    columns: TableColumn[] = [];

    globalFilterFields: string[] = [];

    loading = false;

    constructor() {}

    ngOnInit(): void {
        // Define custom column templates for different filter types
        this.columns = [
            {
                field: 'id',
                header: 'Nº',
                filterType: 'text',
            },
            {
                field: 'name',
                header: 'Nome',
                filterType: 'text',
            },
            {
                field: 'center',
                header: 'Centro',
                filterType: 'text',
            },
            {
                field: 'level',
                header: 'Nível',
                filterType: 'text',
            },
            {
                field: 'phone',
                header: 'Telefone',
                filterType: 'text',
            },
            {
                field: 'status',
                header: 'Estado',
                filterType: 'boolean',
                customTemplate: this.editTemplate,
            },
        ];
    }

    getClass(status: StudentStatus): string {
        return this.statusClass.get(status) || '';
    }
}
