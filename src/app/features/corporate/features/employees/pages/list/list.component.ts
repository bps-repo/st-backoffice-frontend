import {Component, OnInit, OnDestroy, TemplateRef, ViewChild, AfterViewInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {
    TableColumn,
    GlobalTable,
} from 'src/app/shared/components/tables/global-table/global-table.component';
import {Observable, Subject, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {EmployeesActions} from 'src/app/core/store/corporate/employees/employees.actions';
import {selectAllEmployees, selectLoading} from 'src/app/core/store/corporate/employees/employees.selectors';
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

    // Using a view model (any) because API returns nested user fields not present in core Employee model
    employees$: Observable<any[]> = of([]);
    loading$: Observable<boolean> = of(false);
    columns: TableColumn[] = COLUMNS;
    globalFilterFields: string[] = GLOBAL_FILTERS;
    customTemplates: Record<string, TemplateRef<any>> = {};
    headerActions: TableHeaderAction[] = HEADER_ACTIONS;

    private loading = false;
    private destroy$ = new Subject<void>();

    constructor(
        private router: Router,
        private store: Store
    ) {
        this.employees$.subscribe(employees => {
            console.log('Employees loaded:', employees);
        })
    }

    ngOnInit(): void {
        this.loadEmployees();
        // select loading and employees from store
        this.loading$ = this.store.select(selectLoading);
        this.employees$ = this.store.select(selectAllEmployees).pipe(
            map((items: any[]) => items.map((e: any) => ({
                id: e.id,
                name: e.user ? `${e.user.firstname ?? ''} ${e.user.lastname ?? ''}`.trim() : '',
                email: e.user?.email ?? '',
                department: e.user?.roleName ?? e.user?.roles?.[0]?.name ?? '',
                position: e.user?.roleName ?? e.user?.roles?.[0]?.name ?? '',
                status: e.status ?? e.user?.status ?? '',
                hireDate: e.hiringDate ?? e.hireDate ?? null,
                raw: e,
            })))
        );
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
        // Dispatch NgRx action instead of calling service directly
        this.store.dispatch(EmployeesActions.loadEmployees());
    }

    onRowSelect(employee: any) {
        this.router.navigate(['/corporate/employees', employee.id]).then();
    }

    navigateToCreateEmployee() {
        this.router.navigate(['/corporate/employees/create']).then();
    }
}
