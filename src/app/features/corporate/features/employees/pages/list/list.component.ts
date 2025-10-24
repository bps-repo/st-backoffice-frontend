import { Component, OnInit, OnDestroy, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
    TableColumn,
    GlobalTable,
} from 'src/app/shared/components/tables/global-table/global-table.component';
import { Observable, Subject, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { EmployeesActions } from 'src/app/core/store/corporate/employees/employees.actions';
import { selectAllEmployees, selectLoading } from 'src/app/core/store/corporate/employees/employees.selectors';
import { ButtonModule } from 'primeng/button';
import { COLUMNS, GLOBAL_FILTERS, HEADER_ACTIONS } from "../../constants";
import { TableHeaderAction } from "../../../../../../shared/components/tables/global-table/table-header.component";
import { Employee, EmployeeStatus } from 'src/app/core/models/corporate/employee';
import { BadgeModule } from "primeng/badge";
import { HasPermissionDirective } from 'src/app/shared/directives';

@Component({
    selector: 'app-employee-list',
    imports: [
        CommonModule,
        RouterModule,
        GlobalTable,
        ButtonModule,
        BadgeModule,
        HasPermissionDirective
    ],
    templateUrl: './list.component.html',
    standalone: true
})
export class ListComponent implements OnInit, OnDestroy, AfterViewInit {

    // Custom Templates for the table
    @ViewChild('nameTemplate', { static: true })
    nameTemplate!: TemplateRef<any>;

    @ViewChild('emailTemplate', { static: true })
    emailTemplate!: TemplateRef<any>;

    @ViewChild('positionTemplate', { static: true })
    positionTemplate!: TemplateRef<any>;

    @ViewChild('statusTemplate', { static: true })
    statusTemplate!: TemplateRef<any>;


    employees$: Observable<Employee[]> = of([]);
    loading$: Observable<boolean> = of(false);
    columns: TableColumn[] = COLUMNS;
    globalFilterFields: string[] = GLOBAL_FILTERS;
    customTemplates: Record<string, TemplateRef<any>> = {};
    headerActions: TableHeaderAction[] = HEADER_ACTIONS;

    private destroy$ = new Subject<void>();

    constructor(
        private router: Router,
        private store: Store
    ) {
        this.employees$ = this.store.select(selectAllEmployees)
        this.loading$ = this.store.select(selectLoading);

        this.employees$.subscribe((v) => console.log("Users", v))
    }

    ngOnInit(): void {
        this.loadEmployees();
    }

    ngAfterViewInit() {
        this.customTemplates = {
            name: this.nameTemplate,
            email: this.emailTemplate,
            position: this.positionTemplate,
            status: this.statusTemplate,
        };
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadEmployees(): void {
        this.store.dispatch(EmployeesActions.loadEmployees());
    }

    onRowSelect(employee: any) {
        this.router.navigate(['/corporate/employees', employee.id]).then();
    }

    navigateToCreateEmployee() {
        this.router.navigate(['/corporate/employees/create']).then();
    }

    getStatusLabel(status: EmployeeStatus): string {
        const statusMap: Record<EmployeeStatus, string> = {
            'ACTIVE': 'Ativo',
            'INACTIVE': 'Inativo',
            'ON_LEAVE': 'De Licença',
            'TERMINATED': 'Terminado'
        };
        return statusMap[status] || '';
    }

    getStatusSeverity(status: EmployeeStatus): "success" | "warning" | "info" | "danger" | null {
        const severityMap: Record<EmployeeStatus, "success" | "warning" | "info" | "danger" | null> = {
            'ACTIVE': 'success',
            'INACTIVE': 'warning',
            'ON_LEAVE': 'info',
            'TERMINATED': 'danger'
        };
        return severityMap[status] || null;
    }
}
