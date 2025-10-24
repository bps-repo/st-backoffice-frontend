// student.component.ts
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil, combineLatest, of, BehaviorSubject, forkJoin } from 'rxjs';
import { map, switchMap, catchError, tap, distinctUntilChanged, shareReplay, startWith } from 'rxjs/operators';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Level } from 'src/app/core/models/course/level';
import { Unit } from 'src/app/core/models/course/unit';
import { Student } from 'src/app/core/models/academic/student';
import { UnitProgress } from 'src/app/core/models/academic/unit-progress';
import { ChartModule } from 'primeng/chart';
import { RippleModule } from 'primeng/ripple';
import { TabViewModule } from 'primeng/tabview';
import { TabMenuModule } from 'primeng/tabmenu';
import { SelectButtonModule } from 'primeng/selectbutton';
import { BadgeModule } from 'primeng/badge';
import { ProgressBarModule } from 'primeng/progressbar';
import { ChipModule } from 'primeng/chip';
import { AvatarModule } from 'primeng/avatar';
import { MenuItem } from 'primeng/api';
import * as LevelSelectors from "../../../../../../core/store/schoolar/level/level.selector";
import { LevelActions } from "../../../../../../core/store/schoolar/level/level.actions";
import { LevelService } from 'src/app/core/services/level.service';
import { UnitService } from 'src/app/core/services/unit.service';
import { StudentService } from 'src/app/core/services/student.service';

// Cache interface for better type safety
interface LevelDetailCache {
    units: Unit[];
    students: Student[];
    unitProgresses: UnitProgress[];
    lastUpdated: number;
    isExpired: boolean;
}

@Component({
    selector: 'app-level-student',
    templateUrl: './detail.component.html',
    standalone: true,
    imports: [
        CommonModule,
        SkeletonModule,
        InputTextModule,
        InputTextareaModule,
        ButtonModule,
        DropdownModule,
        FormsModule,
        ProgressSpinnerModule,
        ChartModule,
        RippleModule,
        TabViewModule,
        TabMenuModule,
        SelectButtonModule,
        BadgeModule,
        ProgressBarModule,
        ChipModule,
        AvatarModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        ::ng-deep .p-selectbutton {
            display: flex;
            flex-wrap: nowrap;
        }

        ::ng-deep .p-selectbutton .p-button {
            margin-right: 0.5rem;
            border: none;
        }

        ::ng-deep .p-selectbutton .p-button:last-child {
            margin-right: 0;
        }

        .animate-fade {
            transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .skeleton-card {
            height: 200px;
        }

        .lazy-loading {
            min-height: 300px;
        }
    `]
})
export class DetailComponent implements OnInit, OnDestroy {

    levelId: string = '';
    level$: Observable<Level | null>;
    level: Level | null = null;
    editableLevel: Level | null = null;
    loading$: Observable<boolean>;
    loading: boolean = true;
    private destroy$ = new Subject<void>();

    // UI state
    selectedTab: 'overview' | 'students' | 'units' = 'overview';
    currentTab: string = 'overview';

    // View options for the select button
    viewOptions = [
        { label: 'Visão Geral', value: 'overview' },
        { label: 'Alunos', value: 'students' },
        { label: 'Unidades', value: 'units' }
    ];

    // Cache for related data (5 minutes expiration)
    private cache: Map<string, LevelDetailCache> = new Map();
    private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    // Lazy loading observables with caching
    private unitsSubject = new BehaviorSubject<Unit[]>([]);
    private studentsSubject = new BehaviorSubject<Student[]>([]);
    private unitProgressesSubject = new BehaviorSubject<UnitProgress[]>([]);

    // Public observables with caching and error handling
    units$ = this.unitsSubject.asObservable().pipe(
        shareReplay(1),
        distinctUntilChanged()
    );

    students$ = this.studentsSubject.asObservable().pipe(
        shareReplay(1),
        distinctUntilChanged()
    );

    unitProgresses$ = this.unitProgressesSubject.asObservable().pipe(
        shareReplay(1),
        distinctUntilChanged()
    );

    // Loading states for each tab
    loadingOverview = false;
    loadingStudents = false;
    loadingUnits = false;

    // Header KPI values (calculated from real data)
    headerStats = [
        { label: 'Total de Alunos', value: 0, icon: 'pi pi-users' },
        { label: 'Unidades', value: 0, icon: 'pi pi-book' },
        { label: 'Tópicos', value: 0, icon: 'pi pi-bullseye' },
        { label: 'Horas Totais', value: '0h', icon: 'pi pi-calendar' },
        { label: 'Progresso Médio', value: '0%', icon: 'pi pi-chart-line' },
    ];

    // Students list (calculated from real data)
    students: any[] = [];

    // Units for overview and units tabs (calculated from real data)
    unitsSummary: any[] = [];
    unitsCards: any[] = [];

    // Progress statistics
    progressStats = {
        completed: 0,
        inProgress: 0,
        notStarted: 0
    };

    // Chart properties
    unitsChartData: any;
    unitsChartOptions: any;
    enrollmentChartData: any;
    enrollmentChartOptions: any;
    completionRateChartData: any;
    completionRateChartOptions: any;

    constructor(
        private route: ActivatedRoute,
        private store: Store,
        private levelService: LevelService,
        private unitService: UnitService,
        private studentService: StudentService,
        private cdr: ChangeDetectorRef
    ) {
        this.level$ = this.store.select(LevelSelectors.selectSelectedLevel);
        this.loading$ = this.store.select(LevelSelectors.selectLoading);
    }

    ngOnInit(): void {
        this.route.params.pipe(
            takeUntil(this.destroy$),
            map(params => params['id']),
            distinctUntilChanged()
        ).subscribe(levelId => {
            this.levelId = levelId;
            if (levelId) {
                this.loadLevel();
            }
        });

        this.level$.pipe(
            takeUntil(this.destroy$),
            distinctUntilChanged()
        ).subscribe(level => {
            this.level = level;
            this.editableLevel = level ? { ...level } : null;

            if (level) {
                // Load overview data immediately (most important)
                this.loadOverviewData();

                // Initialize charts
                this.initUnitsChart();
                this.initEnrollmentChart();
                this.initCompletionRateChart();
            }

            this.cdr.markForCheck();
        });

        this.loading$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(loading => {
            this.loading = loading;
            this.cdr.markForCheck();
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Loads overview data (units and basic statistics) - called immediately
     */
    private loadOverviewData(): void {
        if (!this.levelId || !this.level) return;

        const cacheKey = `${this.levelId}_overview`;
        const cached = this.getCachedData(cacheKey);

        if (cached && !cached.isExpired) {
            this.unitsSubject.next(cached.units);
            this.calculateStatistics(cached.units, cached.students, cached.unitProgresses);
            return;
        }

        this.loadingOverview = true;
        this.cdr.markForCheck();

        // Load units and basic data in parallel
        forkJoin({
            units: this.unitService.loadUnits().pipe(
                map(units => units.filter(unit => unit.levelId === this.levelId)),
                catchError(error => {
                    console.error('Error loading units:', error);
                    return of([]);
                })
            ),
            students: this.studentService.getStudents().pipe(
                map(students => students.filter(student => student.level.id === this.levelId)),
                catchError(error => {
                    console.error('Error loading students:', error);
                    return of([]);
                })
            )
        }).pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: ({ units, students }) => {
                this.unitsSubject.next(units);

                // Load unit progresses in parallel for all units
                this.loadUnitProgressesParallel(units).subscribe(unitProgresses => {
                    this.unitProgressesSubject.next(unitProgresses);
                    this.calculateStatistics(units, students, unitProgresses);

                    // Cache the data
                    this.cacheData(cacheKey, { units, students, unitProgresses });

                    this.loadingOverview = false;
                    this.cdr.markForCheck();
                });
            },
            error: (error) => {
                console.error('Error loading overview data:', error);
                this.loadingOverview = false;
                this.cdr.markForCheck();
            }
        });
    }

    /**
     * Loads unit progresses for all units in parallel (optimized)
     */
    private loadUnitProgressesParallel(units: Unit[]): Observable<UnitProgress[]> {
        if (units.length === 0) return of([]);

        const unitProgressObservables = units.map(unit =>
            this.unitService.loadUnitProgresses(unit.id).pipe(
                map(response => response.data || []),
                catchError(error => {
                    console.error(`Error loading unit progresses for unit ${unit.id}:`, error);
                    return of([]);
                })
            )
        );

        return combineLatest(unitProgressObservables).pipe(
            map(progressArrays => progressArrays.flat())
        );

    }

    /**
     * Loads students data when students tab is selected (lazy loading)
     */
    loadStudentsData(): void {
        if (!this.levelId) return;

        const cacheKey = `${this.levelId}_students`;
        const cached = this.getCachedData(cacheKey);

        if (cached && !cached.isExpired) {
            this.studentsSubject.next(cached.students);
            return;
        }

        this.loadingStudents = true;
        this.cdr.markForCheck();

        this.studentService.getStudents().pipe(
            map(students => students.filter(student => student.level.id === this.levelId)),
            catchError(error => {
                console.error('Error loading students:', error);
                return of([]);
            }),
            takeUntil(this.destroy$)
        ).subscribe({
            next: (students) => {
                this.studentsSubject.next(students);
                this.cacheData(cacheKey, { units: [], students, unitProgresses: [] });
                this.loadingStudents = false;
                this.cdr.markForCheck();
            },
            error: (error) => {
                console.error('Error loading students:', error);
                this.loadingStudents = false;
                this.cdr.markForCheck();
            }
        });
    }

    /**
     * Loads units data when units tab is selected (lazy loading)
     */
    loadUnitsData(): void {
        if (!this.levelId) return;

        const cacheKey = `${this.levelId}_units`;
        const cached = this.getCachedData(cacheKey);

        if (cached && !cached.isExpired) {
            this.unitsSubject.next(cached.units);
            return;
        }

        this.loadingUnits = true;
        this.cdr.markForCheck();

        this.unitService.loadUnits().pipe(
            map(units => units.filter(unit => unit.levelId === this.levelId)),
            catchError(error => {
                console.error('Error loading units:', error);
                return of([]);
            }),
            takeUntil(this.destroy$)
        ).subscribe({
            next: (units) => {
                this.unitsSubject.next(units);
                this.cacheData(cacheKey, { units, students: [], unitProgresses: [] });
                this.loadingUnits = false;
                this.cdr.markForCheck();
            },
            error: (error) => {
                console.error('Error loading units:', error);
                this.loadingUnits = false;
                this.cdr.markForCheck();
            }
        });
    }

    /**
     * Cache management methods
     */
    private getCachedData(key: string): LevelDetailCache | null {
        const cached = this.cache.get(key);
        if (!cached) return null;

        cached.isExpired = Date.now() - cached.lastUpdated > this.CACHE_DURATION;
        return cached.isExpired ? null : cached;
    }

    private cacheData(key: string, data: { units: Unit[], students: Student[], unitProgresses: UnitProgress[] }): void {
        this.cache.set(key, {
            ...data,
            lastUpdated: Date.now(),
            isExpired: false
        });
    }

    private clearCache(): void {
        this.cache.clear();
    }

    calculateStatistics(units: Unit[], students: Student[], unitProgresses: UnitProgress[]): void {
        // Calculate header statistics
        const totalStudents = students.length;
        const totalUnits = units.length;
        const totalTopics = units.reduce((sum, unit) => sum + (unit.assessments?.length || 0), 0);
        const totalHours = units.reduce((sum, unit) => sum + (unit.lessons?.length || 0) * 2, 0);

        // Calculate average progress
        const studentProgresses = students.map(student => student.levelProgressPercentage || 0);
        const averageProgress = studentProgresses.length > 0
            ? Math.round(studentProgresses.reduce((sum, progress) => sum + progress, 0) / studentProgresses.length)
            : 0;

        // Update header stats
        this.headerStats = [
            { label: 'Total de Alunos', value: totalStudents, icon: 'pi pi-users' },
            { label: 'Unidades', value: totalUnits, icon: 'pi pi-book' },
            { label: 'Tópicos', value: totalTopics, icon: 'pi pi-bullseye' },
            { label: 'Horas Totais', value: `${totalHours}h`, icon: 'pi pi-calendar' },
            { label: 'Progresso Médio', value: `${averageProgress}%`, icon: 'pi pi-chart-line' },
        ];

        // Calculate progress statistics
        let completed = 0, inProgress = 0, notStarted = 0;

        unitProgresses.forEach((progress: UnitProgress) => {
            if (progress.completed) {
                completed++;
            } else if (progress.completionPercentage > 0) {
                inProgress++;
            } else {
                notStarted++;
            }
        });

        this.progressStats = { completed, inProgress, notStarted };

        // Build units summary
        this.unitsSummary = units.map((unit, index) => ({
            idx: index + 1,
            title: unit.name,
            desc: unit.description,
            topics: unit.assessments?.length || 0,
            hours: `${(unit.lessons?.length || 0) * 2}h`
        }));

        // Build students list
        this.students = students.map(student => {
            const studentProgresses = unitProgresses.filter((p: UnitProgress) => p.student.id === student.id);
            const completedUnits = studentProgresses.filter((p: UnitProgress) => p.completed).length;
            const totalUnits = units.length;
            const progress = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;

            return {
                name: `${student.user?.firstname || ''} ${student.user?.lastname || ''}`.trim(),
                initials: this.getInitials(student.user?.firstname || '', student.user?.lastname || ''),
                unitsInfo: `${completedUnits} unidade(s) em progresso`,
                progress: progress,
                completed: progress === 100
            };
        });

        // Build units cards
        this.unitsCards = units.map(unit => {
            const unitProgressesForUnit = unitProgresses.filter((p: UnitProgress) => p.unit.id === unit.id);
            const completed = unitProgressesForUnit.filter((p: UnitProgress) => p.completed).length;
            const inProgress = unitProgressesForUnit.filter((p: UnitProgress) => !p.completed && p.completionPercentage > 0).length;
            const progress = unitProgressesForUnit.length > 0
                ? Math.round(unitProgressesForUnit.reduce((sum: number, p: UnitProgress) => sum + p.completionPercentage, 0) / unitProgressesForUnit.length)
                : 0;

            return {
                title: unit.name,
                desc: unit.description,
                progress: progress,
                done: completed,
                inProgress: inProgress,
                chips: unit.assessments?.map(a => a.name) || []
            };
        });

        this.cdr.markForCheck();
    }

    getInitials(firstName: string, lastName: string): string {
        const first = firstName.charAt(0).toUpperCase();
        const last = lastName.charAt(0).toUpperCase();
        return `${first}${last}`;
    }

    // Method to handle view selection with lazy loading
    onViewChange(event: any): void {
        this.currentTab = event.value;
        this.selectedTab = event.value as 'overview' | 'students' | 'units';

        // Lazy load data based on selected tab
        switch (this.selectedTab) {
            case 'students':
                this.loadStudentsData();
                break;
            case 'units':
                this.loadUnitsData();
                break;
            case 'overview':
                // Overview data is already loaded
                break;
        }
    }

    initUnitsChart(): void {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        // general data - in a real app, this would come from the level's units
        this.unitsChartData = {
            labels: ['Grammar', 'Vocabulary', 'Reading', 'Writing', 'Listening', 'Speaking'],
            datasets: [
                {
                    data: [4, 5, 3, 3, 2, 3],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--primary-800'),
                        documentStyle.getPropertyValue('--primary-600'),
                        documentStyle.getPropertyValue('--primary-400'),
                        documentStyle.getPropertyValue('--primary-200'),
                        documentStyle.getPropertyValue('--primary-100'),
                        documentStyle.getPropertyValue('--primary-300'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--primary-700'),
                        documentStyle.getPropertyValue('--primary-500'),
                        documentStyle.getPropertyValue('--primary-300'),
                        documentStyle.getPropertyValue('--primary-100'),
                        documentStyle.getPropertyValue('--primary-50'),
                        documentStyle.getPropertyValue('--primary-200'),
                    ]
                }
            ]
        };

        this.unitsChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        font: { weight: 700 },
                        padding: 20,
                    },
                    position: 'right',
                },
                title: {
                    display: true,
                    text: 'Units Distribution',
                    font: {
                        size: 16
                    }
                }
            }
        };
    }

    initEnrollmentChart(): void {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        // general data - in a real app, this would come from enrollment data
        this.enrollmentChartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'New Enrollments',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    data: [65, 59, 80, 81, 56, 55]
                },
                {
                    label: 'Total Students',
                    backgroundColor: documentStyle.getPropertyValue('--primary-200'),
                    data: [120, 170, 210, 240, 280, 300]
                }
            ]
        };

        this.enrollmentChartOptions = {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
                title: {
                    display: true,
                    text: 'Student Enrollment',
                    font: {
                        size: 16
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: textColor },
                    grid: { color: documentStyle.getPropertyValue('--surface-border') }
                },
                y: {
                    beginAtZero: true,
                    ticks: { color: textColor },
                    grid: { color: documentStyle.getPropertyValue('--surface-border') }
                }
            }
        };
    }

    initCompletionRateChart(): void {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        // general data - in a real app, this would come from completion data
        this.completionRateChartData = {
            labels: ['Completed', 'In Progress', 'Not Started'],
            datasets: [
                {
                    data: [70, 20, 10],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--green-500'),
                        documentStyle.getPropertyValue('--blue-500'),
                        documentStyle.getPropertyValue('--gray-300'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--green-400'),
                        documentStyle.getPropertyValue('--blue-400'),
                        documentStyle.getPropertyValue('--gray-200'),
                    ]
                }
            ]
        };

        this.completionRateChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        font: { weight: 700 },
                        padding: 20,
                    },
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Completion Rate',
                    font: {
                        size: 16
                    }
                }
            },
            cutout: '60%'
        };
    }

    loadLevel(): void {
        this.store.dispatch(LevelActions.loadLevel({ id: this.levelId }));
    }

    editLevel(): void {
        if (this.editableLevel) {
            const updatedLevel: Partial<Level> = {
                name: this.editableLevel.name,
                description: this.editableLevel.description,
                duration: this.editableLevel.duration,
                maximumUnits: this.editableLevel.maximumUnits
            };

            this.store.dispatch(LevelActions.updateLevel({ id: this.levelId, level: updatedLevel }));
        }
    }

    downloadLevelDetails(): void {
        console.log('Downloading level details:', this.level);
        alert('Download dos detalhes do Nível iniciado');
    }

    sendLevelDetails(): void {
        console.log('Sending level details:', this.level?.name);
        alert('Detalhes do Nível enviados para ' + this.level?.name);
    }
}
