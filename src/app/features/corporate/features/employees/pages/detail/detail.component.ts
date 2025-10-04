import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmployeeStatus, EmployeeDetails } from 'src/app/core/models/corporate/employee';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil, } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from "primeng/ripple";
import { PermissionTreeDisplayComponent } from 'src/app/shared/components/permission-tree-display/permission-tree-display.component';
import { Store } from '@ngrx/store';
import { selectEmployeeLoading, selectSelectedEmployee } from 'src/app/core/store/corporate/employees/employees.selectors';
import { EmployeesActions } from 'src/app/core/store/corporate/employees/employees.actions';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule,
        TabViewModule,
        TagModule,
        ProgressSpinnerModule,
        RippleModule,
        PermissionTreeDisplayComponent
    ]
})
export class DetailComponent implements OnInit, OnDestroy {
    employeeDetails: EmployeeDetails | null = null;

    employee$!: Observable<EmployeeDetails | null>;

    loading$: Observable<boolean> = of(false)
    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private store$: Store
    ) { }

    ngOnInit(): void {
        // Subscribe to loading state
        this.loading$ = this.store$.select(selectEmployeeLoading)

        // Subscribe to selected employee
        this.employee$ = this.store$.select(selectSelectedEmployee) as Observable<EmployeeDetails | null>;

        this.employee$
            .pipe(takeUntil(this.destroy$))
            .subscribe(employee => {
                this.employeeDetails = employee;
            });

        // Load employee from route params
        this.route.paramMap.pipe(
            takeUntil(this.destroy$)
        ).subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.loadEmployee(id);
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadEmployee(id: string): void {
        this.store$.dispatch(EmployeesActions.loadEmployeeById({ id }));
    }

    getStatusLabel(status: EmployeeStatus): string {
        const statusMap: Record<EmployeeStatus, string> = {
            'ACTIVE': 'Ativo',
            'INACTIVE': 'Inativo',
            'ON_LEAVE': 'De Licença',
            'TERMINATED': 'Terminado'
        };
        return statusMap[status] || status;
    }

    getStatusSeverity(status: EmployeeStatus): string {
        const severityMap: Record<EmployeeStatus, string> = {
            'ACTIVE': 'success',
            'INACTIVE': 'warning',
            'ON_LEAVE': 'info',
            'TERMINATED': 'danger'
        };
        return severityMap[status] || 'info';
    }

    editEmployee(): void {
        if (this.employeeDetails) {
            this.router.navigate(['/corporate/employees/edit', this.employeeDetails.id]);
        }
    }

    goBack(): void {
        this.router.navigate(['/corporate/employees']);
    }

    getGenderLabel(gender: string): string {
        const genderMap: Record<string, string> = {
            'MALE': 'Masculino',
            'FEMALE': 'Feminino',
            'OTHER': 'Outro',
            'PREFER_NOT_TO_SAY': 'Prefere não dizer'
        };
        return genderMap[gender] || gender;
    }

    formatDate(date: string | null): string | null {
        if (!date) return null;
        try {
            return new Date(date).toLocaleDateString('pt-BR');
        } catch {
            return date;
        }
    }

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount);
    }
}
