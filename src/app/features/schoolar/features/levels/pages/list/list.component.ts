import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    HostListener,
    AfterViewInit,
    inject,
    signal,
    computed,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {ConfirmationService} from 'primeng/api';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {Level} from 'src/app/core/models/course/level';
import {Unit} from 'src/app/core/models/course/unit';
import {RippleModule} from 'primeng/ripple';
import {InputTextModule} from 'primeng/inputtext';
import {SelectModule} from 'primeng/select';
import {TabsModule} from 'primeng/tabs';
import {CardModule} from 'primeng/card';
import {BadgeModule} from 'primeng/badge';
import {TooltipModule} from 'primeng/tooltip';
import {SelectButtonModule} from 'primeng/selectbutton';
import {FormsModule} from '@angular/forms';
import {KpiIndicatorsComponent, Kpi} from '../../../../../../shared/kpi-indicator/kpi-indicator.component';
import {ProgressBarModule} from 'primeng/progressbar';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ChipModule} from 'primeng/chip';
import {PaginatorModule} from 'primeng/paginator';
import {LevelService} from 'src/app/core/services/level.service';
import {UnitService} from 'src/app/core/services/unit.service';
import {EditUnitDialogComponent} from '../../../units/dialogs/edit-unit-dialog/edit-unit-dialog.component';
import {ViewUnitDetailDialogComponent} from '../../../units/dialogs/view-unit-detail-dialog/view-unit-detail-dialog.component';

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
        PaginatorModule,
        EditUnitDialogComponent,
        ViewUnitDetailDialogComponent,
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
    private levelService = inject(LevelService);
    private unitService = inject(UnitService);
    private confirmationService = inject(ConfirmationService);

    @ViewChild('mainHeader') mainHeader!: ElementRef;
    @ViewChild('viewSelector') viewSelector!: ElementRef;
    @ViewChild(EditUnitDialogComponent) editUnitDialog!: EditUnitDialogComponent;
    @ViewChild(ViewUnitDetailDialogComponent) viewUnitDialog!: ViewUnitDetailDialogComponent;

    units = signal<Unit[]>([]);
    unitsByLevel = computed(() => {
        const map: Record<string, Unit[]> = {};
        for (const unit of this.units()) {
            (map[unit.levelId] ??= []).push(unit);
        }
        return map;
    });

    paginatedLevels = signal<Level[]>([]);
    filterLevelOptions = signal<Level[]>([]);
    totalRecords = signal(0);
    pageSize = 10;
    currentPage = 0;
    listLoading = signal(false);
    unitsLoading = signal(false);

    expandedLevels = signal<Set<string>>(new Set());
    selectedLevelId = signal<string | null>(null);
    currentTab = 0;
    isMainHeaderSticky = false;
    isViewSelectorSticky = false;

    kpis = signal<Kpi[]>([]);

    levelColors = [
        '#3B82F6',
        '#10B981',
        '#F59E0B',
        '#EF4444',
        '#8B5CF6',
        '#EC4899',
        '#06B6D4',
        '#F97316',
    ];

    ngOnInit(): void {
        this.loadUnits();
        this.loadPaginatedLevels();
        this.loadFilterOptions();
        this.initializeKpis();
    }

    private loadUnits(): void {
        this.unitsLoading.set(true);
        this.unitService.loadUnits().subscribe({
            next: (units) => {
                this.units.set(units.filter((u) => !u.generic));
                this.unitsLoading.set(false);
                this.updateUnitsKpi();
            },
            error: () => {
                this.units.set([]);
                this.unitsLoading.set(false);
                this.updateUnitsKpi();
            },
        });
    }

    private loadFilterOptions(): void {
        this.levelService.getLevels().subscribe({
            next: (levels) => {
                this.filterLevelOptions.set(levels ?? []);
            },
        });
    }

    ngAfterViewInit(): void {
        setTimeout(() => this.checkStickyState(), 100);
    }

    @HostListener('window:scroll')
    onWindowScroll(): void {
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
        this.kpis.set([
            {
                label: 'Total de níveis',
                value: this.totalRecords(),
                icon: {label: 'layers', color: 'text-blue-500', type: 'mat'},
            },
            {
                label: 'Total de unidades',
                value: this.units().length,
                icon: {label: 'book', color: 'text-green-500', type: 'mat'},
            },
        ]);
    }

    private updateKpiTotalLevels(): void {
        if (this.selectedLevelId()) return;

        this.kpis.update((items) =>
            items.map((k) =>
                k.label === 'Total de níveis' ? {...k, value: this.totalRecords()} : k,
            ),
        );
    }

    private updateUnitsKpi(): void {
        this.kpis.update((items) =>
            items.map((k) =>
                k.label === 'Total de unidades' ? {...k, value: this.units().length} : k,
            ),
        );
    }

    loadPaginatedLevels(): void {
        const levelId = this.selectedLevelId();
        this.listLoading.set(true);

        if (levelId) {
            this.levelService.getLevelById(levelId).subscribe({
                next: (level) => {
                    this.paginatedLevels.set([level]);
                    this.totalRecords.set(1);
                    this.currentPage = 0;
                    this.listLoading.set(false);
                    this.updateKpiTotalLevels();
                },
                error: () => {
                    this.paginatedLevels.set([]);
                    this.totalRecords.set(0);
                    this.listLoading.set(false);
                    this.updateKpiTotalLevels();
                },
            });
            return;
        }

        this.levelService.getLevelsPaginated(this.currentPage, this.pageSize).subscribe({
            next: (page) => {
                this.paginatedLevels.set(page.content ?? []);
                this.totalRecords.set(page.totalElements ?? 0);
                this.listLoading.set(false);
                this.updateKpiTotalLevels();
            },
            error: () => {
                this.paginatedLevels.set([]);
                this.totalRecords.set(0);
                this.listLoading.set(false);
                this.updateKpiTotalLevels();
            },
        });
    }

    onPageChange(event: { first?: number; rows?: number }): void {
        const rows = event.rows ?? this.pageSize;
        this.currentPage = Math.floor((event.first ?? 0) / rows);
        this.pageSize = rows;
        this.loadPaginatedLevels();
    }

    onLevelFilterChange(levelId: string | null | undefined): void {
        this.selectedLevelId.set(levelId ?? null);
        this.currentPage = 0;
        this.paginatedLevels.set([]);
        this.loadPaginatedLevels();
    }

    onTabChange(_event: unknown): void {
        // Tab change handler — index available when needed
    }

    toggleExpand(levelId: string): void {
        this.expandedLevels.update((current) => {
            const next = new Set(current);
            if (next.has(levelId)) {
                next.delete(levelId);
            } else {
                next.add(levelId);
            }
            return next;
        });
    }

    isExpanded(levelId: string): boolean {
        return this.expandedLevels().has(levelId);
    }

    getLevelColor(index: number): string {
        return this.levelColors[index % this.levelColors.length];
    }

    getLevelColorForPage(index: number): string {
        return this.getLevelColor(this.currentPage * this.pageSize + index);
    }

    viewDetails(level: Level): void {
        this.router.navigate(['/schoolar/levels', level.id]).then();
    }

    viewUnit(unit: Unit, level: Level): void {
        this.viewUnitDialog.show(unit, level.name);
    }

    editUnit(unit: Unit): void {
        this.editUnitDialog.show(unit);
    }

    onUnitUpdated(updated: Unit): void {
        this.units.update((list) =>
            list.map((u) => (u.id === updated.id ? updated : u)),
        );
        this.updateUnitsKpi();
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
                this.levelService.deleteLevel(level.id).subscribe({
                    next: () => this.loadPaginatedLevels(),
                });
            },
        });
    }
}
