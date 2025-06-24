import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    TableColumn,
    GlobalTable,
} from 'src/app/shared/components/tables/global-table/global-table.component';
import {TableService} from 'src/app/shared/services/table.service';
import {Router} from "@angular/router";

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

    constructor(private tableService: TableService<any>, private router: Router) {
    }

    ngOnInit(): void {
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
