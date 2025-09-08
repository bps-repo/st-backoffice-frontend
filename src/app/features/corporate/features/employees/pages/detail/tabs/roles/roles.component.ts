import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Employee } from 'src/app/core/models/corporate/employee';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RippleModule } from "primeng/ripple";
import { Permission } from 'src/app/core/models/auth/permission';
import { UserManagementService } from 'src/app/core/services/user-management.service';

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
    availablePermissions: Permission[] = [];
    selectedPermission: Permission | null = null;
    loading = false;
    adding = false;
    removing = false;
    private destroy$ = new Subject<void>();
    private employeeId: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private userManagementService: UserManagementService,
        private messageService: MessageService,
        private employeeService: EmployeeService
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
            employee: this.employeeService.getEmployeeById(this.employeeId),
            permissions: this.userManagementService.getUserPermissions(this.employeeId)
        }).pipe(
            takeUntil(this.destroy$),
            finalize(() => this.loading = false)
        ).subscribe({
            next: ({ employee, permissions }) => {
                this.employee = employee;

                this.availablePermissions = permissions.filter(permission => permission.id !== employee.user.roleId);
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
        // if (!this.employeeId || !this.selectedPermission) return;

        // this.adding = true;
        // this.userManagementService.addPermissionToUser(this.employeeId, this.selectedPermission.id).pipe(
        //     takeUntil(this.destroy$),
        //     finalize(() => this.adding = false)
        // ).subscribe({
        //     next: (updatedUser) => {
        //         this.employee = updatedUser as unknown as Employee;
        //         this.selectedPermission = null;

        //         // Update available roles
        //         this.availablePermissions = this.availablePermissions.filter(permission => permission.id !== updatedUser.user.roleId);

        //         this.messageService.add({
        //             severity: 'success',
        //             summary: 'Sucesso',
        //             detail: 'Função adicionada com sucesso'
        //         });
        //     },
        //     error: (error) => {
        //         console.error('Error adding role', error);
        //         this.messageService.add({
        //             severity: 'error',
        //             summary: 'Erro',
        //             detail: 'Erro ao adicionar função. Por favor, tente novamente.'
        //         });
        //     }
        // });
    }

    removePermission(permission: Permission): void {
        // if (!this.employeeId) return;

        // this.removing = true;
        // this.userManagementService.removePermissionFromUser(this.employeeId, permission.id).pipe(
        //     takeUntil(this.destroy$),
        //     finalize(() => this.removing = false)
        // ).subscribe({
        //     next: (updatedUser) => {
        //         this.employee = updatedUser as Employee;

        //         // Update available roles
        //         this.availablePermissions = [...this.availablePermissions, permission];

        //         this.messageService.add({
        //             severity: 'success',
        //             summary: 'Sucesso',
        //             detail: 'Permissão removida com sucesso'
        //         });
        //     },
        //     error: (error) => {
        //         console.error('Error removing permission', error);
        //         this.messageService.add({
        //             severity: 'error',
        //             summary: 'Erro',
        //             detail: 'Erro ao remover permissão. Por favor, tente novamente.'
        //         });
        //     }
        // });
    }
}
