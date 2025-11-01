import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from './models/task.model';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { TableColumn } from 'src/app/shared/components/tables/global-table/global-table.component';
import { RippleModule } from "primeng/ripple";
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Store } from '@ngrx/store';
import { TasksActions } from '../../../../core/store/settings/tasks/tasks.actions';
import * as TasksSelectors from '../../../../core/store/settings/tasks/tasks.selectors';
import { TaskItem } from '../../../../core/models/task-item.model';
import { Subject, takeUntil } from 'rxjs';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'settings-tasks',
    standalone: true,
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
        ProgressSpinnerModule
    ],
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit, AfterViewInit, OnDestroy {
    tasks: Task[] = [];
    pendingRegistrations: TaskItem[] = [];
    overdueInstallments: TaskItem[] = [];
    private destroy$ = new Subject<void>();

    // Task counts for each category
    contratosTerminadosCount: number = 0;
    parcelasVencerCount: number = 0;
    parcelasVencidasCount: number = 0;
    ausenciasLongasCount: number = 0;
    inscricoesPendentesCount: number = 0;

    // Loading state from store
    loading$ = this.store.select(TasksSelectors.selectTasksLoading);

    // Make Math available to the template
    protected readonly Math = Math;

    // View selection
    currentView: string = 'contratos_terminados'; // Default view is terminated contracts

    viewOptions = [
        { label: 'Contratos terminados', value: 'contratos_terminados' },
        { label: 'Parcelas a vencer', value: 'parcelas_vencer' },
        { label: 'Parcelas vencidas', value: 'parcelas_vencidas' },
        { label: 'Ausências longas', value: 'ausencias_longas' },
        { label: 'Inscrições pendentes', value: 'inscricoes_pendentes' },
    ];

    // Table columns
    columns: TableColumn[] = [
        { field: 'id', header: 'ID' },
        { field: 'title', header: 'Título' },
        { field: 'description', header: 'Descrição' },
        { field: 'status', header: 'Status' },
        { field: 'priority', header: 'Prioridade' },
        { field: 'dueDate', header: 'Data de Vencimento' },
        { field: 'assignedTo', header: 'Responsável' },
        { field: 'category', header: 'Categoria' }
    ];

    globalFilterFields: string[] = ['title', 'description', 'assignedTo', 'category'];
    customTemplates: Record<string, TemplateRef<any>> = {};

    // References to sticky header elements
    @ViewChild('mainHeader', { static: false })
    mainHeader!: ElementRef;

    @ViewChild('viewSelector', { static: false })
    viewSelector!: ElementRef;

    // Sticky state tracking
    isMainHeaderSticky: boolean = false;
    isViewSelectorSticky: boolean = false;

    // Status templates
    @ViewChild('statusTemplate', { static: true })
    statusTemplate!: TemplateRef<any>;

    @ViewChild('priorityTemplate', { static: true })
    priorityTemplate!: TemplateRef<any>;

    @ViewChild('dueDateTemplate', { static: true })
    dueDateTemplate!: TemplateRef<any>;

    @ViewChild('actionsTemplate', { static: true })
    actionsTemplate!: TemplateRef<any>;

    constructor(
        private store: Store,
        private router: Router
    ) { }

    // Method to handle view selection
    onViewChange(event: any) {
        this.currentView = event.value;
        // Reload tasks when switching to inscricoes_pendentes or parcelas_vencidas
        if (this.currentView === 'inscricoes_pendentes' || this.currentView === 'parcelas_vencidas') {
            this.store.dispatch(TasksActions.loadDailyTasks());
        }
    }

    // Listen for scroll events
    @HostListener('window:scroll', ['$event'])
    onWindowScroll() {
        this.checkStickyState();
    }

    // Check if headers are in sticky state
    checkStickyState() {
        if (this.mainHeader && this.mainHeader.nativeElement) {
            const mainHeaderRect = this.mainHeader.nativeElement.getBoundingClientRect();
            this.isMainHeaderSticky = mainHeaderRect.top <= 0;
        }

        if (this.viewSelector && this.viewSelector.nativeElement) {
            const viewSelectorRect = this.viewSelector.nativeElement.getBoundingClientRect();
            this.isViewSelectorSticky = viewSelectorRect.top <= 80;
        }
    }

    // Get filtered tasks based on current view
    get filteredTasks(): Task[] {
        switch (this.currentView) {
            case 'contratos_terminados':
                return this.tasks.filter(task => task.category === 'Contrato Terminado');
            case 'parcelas_vencer':
                return this.tasks.filter(task => task.category === 'Parcela a Vencer');
            case 'parcelas_vencidas':
                return [];
            case 'ausencias_longas':
                return this.tasks.filter(task => task.category === 'Ausência Longa');
            case 'inscricoes_pendentes':
                return [];
            default:
                return this.tasks;
        }
    }

    // Get filtered pending registrations
    get filteredPendingRegistrations(): TaskItem[] {
        if (this.currentView !== 'inscricoes_pendentes') {
            return [];
        }
        return this.pendingRegistrations || [];
    }

    // Get filtered overdue installments
    get filteredOverdueInstallments(): TaskItem[] {
        if (this.currentView !== 'parcelas_vencidas') {
            return [];
        }
        return this.overdueInstallments || [];
    }

    // Check if we should show loading for inscricoes_pendentes or parcelas_vencidas
    get isLoadingPendingRegistrations(): boolean {
        return this.currentView === 'inscricoes_pendentes' || this.currentView === 'parcelas_vencidas';
    }

    // Update task counts
    updateTaskCounts(): void {
        this.contratosTerminadosCount = this.tasks.filter(task => task.category === 'Contrato Terminado').length;
        this.parcelasVencerCount = this.tasks.filter(task => task.category === 'Parcela a Vencer').length;
        this.parcelasVencidasCount = this.overdueInstallments.length;
        this.ausenciasLongasCount = this.tasks.filter(task => task.category === 'Ausência Longa').length;
        this.inscricoesPendentesCount = this.pendingRegistrations.length;
    }

    ngOnInit() {
        // Dispatch action to load daily tasks
        this.store.dispatch(TasksActions.loadDailyTasks());

        // Subscribe to pending registrations
        this.store.select(TasksSelectors.selectPendingRegistrations)
            .pipe(takeUntil(this.destroy$))
            .subscribe(tasks => {
                this.pendingRegistrations = tasks;
                this.updateTaskCounts();
            });

        // Subscribe to overdue installments
        this.store.select(TasksSelectors.selectOverdueInstallments)
            .pipe(takeUntil(this.destroy$))
            .subscribe(tasks => {
                this.overdueInstallments = tasks;
                this.updateTaskCounts();
            });

        // Update task counts
        this.updateTaskCounts();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    ngAfterViewInit() {
        this.customTemplates = {
            status: this.statusTemplate,
            priority: this.priorityTemplate,
            dueDate: this.dueDateTemplate,
            actions: this.actionsTemplate
        };

        // Initialize sticky state check after view is initialized
        setTimeout(() => {
            this.checkStickyState();
        });
    }

    // Action methods
    editTask(task: Task) {
        console.log('Edit task:', task);
    }

    deleteTask(task: Task) {
        console.log('Delete task:', task);
    }

    completeTask(task: Task) {
        console.log('Complete task:', task);
    }

    // Action methods for pending registrations and overdue installments
    handleTaskAction(task: TaskItem, action: string) {
        switch (action) {
            case 'proceed':
                // Navigate to student detail or handle proceed action
                this.router.navigate(['/finances/contracts/renew'], {
                    queryParams: { studentId: task.studentId }
                });
                break;
            case 'create_contract':
                // Navigate to create contract page
                this.router.navigate(['/finances/contracts/create'], {
                    queryParams: { studentId: task.studentId }
                });
                break;
            case 'remind':
                console.log('Remind about installment:', task);
                // Implement remind logic
                break;
            case 'billing_call':
                console.log('Billing call for task:', task);
                // Implement billing call logic
                break;
            case 'complete':
                console.log('Complete task:', task);
                // Implement complete logic
                break;
            case 'delete':
                console.log('Delete task:', task);
                // Implement delete logic
                break;
            case 'ignore':
                console.log('Ignore task:', task);
                // Implement ignore logic
                break;
            default:
                console.log('Unknown action:', action);
        }
    }

    // Helper method to get level name
    getLevelName(level: string | { id: string; name: string } | null): string {
        if (!level) return '-';
        if (typeof level === 'string') return level;
        return level.name;
    }

    // Helper method to format currency
    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'AOA'
        }).format(amount);
    }

    // Calculate days between a date string and today
    getDaysFromDateString(dateString: string): number {
        const today = new Date();
        const targetDate = new Date(dateString);

        // Reset time part for accurate day calculation
        today.setHours(0, 0, 0, 0);
        targetDate.setHours(0, 0, 0, 0);

        // Calculate difference in milliseconds and convert to days
        const diffTime = targetDate.getTime() - today.getTime();
        return Math.round(diffTime / (1000 * 60 * 60 * 24));
    }

    // Calculate days between a date and today
    getDaysFromNow(date: Date): number {
        const today = new Date();
        const targetDate = new Date(date);

        // Reset time part for accurate day calculation
        today.setHours(0, 0, 0, 0);
        targetDate.setHours(0, 0, 0, 0);

        // Calculate difference in milliseconds and convert to days
        const diffTime = targetDate.getTime() - today.getTime();
        return Math.round(diffTime / (1000 * 60 * 60 * 24));
    }
}
