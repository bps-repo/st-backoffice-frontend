import {CommonModule} from '@angular/common';
import {
    booleanAttribute,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {TableModule, Table} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {MultiSelectModule} from 'primeng/multiselect';
import {SliderModule} from 'primeng/slider';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {TableHeaderAction, TableHeaderComponent} from './table-header.component';

export interface TableColumn {
    field: string;
    header: string;
    filterType?: 'text' | 'numeric' | 'date' | 'boolean' | 'custom';
    filterOptions?: any;
    filterTemplate?: boolean;
    customTemplate?: boolean;
    sortable?: boolean;
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
        ProgressSpinnerModule,
    ],
    templateUrl: './global-table.component.html',
})
export class GlobalTable<T> implements OnInit {
    @Input()
    headerActions: TableHeaderAction[] = []

    @Input()
    columns: TableColumn[] = [];

    @Input()
    columnTemplates: Record<string, TemplateRef<any>> = {};

    @Input()
    filterTemplates: Record<string, TemplateRef<any>> = {};

    @Input()
    set data(value: T[] | null) {
        this._data = value || [];
    }

    @Input()
    entity: string = 'students';

    @Input()
    globalFilterFields: string[] = [];

    @Input({transform: booleanAttribute})
    loading: boolean = false;

    @Input()
    tableLabel = '';

    @Input({transform: booleanAttribute})
    expandableRows: boolean = false;

    @Input()
    childrenField: string = 'children';

    @Input({transform: booleanAttribute})
    lazy: boolean = false;

    @Input()
    totalRecords: number = 0;

    @Input()
    pageSize: number = 10;

    @Output()
    createEntity = new EventEmitter<void>();

    @Output()
    rowSelect = new EventEmitter<T>();

    @Output()
    pageChange = new EventEmitter<{ page: number; rows: number; sort?: string }>();

    @Output()
    rowExpand = new EventEmitter<any>();

    @Output()
    rowCollapse = new EventEmitter<any>();

    @ViewChild('filter')
    filter!: ElementRef;

    @ContentChild('actions', {static: false})
    actionsTemplate!: TemplateRef<any>;

    @ContentChild('expansion', {static: false})
    expansionTemplate!: TemplateRef<any>;

    expandedRows: { [key: string]: boolean } = {};

    private _data: T[] = [];

    get data(): T[] {
        return this._data;
    }

    ngOnInit(): void {}

    onLazyLoad(event: any): void {
        if (!this.lazy) return;
        const rows = event.rows ?? this.pageSize;
        const page = Math.floor((event.first ?? 0) / rows);
        let sort: string | undefined;
        if (event.sortField) {
            const direction = event.sortOrder === -1 ? 'desc' : 'asc';
            sort = `${event.sortField},${direction}`;
        }
        this.pageChange.emit({page, rows, sort});
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    selectRow(rowData: any) {
        this.rowSelect.emit(rowData);
    }

    hasChildren(rowData: any): boolean {
        return rowData[this.childrenField] && rowData[this.childrenField].length > 0;
    }

    toggleRow(rowData: any, event: Event) {
        event.stopPropagation();

        if (!this.hasChildren(rowData)) {
            return;
        }

        const rowId = rowData.id;
        this.expandedRows[rowId] = !this.expandedRows[rowId];

        if (this.expandedRows[rowId]) {
            this.rowExpand.emit({ originalEvent: event, data: rowData });
        } else {
            this.rowCollapse.emit({ originalEvent: event, data: rowData });
        }
    }

    isRowExpanded(rowData: any): boolean {
        return this.expandedRows[rowData.id] === true;
    }
}
