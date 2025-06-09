import {Component, OnInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {
    TableColumn,
    GlobalTable,
} from 'src/app/shared/components/tables/global-table/global-table.component';
import {Student} from 'src/app/core/models/academic/student';
import {TableService} from 'src/app/shared/services/table.service';
import {Store} from '@ngrx/store';
import {
    studentsActions,
    selectAllStudents,
    selectExamLoading
} from 'src/app/core/store/schoolar';
import {Observable, Subject, takeUntil, map} from 'rxjs';
import {ChartModule} from 'primeng/chart';
import {ButtonModule} from 'primeng/button';
import {COLUMNS, GLOBAL_FILTERS, HEADER_ACTIONS} from "../../constants";
import {TableHeaderAction} from "../../../../../../shared/components/tables/global-table/table-header.component";

@Component({
    selector: 'app-list',
    imports: [
        CommonModule,
        RouterModule,
        GlobalTable,
        ChartModule,
        ButtonModule
    ],
    templateUrl: './list.component.html'
})
export class ListComponent implements OnInit, OnDestroy {
    students$: Observable<Student[]>;
    loading$: Observable<boolean>;
    columns: TableColumn[] = COLUMNS;
    globalFilterFields: string[] = GLOBAL_FILTERS;

    headerActions: TableHeaderAction[] = HEADER_ACTIONS;

    // Chart data
    centerChartData: any;
    levelChartData: any;
    unitChartData: any;
    statusChartData: any;
    classChartData: any;
    unitProgressChartData: any;
    chartOptions: any;

    private destroy$ = new Subject<void>();

    constructor(
        private tableService: TableService<Student>,
        private store: Store,
        private router: Router
    ) {
        // Use the entity selectors
        this.students$ = this.store.select(selectAllStudents);
        this.loading$ = this.store.select(selectExamLoading);

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

        // Generate chart data from students
        this.generateChartData();
    }

    ngOnInit(): void {
        // Dispatch action to load students
        this.store.dispatch(studentsActions.loadStudents());
        this.headerActions.push(
            {
                label: "Adicionar ao Centro",
                icon: "pi pi-plus",
                command: () => this.router.navigate(['/schoolar/students/add-to-center']),
            },
            {
                label: 'Adicionar à turma',
                icon: 'pi pi-plus',
                command: () => this.router.navigate(['/schoolar/students/add-to-class']).then(r => null)
            },
            {
                label: "Criar contracto",
                icon: "pi pi-file",
                command: () => this.router.navigate(['/schoolar/students/create-contract']),
            },
        )
    }

    /**
     * Generate chart data from students
     */
    generateChartData(): void {
        // Subscribe to students$ to generate chart data
        this.students$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(students => {
            // Generate center chart data
            const centerCounts = this.countByProperty(students, 'center');
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

            // Generate level chart data
            const levelCounts = this.countByProperty(students, 'level');
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

            // Generate unit chart data
            const unitCounts = this.countByProperty(students, 'unit');
            this.unitChartData = {
                labels: Object.keys(unitCounts).map(key => key ? key : 'Not Assigned'),
                datasets: [
                    {
                        data: Object.values(unitCounts),
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

            // Generate class chart data
            const classCounts = this.countByProperty(students, 'classEntity');
            this.classChartData = {
                labels: Object.keys(classCounts).map(key => key ? key : 'Not Assigned'),
                datasets: [
                    {
                        data: Object.values(classCounts),
                        backgroundColor: [
                            '#36A2EB',
                            '#FF9F40',
                            '#4BC0C0',
                            '#FF6384',
                            '#FFCE56',
                            '#9966FF'
                        ]
                    }
                ]
            };

            // Generate status chart data (mock data since status is not in the Student model)
            const statusData = {
                'Active': Math.floor(students.length * 0.7),
                'Inactive': Math.floor(students.length * 0.1),
                'Graduated': Math.floor(students.length * 0.1),
                'On Leave': Math.floor(students.length * 0.1)
            };
            this.statusChartData = {
                labels: Object.keys(statusData),
                datasets: [
                    {
                        data: Object.values(statusData),
                        backgroundColor: [
                            '#4BC0C0', // Active - Green
                            '#FF6384', // Inactive - Red
                            '#FFCE56', // Graduated - Yellow
                            '#9966FF'  // On Leave - Purple
                        ]
                    }
                ]
            };

            // Generate unit progress chart data (mock data since unitProgress is not in the Student model)
            const progressData = {
                'Not Started': Math.floor(students.length * 0.2),
                '0-25%': Math.floor(students.length * 0.2),
                '26-50%': Math.floor(students.length * 0.2),
                '51-75%': Math.floor(students.length * 0.2),
                '76-100%': Math.floor(students.length * 0.2)
            };
            this.unitProgressChartData = {
                labels: Object.keys(progressData),
                datasets: [
                    {
                        data: Object.values(progressData),
                        backgroundColor: [
                            '#FF6384', // Not Started - Red
                            '#FF9F40', // 0-25% - Orange
                            '#FFCE56', // 26-50% - Yellow
                            '#36A2EB', // 51-75% - Blue
                            '#4BC0C0'  // 76-100% - Green
                        ]
                    }
                ]
            };
        });
    }

    /**
     * Count students by a specific property
     * @param students Array of students
     * @param property Property to count by
     * @returns Object with counts by property value
     */
    countByProperty(students: Student[], property: keyof Student): Record<string, number> {
        const counts: Record<string, number> = {};

        students.forEach(student => {
            const value = student[property] as string;
            if (value) {
                counts[value] = (counts[value] || 0) + 1;
            }
        });
        return counts;
    }

    /**
     * Navigate to student detail
     * @param student The selected student
     */
    onRowSelect(student: Student): void {
        // You can use the router to navigate to the student detail page
        // this.router.navigate(['/schoolar/students', student.id]);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
