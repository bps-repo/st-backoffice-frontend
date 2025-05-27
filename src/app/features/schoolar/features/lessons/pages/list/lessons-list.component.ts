import {CommonModule} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {DialogModule} from 'primeng/dialog';
import {ToastModule} from 'primeng/toast';
import {Lesson} from 'src/app/core/models/academic/lesson';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {SelectItem} from 'primeng/api';
import {LEVELS} from 'src/app/shared/constants/app';
import {INSTALATIONS} from 'src/app/shared/constants/representatives';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {ClassesService} from '../../../../../../core/services/classes.service';
import {GlobalTable} from 'src/app/shared/components/tables/global-table/global-table.component';
import {Store} from '@ngrx/store';
import {lessonsActions} from 'src/app/core/store/schoolar';
import {Subject, takeUntil} from 'rxjs';
import {selectAllClasses, selectLoadingClass} from "../../../../../../core/store/schoolar/selectors/classes.selectors";
import {Router, RouterModule} from '@angular/router';
import {ChartModule} from 'primeng/chart';
import {CardModule} from 'primeng/card';
import {LessonStatus} from "../../../../../../core/enums/lesson-status";

@Component({
    selector: 'app-lessons',
    imports: [
        GlobalTable,
        DialogModule,
        ToastModule,
        CommonModule,
        DropdownModule,
        InputTextModule,
        InputTextareaModule,
        FormsModule,
        ButtonModule,
        RouterModule,
        ChartModule,
        CardModule
    ],
    templateUrl: './lessons-list.component.html'
})
export class LessonsListComponent implements OnInit, OnDestroy {
    lesson: Lesson = {} as Lesson;
    lessons: Lesson[] = [];
    lessonToCreate: Lesson = {} as Lesson;
    classes: Lesson[] = [];
    loading = false;

    instalations: any[] = INSTALATIONS;
    selected: SelectItem[] = [];
    types: any[] = ['VIP', 'Online', 'In Center'];
    levels = LEVELS;
    columns: any[] = [];
    globalFilterFields: string[] = [];
    // createClassDialog property removed as we now use a page instead of a dialog
    deleteClasstDialog: boolean = false;

    // Chart data
    centerChartData: any;
    classChartData: any;
    teacherChartData: any;
    statusChartData: any;
    dateChartData: any;
    chartOptions: any;

    private destroy$ = new Subject<void>();

    constructor(
        private classeService: ClassesService,
        private store: Store,
        private router: Router
    ) {
        this.columns = [
            {field: 'id', header: 'ID'},
            {field: 'name', header: 'Turma'},
            {field: 'startDate', header: 'Data Início'},
            {field: 'endDate', header: 'Data Fim'},
            {field: 'teacher.name', header: 'Professor'},
            {field: 'center.name', header: 'Centro'},
            {field: 'level.name', header: 'Nível'},
            {field: 'status', header: 'Status'},
            {field: 'maxCapacity', header: 'Capacidade'},
        ];

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


        // Generate chart data
        this.generateChartData();
    }

    ngOnInit(): void {
        // Subscribe to dialog state
        this.classeService.deleteClassDialog$
            .pipe(takeUntil(this.destroy$))
            .subscribe((state) => {
                this.deleteClasstDialog = state;
            });

        // Dispatch action to load lessons
        this.store.dispatch(lessonsActions.loadLessons());

        // Subscribe to lessons from store
        this.store.select(selectAllClasses)
            .pipe(takeUntil(this.destroy$))
            .subscribe(classes => {
                this.classes = classes;
            });

        // Subscribe to loading state
        this.store.select(selectLoadingClass)
            .pipe(takeUntil(this.destroy$))
            .subscribe(loading => {
                this.loading = loading;
            });
    }

    ngOnDestroy(): void {
        this.classeService.setDeleteClassDialogState(false);
        this.destroy$.next();
        this.destroy$.complete();
    }

    saveClass(): void {
        if (this.lessonToCreate.id) {
            this.store.dispatch(lessonsActions.updateLesson({lesson: this.lessonToCreate}));
        } else {
            this.store.dispatch(lessonsActions.createLesson({lesson: this.lessonToCreate}));
        }
        this.hideDialog();
    }

    hideDialog() {
        this.classeService.setDeleteClassDialogState(false);
        this.lessonToCreate = {} as Lesson;
    }

    navigateToCreateLesson() {
        this.router.navigate(['/schoolar/lessons/create']);
    }

    confirmDelete() {
        if (this.lessonToCreate.id) {
            this.store.dispatch(lessonsActions.deleteLesson({id: this.lessonToCreate.id}));
        }
        this.hideDialog();
    }

    /**
     * Generate chart data from lessons
     */
    generateChartData(): void {
        if (!this.classes || this.classes.length === 0) {
            return;
        }

        // Count lessons by center
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

        // Count lessons by class
        const classCounts = this.countByProperty(this.classes, 'classEntity');
        this.classChartData = {
            labels: Object.keys(classCounts),
            datasets: [
                {
                    data: Object.values(classCounts),
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

        // Count lessons by teacher
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

        // Count lessons by status
        const statusCounts = this.countByProperty(this.classes, 'status');
        this.statusChartData = {
            labels: Object.keys(statusCounts),
            datasets: [
                {
                    data: Object.values(statusCounts),
                    backgroundColor: [
                        '#4BC0C0', // Booked - Green
                        '#FF6384', // Cancelled - Red
                        '#FFCE56', // Completed - Yellow
                        '#9966FF'  // Other - Purple
                    ]
                }
            ]
        };

        // Group lessons by date (for the current week)
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        const dateLabels = [];
        const dateCounts = {};

        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            const dateString = date.toISOString().split('T')[0];
            dateLabels.push(this.formatDate(dateString));
            //dateCounts[this.formatDate(dateString)] = 0;
        }

        this.classes.forEach(lesson => {
            if (lesson.startDatetime) {
                const lessonDate = new Date(lesson.startDatetime);
                const dateString = this.formatDate(lessonDate.toISOString());
                // if (dateCounts[dateString] !== undefined) {
                //     dateCounts[dateString]++;
                // }
            }
        });

        this.dateChartData = {
            labels: dateLabels,
            datasets: [
                {
                    label: 'Lessons per Day',
                    data: Object.values(dateCounts),
                    backgroundColor: '#36A2EB',
                    borderColor: '#36A2EB',
                    fill: false
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

    /**
     * Format date for display
     */
    private formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    }
}
