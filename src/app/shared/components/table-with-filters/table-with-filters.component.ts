import { CommonModule } from '@angular/common';
import {
    Component,
    ElementRef,
    Input,
    OnInit,
    TemplateRef,
    ViewChild,
} from '@angular/core';
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
import { ClassesService } from 'src/app/modules/schoolar/features/classes/services/classes.service';

export interface TableColumn {
    field: string;
    header: string;
    filterType?: 'text' | 'numeric' | 'date' | 'boolean' | 'custom';
    filterOptions?: any;
    filterTemplate?: boolean;
    customTemplate?: TemplateRef<any>;
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
export class TableWithFiltersComponent implements OnInit {
    @Input() columns: TableColumn[] = []; // Dynamic column definitions

    @Input() customTemplate?: TemplateRef<any>;

    @Input() data: any[] = [];

    @Input() entity: string = 'students';

    @Input() globalFilterFields: string[] = []; // Fields to be filtered globally

    @Input() loading: boolean = false; // Loading state

    @Input() tableLabel = '';

    @ViewChild('filter') filter!: ElementRef;

    constructor(private router: Router, private classService: ClassesService) {}

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
}
