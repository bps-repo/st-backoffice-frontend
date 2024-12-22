import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { SliderModule } from 'primeng/slider';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Table } from 'primeng/table';
import { TableHeaderComponent } from './table-header.component';

interface TableColumn {
    field: string;
    header: string;
    filterType?: 'text' | 'numeric' | 'date' | 'boolean' | 'custom';
    filterOptions?: any; // For dropdown, multiselect, etc.
    filterTemplate?: boolean; // Indicates custom filter template usage
    customTemplate?: boolean; // Indicates custom column template usage
}

@Component({
    selector: 'app-table-with-filters',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        InputTextModule,
        DropdownModule,
        MultiSelectModule,
        SliderModule,
        ButtonModule,
        RouterModule,
        TableHeaderComponent,
    ],
    templateUrl: './table-with-filters.component.html',
    styleUrls: ['./table-with-filters.component.scss'],
})
export class TableWithFiltersComponent<T> implements OnInit {
    @Input() columns: TableColumn[] = []; // Dynamic column definitions

    @Input() data: T[] = [];

    @Input() entity: string = '';

    @Input() globalFilterFields: string[] = []; // Fields to be filtered globally

    @Input() loading: boolean = false; // Loading state

    @Input() tableLabel = '';

    @ViewChild('filter') filter!: ElementRef;

    constructor(private router: Router) {}

    ngOnInit(): void {}

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    navigateToCreate() {
        this.router.navigate([`/modules/schoolar/create`]);
    }
}
