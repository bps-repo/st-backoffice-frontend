import { Component, OnInit, OnDestroy, TemplateRef, ViewChild, AfterViewInit, ElementRef, HostListener, inject } from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {
    TableColumn,
    GlobalTable,
} from 'src/app/shared/components/tables/global-table/global-table.component';
import {Student, StudentStatus} from 'src/app/core/models/academic/students/student';
import {Store} from '@ngrx/store';

import {Observable, Subject, take, debounceTime, distinctUntilChanged, takeUntil, BehaviorSubject, map, of} from 'rxjs';
import {ChartModule} from 'primeng/chart';
import {ButtonModule} from 'primeng/button';
import {buildStudentListKpis, COLUMNS, GLOBAL_FILTERS, HEADER_ACTIONS} from "../../constants";
import {TableHeaderAction} from "../../../../../../shared/components/tables/global-table/table-header.component";
import * as StudentSelectors from "../../../../../../core/store/schoolar/students/students.selectors";
import {StudentsActions} from "../../../../../../core/store/schoolar/students/students.actions";
import {RippleModule} from "primeng/ripple";
import {TooltipModule} from "primeng/tooltip";
import * as LevelSelectors from "../../../../../../core/store/schoolar/level/level.selector";
import * as CenterSelectors from "../../../../../../core/store/corporate/center/centers.selector";
import {LevelActions} from "../../../../../../core/store/schoolar/level/level.actions";
import {CenterActions} from "../../../../../../core/store/corporate/center/centers.actions";
import {BadgeModule} from "primeng/badge";
import {KpiIndicatorsComponent} from "../../../../../../shared/kpi-indicator/kpi-indicator.component";
import {Kpi} from "../../../../../../shared/kpi-indicator/kpi-indicator.component";
import {DatePickerModule} from "primeng/datepicker";
import {ChipsModule} from "primeng/chips";
import {SelectButtonModule} from "primeng/selectbutton";
import {InputTextModule} from "primeng/inputtext";
import {DropdownModule} from "primeng/dropdown";
import {DialogModule} from "primeng/dialog";
import {FormsModule} from "@angular/forms";
import {StudentsDashboardComponent} from "../../../dashboard/components/students/student-dashboard.component";
import {StudentReports} from "../../../reports/components/student/student-reports.component";
import {SelectItem} from 'primeng/api';
import {LocationActions} from 'src/app/core/store/location/location.actions';
import * as LocationSelectors from 'src/app/core/store/location/location.selectors';
import {AppState} from 'src/app/core/store';
import {StatisticsActions} from 'src/app/core/store/schoolar/statistics/statistics.actions';
import {selectDashboardStatistics} from 'src/app/core/store/schoolar/statistics/statistics.selectors';

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
        DatePickerModule,
        ChipsModule,
        SelectButtonModule,
        InputTextModule,
        DropdownModule,
        DialogModule,
        FormsModule,
        StudentsDashboardComponent,
        StudentReports,
    ],
    templateUrl: './list.component.html',
})
export class ListComponent implements OnInit, OnDestroy, AfterViewInit {
    private store = inject<Store<AppState>>(Store);
    private router = inject(Router);


    isSearchMode$ = new BehaviorSubject<boolean>(false);

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
    totalElements$!: Observable<number>;
    centers$!: Observable<any[]>;
    levels$!: Observable<any[]>;

    loading$: Observable<boolean>;

    readonly DEFAULT_PAGE_SIZE = 100;
    readonly DEFAULT_SORT = 'status,asc';
    private currentSort = this.DEFAULT_SORT;

    // Filter options
    statusOptions = [
        {label: 'Ativo', value: 'ACTIVE'},
        {label: 'Inativo', value: 'INACTIVE'},
        {label: 'Em renovação', value: 'PENDING_PAYMENT'},
        {label: 'Desistiu', value: 'DROPPED_OUT'},
        {label: 'Saiu', value: 'QUIT'},
    ];
    provinces$!: Observable<SelectItem[]>;
    municipalities$!: Observable<SelectItem[]>;
    loadingProvinces$!: Observable<boolean>;
    loadingMunicipalities$!: Observable<boolean>;

    columns: TableColumn[] = COLUMNS;

    globalFilterFields: string[] = GLOBAL_FILTERS;

    customTemplates: Record<string, TemplateRef<any>> = {};

    // Filter dialog state
    showFilterDialog = false;
    filterStatus: string | null = null;
    filterCenterId: string | null = null;
    filterLevelId: string | null = null;
    filterProvince: string | null = null;
    filterMunicipality: string | null = null;

    private centersCache: { id: string; name: string }[] = [];
    private levelsCache: { id: string; name: string }[] = [];

    get hasActiveFilters(): boolean {
        return !!(this.filterStatus || this.filterCenterId || this.filterLevelId ||
            this.filterProvince || this.filterMunicipality);
    }

    getStatusLabel(status: string): string {
        return this.statusOptions.find(o => o.value === status)?.label ?? status;
    }

    getCenterLabel(centerId: string): string {
        return this.centersCache.find(c => c.id === centerId)?.name ?? centerId;
    }

    getLevelLabel(levelId: string): string {
        return this.levelsCache.find(l => l.id === levelId)?.name ?? levelId;
    }

    headerActions: TableHeaderAction[] = HEADER_ACTIONS;

    chartOptions: any;

    // View selection
    currentView: string = 'list'; // Default view is list

    viewOptions = [
        {label: 'Lista de alunos', value: 'list'},
        //  { label: 'Relatórios', value: 'reports' },
        {label: 'Dashboard', value: 'dashboard'},
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
        fullName?: string;
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
    @HostListener('window:scroll')
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

    constructor() {
        this.students$ = this.store.select(StudentSelectors.selectAllStudents);
        this.totalElements$ = this.store.select(StudentSelectors.selectTotalElements);
        this.centers$ = this.store.select(CenterSelectors.selectAllCenters);
        this.levels$ = this.store.select(LevelSelectors.selectAllLevels);

        this.loading$ = this.store.select(StudentSelectors.selectLoading);

        this.centers$.pipe(takeUntil(this.destroy$)).subscribe(centers => {
            this.centersCache = centers ?? [];
        });
        this.levels$.pipe(takeUntil(this.destroy$)).subscribe(levels => {
            this.levelsCache = levels ?? [];
        });

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

        this.kpis$ = this.store.select(selectDashboardStatistics).pipe(
            map((stats) => buildStudentListKpis(stats)),
        );
    }

    ngOnInit(): void {
        this.store.dispatch(StatisticsActions.loadDashboardStatistics());
        this.store.dispatch(LevelActions.loadLevels({}))
        this.store.dispatch(CenterActions.loadCenters());
        this.store.dispatch(StudentsActions.loadStudentsPaginated({
            page: 0,
            size: this.DEFAULT_PAGE_SIZE,
            sort: this.DEFAULT_SORT,
        }));
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

        // Initialize sticky state check after view is initialized
        setTimeout(() => {
            this.checkStickyState();
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onPageChange(event: { page: number; rows: number; sort?: string }): void {
        if (event.sort) {
            this.currentSort = event.sort;
        }
        this.store.dispatch(StudentsActions.loadStudentsPaginated({
            page: event.page,
            size: event.rows,
            sort: this.currentSort,
            filters: Object.keys(this.searchFilters).length > 0 ? this.searchFilters : undefined,
        }));
    }

    onRowSelect($event: Student) {
        this.router.navigate(['/schoolar/students', $event.id]).then();
    }

    navigateToCreateStudent() {
        this.router.navigate(['/schoolar/students/create']).then();
    }

    navigateToEditStudent(id: string) {

    }

    navigateToScheduleLesson(studentId: string) {
        this.router.navigate(['/schoolar/lessons/schedule'], {queryParams: {studentId}}).then();
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

        const filters: any = {};

        if (searchTerm.includes('@')) {
            filters.email = searchTerm;
        } else if (/^\d+$/.test(searchTerm.trim())) {
            filters.code = parseInt(searchTerm.trim(), 10);
        } else {
            filters.fullName = searchTerm;
        }

        const mergedFilters = {...this.searchFilters, ...filters};

        Object.keys(mergedFilters).forEach(key => {
            if (mergedFilters[key] === undefined || mergedFilters[key] === null || mergedFilters[key] === '') {
                delete mergedFilters[key];
            }
        });

        this.store.dispatch(StudentsActions.loadStudentsPaginated({
            page: 0,
            size: this.DEFAULT_PAGE_SIZE,
            sort: this.currentSort,
            filters: mergedFilters,
        }));
    }

    clearSearch(): void {
        this.searchTerm = '';
        this.searchFilters = {};
        this.selectedProvince = null;
        this.selectedMunicipality = null;
        this.municipalities$ = of([]);
        this.loadingMunicipalities$ = of(false);
        this.currentSort = this.DEFAULT_SORT;
        this.isSearchMode$.next(false);
        this.store.dispatch(StudentsActions.loadStudentsPaginated({
            page: 0,
            size: this.DEFAULT_PAGE_SIZE,
            sort: this.DEFAULT_SORT,
        }));
    }

    applyDialogFilters(): void {
        this.searchFilters = {};

        if (this.filterStatus) this.searchFilters.status = this.filterStatus;
        if (this.filterCenterId) (this.searchFilters as any).centerId = this.filterCenterId;
        if (this.filterLevelId) (this.searchFilters as any).levelId = this.filterLevelId;
        if (this.filterProvince) this.searchFilters.province = this.filterProvince;
        if (this.filterMunicipality) this.searchFilters.municipality = this.filterMunicipality;

        if (this.hasActiveFilters || this.searchTerm.trim()) {
            this.performColumnFilter();
            this.isSearchMode$.next(true);
        } else {
            this.clearSearch();
        }
    }

    clearFilters(): void {
        this.filterStatus = null;
        this.filterCenterId = null;
        this.filterLevelId = null;
        this.filterProvince = null;
        this.filterMunicipality = null;
        this.clearSearch();
    }

    onDialogProvinceChange(value: string | null): void {
        this.filterMunicipality = null;
        if (value) {
            this.municipalities$ = this.store.select(LocationSelectors.selectMunicipalitiesByProvinceId(value)).pipe(
                map(municipalities => municipalities.map(m => ({label: m.name, value: m.name.toLowerCase()} as SelectItem)))
            );
            this.loadMunicipalities(value);
        } else {
            this.municipalities$ = of([]);
        }
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

        const filters: any = {...this.searchFilters};

        // Add text search if present
        if (this.searchTerm.trim()) {
            if (this.searchTerm.includes('@')) {
                filters.email = this.searchTerm;
            } else if (/^\d+$/.test(this.searchTerm.trim())) {
                filters.code = parseInt(this.searchTerm.trim(), 10);
            } else {
                filters.fullName = this.searchTerm;
            }
        }

        // Remove empty filters
        Object.keys(filters).forEach(key => {
            if (filters[key] === undefined || filters[key] === null || filters[key] === '') {
                delete filters[key];
            }
        });

        if (Object.keys(filters).length > 0) {
            this.store.dispatch(StudentsActions.loadStudentsPaginated({
                page: 0,
                size: this.DEFAULT_PAGE_SIZE,
                sort: this.currentSort,
                filters,
            }));
        } else {
            this.clearSearch();
        }
    }

    private initializeLocationSelectors() {
        // Initialize provinces observable
        this.provinces$ = this.store.select(LocationSelectors.selectAllProvinces).pipe(
            map(provinces => provinces.map(p => ({label: p.name, value: p.name} as SelectItem)))
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
        this.store.dispatch(LocationActions.loadProvince({provinceId}));
    }

    protected StudentStatus = StudentStatus
}
