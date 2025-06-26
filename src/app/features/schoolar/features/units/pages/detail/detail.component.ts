// student.component.ts
import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {SkeletonModule} from 'primeng/skeleton';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {Unit} from 'src/app/core/models/course/unit';
import {Level} from 'src/app/core/models/course/level';
import {RippleModule} from "primeng/ripple";
import {ChartModule} from 'primeng/chart';

@Component({
    selector: 'app-unit-student',
    templateUrl: './detail.component.html',
    standalone: true,
    imports: [
        CommonModule,
        SkeletonModule,
        InputTextModule,
        InputTextareaModule,
        ButtonModule,
        FormsModule,
        ProgressSpinnerModule,
        RippleModule,
        ChartModule
    ]
})
export class DetailComponent implements OnInit {

    unitId: string = '';
    unit$: Observable<Unit | null>;
    unit: Unit | null = null;
    editableUnit: Unit | null = null;
    loading$: Observable<boolean>;
    loading: boolean = true;
    levels: Level[] = [];

    // Chart properties
    progressChartData: any;
    progressChartOptions: any;
    assessmentChartData: any;
    assessmentChartOptions: any;
    lessonDistributionData: any;
    lessonDistributionOptions: any;


    constructor(private route: ActivatedRoute, private store: Store) {
        this.unit$ = this.store.select(selectSelectedUnit);
        this.loading$ = this.store.select(selectUnitLoading);
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.unitId = params['id'];
            this.loadUnit();
        });

        // Carrega níveis
        this.store.dispatch(LevelActions.loadLevels());

        this.store.select(selectAllLevels).subscribe(levels => {
            this.levels = levels;
            this.setUnitLevel();
        });

        this.unit$.subscribe(unit => {
            this.unit = unit;
            this.editableUnit = unit ? {...unit} : null;
            this.setUnitLevel();

            // Initialize charts when unit data is available
            if (unit) {
                this.initProgressChart();
                this.initAssessmentChart();
                this.initLessonDistributionChart();
            }
        });

        this.loading$.subscribe(loading => {
            this.loading = loading;
        });
    }

    initProgressChart(): void {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        // general data - in a real app, this would come from the unit data
        this.progressChartData = {
            labels: ['Completed', 'In Progress', 'Not Started'],
            datasets: [
                {
                    data: [65, 25, 10],
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

        this.progressChartOptions = {
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
                    text: 'Student Progress',
                    font: {
                        size: 16
                    }
                }
            },
            cutout: '60%'
        };
    }

    initAssessmentChart(): void {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        // general data - in a real app, this would come from the unit's assessment data
        this.assessmentChartData = {
            labels: ['Excellent', 'Good', 'Average', 'Poor'],
            datasets: [
                {
                    label: 'Assessment Results',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    data: [40, 30, 20, 10]
                }
            ]
        };

        this.assessmentChartOptions = {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Assessment Performance',
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

    initLessonDistributionChart(): void {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        // general data - in a real app, this would come from the unit's lessons
        this.lessonDistributionData = {
            labels: ['Theory', 'Practice', 'Assessment', 'Review'],
            datasets: [
                {
                    data: [30, 40, 15, 15],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--primary-800'),
                        documentStyle.getPropertyValue('--primary-600'),
                        documentStyle.getPropertyValue('--primary-400'),
                        documentStyle.getPropertyValue('--primary-200'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--primary-700'),
                        documentStyle.getPropertyValue('--primary-500'),
                        documentStyle.getPropertyValue('--primary-300'),
                        documentStyle.getPropertyValue('--primary-100'),
                    ]
                }
            ]
        };

        this.lessonDistributionOptions = {
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
                    text: 'Lesson Type Distribution',
                    font: {
                        size: 16
                    }
                }
            }
        };
    }

    loadUnit(): void {
        this.store.dispatch(UnitActions.loadUnit({id: this.unitId}));
    }

    editUnit(): void {

        if (this.editableUnit) {
            const updatedUnit: any = {
                name: this.editableUnit.name,
                description: this.editableUnit.description,
                orderUnit: this.editableUnit.orderUnit,

            };

            this.store.dispatch(UnitActions.updateUnit({id: this.unitId, unit: updatedUnit}));
        }
    }

    setUnitLevel(): void {
        if (this.unit && this.levels.length > 0) {
            const matchedLevel = this.levels.find(l => l.id === this.unit?.levelId);
            if (matchedLevel) {
                this.unit = {
                    ...this.unit,
                    level: matchedLevel
                };
                this.editableUnit = {...this.unit};
            }
        }
    }

    downloadUnitDetails(): void {
        console.log('Downloading unit details:', this.unit);
        alert('Download dos detalhes do Nível iniciado');
    }

    sendUnitDetails(): void {
        console.log('Sending unit details:', this.unit?.name);
        alert('Detalhes do Nível enviados para ' + this.unit?.name);
    }
}
