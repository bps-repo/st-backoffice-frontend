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
import {Level} from 'src/app/core/models/course/level';
import {ChartModule} from 'primeng/chart';
import {RippleModule} from 'primeng/ripple';
import * as LevelSelectors from "../../../../../../core/store/schoolar/level/level.selector";
import {LevelActions} from "../../../../../../core/store/schoolar/level/levelActions";

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
        FormsModule,
        ProgressSpinnerModule,
        ChartModule,
        RippleModule
    ]
})
export class DetailComponent implements OnInit {

    levelId: string = '';
    level$: Observable<Level | null>;
    level: Level | null = null;
    editableLevel: Level | null = null;
    loading$: Observable<boolean>;
    loading: boolean = true;

    // Chart properties
    unitsChartData: any;
    unitsChartOptions: any;
    enrollmentChartData: any;
    enrollmentChartOptions: any;
    completionRateChartData: any;
    completionRateChartOptions: any;

    constructor(private route: ActivatedRoute, private store: Store) {
        this.level$ = this.store.select(LevelSelectors.selectSelectedLevel);
        this.loading$ = this.store.select(LevelSelectors.selectLoading);
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.levelId = params['id'];
            this.loadLevel();
        });

        this.level$.subscribe(level => {
            this.level = level;
            this.editableLevel = level ? {...level} : null;

            // Initialize charts when level data is available
            if (level) {
                this.initUnitsChart();
                this.initEnrollmentChart();
                this.initCompletionRateChart();
            }
        });

        this.loading$.subscribe(loading => {
            this.loading = loading;
        });
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
