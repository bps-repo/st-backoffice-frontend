import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    TableColumn,
    TableWithFiltersComponent,
} from 'src/app/shared/components/table-with-filters/table-with-filters.component';
import { STUDENTS } from 'src/app/shared/constants/representatives';
import { Student } from 'src/app/core/models/academic/student';
import { TableService } from 'src/app/shared/services/table.service';
import { TableColumnFilterTemplates } from 'primeng/table';

type studentKeys = keyof Student;

@Component({
    selector: 'app-list',
    standalone: true,
    imports: [TableWithFiltersComponent, CommonModule],
    templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
    students: Student[] = STUDENTS;

    columns: TableColumn[] = [];

    globalFilterFields: string[] = [];

    loading = false;

    constructor(private tableService: TableService<Student>) {}

    ngOnInit(): void {
        // Dynamically populate columns and globalFilterFields
        // if (STUDENTS.length > 0) {
        //     this.tableService.populateColumnsFromModel(
        //         STUDENTS[0],
        //         this.columns,
        //         this.globalFilterFields
        //     );
        // }

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
        ];
    }
}
