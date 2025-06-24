import {Component, OnInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {Employee, EmployeeStatus} from 'src/app/core/models/corporate/employee';
import {EmployeeService} from 'src/app/core/services/employee.service';
import {Subject} from 'rxjs';
import {takeUntil, finalize} from 'rxjs/operators';
import {ButtonModule} from 'primeng/button';
import {TabViewModule} from 'primeng/tabview';
import {TagModule} from 'primeng/tag';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {RippleModule} from "primeng/ripple";

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
        RippleModule
    ]
})
export class DetailComponent implements OnInit, OnDestroy {
    employee: Employee | null = null;
    loading = false;
    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private employeeService: EmployeeService
    ) {
    }

    ngOnInit(): void {
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
        this.loading = true;
        this.employeeService.getEmployee(id).pipe(
            takeUntil(this.destroy$),
            finalize(() => this.loading = false)
        ).subscribe({
            next: (employee) => {
                this.employee = employee;
            },
            error: (error) => {
                console.error('Error loading employee', error);
                this.employee = null;
            }
        });
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
        if (this.employee) {
            this.router.navigate(['/corporate/employees/edit', this.employee.id]);
        }
    }

    goBack(): void {
        this.router.navigate(['/corporate/employees']);
    }
}
