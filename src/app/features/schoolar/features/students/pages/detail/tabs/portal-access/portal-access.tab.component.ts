// src/app/features/schoolar/features/students/pages/detail/tabs/portal-access/portal-access.tab.component.ts
import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormBuilder, Validators} from '@angular/forms';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {ButtonSeverity} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {ToastModule} from 'primeng/toast';
import {DividerModule} from 'primeng/divider';
import {TagModule} from 'primeng/tag';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {MessageService, ConfirmationService} from 'primeng/api';
import {Student} from 'src/app/core/models/academic/students/student';
import {StudentService} from 'src/app/core/services/student.service';
import {UserManagementService} from 'src/app/core/services/user-management.service';
import {UserStatus} from 'src/app/core/models/user.model';

@Component({
    selector: 'scholar-student-portal-access-tab',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CardModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        PasswordModule,
        ToastModule,
        DividerModule,
        TagModule,
        ConfirmDialogModule,
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './portal-access.tab.component.html',
})
export class StudentPortalAccessTabComponent implements OnChanges {
    @Input() studentId: string | null = null;
    @Input() student: Student | null = null;

    private studentService = inject(StudentService);
    private userManagementService = inject(UserManagementService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private fb = inject(FormBuilder);

    dialogVisible = false;
    saving = signal(false);
    statusUpdating = signal(false);

    readonly statusActions: {label: string; status: UserStatus; severity: ButtonSeverity; icon: string}[] = [
        {label: 'Activar',   status: UserStatus.ACTIVE,   severity: 'success',   icon: 'pi pi-check-circle'},
        {label: 'Bloquear',  status: UserStatus.BLOCKED,  severity: 'warn',      icon: 'pi pi-ban'},
        {label: 'Inactivar', status: UserStatus.INACTIVE, severity: 'secondary', icon: 'pi pi-minus-circle'},
        {label: 'Deletar',   status: UserStatus.DELETED,  severity: 'danger',    icon: 'pi pi-trash'},
    ];

    form = this.fb.group({
        username: ['', Validators.required],
        phone: ['', Validators.required],
        password: [''],
    });

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['student'] && this.student) {
            this.resetForm();
        }
    }

    openDialog(): void {
        this.resetForm();
        this.dialogVisible = true;
    }

    save(): void {
        if (this.form.invalid || !this.studentId || this.saving()) return;

        const {username, phone, password} = this.form.getRawValue();
        const payload: {username?: string; phone?: string; password?: string} = {};

        if (username) payload.username = username;
        if (phone) payload.phone = phone;
        if (password) payload.password = password;

        if (Object.keys(payload).length === 0) return;

        this.saving.set(true);
        this.studentService.updateCredentials(this.studentId, payload).subscribe({
            next: () => {
                this.saving.set(false);
                this.dialogVisible = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Credenciais atualizadas com sucesso.',
                });
            },
            error: (error) => {
                this.saving.set(false);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: error?.error?.message ?? error?.message ?? 'Falha ao atualizar credenciais.',
                });
            },
        });
    }

    updateAccountStatus(status: UserStatus): void {
        const userId = this.student?.user?.id;
        if (!userId || this.statusUpdating()) return;

        const action = this.statusActions.find(a => a.status === status);
        this.confirmationService.confirm({
            header: action?.label ?? 'Confirmar',
            message: `Confirma que pretende ${(action?.label ?? status).toLowerCase()} esta conta?`,
            icon: action?.icon ?? 'pi pi-exclamation-triangle',
            acceptLabel: action?.label ?? 'Confirmar',
            rejectLabel: 'Cancelar',
            accept: () => {
                this.statusUpdating.set(true);
                this.userManagementService.patchUser(userId, {accountStatus: status}).subscribe({
                    next: () => {
                        this.statusUpdating.set(false);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Estado da conta atualizado com sucesso.',
                        });
                    },
                    error: (error) => {
                        this.statusUpdating.set(false);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: error?.error?.message ?? error?.message ?? 'Falha ao atualizar estado da conta.',
                        });
                    },
                });
            },
        });
    }

    statusSeverity(status: string | undefined): ButtonSeverity {
        const map: Record<string, ButtonSeverity> = {
            ACTIVE: 'success',
            BLOCKED: 'warn',
            INACTIVE: 'secondary',
            DELETED: 'danger',
            SUSPENDED: 'warn',
        };
        return map[status ?? ''] ?? 'secondary';
    }

    private resetForm(): void {
        const code = this.student?.code?.toString() ?? '';
        const defaultPassword = code ? `${code}${new Date().getFullYear()}` : '';
        this.form.reset({
            username: this.student?.user?.username || code,
            phone: this.student?.user?.phone ?? '',
            password: defaultPassword,
        });
    }
}
