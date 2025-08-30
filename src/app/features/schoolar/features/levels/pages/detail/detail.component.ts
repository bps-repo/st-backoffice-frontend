// student.component.ts
import {Component, OnInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable, Subject, takeUntil, combineLatest, of} from 'rxjs';
import {map, switchMap, catchError} from 'rxjs/operators';
import {SkeletonModule} from 'primeng/skeleton';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {Level} from 'src/app/core/models/course/level';
import {Unit} from 'src/app/core/models/course/unit';
import {Student} from 'src/app/core/models/academic/student';
import {UnitProgress} from 'src/app/core/models/academic/unit-progress';
import {ChartModule} from 'primeng/chart';
import {RippleModule} from 'primeng/ripple';
import {TabViewModule} from 'primeng/tabview';
import {TabMenuModule} from 'primeng/tabmenu';
import {SelectButtonModule} from 'primeng/selectbutton';
import {BadgeModule} from 'primeng/badge';
import {ProgressBarModule} from 'primeng/progressbar';
import {ChipModule} from 'primeng/chip';
import {AvatarModule} from 'primeng/avatar';
import {MenuItem} from 'primeng/api';
import * as LevelSelectors from "../../../../../../core/store/schoolar/level/level.selector";
import {LevelActions} from "../../../../../../core/store/schoolar/level/level.actions";
import {LevelService} from 'src/app/core/services/level.service';
import {UnitService} from 'src/app/core/services/unit.service';
import {StudentService} from 'src/app/core/services/student.service';

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

    // View options for the select button (similar to Aulas list)
    viewOptions = [
        { label: 'Visão Geral', value: 'overview' },
        { label: 'Alunos', value: 'students' },
        { label: 'Unidades', value: 'units' }
    ];

    // Real data observables
    units$: Observable<Unit[]> = of([]);
    students$: Observable<Student[]> = of([]);
    unitProgresses$: Observable<UnitProgress[]> = of([]);

    // Loading states
    loadingRelatedData: boolean = false;

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
        private studentService: StudentService
    ) {
        this.level$ = this.store.select(LevelSelectors.selectSelectedLevel);
        this.loading$ = this.store.select(LevelSelectors.selectLoading);
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.levelId = params['id'];
            if (this.levelId) {
                this.loadLevel();
            }
        });

        this.level$.subscribe(level => {
            this.level = level;
            this.editableLevel = level ? {...level} : null;

            if (level) {
                this.loadRelatedData();
                this.initUnitsChart();
                this.initEnrollmentChart();
                this.initCompletionRateChart();
            }
        });

        this.loading$.subscribe(loading => {
            this.loading = loading;
            // If loading is false and we have a levelId but no level, there might be an error
            if (!loading && this.levelId && !this.level) {
                console.warn('Level not found or failed to load for ID:', this.levelId);
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadRelatedData(): void {
        if (!this.levelId || !this.level) {
            console.warn('Cannot load related data: levelId or level is null');
            return;
        }

        this.loadingRelatedData = true;

        // Load units for this level
        this.units$ = this.unitService.loadUnits().pipe(
            map(units => units.filter(unit => unit.levelId === this.levelId)),
            catchError(error => {
                console.error('Error loading units:', error);
                return of([]);
            })
        );

        // Load students for this level
        this.students$ = this.studentService.getStudents().pipe(
            map(students => students.filter(student => student.levelId === this.levelId)),
            catchError(error => {
                console.error('Error loading students:', error);
                return of([]);
            })
        );

        // Load unit progresses for this level
        this.unitProgresses$ = this.units$.pipe(
            switchMap(units => {
                if (units.length === 0) return of([]);

                // Load unit progresses for each unit
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
            }),
            catchError(error => {
                console.error('Error loading unit progresses:', error);
                return of([]);
            })
        );

        // Combine all data to calculate statistics
        combineLatest([this.units$, this.students$, this.unitProgresses$])
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: ([units, students, unitProgresses]) => {
                    this.calculateStatistics(units, students, unitProgresses);
                    this.loadingRelatedData = false;
                },
                error: (error) => {
                    console.error('Error loading related data:', error);
                    this.loadingRelatedData = false;
                }
            });
    }

    calculateStatistics(units: Unit[], students: Student[], unitProgresses: UnitProgress[]): void {
        // Calculate header statistics
        const totalStudents = students.length;
        const totalUnits = units.length;
        const totalTopics = units.reduce((sum, unit) => sum + (unit.assessments?.length || 0), 0);
        const totalHours = units.reduce((sum, unit) => sum + (unit.lessons?.length || 0) * 2, 0); // Assuming 2 hours per lesson

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

        // Update tab items with student count
        // This part is no longer needed as viewOptions handles the tab selection
        // this.tabItems = [
        //     {
        //         label: 'Visão Geral',
        //         icon: 'pi pi-home'
        //     },
        //     {
        //         label: `Alunos (${totalStudents})`,
        //         icon: 'pi pi-users'
        //     },
        //     {
        //         label: 'Unidades',
        //         icon: 'pi pi-book'
        //     }
        // ];

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
    }

    getInitials(firstName: string, lastName: string): string {
        const first = firstName.charAt(0).toUpperCase();
        const last = lastName.charAt(0).toUpperCase();
        return `${first}${last}`;
    }

    // Method to handle view selection (similar to Aulas list)
    onViewChange(event: any): void {
        this.currentTab = event.value;
        this.selectedTab = event.value as 'overview' | 'students' | 'units';
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
                        font: {weight: 700},
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
                    ticks: {color: textColor},
                    grid: {color: documentStyle.getPropertyValue('--surface-border')}
                },
                y: {
                    beginAtZero: true,
                    ticks: {color: textColor},
                    grid: {color: documentStyle.getPropertyValue('--surface-border')}
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
                        font: {weight: 700},
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
        this.store.dispatch(LevelActions.loadLevel({id: this.levelId}));
    }

    editLevel(): void {
        if (this.editableLevel) {
            const updatedLevel: Partial<Level> = {
                name: this.editableLevel.name,
                description: this.editableLevel.description,
                duration: this.editableLevel.duration,
                maximumUnits: this.editableLevel.maximumUnits
            };

            this.store.dispatch(LevelActions.updateLevel({id: this.levelId, level: updatedLevel}));
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
