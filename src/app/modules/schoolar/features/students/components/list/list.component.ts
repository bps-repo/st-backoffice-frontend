import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Student, StudentStatus } from 'src/app/core/models/student';
import { DropdownModule } from 'primeng/dropdown';
import {
    GlobalTableComponent,
    TableColumn,
} from 'src/app/shared/components/global-table/global-table.component';
import { StudentService } from 'src/app/core/services/students.service';
import { STATUS_CLASSES } from 'src/app/shared/constants/status-class';
import { Utils } from 'src/app/shared/utils/status.service';

@Component({
    selector: 'app-list',
    standalone: true,
    imports: [GlobalTableComponent, CommonModule, DropdownModule],
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
    @ViewChild('editTemplate', { static: true })
    editTemplate?: TemplateRef<any>;

    students: Student[] = [];
    columns: TableColumn[] = [];
    globalFilterFields: string[] = [];
    loading = false;

    statusColor: Map<StudentStatus, string> = STATUS_CLASSES;

    constructor(private studentService: StudentService) {}

    ngOnInit(): void {
        this.loadStudents();
        this.initializeColumns();
    }

    private loadStudents(): void {
        this.studentService.getStudents().subscribe((students) => {
            this.students = students;
        });
    }

    private initializeColumns(): void {
        this.columns = [
            { field: 'id', header: 'Nº', filterType: 'text' },
            { field: 'name', header: 'Nome', filterType: 'text' },
            { field: 'center', header: 'Centro', filterType: 'text' },
            { field: 'level', header: 'Nível', filterType: 'text' },
            { field: 'phone', header: 'Telefone', filterType: 'text' },
            {
                field: 'status',
                header: 'Estado',
                filterType: 'boolean',
                customTemplate: this.editTemplate,
            },
        ];
    }

    get statusClass() {
        return (status: string): { [key: string]: boolean } => {
            return Utils.StatusService.getStatusClass(this.statusColor, status);
        };
    }
}
