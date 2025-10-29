import {
    Component,
    OnInit,
    OnDestroy,
    TemplateRef,
    ViewChild,
    AfterViewInit,
    ElementRef,
    HostListener
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {
    TableColumn,
    GlobalTable,
} from 'src/app/shared/components/tables/global-table/global-table.component';
import {Student, StudentStatus} from 'src/app/core/models/academic/student';
import {Store} from '@ngrx/store';

import {Observable, Subject, take, map} from 'rxjs';
import {ChartModule} from 'primeng/chart';
import {ButtonModule} from 'primeng/button';
import {COLUMNS, GLOBAL_FILTERS, HEADER_ACTIONS} from "../../constants";
import {TableHeaderAction} from "../../../../../../shared/components/tables/global-table/table-header.component";
import * as StudentSelectors from "../../../../../../core/store/schoolar/students/students.selectors";
import {StudentsActions} from "../../../../../../core/store/schoolar/students/students.actions";
import {StudentState} from "../../../../../../core/store/schoolar/students/student.state";
import {RippleModule} from "primeng/ripple";
import {TooltipModule} from "primeng/tooltip";
import * as LevelSelectors from "../../../../../../core/store/schoolar/level/level.selector";
import * as CenterSelectors from "../../../../../../core/store/corporate/center/centers.selector";
import {LevelActions} from "../../../../../../core/store/schoolar/level/level.actions";
import {CenterActions} from "../../../../../../core/store/corporate/center/centers.actions";
import {BadgeModule} from "primeng/badge";
import {KpiIndicatorsComponent} from "../../../../../../shared/kpi-indicator/kpi-indicator.component";
import {Kpi} from "../../../../../../shared/kpi-indicator/kpi-indicator.component";
import {CalendarModule} from "primeng/calendar";
import {ChipsModule} from "primeng/chips";
import {SelectButtonModule} from "primeng/selectbutton";
import {FormsModule} from "@angular/forms";
import {StudentsDashboardComponent} from "../../../dashboard/components/students/student-dashboard.component";
import {StudentReports} from "../../../reports/components/student/student-reports.component";
import {HasPermissionPipe} from 'src/app/shared/pipes';
import {HasPermissionDirective} from 'src/app/shared/directives';

@Component({
    selector: 'schoolar-students-list',
    imports: [
        CommonModule,
        RouterModule,
        GlobalTable,
        ChartModule,
        ButtonModule,
        RippleModule,
        TooltipModule,
        BadgeModule,
        KpiIndicatorsComponent,
        CalendarModule,
        ChipsModule,
        SelectButtonModule,
        FormsModule,
        StudentsDashboardComponent,
        StudentReports,
        HasPermissionDirective
    ],
    templateUrl: './list.component.html',
})
export class ListComponent implements OnInit, OnDestroy, AfterViewInit {

    // Custom Templates for the table
    @ViewChild('nameTemplate', {static: true})
    nameTemplate!: TemplateRef<any>;

    @ViewChild('dateOfBirthTemplate', {static: true})
    dateOfBirthTemplate!: TemplateRef<any>;

    @ViewChild('emailTemplate', {static: true})
    emailTemplate!: TemplateRef<any>;

    @ViewChild('phoneTemplate', {static: true})
    phoneTemplate!: TemplateRef<any>;

    @ViewChild('actionsTemplate', {static: true})
    actionsTemplate!: TemplateRef<any>;

    @ViewChild('centerTemplate', {static: true})
    centerTemplate!: TemplateRef<any>;

    @ViewChild('levelTemplate', {static: true})
    levelTemplate!: TemplateRef<any>;

    @ViewChild('statusTemplate', {static: true})
    statusTemplate!: TemplateRef<any>;

    @ViewChild('typeTemplate', {static: true})
    typeTemplate!: TemplateRef<any>;

    // References to sticky header elements
    @ViewChild('mainHeader', {static: false})
    mainHeader!: ElementRef;

    @ViewChild('viewSelector', {static: false})
    viewSelector!: ElementRef;

    // Sticky state tracking
    isMainHeaderSticky: boolean = false;

    isViewSelectorSticky: boolean = false;

    students$!: Observable<Student[]>;

    loading$: Observable<boolean>;

    columns: TableColumn[] = COLUMNS;

    globalFilterFields: string[] = GLOBAL_FILTERS;

    customTemplates: Record<string, TemplateRef<any>> = {};

    headerActions: TableHeaderAction[] = HEADER_ACTIONS;

    chartOptions: any;

    // View selection
    currentView: string = 'list'; // Default view is list

    viewOptions = [
        {label: 'Lista de alunos', value: 'list'},
        {label: 'Relatórios', value: 'reports'},
        {label: 'Dashboard', value: 'dashboard'},
    ];

    private destroy$ = new Subject<void>();

    // KPIs derived from students data
    kpis$!: Observable<Kpi[]>;

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
            // Header is sticky when its top position is 0
            this.isMainHeaderSticky = mainHeaderRect.top <= 0;
        }

        if (this.viewSelector && this.viewSelector.nativeElement) {
            const viewSelectorRect = this.viewSelector.nativeElement.getBoundingClientRect();
            // View selector is sticky when its top position is at its sticky position (80px)
            this.isViewSelectorSticky = viewSelectorRect.top <= 80;
        }
    }

    constructor(
        private store: Store<StudentState>,
        private router: Router
    ) {
        // Use the entity selectors
        this.students$ = this.store.select(StudentSelectors.selectAllStudents)

        this.loading$ = this.store.select(StudentSelectors.selectLoading);

        this.store.select(StudentSelectors.selectIds).subscribe(selectedStudentIds => {
            console.log(selectedStudentIds)
        })

        // Initialize chart options
        this.chartOptions = {
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#495057'
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        };

        // Build KPI indicators dynamically from students data
        this.kpis$ = this.students$.pipe(
            map((students: Student[]) => {
                const total = students.length;
                const active = students.filter(s => s.status === StudentStatus.ACTIVE).length;
                const inactive = students.filter(s => s.status === StudentStatus.INACTIVE).length;
                const renewing = students.filter(s => s.status === StudentStatus.PENDING_PAYMENT).length;
                const vip = students.filter(s => !!s.vip).length;
                const standard = students.filter(s => !s.vip).length;

                const kpis: Kpi[] = [
                    {
                        label: 'Total de Alunos',
                        value: total,
                        icon: {label: 'users', color: 'text-blue-500', type: 'mat'},
                    },
                    {
                        label: 'Ativos',
                        value: active,
                        icon: {label: 'user-check', color: 'text-green-500', type: 'mat'},
                    },
                    {
                        label: 'Inativos',
                        value: inactive,
                        icon: {label: 'user-cancel', color: 'text-red-500', type: 'mat'},
                    },
                    {
                        label: 'Em renovação',
                        value: renewing,
                        icon: {label: 'exclamation-circle', color: 'text-orange-500'},
                    },
                    {
                        label: 'VIP',
                        value: vip,
                        icon: {label: 'graduation-cap', color: 'text-purple-500'},
                    },
                    {
                        label: 'Standard',
                        value: standard,
                        icon: {label: 'calendar', color: 'text-secondary'},
                    },
                ];

                return kpis;
            })
        );
    }

    ngOnInit(): void {
        // Dispatch action to load students
        this.store.dispatch(LevelActions.loadLevels({}))
        this.store.dispatch(CenterActions.loadCenters());
        this.store.dispatch(StudentsActions.loadStudents());
        this.headerActions.push(
            {
                label: "Adicionar ao Centro",
                icon: "pi pi-plus",
                command: () => this.router.navigate(['/schoolar/students/add-to-center']).then(),
            },
            {
                label: 'Adicionar à turma',
                icon: 'pi pi-plus',
                command: () => this.router.navigate(['/schoolar/students/add-to-class']).then(r => null)
            },
            {
                label: "Criar contracto",
                icon: "pi pi-file",
                command: () => this.router.navigate(['/schoolar/students/create-contract']).then(),
            },
        )
    }

    ngAfterViewInit() {
        this.customTemplates = {
            name: this.nameTemplate,
            birthdate: this.dateOfBirthTemplate,
            email: this.emailTemplate,
            phone: this.phoneTemplate,
            actions: this.actionsTemplate,
            centerId: this.centerTemplate,
            levelId: this.levelTemplate,
            status: this.statusTemplate,
            vip: this.typeTemplate,
        };

        // Initialize sticky state check after view is initialized
        setTimeout(() => {
            this.checkStickyState();
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onRowSelect($event: Student) {
        this.router.navigate(['/schoolar/students', $event.id]).then();
    }

    navigateToCreateStudent() {
        this.router.navigate(['/schoolar/students/create']).then();
    }

    navigateToEditStudent(id: string) {

    }

    protected StudentStatus = StudentStatus
    protected readonly Math = Math;
}
