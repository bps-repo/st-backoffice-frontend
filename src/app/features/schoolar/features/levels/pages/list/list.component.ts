import {Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable, startWith, map, combineLatest} from 'rxjs';
import {CreateLevelDialogComponent} from '../../dialogs/create-level-dialog/create-level-dialog.component';
import {ButtonModule} from 'primeng/button';
import {ConfirmationService} from 'primeng/api';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {Level} from 'src/app/core/models/course/level';
import {Unit} from 'src/app/core/models/course/unit';
import {RippleModule} from "primeng/ripple";
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {TabViewModule} from 'primeng/tabview';
import {CardModule} from 'primeng/card';
import {BadgeModule} from 'primeng/badge';
import {TooltipModule} from 'primeng/tooltip';
import {SelectButtonModule} from 'primeng/selectbutton';
import {FormsModule} from '@angular/forms';
import * as LevelSelectors from "../../../../../../core/store/schoolar/level/level.selector";
import * as UnitSelectors from "../../../../../../core/store/schoolar/units/unit.selectors";
import * as StudentSelectors from "../../../../../../core/store/schoolar/students/students.selectors";
import {LevelActions} from "../../../../../../core/store/schoolar/level/level.actions";
import {UnitActions} from "../../../../../../core/store/schoolar/units/unit.actions";
import {KpiIndicatorsComponent, Kpi} from "../../../../../../shared/kpi-indicator/kpi-indicator.component";
import {ProgressBarModule} from 'primeng/progressbar';
import {ChipModule} from 'primeng/chip';

@Component({
    selector: 'app-level-general',
    imports: [
        CommonModule,
        ConfirmDialogModule,
        ButtonModule,
        CreateLevelDialogComponent,
        RippleModule,
        InputTextModule,
        DropdownModule,
        TabViewModule,
        CardModule,
        BadgeModule,
        TooltipModule,
        SelectButtonModule,
        FormsModule,
        KpiIndicatorsComponent,
        ProgressBarModule,
        ChipModule
    ],
    templateUrl: './list.component.html',
    standalone: true,
    providers: [ConfirmationService],
    styles: [`
        ::ng-deep .p-tabview .p-tabview-nav {
            border: none;
            background: transparent;
        }

        ::ng-deep .p-tabview .p-tabview-nav li .p-tabview-nav-link {
            border: none;
            background: transparent;
            color: var(--text-color);
            font-weight: 600;
            padding: 1rem 1.5rem;
            transition: all 0.2s;
        }

        ::ng-deep .p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
            background: transparent;
            border-color: transparent;
            color: var(--primary-color);
            border-bottom: 2px solid var(--primary-color);
        }

        .sticky-header {
            position: sticky;
            top: 0;
            z-index: 100;
            padding-top: 1rem;
            padding-bottom: 1rem;
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
            background-color: var(--surface-card);
        }

        .sticky-active {
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .level-card {
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .level-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .level-color-indicator {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            display: inline-block;
            margin-right: 8px;
        }

        .unit-list {
            padding-left: 20px;
            margin-top: 10px;
        }

        .unit-item {
            padding: 8px;
            margin-bottom: 4px;
            border-radius: 4px;
            background-color: var(--surface-hover);
        }
    `]
})
export class ListComponent implements OnInit, AfterViewInit {

    @ViewChild(CreateLevelDialogComponent) createLevelDialog!: CreateLevelDialogComponent;
    @ViewChild('mainHeader') mainHeader!: ElementRef;
    @ViewChild('viewSelector') viewSelector!: ElementRef;

    // Data observables
    levels$: Observable<Level[]>;
    units$: Observable<Unit[]>;
    loading$: Observable<boolean>;
    totalLevels$: Observable<number>;
    totalUnits$: Observable<number>;
    activeStudents$: Observable<number>;

    // Local state
    levels: Level[] = [];
    units: Unit[] = [];
    expandedLevels: Set<string> = new Set();
    loading = false;
    searchTerm = '';
    selectedLevelId = '';
    currentTab = 0;
    isMainHeaderSticky = false;
    isViewSelectorSticky = false;

    // KPI indicators
    kpis: Kpi[] = [];

    // Tab view options
    tabOptions = [
        {label: 'Hierarquia', value: 0},
        {label: 'Progresso', value: 1},
        {label: 'Relatórios', value: 2}
    ];

    // Level colors for indicators
    levelColors = [
        '#3B82F6', // blue
        '#10B981', // green
        '#F59E0B', // amber
        '#EF4444', // red
        '#8B5CF6', // purple
        '#EC4899', // pink
        '#06B6D4', // cyan
        '#F97316', // orange
    ];

    constructor(
        private router: Router,
        private store: Store,
        private confirmationService: ConfirmationService
    ) {
        // Initialize observables
        this.levels$ = this.store.select(LevelSelectors.selectAllLevels);
        this.units$ = this.store.select(UnitSelectors.selectAllUnits);
        this.loading$ = this.store.select(LevelSelectors.selectLevelsLoading);
        this.totalLevels$ = this.store.select(LevelSelectors.selectTotalLevels);
        this.totalUnits$ = this.store.select(UnitSelectors.selectTotalUnits);

        // For active students, we need to filter the students by status
        this.activeStudents$ = this.store.select(StudentSelectors.selectAllStudents).pipe(
            map(students => students.filter(student => student.status === 'ACTIVE').length)
        );
    }

    ngOnInit(): void {
        // Load data
        this.store.dispatch(LevelActions.loadLevels());
        this.store.dispatch(UnitActions.loadPagedUnits({size: 10}));

        // Initialize KPIs
        this.initializeKpis();

        // Subscribe to levels and units
        this.levels$.subscribe(levels => {
            this.levels = levels;
        });

        this.units$.subscribe(units => {
            this.units = units;
        });
    }

    ngAfterViewInit(): void {
        // Initialize sticky headers
        setTimeout(() => {
            this.checkStickyState();
        }, 100);
    }

    @HostListener('window:scroll', ['$event'])
    onWindowScroll() {
        this.checkStickyState();
    }

    checkStickyState(): void {
        if (this.mainHeader) {
            const mainHeaderPos = this.mainHeader.nativeElement.getBoundingClientRect().top;
            this.isMainHeaderSticky = mainHeaderPos <= 0;
        }

        if (this.viewSelector) {
            const viewSelectorPos = this.viewSelector.nativeElement.getBoundingClientRect().top;
            this.isViewSelectorSticky = viewSelectorPos <= 80;
        }
    }

    initializeKpis(): void {
        // Combine observables to create KPIs
        combineLatest([
            this.totalLevels$,
            this.totalUnits$,
            this.activeStudents$,
            // For average completion, we would need additional data
            // This is a placeholder value
            this.levels$.pipe(map(() => 75)) // 75% average completion
        ]).subscribe(([totalLevels, totalUnits, activeStudents, avgCompletion]) => {
            this.kpis = [
                {
                    label: 'Total de níveis',
                    value: totalLevels,
                    icon: {label: 'layers', color: 'text-blue-500', type: 'mat'}
                },
                {
                    label: 'Total de unidades',
                    value: totalUnits,
                    icon: {label: 'book', color: 'text-green-500', type: 'mat'}
                },
                {
                    label: 'Alunos ativos',
                    value: activeStudents,
                    icon: {label: 'person', color: 'text-orange-500', type: 'mat'}
                },
                {
                    label: 'Conclusão média',
                    value: avgCompletion,
                    icon: {label: 'check-circle', color: 'text-purple-500', type: 'mat'}
                }
            ];
        });
    }

    onTabChange(event: any): void {
        this.currentTab = event.index;
    }

    onSearch(): void {
        // Filter levels by search term
        // This will be handled in the template with a pipe
    }

    onLevelSelect(event: any): void {
        this.selectedLevelId = event.value;
    }

    toggleExpand(levelId: string): void {
        if (this.expandedLevels.has(levelId)) {
            this.expandedLevels.delete(levelId);
        } else {
            this.expandedLevels.add(levelId);
        }
    }

    isExpanded(levelId: string): boolean {
        return this.expandedLevels.has(levelId);
    }

    getUnitsForLevel(levelId: string): Unit[] {
        return this.units.filter(unit => unit.levelId === levelId);
    }

    getLevelColor(index: number): string {
        return this.levelColors[index % this.levelColors.length];
    }

    viewDetails(level: Level): void {
        this.router.navigate(['/courses/levels', level.id]).then();
    }

    createLevel(): void {
        this.createLevelDialog.show();
    }

    deleteLevel(level: Level): void {
        this.confirmationService.confirm({
            message: `Tem certeza de que deseja excluir o nivel "${level.name}"?`,
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle text-warning',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: () => {
                this.store.dispatch(LevelActions.deleteLevel({id: level.id}));
            },
            reject: () => {
                console.log('Ação de exclusão cancelada.');
            }
        });
    }
}
