import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    TableColumn,
    TableWithFiltersComponent,
} from 'src/app/shared/components/table-with-filters/table-with-filters.component';
import { STUDENTS } from 'src/app/shared/constants/representatives';
import { Student } from 'src/app/core/models/student';
import { EditComponent } from '../edit/edit.component';

@Component({
    selector: 'app-list',
    standalone: true,
    imports: [TableWithFiltersComponent, CommonModule],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
    @ViewChild('editTemplate', { static: true })
    editTemplate?: TemplateRef<any>;

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

    editItem(item: Student): void {
        // Implement the edit logic here
        console.log('Editing item:', item);
    }
}
