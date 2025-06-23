import {Component, OnInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {
    TableColumn,
    GlobalTable,
} from 'src/app/shared/components/tables/global-table/global-table.component';
import {TableService} from 'src/app/shared/services/table.service';
import {Class} from 'src/app/core/models/academic/class';
import {Store} from '@ngrx/store';
import {Observable, Subject} from 'rxjs';
import {ChartModule} from 'primeng/chart';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';

@Component({
    selector: 'app-list',
    imports: [
        GlobalTable,
        CommonModule,
        RouterModule,
        ChartModule,
        ButtonModule,
        CardModule
    ],
    templateUrl: './class.component.html'
})
export class ClassComponent implements OnInit, OnDestroy {
    classes: any[] = []; // This would be populated from a service
    columns: TableColumn[] = [];
    globalFilterFields: string[] = [];
    loading = false;

    // Chart data
    centerChartData: any;
    levelChartData: any;
    teacherChartData: any;
    statusChartData: any;
    enrollmentChartData: any;
    chartOptions: any;

    private destroy$ = new Subject<void>();

    constructor(private tableService: TableService<any>, private store: Store, private router: Router) {
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
        // In a real app, we would dispatch an action to load classes
        // this.store.dispatch(classesActions.loadClasses());

        // Mock data for classes
        this.classes = [
            {
                id: 1,
                name: 'English Beginner',
                code: 'ENG101',
                level: 'Beginner',
                teacher: 'John Smith',
                startDate: '2023-01-15',
                endDate: '2023-06-30',
                schedule: 'Mon, Wed 18:00-19:30',
                capacity: 15,
                enrolled: 12,
                status: 'Active'
            },
            {
                id: 2,
                name: 'English Intermediate',
                code: 'ENG201',
                level: 'Intermediate',
                teacher: 'Jane Doe',
                startDate: '2023-01-15',
                endDate: '2023-06-30',
                schedule: 'Tue, Thu 18:00-19:30',
                capacity: 15,
                enrolled: 10,
                status: 'Active'
            },
            {
                id: 3,
                name: 'Spanish Beginner',
                code: 'SPA101',
                level: 'Beginner',
                teacher: 'Maria Rodriguez',
                startDate: '2023-02-01',
                endDate: '2023-07-15',
                schedule: 'Mon, Wed 17:00-18:30',
                capacity: 12,
                enrolled: 8,
                status: 'Active'
            },
            {
                id: 4,
                name: 'French Beginner',
                code: 'FRE101',
                level: 'Beginner',
                teacher: 'Pierre Dupont',
                startDate: '2023-02-15',
                endDate: '2023-07-30',
                schedule: 'Tue, Thu 17:00-18:30',
                capacity: 12,
                enrolled: 6,
                status: 'Active'
            }
        ];

        // Define custom column templates for different filter types
        this.columns = [
            {
                field: 'id',
                header: 'ID',
                filterType: 'text',
            },
            {
                field: 'name',
                header: 'Name',
                filterType: 'text',
            },
            {
                field: 'code',
                header: 'Code',
                filterType: 'text',
            },
            {
                field: 'level',
                header: 'Level',
                filterType: 'text',
            },
            {
                field: 'teacher',
                header: 'Teacher',
                filterType: 'text',
            },
            {
                field: 'schedule',
                header: 'Schedule',
                filterType: 'text',
            },
            {
                field: 'enrolled',
                header: 'Enrolled',
                filterType: 'numeric',
            },
            {
                field: 'capacity',
                header: 'Capacity',
                filterType: 'numeric',
            },
            {
                field: 'status',
                header: 'Status',
                filterType: 'text',
            }
        ];

        // Populate globalFilterFields
        this.globalFilterFields = this.columns.map(col => col.field);

        // Regenerate chart data when classes change
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
        const totalEnrolled = this.classes.reduce((sum, cls) => sum + cls.enrolled, 0);
        const totalCapacity = this.classes.reduce((sum, cls) => sum + cls.capacity, 0);
        const availableSpots = totalCapacity - totalEnrolled;

        this.enrollmentChartData = {
            labels: ['Enrolled', 'Available'],
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
}
