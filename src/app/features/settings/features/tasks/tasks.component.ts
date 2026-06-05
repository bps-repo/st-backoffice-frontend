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
import {ButtonModule} from 'primeng/button';
import {BadgeModule} from 'primeng/badge';
import {TooltipModule} from 'primeng/tooltip';
import {RippleModule} from 'primeng/ripple';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {Router, RouterModule} from '@angular/router';
import {TaskAction, TaskItem, TaskType} from '../../../../core/models/task-item.model';
import {TaskService} from '../../../../core/services/task.service';

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
        ButtonModule,
        BadgeModule,
        TooltipModule,
        RippleModule,
        RouterModule,
        ProgressSpinnerModule,
    ],
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
    private taskService = inject(TaskService);
    private router = inject(Router);

    readonly tasks = signal<TaskItem[]>([]);
    readonly loading = signal(false);
    readonly currentView = signal<TaskType>('NO_ACTIVE_CONTRACT');

    protected readonly Math = Math;

    readonly viewOptions: {label: string; value: TaskType}[] = [
        {label: 'Sem contrato activo',  value: 'NO_ACTIVE_CONTRACT'},
        {label: 'Sem nível activado',   value: 'LEVEL_NEEDS_ACTIVATION'},
        {label: 'Pagamentos vencidos',  value: 'INSTALLMENT_OVERDUE'},
        {label: 'Pagamentos a vencer',  value: 'INSTALLMENT_DUE_SOON'},
        {label: 'Término de contrato',  value: 'CONTRACT_ENDING_SOON'},
        {label: 'Ausências longas',     value: 'LONG_ABSENCE'},
    ];

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
        this.loadTasks();
    }

    setView(value: string) {
        this.currentView.set(value as TaskType);
    }

    loadTasks() {
        this.loading.set(true);
        this.taskService.getDailyTasks().subscribe({
            next: tasks => {
                this.tasks.set(tasks);
                this.loading.set(false);
            },
            error: () => this.loading.set(false),
        });
    }

    handleTaskAction(task: TaskItem, action: TaskAction) {
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

    getLevelName(level: {id: string; name: string} | null): string {
        return level?.name ?? '-';
    }

    getDaysFromDateString(dateString: string): number {
        const today = new Date();
        const target = new Date(dateString);
        today.setHours(0, 0, 0, 0);
        target.setHours(0, 0, 0, 0);
        return Math.round((target.getTime() - today.getTime()) / 86_400_000);
    }
}
