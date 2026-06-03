import {Component, OnDestroy, OnInit, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {Subject, switchMap, takeUntil} from 'rxjs';
import {Actions, ofType} from '@ngrx/effects';
import {SkeletonModule} from 'primeng/skeleton';
import {InputTextModule} from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import {InputNumberModule} from 'primeng/inputnumber';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {Unit, toUpdateUnitPayload} from 'src/app/core/models/course/unit';
import {Level} from 'src/app/core/models/course/level';
import {RippleModule} from 'primeng/ripple';
import {ChartModule} from 'primeng/chart';
import {UnitActions} from '../../../../../../core/store/schoolar/units/unit.actions';
import {selectUnitById, selectLoading, selectLoadingUpdate} from '../../../../../../core/store/schoolar/units/unit.selectors';
import {ShowToastErrorService} from '../../../../../../shared/services/show-toast-error-service';


@Component({
    selector: 'app-unit-student',
    templateUrl: './detail.component.html',
    standalone: true,
    imports: [
        CommonModule,
        SkeletonModule,
        InputTextModule,
        TextareaModule,
        InputNumberModule,
        ButtonModule,
        FormsModule,
        ProgressSpinnerModule,
        ToastModule,
        RippleModule,
        ChartModule,
    ],
    providers: [MessageService],
})
export class DetailComponent implements OnInit, OnDestroy {
    private route = inject(ActivatedRoute);
    private store = inject(Store);
    private actions$ = inject(Actions);
    private messageService = inject(MessageService);

    unitId = '';
    unit: Unit | null = null;
    editableUnit: Unit | null = null;
    loading = true;
    saving = false;
    levels: Level[] = [];

    private destroy$ = new Subject<void>();

    progressChartData: any;
    progressChartOptions: any;
    assessmentChartData: any;
    assessmentChartOptions: any;
    lessonDistributionData: any;
    lessonDistributionOptions: any;

    ngOnInit(): void {
        this.route.params.pipe(
            switchMap((params) => {
                this.unitId = params['id'];
                this.loading = true;
                this.store.dispatch(UnitActions.loadUnit({id: this.unitId}));
                return this.store.select(selectUnitById(this.unitId));
            }),
            takeUntil(this.destroy$),
        ).subscribe((unit) => {
            this.unit = unit;
            this.editableUnit = unit ? {...unit} : null;
            this.loading = false;
            this.setUnitLevel();

            if (unit) {
                this.initProgressChart();
                this.initAssessmentChart();
                this.initLessonDistributionChart();
            }
        });

        this.store.select(selectLoading).pipe(takeUntil(this.destroy$)).subscribe((loading) => {
            if (this.unitId) {
                this.loading = loading;
            }
        });

        this.store.select(selectLoadingUpdate).pipe(takeUntil(this.destroy$)).subscribe((saving) => {
            this.saving = saving;
        });

        this.actions$.pipe(
            ofType(UnitActions.updateUnitSuccess),
            takeUntil(this.destroy$),
        ).subscribe(() => {
            this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Unidade atualizada com sucesso.',
            });
        });

        this.actions$.pipe(
            ofType(UnitActions.updateUnitFailure),
            takeUntil(this.destroy$),
        ).subscribe(({error}) => {
            ShowToastErrorService.showToastError(
                'Erro',
                error,
                this.messageService,
                'Falha ao atualizar unidade.',
            );
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    initProgressChart(): void {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

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
                    ],
                },
            ],
        };

        this.progressChartOptions = {
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
                    text: 'Student Progress',
                    font: {size: 16},
                },
            },
            cutout: '60%',
        };
    }

    initAssessmentChart(): void {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.assessmentChartData = {
            labels: ['Excellent', 'Good', 'Average', 'Poor'],
            datasets: [
                {
                    label: 'Assessment Results',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    data: [40, 30, 20, 10],
                },
            ],
        };

        this.assessmentChartOptions = {
            responsive: true,
            plugins: {
                legend: {display: false},
                title: {
                    display: true,
                    text: 'Assessment Performance',
                    font: {size: 16},
                },
            },
            scales: {
                x: {
                    ticks: {color: textColor},
                    grid: {color: documentStyle.getPropertyValue('--surface-border')},
                },
                y: {
                    beginAtZero: true,
                    ticks: {color: textColor},
                    grid: {color: documentStyle.getPropertyValue('--surface-border')},
                },
            },
        };
    }

    initLessonDistributionChart(): void {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

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
                    ],
                },
            ],
        };

        this.lessonDistributionOptions = {
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
                    text: 'Lesson Type Distribution',
                    font: {size: 16},
                },
            },
        };
    }

    saveUnit(): void {
        if (!this.editableUnit || !this.unitId) {
            return;
        }

        const payload = toUpdateUnitPayload({
            name: this.editableUnit.name.trim(),
            description: this.editableUnit.description.trim(),
            orderUnit: this.editableUnit.orderUnit,
            maximumAssessmentAttempt: this.editableUnit.maximumAssessmentAttempt,
        });

        this.store.dispatch(UnitActions.updateUnit({id: this.unitId, unit: payload}));
    }

    setUnitLevel(): void {
        if (this.unit && this.levels.length > 0) {
            const matchedLevel = this.levels.find((l) => l.id === this.unit?.levelId);
            if (matchedLevel) {
                this.unit = {...this.unit, level: matchedLevel};
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
