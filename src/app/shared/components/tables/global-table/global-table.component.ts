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
    ViewChild
} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {TableModule, Table} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {MultiSelectModule} from 'primeng/multiselect';
import {SliderModule} from 'primeng/slider';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {TableHeaderAction, TableHeaderComponent} from './table-header.component';

export interface TableColumn {
    field: string;
    header: string;
    filterType?: 'text' | 'numeric' | 'date' | 'boolean' | 'custom';
    filterOptions?: any;
    filterTemplate?: boolean;
    customTemplate?: boolean;
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

    @Output()
    createEntity = new EventEmitter<void>();


    @Output()
    rowSelect = new EventEmitter<T>();

    @ViewChild('filter')
    filter!: ElementRef;

    @ContentChild('actions', {static: false})
    actionsTemplate!: TemplateRef<any>;

    private _data: T[] = [];

    get data(): T[] {
        return this._data;
    }

    ngOnInit(): void {}

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
}
