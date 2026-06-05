import {ChangeDetectionStrategy, Component, OnInit, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {TagModule} from 'primeng/tag';
import {TooltipModule} from 'primeng/tooltip';
import {RippleModule} from 'primeng/ripple';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextarea} from 'primeng/inputtextarea';
import {DatePickerModule} from 'primeng/datepicker';
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {TaskAction, TaskItem} from '../../../../../../core/models/task-item.model';
import {TaskService} from '../../../../../../core/services/task.service';
import {
    TASK_ACTION_LABELS,
    TASK_STATUS_LABELS,
    TASK_TYPE_LABELS,
    getDaysFromDateString,
    isContractTaskType,
    studentStatusClass,
    taskStatusClass,
} from '../../task-presenter';

@Component({
    selector: 'settings-task-detail',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ButtonModule,
        CardModule,
        TagModule,
        TooltipModule,
        RippleModule,
        ProgressSpinnerModule,
        DialogModule,
        InputTextModule,
        InputTextarea,
        DatePickerModule,
        ToastModule,
    ],
    providers: [MessageService],
    templateUrl: './detail.component.html',
})
export class TaskDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private taskService = inject(TaskService);
    private messageService = inject(MessageService);

    readonly task = signal<TaskItem | null>(null);
    readonly loading = signal(true);
    readonly error = signal<string | null>(null);
    readonly actionLoading = signal(false);

    readonly meetingDialogVisible = signal(false);
    readonly meetingSubmitting = signal(false);
    readonly meetingDate = signal<Date | null>(null);
    readonly meetingTitle = signal('');
    readonly meetingDescription = signal('');

    readonly today = new Date();
    protected readonly Math = Math;

    readonly taskTypeLabels = TASK_TYPE_LABELS;
    readonly taskStatusLabels = TASK_STATUS_LABELS;
    readonly taskActionLabels = TASK_ACTION_LABELS;
    readonly taskStatusClass = taskStatusClass;
    readonly studentStatusClass = studentStatusClass;
    readonly isContractTaskType = isContractTaskType;
    readonly getDaysFromDateString = getDaysFromDateString;

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) {
            this.router.navigate(['/settings/tasks']);
            return;
        }

        const stateTask = history.state?.['task'] as TaskItem | undefined;
        if (stateTask?.id === id) {
            this.task.set(stateTask);
            this.loading.set(false);
            return;
        }

        this.loadTask(id);
    }

    private loadTask(id: string): void {
        this.loading.set(true);
        this.error.set(null);

        this.taskService.getDailyTaskById(id).subscribe({
            next: (task) => {
                this.task.set(task);
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
                this.error.set('Não foi possível carregar os detalhes da tarefa.');
            },
        });
    }

    goBack(): void {
        this.router.navigate(['/settings/tasks']);
    }

    viewStudent(): void {
        const studentId = this.task()?.studentId;
        if (studentId) {
            this.router.navigate(['/schoolar/students', studentId]);
        }
    }

    handleTaskAction(action: TaskAction): void {
        const current = this.task();
        if (!current) return;

        if (action === 'MARK_MEETING') {
            this.meetingDate.set(null);
            this.meetingTitle.set('');
            this.meetingDescription.set('');
            this.meetingDialogVisible.set(true);
            return;
        }

        switch (action) {
            case 'PROCEED':
                this.router.navigate(['/finances/contracts/renew'], {
                    queryParams: {studentId: current.studentId},
                });
                break;
            case 'CREATE_CONTRACT':
                this.router.navigate(['/finances/contracts/create'], {
                    queryParams: {studentId: current.studentId},
                });
                break;
            default:
                this.actionLoading.set(true);
                this.taskService.applyTaskAction(current.id, action).subscribe({
                    next: (updated) => {
                        this.task.set(updated);
                        this.actionLoading.set(false);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Ação aplicada com sucesso.',
                        });
                    },
                    error: () => {
                        this.actionLoading.set(false);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Não foi possível aplicar a ação.',
                        });
                    },
                });
        }
    }

    submitMeeting(): void {
        const current = this.task();
        const date = this.meetingDate();
        if (!current || !date || !this.meetingTitle().trim()) return;

        this.meetingSubmitting.set(true);
        const pad = (n: number) => String(n).padStart(2, '0');
        const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

        this.taskService.applyTaskAction(current.id, 'MARK_MEETING', {
            date: dateStr,
            title: this.meetingTitle().trim(),
            description: this.meetingDescription().trim(),
        }).subscribe({
            next: (updated) => {
                this.task.set(updated);
                this.meetingSubmitting.set(false);
                this.meetingDialogVisible.set(false);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Reunião marcada com sucesso.',
                });
            },
            error: () => {
                this.meetingSubmitting.set(false);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível marcar a reunião.',
                });
            },
        });
    }

    closeMeetingDialog(): void {
        this.meetingDialogVisible.set(false);
    }

    actionIcon(action: TaskAction): string {
        const icons: Partial<Record<TaskAction, string>> = {
            PROCEED: 'pi pi-arrow-right',
            CREATE_CONTRACT: 'pi pi-file-plus',
            PROCEED_WITH_PENDING_PAYMENT: 'pi pi-arrow-circle-right',
            BILLING_CALL: 'pi pi-phone',
            REMIND: 'pi pi-bell',
            MARK_MEETING: 'pi pi-calendar',
            EXTEND_PAYMENT: 'pi pi-clock',
            SUSPEND: 'pi pi-ban',
            COMPLETE: 'pi pi-check',
            IGNORE: 'pi pi-times',
            DELETE: 'pi pi-trash',
        };
        return icons[action] ?? 'pi pi-cog';
    }

    actionSeverity(action: TaskAction): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | undefined {
        const map: Partial<Record<TaskAction, 'success' | 'info' | 'warn' | 'danger' | 'secondary'>> = {
            PROCEED: 'success',
            CREATE_CONTRACT: 'success',
            COMPLETE: 'success',
            BILLING_CALL: 'info',
            REMIND: 'info',
            MARK_MEETING: 'info',
            EXTEND_PAYMENT: 'secondary',
            PROCEED_WITH_PENDING_PAYMENT: 'warn',
            IGNORE: 'warn',
            SUSPEND: 'danger',
            DELETE: 'danger',
        };
        return map[action];
    }
}
