import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableWithFiltersComponent } from 'src/app/shared/components/table-with-filters/table-with-filters.component';
import { STUDENTS } from 'src/app/shared/constants/representatives';
import { Student } from 'src/app/core/models/student';
import { TableService } from 'src/app/shared/services/table.service';

type studentKeys = keyof Student;

@Component({
    selector: 'app-list',
    standalone: true,
    imports: [TableWithFiltersComponent, CommonModule],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
    students: Student[] = STUDENTS;

    columns: any[] = [];

    globalFilterFields: string[] = [];

    loading = false;

    constructor(private tableService: TableService<Student>) {}

    ngOnInit(): void {
        // Dynamically populate columns and globalFilterFields
        if (STUDENTS.length > 0) {
            this.tableService.populateColumnsFromModel(
                STUDENTS[0],
                this.columns,
                this.globalFilterFields
            );
        }
    }
}
