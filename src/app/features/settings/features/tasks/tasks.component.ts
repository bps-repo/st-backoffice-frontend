import {Component, OnInit, ViewChild, TemplateRef, AfterViewInit, ElementRef, HostListener} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Task} from './models/task.model';
import {SelectButtonModule} from 'primeng/selectbutton';
import {TableModule} from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {BadgeModule} from 'primeng/badge';
import {TooltipModule} from 'primeng/tooltip';
import {TableColumn} from 'src/app/shared/components/tables/global-table/global-table.component';
import {RippleModule} from "primeng/ripple";

@Component({
    selector: 'app-tasks',
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
        RippleModule
    ],
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit, AfterViewInit {
    tasks: Task[] = [];

    // Task counts for each category
    contratosTerminadosCount: number = 0;
    parcelasVencerCount: number = 0;
    parcelasVencidasCount: number = 0;
    ausenciasLongasCount: number = 0;

    // Make Math available to the template
    protected readonly Math = Math;

    // View selection
    currentView: string = 'contratos_terminados'; // Default view is terminated contracts

    viewOptions = [
        {label: 'Contratos terminados', value: 'contratos_terminados'},
        {label: 'Parcelas a vencer', value: 'parcelas_vencer'},
        {label: 'Parcelas vencidas', value: 'parcelas_vencidas'},
        {label: 'Ausências longas', value: 'ausencias_longas'}
    ];

    // Table columns
    columns: TableColumn[] = [
        {field: 'id', header: 'ID'},
        {field: 'title', header: 'Título'},
        {field: 'description', header: 'Descrição'},
        {field: 'status', header: 'Status'},
        {field: 'priority', header: 'Prioridade'},
        {field: 'dueDate', header: 'Data de Vencimento'},
        {field: 'assignedTo', header: 'Responsável'},
        {field: 'category', header: 'Categoria'}
    ];

    globalFilterFields: string[] = ['title', 'description', 'assignedTo', 'category'];
    customTemplates: Record<string, TemplateRef<any>> = {};

    // References to sticky header elements
    @ViewChild('mainHeader', {static: false})
    mainHeader!: ElementRef;

    @ViewChild('viewSelector', {static: false})
    viewSelector!: ElementRef;

    // Sticky state tracking
    isMainHeaderSticky: boolean = false;
    isViewSelectorSticky: boolean = false;

    // Status templates
    @ViewChild('statusTemplate', {static: true})
    statusTemplate!: TemplateRef<any>;

    @ViewChild('priorityTemplate', {static: true})
    priorityTemplate!: TemplateRef<any>;

    @ViewChild('dueDateTemplate', {static: true})
    dueDateTemplate!: TemplateRef<any>;

    @ViewChild('actionsTemplate', {static: true})
    actionsTemplate!: TemplateRef<any>;

    // Method to handle view selection
    onViewChange(event: any) {
        this.currentView = event.value;
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
                return this.tasks.filter(task => task.category === 'Parcela Vencida');
            case 'ausencias_longas':
                return this.tasks.filter(task => task.category === 'Ausência Longa');
            default:
                return this.tasks;
        }
    }

    // Update task counts
    updateTaskCounts(): void {
        this.contratosTerminadosCount = this.tasks.filter(task => task.category === 'Contrato Terminado').length;
        this.parcelasVencerCount = this.tasks.filter(task => task.category === 'Parcela a Vencer').length;
        this.parcelasVencidasCount = this.tasks.filter(task => task.category === 'Parcela Vencida').length;
        this.ausenciasLongasCount = this.tasks.filter(task => task.category === 'Ausência Longa').length;
    }

    ngOnInit() {
        // Inicializar com algumas tarefas de exemplo
        this.tasks = [
            {
                id: '1',
                title: 'Contrato de João Silva',
                description: 'Contrato de curso de inglês terminado em 01/08/2025',
                status: 'PENDENTE',
                priority: 'ALTA',
                dueDate: new Date(new Date().setDate(new Date().getDate() - 5)),
                createdAt: new Date(),
                updatedAt: new Date(),
                assignedTo: 'Maria Oliveira',
                category: 'Contrato Terminado'
            },
            {
                id: '2',
                title: 'Contrato de Ana Pereira',
                description: 'Contrato de curso de espanhol terminado em 30/07/2025',
                status: 'PENDENTE',
                priority: 'MEDIA',
                dueDate: new Date(new Date().setDate(new Date().getDate() - 7)),
                createdAt: new Date(),
                updatedAt: new Date(),
                assignedTo: 'Carlos Santos',
                category: 'Contrato Terminado'
            },
            {
                id: '3',
                title: 'Parcela 3/10 de Pedro Costa',
                description: 'Terceira parcela do curso de francês com vencimento próximo',
                status: 'PENDENTE',
                priority: 'MEDIA',
                dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
                createdAt: new Date(),
                updatedAt: new Date(),
                assignedTo: 'Lucia Mendes',
                category: 'Parcela a Vencer'
            },
            {
                id: '4',
                title: 'Parcela 5/12 de Mariana Souza',
                description: 'Quinta parcela do curso de alemão com vencimento próximo',
                status: 'PENDENTE',
                priority: 'BAIXA',
                dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
                createdAt: new Date(),
                updatedAt: new Date(),
                assignedTo: 'Roberto Alves',
                category: 'Parcela a Vencer'
            },
            {
                id: '5',
                title: 'Parcela 2/8 de Lucas Ferreira',
                description: 'Segunda parcela do curso de italiano vencida há 10 dias',
                status: 'PENDENTE',
                priority: 'ALTA',
                dueDate: new Date(new Date().setDate(new Date().getDate() - 10)),
                createdAt: new Date(),
                updatedAt: new Date(),
                assignedTo: 'Camila Rocha',
                category: 'Parcela Vencida'
            },
            {
                id: '6',
                title: 'Parcela 7/10 de Juliana Lima',
                description: 'Sétima parcela do curso de japonês vencida há 15 dias',
                status: 'PENDENTE',
                priority: 'ALTA',
                dueDate: new Date(new Date().setDate(new Date().getDate() - 15)),
                createdAt: new Date(),
                updatedAt: new Date(),
                assignedTo: 'Fernando Silva',
                category: 'Parcela Vencida'
            },
            {
                id: '7',
                title: 'Ausência de Rafael Martins',
                description: 'Aluno ausente há 25 dias nas aulas de inglês avançado',
                status: 'PENDENTE',
                priority: 'MEDIA',
                dueDate: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
                assignedTo: 'Patricia Gomes',
                category: 'Ausência Longa'
            },
            {
                id: '8',
                title: 'Ausência de Carolina Santos',
                description: 'Aluna ausente há 30 dias nas aulas de espanhol intermediário',
                status: 'PENDENTE',
                priority: 'ALTA',
                dueDate: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
                assignedTo: 'Marcos Oliveira',
                category: 'Ausência Longa'
            }
        ];

        // Update task counts
        this.updateTaskCounts();
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
