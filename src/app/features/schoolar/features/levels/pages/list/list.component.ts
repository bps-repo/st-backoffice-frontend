import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    HostListener,
    AfterViewInit,
    inject,
    signal,
    input
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable, map, combineLatest, of, startWith} from 'rxjs';
import {ButtonModule} from 'primeng/button';
import {ConfirmationService} from 'primeng/api';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {Level} from 'src/app/core/models/course/level';
import {Unit} from 'src/app/core/models/course/unit';
import {RippleModule} from "primeng/ripple";
import {InputTextModule} from 'primeng/inputtext';
import {SelectModule} from 'primeng/select';
import {TabsModule} from 'primeng/tabs';
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
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ChipModule} from 'primeng/chip';
import {toObservable} from "@angular/core/rxjs-interop";

@Component({
    selector: 'app-level-general',
    imports: [
        CommonModule,
        ConfirmDialogModule,
        ButtonModule,
        RippleModule,
        InputTextModule,
        SelectModule,
        TabsModule,
        CardModule,
        BadgeModule,
        TooltipModule,
        SelectButtonModule,
        FormsModule,
        KpiIndicatorsComponent,
        ProgressBarModule,
        ProgressSpinnerModule,
        ChipModule,
    ],
    templateUrl: './list.component.html',
    standalone: true,
    providers: [ConfirmationService],
    styles: [`
        ::ng-deep .p-tabs .p-tablist {
            border: none;
            background: transparent;
        }

        ::ng-deep .p-tabs .p-tablist .p-tab {
            border: none;
            background: transparent;
            color: var(--text-color);
            font-weight: 600;
            padding: 1rem 1.5rem;
            transition: all 0.2s;
        }

        ::ng-deep .p-tabs .p-tablist .p-tab.p-tab-active {
            background: transparent;
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
    private router = inject(Router);
    private store$ = inject(Store);
    private confirmationService = inject(ConfirmationService);

    @ViewChild('mainHeader') mainHeader!: ElementRef;
    @ViewChild('viewSelector') viewSelector!: ElementRef;

    // Data observables
    levels$ = this.store$.select(LevelSelectors.selectAllLevels)
    units$ = this.store$.select(UnitSelectors.selectAllUnits);
    loading$ = this.store$.select(LevelSelectors.selectLevelsLoading);
    unitsByLevel$?: Observable<Record<string, Unit[]>>

    // Local state
    expandedLevels: Set<string> = new Set();
    selectedLevelId = signal<string | null>(null);
    currentTab = 0;
    isMainHeaderSticky = false;
    isViewSelectorSticky = false;

    // KPI indicators
    kpis: Kpi[] = [];

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

    filteredLevels$ = combineLatest([
        this.levels$,
        toObservable(this.selectedLevelId)
    ]).pipe(
        map(([levels, levelId]) => levels.filter(l => (!levelId || l.id === levelId)))
    );

    ngOnInit(): void {
        this.store$.dispatch(LevelActions.loadLevels({}));
        this.store$.dispatch(UnitActions.loadUnits());
        this.initializeKpis();

        this.unitsByLevel$ = this.units$.pipe(
            map(units => {
                const filtered = units.filter(u => !u.generic);

                return filtered.reduce((acc, u) => {
                    (acc[u.levelId] ??= []).push(u);
                    return acc;
                }, {} as Record<string, Unit[]>);
            })
        );
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
            this.levels$,
            this.units$,
        ]).subscribe(([totalLevels, totalUnits]) => {
            this.kpis = [
                {
                    label: 'Total de níveis',
                    value: totalLevels.length,
                    icon: {label: 'layers', color: 'text-blue-500', type: 'mat'}
                },
                {
                    label: 'Total de unidades',
                    value: totalUnits.length,
                    icon: {label: 'book', color: 'text-green-500', type: 'mat'}
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
        let units: Unit[] = [];

        this.store$.select(UnitSelectors.selectUnitsByLevelId(levelId)).subscribe(u => {
            units = u;
        })
        console.log(`${levelId} - `, units)
        return units;
    }

    getLevelColor(index: number): string {
        return this.levelColors[index % this.levelColors.length];
    }

    viewDetails(level: Level): void {
        this.router.navigate(['/schoolar/levels', level.id]).then();
    }

    navigateToCreateLevel(): void {
        this.router.navigate(['/schoolar/levels/create']).then();
    }


    navigateToCreateUnit(): void {
        this.router.navigate(['/schoolar/units/create']).then();
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
                this.store$.dispatch(LevelActions.deleteLevel({id: level.id}));
            },
            reject: () => {
                console.log('Ação de exclusão cancelada.');
            }
        });
    }
}
