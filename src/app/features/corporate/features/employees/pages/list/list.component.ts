import {Component, OnInit, OnDestroy, TemplateRef, ViewChild, AfterViewInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {
    TableColumn,
    GlobalTable,
} from 'src/app/shared/components/tables/global-table/global-table.component';
import {Employee} from 'src/app/core/models/corporate/employee';
import {EmployeeService} from 'src/app/core/services/employee.service';

import {Observable, Subject, of} from 'rxjs';
import {catchError, finalize, takeUntil} from 'rxjs/operators';
import {ButtonModule} from 'primeng/button';
import {COLUMNS, GLOBAL_FILTERS, HEADER_ACTIONS} from "../../constants";
import {TableHeaderAction} from "../../../../../../shared/components/tables/global-table/table-header.component";

@Component({
    selector: 'app-employee-list',
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

    // Custom Templates for the table
    @ViewChild('nameTemplate', {static: true})
    nameTemplate!: TemplateRef<any>;

    @ViewChild('emailTemplate', {static: true})
    emailTemplate!: TemplateRef<any>;

    @ViewChild('hireDateTemplate', {static: true})
    hireDateTemplate!: TemplateRef<any>;

    employees$: Observable<Employee[]> = of([]);
    loading$: Observable<boolean> = of(false);
    columns: TableColumn[] = COLUMNS;
    globalFilterFields: string[] = GLOBAL_FILTERS;
    customTemplates: Record<string, TemplateRef<any>> = {};
    headerActions: TableHeaderAction[] = HEADER_ACTIONS;

    private loading = false;
    private destroy$ = new Subject<void>();

    constructor(
        private employeeService: EmployeeService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.loadEmployees();
    }

    ngAfterViewInit() {
        this.customTemplates = {
            name: this.nameTemplate,
            email: this.emailTemplate,
            hireDate: this.hireDateTemplate
        };
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadEmployees(): void {
        this.loading = true;
        this.loading$ = of(true);

        this.employees$ = this.employeeService.getEmployees().pipe(
            takeUntil(this.destroy$),
            catchError(error => {
                console.error('Error loading employees', error);
                return of([]);
            }),
            finalize(() => {
                this.loading = false;
                this.loading$ = of(false);
            })
        );
    }

    onRowSelect(employee: Employee) {
        this.router.navigate(['/corporate/employees', employee.id]).then();
    }

    navigateToCreateEmployee() {
        this.router.navigate(['/corporate/employees/create']).then();
    }
}
