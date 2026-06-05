import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
    OnInit,
    ViewChild,
    computed,
    inject,
    signal,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SelectButtonModule} from 'primeng/selectbutton';
import {TableModule} from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextarea} from 'primeng/inputtextarea';
import {ButtonModule} from 'primeng/button';
import {BadgeModule} from 'primeng/badge';
import {TooltipModule} from 'primeng/tooltip';
import {RippleModule} from 'primeng/ripple';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {DropdownModule} from 'primeng/dropdown';
import {DialogModule} from 'primeng/dialog';
import {DatePickerModule} from 'primeng/datepicker';
import {Router, RouterModule} from '@angular/router';
import {TaskAction, TaskItem, TaskStatus, TaskType} from '../../../../core/models/task-item.model';
import {TaskService} from '../../../../core/services/task.service';
import {CenterService} from '../../../../core/services/center.service';
import {Center} from '../../../../core/models/corporate/center';
import {
    TASK_STATUS_LABELS,
    getDaysFromDateString,
    taskStatusClass,
} from './task-presenter';

@Component({
    selector: 'settings-tasks',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        FormsModule,
        SelectButtonModule,
        TableModule,
        InputTextModule,
        InputTextarea,
        ButtonModule,
        BadgeModule,
        TooltipModule,
        RippleModule,
        RouterModule,
        ProgressSpinnerModule,
        DropdownModule,
        DialogModule,
        DatePickerModule,
    ],
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
    private taskService = inject(TaskService);
    private centerService = inject(CenterService);
    private router = inject(Router);

    readonly tasks = signal<TaskItem[]>([]);
    readonly loading = signal(false);
    readonly currentView = signal<TaskType>('NO_ACTIVE_CONTRACT');
    readonly selectedStatus = signal<TaskStatus>('OPEN');
    readonly selectedCenterId = signal<string | null>(null);
    readonly centers = signal<Center[]>([]);

    readonly meetingDialogVisible = signal(false);
    readonly meetingSubmitting = signal(false);
    readonly pendingMeetingTask = signal<TaskItem | null>(null);
    readonly meetingDate = signal<Date | null>(null);
    readonly meetingTitle = signal('');
    readonly meetingDescription = signal('');

    protected readonly Math = Math;
    readonly today = new Date();

    readonly viewOptions: {label: string; value: TaskType}[] = [
        {label: 'Sem contrato activo',  value: 'NO_ACTIVE_CONTRACT'},
        {label: 'Sem nível activado',   value: 'LEVEL_NEEDS_ACTIVATION'},
        {label: 'Pagamentos vencidos',  value: 'INSTALLMENT_OVERDUE'},
        {label: 'Pagamentos a vencer',  value: 'INSTALLMENT_DUE_SOON'},
        {label: 'Término de contrato',  value: 'CONTRACT_ENDING_SOON'},
        {label: 'Ausências longas',     value: 'LONG_ABSENCE'},
    ];

    readonly statusOptions: {label: string; value: TaskStatus}[] = [
        {label: 'Aberta',       value: 'OPEN'},
        {label: 'Em progresso', value: 'IN_PROGRESS'},
        {label: 'Concluída',    value: 'COMPLETED'},
        {label: 'Ignorada',     value: 'IGNORED'},
        {label: 'Adiada',       value: 'SNOOZED'},
    ];

    readonly centerOptions = computed(() => [
        {label: 'Todos os centros', value: null},
        ...this.centers().map(c => ({label: c.name, value: c.id})),
    ]);

    readonly filteredTasks = computed(() =>
        this.tasks().filter(t => t.taskType === this.currentView())
    );

    readonly taskCountByType = computed(() => {
        const counts: Record<string, number> = {};
        for (const task of this.tasks()) {
            counts[task.taskType] = (counts[task.taskType] ?? 0) + 1;
        }
        return counts;
    });

    readonly isContractView = computed(() =>
        (['INSTALLMENT_OVERDUE', 'INSTALLMENT_DUE_SOON', 'CONTRACT_ENDING_SOON'] as TaskType[])
            .includes(this.currentView())
    );

    readonly showDelayColumn = computed(() => this.currentView() === 'INSTALLMENT_OVERDUE');

    readonly showStudentStatusColumn = computed(() =>
        (['NO_ACTIVE_CONTRACT', 'LEVEL_NEEDS_ACTIVATION', 'LONG_ABSENCE'] as TaskType[])
            .includes(this.currentView())
    );

    globalFilterFields = ['studentName', 'studentCode', 'center.name', 'level.name', 'description'];

    @ViewChild('mainHeader', {static: false}) mainHeader!: ElementRef;
    @ViewChild('viewSelector', {static: false}) viewSelector!: ElementRef;

    isMainHeaderSticky = false;
    isViewSelectorSticky = false;

    @HostListener('window:scroll')
    onWindowScroll() {
        if (this.mainHeader?.nativeElement) {
            this.isMainHeaderSticky = this.mainHeader.nativeElement.getBoundingClientRect().top <= 0;
        }
        if (this.viewSelector?.nativeElement) {
            this.isViewSelectorSticky = this.viewSelector.nativeElement.getBoundingClientRect().top <= 80;
        }
    }

    ngOnInit() {
        this.centerService.getAllCenters().subscribe(centers => this.centers.set(centers));
        this.loadTasks();
    }

    setView(value: string) {
        this.currentView.set(value as TaskType);
    }

    setStatus(status: TaskStatus) {
        this.selectedStatus.set(status);
        this.loadTasks();
    }

    setCenterId(centerId: string | null) {
        this.selectedCenterId.set(centerId);
        this.loadTasks();
    }

    loadTasks() {
        this.loading.set(true);
        const centerId = this.selectedCenterId() ?? undefined;
        this.taskService.getDailyTasks(this.selectedStatus(), centerId).subscribe({
            next: tasks => {
                this.tasks.set(tasks);
                this.loading.set(false);
            },
            error: () => this.loading.set(false),
        });
    }

    taskStatusClass = taskStatusClass;

    taskStatusLabel(status: TaskStatus): string {
        return TASK_STATUS_LABELS[status] ?? status;
    }

    viewTask(task: TaskItem): void {
        this.router.navigate(['/settings/tasks', task.id], {state: {task}});
    }

    handleTaskAction(task: TaskItem, action: TaskAction) {
        if (action === 'MARK_MEETING') {
            this.pendingMeetingTask.set(task);
            this.meetingDate.set(null);
            this.meetingTitle.set('');
            this.meetingDescription.set('');
            this.meetingDialogVisible.set(true);
            return;
        }

        switch (action) {
            case 'PROCEED':
                this.router.navigate(['/finances/contracts/renew'], {queryParams: {studentId: task.studentId}});
                break;
            case 'CREATE_CONTRACT':
                this.router.navigate(['/finances/contracts/create'], {queryParams: {studentId: task.studentId}});
                break;
            default:
                this.taskService.applyTaskAction(task.id, action).subscribe({
                    next: updated => {
                        this.tasks.update(all => all.map(t => t.id === updated.id ? updated : t));
                    },
                });
        }
    }

    submitMeeting() {
        const task = this.pendingMeetingTask();
        const date = this.meetingDate();
        if (!task || !date || !this.meetingTitle().trim()) return;

        this.meetingSubmitting.set(true);
        const pad = (n: number) => String(n).padStart(2, '0');
        const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

        this.taskService.applyTaskAction(task.id, 'MARK_MEETING', {
            date: dateStr,
            title: this.meetingTitle().trim(),
            description: this.meetingDescription().trim(),
        }).subscribe({
            next: updated => {
                this.tasks.update(all => all.map(t => t.id === updated.id ? updated : t));
                this.meetingSubmitting.set(false);
                this.meetingDialogVisible.set(false);
            },
            error: () => this.meetingSubmitting.set(false),
        });
    }

    closeMeetingDialog() {
        this.meetingDialogVisible.set(false);
        this.pendingMeetingTask.set(null);
    }

    getLevelName(level: {id: string; name: string} | null): string {
        return level?.name ?? '-';
    }

    getDaysFromDateString = getDaysFromDateString;
}
