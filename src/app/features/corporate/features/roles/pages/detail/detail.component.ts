import {Component, OnInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {Role} from 'src/app/core/models/auth/role';
import {RoleService} from 'src/app/core/services/role.service';
import {Subject} from 'rxjs';
import {takeUntil, finalize} from 'rxjs/operators';
import {ButtonModule} from 'primeng/button';
import {TabViewModule} from 'primeng/tabview';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';

@Component({
    selector: 'app-role-detail',
    templateUrl: './detail.component.html',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        ButtonModule,
        TabViewModule,
        DialogModule,
        InputTextModule,
        InputTextareaModule,
        ProgressSpinnerModule,
        ConfirmDialogModule,
        ToastModule
    ],
    providers: [ConfirmationService, MessageService]
})
export class DetailComponent implements OnInit, OnDestroy {
    role: Role | null = null;
    loading = false;
    saving = false;
    editDialogVisible = false;
    roleForm!: FormGroup;
    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private roleService: RoleService,
        private fb: FormBuilder,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {
    }

    ngOnInit(): void {
        this.initForm();
        this.route.paramMap.pipe(
            takeUntil(this.destroy$)
        ).subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.loadRole(id);
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    initForm(): void {
        this.roleForm = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required]
        });
    }

    loadRole(id: string): void {
        this.loading = true;
        this.roleService.getRole(id).pipe(
            takeUntil(this.destroy$),
            finalize(() => this.loading = false)
        ).subscribe({
            next: (role) => {
                this.role = role;
            },
            error: (error) => {
                console.error('Error loading role', error);
                this.role = null;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar função. Por favor, tente novamente.'
                });
            }
        });
    }

    editRole(): void {
        if (this.role) {
            this.roleForm.patchValue({
                name: this.role.name,
                description: this.role.description
            });
            this.editDialogVisible = true;
        }
    }

    hideEditDialog(): void {
        this.editDialogVisible = false;
    }

    saveRole(): void {
        if (this.roleForm.invalid || !this.role) {
            return;
        }

        this.saving = true;
        const updatedRole: Role = {
            ...this.role,
            name: this.roleForm.value.name,
            description: this.roleForm.value.description
        };

        this.roleService.updateRole(updatedRole).pipe(
            takeUntil(this.destroy$),
            finalize(() => this.saving = false)
        ).subscribe({
            next: (role) => {
                this.role = role;
                this.hideEditDialog();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Função atualizada com sucesso'
                });
            },
            error: (error) => {
                console.error('Error updating role', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao atualizar função. Por favor, tente novamente.'
                });
            }
        });
    }

    deleteRole(): void {
        if (!this.role) return;

        this.confirmationService.confirm({
            message: `Tem certeza que deseja excluir a função "${this.role.name}"?`,
            header: 'Confirmar Exclusão',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.loading = true;
                this.roleService.deleteRole(this.role!.id).pipe(
                    takeUntil(this.destroy$),
                    finalize(() => this.loading = false)
                ).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Função excluída com sucesso'
                        });
                        this.router.navigate(['/corporate/roles']);
                    },
                    error: (error) => {
                        console.error('Error deleting role', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Erro ao excluir função. Por favor, tente novamente.'
                        });
                    }
                });
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/corporate/roles']);
    }
}
