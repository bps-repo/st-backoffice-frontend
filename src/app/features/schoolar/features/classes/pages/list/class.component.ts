import {Component, OnInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {
    TableColumn,
    GlobalTable,
} from 'src/app/shared/components/tables/global-table/global-table.component';
import {Store} from '@ngrx/store';
import {Observable, Subject} from 'rxjs';
import {ChartModule} from 'primeng/chart';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {CLASSES_COLUMNS, GLOBAL_CLASSES_FILTERS} from "../../classes.constants";
import {ClassState} from "../../../../../../core/store/schoolar/classes/classState";
import {ClassesActions} from "../../../../../../core/store/schoolar/classes/classesActions";
import {Class} from "../../../../../../core/models/academic/class";
import * as ClassSelectors from "../../../../../../core/store/schoolar/classes/classes.selectors";
import {selectCenterById} from "../../../../../../core/store/corporate/center/centers.selector";
import {take} from "rxjs/operators";
import {selectUnitById} from "../../../../../../core/store/schoolar/units/unit.selectors";
import {selectLevelById} from "../../../../../../core/store/schoolar/level/level.selector";
import {CenterActions} from "../../../../../../core/store/corporate/center/centers.actions";
import {UnitActions} from "../../../../../../core/store/schoolar/units/unit.actions";
import {LevelActions} from "../../../../../../core/store/schoolar/level/level.actions";
import {BadgeModule} from "primeng/badge";
import {ProgressSpinnerModule} from "primeng/progressspinner";

@Component({
    selector: 'app-general',
    imports: [
        GlobalTable,
        CommonModule,
        RouterModule,
        ChartModule,
        ButtonModule,
        CardModule,
        BadgeModule,
        ProgressSpinnerModule
    ],
    templateUrl: './class.component.html'
})
export class ClassComponent implements OnInit, OnDestroy {
    classes$: Observable<Class[]>;

    classes: Class[] = [];

    columns: TableColumn[] = CLASSES_COLUMNS;

    globalFilterFields: string[] = GLOBAL_CLASSES_FILTERS;

    loading$: Observable<boolean> = this.store$.select(ClassSelectors.selectClassesLoading);

    // Chart data
    centerChartData: any;

    levelChartData: any;

    teacherChartData: any;

    statusChartData: any;

    enrollmentChartData: any;

    chartOptions: any;

    private destroy$ = new Subject<void>();

    error$: Observable<string | null> = this.store$.select(ClassSelectors.selectClassesError);

    constructor(private store$: Store, private router: Router) {
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

        this.classes$ = this.store$.select(ClassSelectors.selectAllClasses)

        this.loading$ = this.store$.select(ClassSelectors.selectClassesLoading);

        this.classes$.subscribe(classes => {
            this.classes = classes;
            this.generateChartData();
        })
    }

    ngOnInit(): void {
        this.store$.dispatch(CenterActions.loadCenters())
        this.store$.dispatch(LevelActions.loadLevels())
        this.store$.dispatch(ClassesActions.loadClasses())
        this.generateChartData();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Generate chart data from classes
     */
    generateChartData(): void {
        // Count classes by center
        const centerCounts = this.countByProperty(this.classes, 'center');
        this.centerChartData = {
            labels: Object.keys(centerCounts),
            datasets: [
                {
                    data: Object.values(centerCounts),
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40'
                    ]
                }
            ]
        };

        // Count classes by level
        const levelCounts = this.countByProperty(this.classes, 'level');
        this.levelChartData = {
            labels: Object.keys(levelCounts),
            datasets: [
                {
                    data: Object.values(levelCounts),
                    backgroundColor: [
                        '#4BC0C0',
                        '#FF6384',
                        '#FFCE56',
                        '#36A2EB',
                        '#9966FF',
                        '#FF9F40'
                    ]
                }
            ]
        };

        // Count classes by teacher
        const teacherCounts = this.countByProperty(this.classes, 'teacher');
        this.teacherChartData = {
            labels: Object.keys(teacherCounts),
            datasets: [
                {
                    data: Object.values(teacherCounts),
                    backgroundColor: [
                        '#FF9F40',
                        '#4BC0C0',
                        '#FF6384',
                        '#FFCE56',
                        '#36A2EB',
                        '#9966FF'
                    ]
                }
            ]
        };

        // Count classes by status
        const statusCounts = this.countByProperty(this.classes, 'status');
        this.statusChartData = {
            labels: Object.keys(statusCounts),
            datasets: [
                {
                    data: Object.values(statusCounts),
                    backgroundColor: [
                        '#4BC0C0', // Active - Green
                        '#FF6384', // Inactive - Red
                        '#FFCE56', // Completed - Yellow
                        '#9966FF', // Cancelled - Purple
                        '#36A2EB'  // Suspended - Blue
                    ]
                }
            ]
        };

        // Create enrollment data (enrolled vs capacity)
        const totalEnrolled = this.classes.reduce((sum, cls) => sum, 0);
        const totalCapacity = this.classes.reduce((sum, cls) => sum + cls.maxCapacity, 0);
        const availableSpots = totalCapacity - totalEnrolled;

        this.enrollmentChartData = {
            labels: ['Inscritos', 'Disponíveis'],
            datasets: [
                {
                    data: [totalEnrolled, availableSpots],
                    backgroundColor: [
                        '#36A2EB', // Enrolled - Blue
                        '#FFCE56'  // Available - Yellow
                    ]
                }
            ]
        };
    }

    /**
     * Count items by a specific property
     */
    private countByProperty(items: any[], property: string): Record<string, number> {
        return items.reduce((counts, item) => {
            const value = typeof item[property] === 'object' ?
                (item[property]?.name || 'Not Assigned') :
                (item[property] || 'Not Assigned');

            counts[value] = (counts[value] || 0) + 1;
            return counts;
        }, {});
    }

    createEntity() {
        this.router.navigate(['/schoolar/classes/create']);
    }

    getCenterName(centerId: any) {
        let centerName = '';
        this.store$.select(selectCenterById(centerId)).pipe(
            take(1)
        ).subscribe(center => {
            centerName = center?.name ?? 'Centro não encontrado';
        });
        return centerName;
    }

    getLevelName(levelId: any) {
        let levelName = '';
        this.store$.select(selectLevelById(levelId)).pipe(
            take(1)
        ).subscribe(level => {
            levelName = level?.name ?? 'Nível não encontrada';
        });
        return levelName;
    }
}
