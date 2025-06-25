import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    TableColumn,
    GlobalTable,
} from 'src/app/shared/components/tables/global-table/global-table.component';
import {TableService} from 'src/app/shared/services/table.service';
import {Router} from "@angular/router";
import {AssessmentService} from 'src/app/core/services/assessment.service';

@Component({
    selector: 'app-general',
    imports: [GlobalTable, CommonModule],
    templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
    assessments: any[] = []; // This would be populated from a service
    columns: TableColumn[] = [];
    globalFilterFields: string[] = [];
    loading = false;

    constructor(
        private tableService: TableService<any>,
        private router: Router,
        private assessmentService: AssessmentService
    ) {}

    ngOnInit(): void {
        // Load assessments from service
        this.loading = true;
        this.assessmentService.getAssessments().subscribe({
            next: (data) => {
                this.assessments = data;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error fetching assessments:', error);
                this.loading = false;
            }
        });

        // Define custom column templates for different filter types
        this.columns = [
            {
                field: 'id',
                header: 'ID',
                filterType: 'text',
            },
            {
                field: 'title',
                header: 'Title',
                filterType: 'text',
            },
            {
                field: 'description',
                header: 'Description',
                filterType: 'text',
            },
            {
                field: 'type',
                header: 'Type',
                filterType: 'text',
            },
            {
                field: 'date',
                header: 'Date',
                filterType: 'date',
            },
        ];

        // Populate globalFilterFields
        this.globalFilterFields = this.columns.map(col => col.field);
    }

    createAssessment() {
        this.router.navigate(['/schoolar/assessments/create']);
    }
}
