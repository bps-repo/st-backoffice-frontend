import {CommonModule} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {TabMenuModule} from 'primeng/tabmenu';
import {TabViewModule} from 'primeng/tabview';
import {Observable, Subscription} from 'rxjs';
import {SplitButtonModule} from 'primeng/splitbutton';
import {ActivatedRoute} from '@angular/router';
import {Store} from "@ngrx/store";
import {StudentsActions} from "../../../../../../core/store/schoolar/students/students.actions";
import {selectStudentById} from "../../../../../../core/store/schoolar/students/students.selectors";
import {Student} from "../../../../../../core/models/academic/student";
import {StyleClassModule} from "primeng/styleclass";
import {CardModule} from 'primeng/card';
import {ProgressBarModule} from 'primeng/progressbar';
import {ButtonModule} from 'primeng/button';
import {DatePipe} from '@angular/common';
import {SelectButtonModule} from 'primeng/selectbutton';
import {FormsModule} from '@angular/forms';
import {StudentPaymentTabComponent} from "./tabs/payments/payment.tab.component";
import {StudentLessonsTabComponent} from "./tabs/lessons/lessons.tab.component";
import {GeneralComponent} from "./tabs/general/general.component";


@Component({
    selector: 'app-student',
    imports: [
        TabMenuModule,
        TabViewModule,
        CommonModule,
        SplitButtonModule,
        StyleClassModule,
        CardModule,
        ProgressBarModule,
        ButtonModule,
        SelectButtonModule,
        FormsModule,
        StudentPaymentTabComponent,
        StudentLessonsTabComponent,
        GeneralComponent
    ],
    providers: [DatePipe],
    templateUrl: './detail.component.html'
})
export class DetailComponent implements OnInit, OnDestroy {
    studentId!: string;
    student$?: Observable<Student | null>;
    private subscriptions = new Subscription();

    // Tab view properties
    currentView: string = 'overview'; // Default view is overview
    viewOptions = [
        {label: 'Visão geral', value: 'overview'},
        {label: 'Historico de aulas', value: 'lessons'},
        {label: 'Avaliações', value: 'assessments'},
        {label: 'Pagamentos', value: 'payments'},
    ];

    // Method to handle view selection
    onViewChange(event: any) {
        this.currentView = event.value;
    }

    constructor(
        private route: ActivatedRoute,
        private store$: Store,
        private datePipe: DatePipe
    ) {
    }

    ngOnInit() {

        this.route.params.subscribe(params => {
            this.studentId = params['id'];
            if (this.studentId) {
                // Dispatch action to load student
                this.store$.dispatch(StudentsActions.loadStudent({id: this.studentId}));

                // Set up selector for this student
                this.student$ = this.store$.select(selectStudentById(this.studentId));

                this.student$.subscribe(s => {
                    console.log(this.studentId);
                })
            }
        })

    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * Calculate and return the student's attendance percentage
     */
    getAttendancePercentage(student: Student): number {
        return Math.min(100, Math.max(0, 22));
    }

    /**
     * Get the name of the student's current level
     */
    getLevelName(student: Student): string {
        return student.level.name;
    }

    /**
     * Get the number of completed lessons
     */
    getCompletedLessons(student: Student): number {

        return Math.max(0, 4);
    }

    /**
     * Get the total number of lessons
     */
    getTotalLessons(student: Student): number {
        return Math.max(0, 35);
    }

    /**
     * Calculate the number of missing/pending lessons
     */
    getMissingLessons(student: Student): number {
        if (!student) {
            return 0;
        }
        const completed = this.getCompletedLessons(student);
        const total = this.getTotalLessons(student);
        return Math.max(0, total - completed);
    }

    /**
     * Return the appropriate CSS class based on student status
     */
    getStatusColor(student: Student): string {
        if (!student || !student.status) {
            return 'text-gray-500'; // Default color for undefined status
        }

        // Map status to color classes
        const statusColorMap: Record<string, string> = {
            'ACTIVE': 'text-green-500',
            'INACTIVE': 'text-red-500',
            'SUSPENDED': 'text-yellow-500',
            'GRADUATED': 'text-blue-500',
            'PENDING': 'text-gray-500'
        };

        return statusColorMap[student.status.toUpperCase()] || 'text-gray-500';
    }

    /**
     * Format the enrollment date
     */
    formatDate(date: string | Date | null | undefined): string {
        if (!date) {
            return 'N/A';
        }

        try {
            const formattedDate = this.datePipe.transform(date, 'dd/MM/yyyy');
            return formattedDate || 'N/A';
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'N/A';
        }
    }
}
