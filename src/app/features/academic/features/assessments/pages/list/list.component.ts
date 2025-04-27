import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    TableColumn,
    TableWithFiltersComponent,
} from 'src/app/shared/components/table-with-filters/table-with-filters.component';
import { TableService } from 'src/app/shared/services/table.service';

@Component({
    selector: 'app-list',
    imports: [TableWithFiltersComponent, CommonModule],
    templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
    assessments: any[] = []; // This would be populated from a service
    columns: TableColumn[] = [];
    globalFilterFields: string[] = [];
    loading = false;

    constructor(private tableService: TableService<any>) {}

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
}
