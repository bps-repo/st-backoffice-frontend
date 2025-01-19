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

type FilterType = 'text' | 'numeric' | 'date' | 'boolean' | 'custom';
export interface TableColumn {
    field: string;
    header: string;
    filterType?: FilterType;
    filterOptions?: any;
    filterTemplate?: TemplateRef<any>;
    customTemplate?: TemplateRef<any>;
}

@Component({
    selector: 'app-global-table',
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
    templateUrl: './global-table.component.html',
    styleUrls: ['./global-table.component.scss'],
})
export class GlobalTableComponent implements OnInit {
    @Input() columns: TableColumn[] = [];

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
