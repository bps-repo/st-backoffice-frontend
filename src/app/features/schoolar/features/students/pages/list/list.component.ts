import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
    TableColumn,
    GlobalTable,
} from 'src/app/shared/components/tables/global-table/global-table.component';
import { Student } from 'src/app/core/models/academic/student';
import { TableService } from 'src/app/shared/services/table.service';
import { Store } from '@ngrx/store';
import {
    studentsActions,
    selectAllStudents,
    selectExamLoading
} from 'src/app/core/store/schoolar';
import { Observable, Subject, takeUntil, map } from 'rxjs';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';

type studentKeys = keyof Student;

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

    columns: TableColumn[] = [];
    globalFilterFields: string[] = ['id', 'name', 'center', 'level', 'phone', 'email', 'course'];

    // Chart data
    centerChartData: any;
    levelChartData: any;
    chartOptions: any;

    private destroy$ = new Subject<void>();

    constructor(
        private tableService: TableService<Student>,
        private store: Store
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

        // Define custom column templates for different filter types
        this.columns = [
            {
                field: 'id',
                header: 'Nº',
                filterType: 'text',
            },
            {
                field: 'name',
                header: 'Nome',
                filterType: 'text',
            },
            {
                field: 'email',
                header: 'Email',
                filterType: 'text',
            },
            {
                field: 'center',
                header: 'Centro',
                filterType: 'text',
            },
            {
                field: 'course',
                header: 'Curso',
                filterType: 'text',
            },
            {
                field: 'level',
                header: 'Nível',
                filterType: 'text',
            },
            {
                field: 'phone',
                header: 'Telefone',
                filterType: 'text',
            },
            {
                field: 'birthdate',
                header: 'Data de Nascimento',
                filterType: 'date',
            },
        ];
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
