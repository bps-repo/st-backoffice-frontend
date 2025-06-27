import {Component, OnInit, OnDestroy, TemplateRef, ViewChild, AfterViewInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {
    TableColumn,
    GlobalTable,
} from 'src/app/shared/components/tables/global-table/global-table.component';
import {Employee} from 'src/app/core/models/corporate/employee';

import {Observable, Subject, of} from 'rxjs';
import {ButtonModule} from 'primeng/button';
import {COLUMNS, GLOBAL_FILTERS, HEADER_ACTIONS} from "../../constants";
import {TableHeaderAction} from "../../../../../../shared/components/tables/global-table/table-header.component";
import {EmployeeService} from "../../../../../../core/services/corporate/employee.service";
import {Store} from "@ngrx/store";
import {EmployeeActions} from "../../../../../../core/store/corporate/employees/employee.actions";
import * as EmployeeSelectors from "../../../../../../core/store/corporate/employees/employees.selector";

@Component({
    selector: 'app-employees-list',
    imports: [
        CommonModule,
        RouterModule,
        GlobalTable,
        ButtonModule
    ],
    templateUrl: './list.component.html',
    standalone: true
})
export class ListComponent implements OnInit, OnDestroy, AfterViewInit {
    employees$: Observable<Employee[]> = of([]);
    loading$: Observable<boolean> = of(false);
    columns: TableColumn[] = COLUMNS;
    globalFilterFields: string[] = GLOBAL_FILTERS;
    headerActions: TableHeaderAction[] = HEADER_ACTIONS;

    private destroy$ = new Subject<void>();

    constructor(
        private router: Router,
        private store: Store
    ) {
        this.employees$ = this.store.select(EmployeeSelectors.selectAllEmployees)
        this.loading$ = this.store.select(EmployeeSelectors.selectLoadingEmployees)
    }

    ngOnInit(): void {
        this.store.dispatch(EmployeeActions.loadEmployees())
    }

    ngAfterViewInit() {
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onRowSelect(employee: Employee) {
        this.router.navigate(['/corporate/employees', employee.id]).then();
    }

    navigateToCreateEmployee() {
        this.router.navigate(['/corporate/employees/create']).then();
    }
}
