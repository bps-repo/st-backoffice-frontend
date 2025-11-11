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
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
    TableColumn,
    GlobalTable,
} from 'src/app/shared/components/tables/global-table/global-table.component';
import { Student, StudentStatus } from 'src/app/core/models/academic/student';
import { Store } from '@ngrx/store';

import { Observable, Subject, take, debounceTime, distinctUntilChanged, takeUntil, BehaviorSubject, map, of } from 'rxjs';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { COLUMNS, GLOBAL_FILTERS, HEADER_ACTIONS } from "../../constants";
import { TableHeaderAction } from "../../../../../../shared/components/tables/global-table/table-header.component";
import * as StudentSelectors from "../../../../../../core/store/schoolar/students/students.selectors";
import { StudentsActions } from "../../../../../../core/store/schoolar/students/students.actions";
import { RippleModule } from "primeng/ripple";
import { TooltipModule } from "primeng/tooltip";
import * as LevelSelectors from "../../../../../../core/store/schoolar/level/level.selector";
import * as CenterSelectors from "../../../../../../core/store/corporate/center/centers.selector";
import { LevelActions } from "../../../../../../core/store/schoolar/level/level.actions";
import { CenterActions } from "../../../../../../core/store/corporate/center/centers.actions";
import { BadgeModule } from "primeng/badge";
import { KpiIndicatorsComponent } from "../../../../../../shared/kpi-indicator/kpi-indicator.component";
import { Kpi } from "../../../../../../shared/kpi-indicator/kpi-indicator.component";
import { CalendarModule } from "primeng/calendar";
import { ChipsModule } from "primeng/chips";
import { SelectButtonModule } from "primeng/selectbutton";
import { InputTextModule } from "primeng/inputtext";
import { DropdownModule } from "primeng/dropdown";
import { FormsModule } from "@angular/forms";
import { StudentsDashboardComponent } from "../../../dashboard/components/students/student-dashboard.component";
import { StudentReports } from "../../../reports/components/student/student-reports.component";
import { SelectItem } from 'primeng/api';
import { LocationActions } from 'src/app/core/store/location/location.actions';
import * as LocationSelectors from 'src/app/core/store/location/location.selectors';
import { AppState } from 'src/app/core/store';

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
        InputTextModule,
        DropdownModule,
        FormsModule,
        StudentsDashboardComponent,
        StudentReports,
    ],
    templateUrl: './list.component.html',
})
export class ListComponent implements OnInit, OnDestroy, AfterViewInit {

    isSearchMode$ = new BehaviorSubject<boolean>(false);

    // Custom Templates for the table
    @ViewChild('nameTemplate', { static: true })
    nameTemplate!: TemplateRef<any>;

    @ViewChild('dateOfBirthTemplate', { static: true })
    dateOfBirthTemplate!: TemplateRef<any>;

    @ViewChild('emailTemplate', { static: true })
    emailTemplate!: TemplateRef<any>;

    @ViewChild('phoneTemplate', { static: true })
    phoneTemplate!: TemplateRef<any>;

    @ViewChild('actionsTemplate', { static: true })
    actionsTemplate!: TemplateRef<any>;

    @ViewChild('centerTemplate', { static: true })
    centerTemplate!: TemplateRef<any>;

    @ViewChild('levelTemplate', { static: true })
    levelTemplate!: TemplateRef<any>;

    @ViewChild('statusTemplate', { static: true })
    statusTemplate!: TemplateRef<any>;

    @ViewChild('typeTemplate', { static: true })
    typeTemplate!: TemplateRef<any>;

    @ViewChild('statusFilterTemplate', { static: true })
    statusFilterTemplate!: TemplateRef<any>;

    @ViewChild('centerFilterTemplate', { static: true })
    centerFilterTemplate!: TemplateRef<any>;

    @ViewChild('levelFilterTemplate', { static: true })
    levelFilterTemplate!: TemplateRef<any>;

    // References to sticky header elements
    @ViewChild('mainHeader', { static: false })
    mainHeader!: ElementRef;

    @ViewChild('viewSelector', { static: false })
    viewSelector!: ElementRef;

    // Sticky state tracking
    isMainHeaderSticky: boolean = false;

    isViewSelectorSticky: boolean = false;

    students$!: Observable<Student[]>;
    centers$!: Observable<any[]>;
    levels$!: Observable<any[]>;

    loading$: Observable<boolean>;

    // Filter options
    statusOptions = [
        { label: 'Ativo', value: 'ACTIVE' },
        { label: 'Inativo', value: 'INACTIVE' },
        { label: 'Em renovação', value: 'PENDING_PAYMENT' },
        { label: 'Desistiu', value: 'DROPPED_OUT' },
        { label: 'Saiu', value: 'QUIT' },
    ];
    provinces$!: Observable<SelectItem[]>;
    municipalities$!: Observable<SelectItem[]>;
    loadingProvinces$!: Observable<boolean>;
    loadingMunicipalities$!: Observable<boolean>;

    columns: TableColumn[] = COLUMNS;

    globalFilterFields: string[] = GLOBAL_FILTERS;

    customTemplates: Record<string, TemplateRef<any>> = {};
    filterTemplates: Record<string, TemplateRef<any>> = {};

    headerActions: TableHeaderAction[] = HEADER_ACTIONS;

    chartOptions: any;

    // View selection
    currentView: string = 'list'; // Default view is list

    viewOptions = [
        { label: 'Lista de alunos', value: 'list' },
        { label: 'Relatórios', value: 'reports' },
        { label: 'Dashboard', value: 'dashboard' },
    ];

    // Search form
    searchTerm: string = '';
    searchFilters: {
        status?: string;
        centerId?: string;
        levelId?: string;
        unitId?: string;
        code?: number;
        email?: string;
        username?: string;
        province?: string;
        municipality?: string;
    } = {};
    selectedProvince: string | null = null;
    selectedMunicipality: string | null = null;

    private destroy$ = new Subject<void>();
    private searchSubject$ = new Subject<string>();

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
        private store: Store<AppState>,
        private router: Router
    ) {
        // Use the entity selectors
        this.students$ = this.store.select(StudentSelectors.selectAllStudents);
        this.centers$ = this.store.select(CenterSelectors.selectAllCenters);
        this.levels$ = this.store.select(LevelSelectors.selectAllLevels);

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
                        icon: { label: 'users', color: 'text-blue-500', type: 'mat' },
                    },
                    {
                        label: 'Ativos',
                        value: active,
                        icon: { label: 'user-check', color: 'text-green-500', type: 'mat' },
                    },
                    {
                        label: 'Inativos',
                        value: inactive,
                        icon: { label: 'user-cancel', color: 'text-red-500', type: 'mat' },
                    },
                    {
                        label: 'Em renovação',
                        value: renewing,
                        icon: { label: 'exclamation-circle', color: 'text-orange-500' },
                    },
                    {
                        label: 'VIP',
                        value: vip,
                        icon: { label: 'graduation-cap', color: 'text-purple-500' },
                    },
                    {
                        label: 'Standard',
                        value: standard,
                        icon: { label: 'calendar', color: 'text-secondary' },
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
        this.initializeLocationSelectors();
        this.loadProvinces();
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
        );

        // Setup search debounce
        this.searchSubject$.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            takeUntil(this.destroy$)
        ).subscribe(searchTerm => {
            if (searchTerm.trim()) {
                this.performSearch(searchTerm);
            } else {
                this.clearSearch();
            }
        });

        // Listen to search results for debugging
        this.store.select(StudentSelectors.selectAllStudents).pipe(
            takeUntil(this.destroy$)
        ).subscribe(students => {
            console.log("Students in store:", students.length, students);
        });
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

        this.filterTemplates = {
            status: this.statusFilterTemplate,
            centerId: this.centerFilterTemplate,
            levelId: this.levelFilterTemplate,
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

    onSearchInput(event: any): void {
        const value = event.target?.value || '';
        this.searchTerm = value;
        this.searchSubject$.next(value);
    }

    onSearch(): void {
        if (this.searchTerm.trim()) {
            this.performSearch(this.searchTerm);
        } else {
            this.clearSearch();
        }
    }

    private performSearch(searchTerm: string): void {
        this.isSearchMode$.next(true);

        // Build search filters
        const filters: any = {};

        // If search term looks like an email
        if (searchTerm.includes('@')) {
            filters.email = searchTerm;
        }
        // If search term is numeric, try as code
        else if (/^\d+$/.test(searchTerm.trim())) {
            filters.code = parseInt(searchTerm.trim(), 10);
        }
        // Otherwise, try as username
        else {
            filters.username = searchTerm;
        }

        // Merge with existing filters
        const mergedFilters = { ...this.searchFilters, ...filters };

        // Remove empty filters
        Object.keys(mergedFilters).forEach(key => {
            if (mergedFilters[key] === undefined || mergedFilters[key] === null || mergedFilters[key] === '') {
                delete mergedFilters[key];
            }
        });

        this.store.dispatch(StudentsActions.searchStudents({ filters: mergedFilters }));
    }

    clearSearch(): void {
        this.searchTerm = '';
        this.searchFilters = {};
        this.selectedProvince = null;
        this.selectedMunicipality = null;
        this.municipalities$ = of([]);
        this.loadingMunicipalities$ = of(false);
        this.isSearchMode$.next(false);
        this.store.dispatch(StudentsActions.loadStudents());
    }

    onColumnFilter(field: string, value: any): void {
        console.log("onColumnFilter", field, value);

        // Update search filters based on column filter
        if (value === null || value === undefined || value === '') {
            delete this.searchFilters[field as keyof typeof this.searchFilters];
        } else {
            // Map field names if needed
            let filterField = field;
            if (field === 'levelId' || field === 'centerId') {
                filterField = field;
            }
            (this.searchFilters as any)[filterField] = value;
        }

        // Trigger search with updated filters
        const hasFilters = Object.keys(this.searchFilters).length > 0;
        const hasSearchTerm = this.searchTerm.trim().length > 0;

        if (hasFilters || hasSearchTerm) {
            this.performColumnFilter();
        } else {
            this.clearSearch();
        }
    }

    onProvinceFilter(value: string | null): void {
        console.log("onProvinceFilter", value);
        // Clear municipality when province changes
        this.selectedMunicipality = null;
        delete this.searchFilters.municipality;

        if (value === null || value === undefined || value === '') {
            delete this.searchFilters.province;
            this.selectedProvince = null;
            // Reset municipalities when province is cleared
            this.municipalities$ = of([]);
            this.loadingMunicipalities$ = of(false);
        } else {
            this.searchFilters.province = value;
            this.selectedProvince = value;

            // Update municipalities selector for the selected province
            this.municipalities$ = this.store.select(LocationSelectors.selectMunicipalitiesByProvinceId(value)).pipe(
                map(municipalities => municipalities.map(m => ({
                    label: m.name,
                    value: m.name.toLowerCase()
                } as SelectItem)))
            );

            // Update loading state for the selected province
            this.loadingMunicipalities$ = this.store.select(LocationSelectors.selectMunicipalitiesLoadingByProvinceId(value));

            // Load municipalities for selected province
            this.loadMunicipalities(value);
        }

        // Trigger search with updated filters
        const hasFilters = Object.keys(this.searchFilters).length > 0;
        const hasSearchTerm = this.searchTerm.trim().length > 0;

        if (hasFilters || hasSearchTerm) {
            this.performColumnFilter();
        } else {
            this.clearSearch();
        }
    }

    onMunicipalityFilter(value: string | null): void {
        if (value === null || value === undefined || value === '') {
            delete this.searchFilters.municipality;
            this.selectedMunicipality = null;
        } else {
            this.searchFilters.municipality = value;
            this.selectedMunicipality = value;
        }

        // Trigger search with updated filters
        const hasFilters = Object.keys(this.searchFilters).length > 0;
        const hasSearchTerm = this.searchTerm.trim().length > 0;

        if (hasFilters || hasSearchTerm) {
            this.performColumnFilter();
        } else {
            this.clearSearch();
        }
    }

    private performColumnFilter(): void {
        this.isSearchMode$.next(true);

        const filters: any = { ...this.searchFilters };

        // Add text search if present
        if (this.searchTerm.trim()) {
            if (this.searchTerm.includes('@')) {
                filters.email = this.searchTerm;
            } else if (/^\d+$/.test(this.searchTerm.trim())) {
                filters.code = parseInt(this.searchTerm.trim(), 10);
            } else {
                filters.username = this.searchTerm;
            }
        }

        // Remove empty filters
        Object.keys(filters).forEach(key => {
            if (filters[key] === undefined || filters[key] === null || filters[key] === '') {
                delete filters[key];
            }
        });

        console.log("Dispatching search with filters:", filters);

        if (Object.keys(filters).length > 0) {
            this.store.dispatch(StudentsActions.searchStudents({ filters }));
        } else {
            this.clearSearch();
        }
    }

    private initializeLocationSelectors() {
        // Initialize provinces observable
        this.provinces$ = this.store.select(LocationSelectors.selectAllProvinces).pipe(
            map(provinces => provinces.map(p => ({ label: p.name, value: p.name } as SelectItem)))
        );

        // Initialize loading states
        this.loadingProvinces$ = this.store.select(LocationSelectors.selectProvincesLoading);

        // Initialize empty municipalities
        this.municipalities$ = of([]);
        this.loadingMunicipalities$ = of(false);
    }

    private loadProvinces() {
        this.store.dispatch(LocationActions.loadProvinces());
    }

    private loadMunicipalities(provinceId: string) {
        this.store.dispatch(LocationActions.loadProvince({ provinceId }));
    }

    protected StudentStatus = StudentStatus
    protected readonly Math = Math;
}
