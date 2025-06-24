import {Component, OnInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Employee} from 'src/app/core/models/corporate/employee';
import {EmployeeService} from 'src/app/core/services/employee.service';
import {RoleService} from 'src/app/core/services/role.service';
import {Subject, forkJoin} from 'rxjs';
import {takeUntil, finalize} from 'rxjs/operators';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {TagModule} from 'primeng/tag';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {RippleModule} from "primeng/ripple";
import {Role} from "../../../../../../../../core/models/auth/role";

@Component({
    selector: 'app-roles',
    templateUrl: './roles.component.html',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        TableModule,
        DropdownModule,
        TagModule,
        ProgressSpinnerModule,
        ToastModule,
        RippleModule
    ],
    providers: [MessageService]
})
export class RolesComponent implements OnInit, OnDestroy {
    employee: Employee | null = null;
    availableRoles: Role[] = [];
    selectedRole: Role | null = null;
    loading = false;
    adding = false;
    removing = false;
    private destroy$ = new Subject<void>();
    private employeeId: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private employeeService: EmployeeService,
        private roleService: RoleService,
        private messageService: MessageService
    ) {
    }

    ngOnInit(): void {
        this.route.parent?.paramMap.pipe(
            takeUntil(this.destroy$)
        ).subscribe(params => {
            this.employeeId = params.get('id');
            if (this.employeeId) {
                this.loadData();
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadData(): void {
        if (!this.employeeId) return;

        this.loading = true;

        forkJoin({
            employee: this.employeeService.getEmployee(this.employeeId),
            roles: this.roleService.getRoles()
        }).pipe(
            takeUntil(this.destroy$),
            finalize(() => this.loading = false)
        ).subscribe({
            next: ({employee, roles}) => {
                this.employee = employee;

                // Filter out roles that the employee already has
                const employeeRoleIds = new Set(employee.roles.map(r => r.id));
                this.availableRoles = roles.filter(role => !employeeRoleIds.has(role.id));
            },
            error: (error) => {
                console.error('Error loading data', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar dados. Por favor, tente novamente.'
                });
            }
        });
    }

    addRole(): void {
        if (!this.employeeId || !this.selectedRole) return;

        this.adding = true;
        this.employeeService.assignRoleToEmployee(this.employeeId, this.selectedRole.id).pipe(
            takeUntil(this.destroy$),
            finalize(() => this.adding = false)
        ).subscribe({
            next: (updatedEmployee) => {
                this.employee = updatedEmployee;
                this.selectedRole = null;

                // Update available roles
                const employeeRoleIds = new Set(updatedEmployee.roles.map(r => r.id));
                this.availableRoles = this.availableRoles.filter(role => !employeeRoleIds.has(role.id));

                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Função adicionada com sucesso'
                });
            },
            error: (error) => {
                console.error('Error adding role', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao adicionar função. Por favor, tente novamente.'
                });
            }
        });
    }

    removeRole(role: Role): void {
        if (!this.employeeId) return;

        this.removing = true;
        this.employeeService.removeRoleFromEmployee(this.employeeId, role.id).pipe(
            takeUntil(this.destroy$),
            finalize(() => this.removing = false)
        ).subscribe({
            next: (updatedEmployee) => {
                this.employee = updatedEmployee;

                // Update available roles
                this.availableRoles = [...this.availableRoles, role];

                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Função removida com sucesso'
                });
            },
            error: (error) => {
                console.error('Error removing role', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao remover função. Por favor, tente novamente.'
                });
            }
        });
    }
}
