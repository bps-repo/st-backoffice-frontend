import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {TableModule} from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';
import {ProgressBarModule} from 'primeng/progressbar';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {Store} from '@ngrx/store';
import {Student} from 'src/app/core/models/academic/student';
import {UnitProgress} from 'src/app/core/models/academic/unit-progress';
import {Unit} from 'src/app/core/models/course/unit';
import {selectAllStudents} from 'src/app/core/store/schoolar/reducers/students.reducers';
import {studentsActions} from 'src/app/core/store/schoolar/actions/students.actions';

@Component({
    selector: 'app-unit-progress',
    templateUrl: './unit-progress.component.html',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        DropdownModule,
        TableModule,
        InputTextModule,
        ProgressBarModule,
        ToastModule
    ],
    providers: [MessageService]
})
export class UnitProgressComponent implements OnInit {
    students: Student[] = [];
    selectedStudent: Student | null = null;
    unitProgressList: UnitProgress[] = [];
    loading = false;

    constructor(
        private store: Store,
        private messageService: MessageService
    ) {
    }

    ngOnInit(): void {
        this.loadStudents();
    }

    loadStudents(): void {
        this.store.dispatch(studentsActions.loadStudents());
        this.store.select(selectAllStudents).subscribe(students => {
            this.students = students;
        });
    }

    onStudentChange(): void {
        if (this.selectedStudent) {
            this.loading = true;
            this.loadUnitProgress(this.selectedStudent.id!);
        } else {
            this.unitProgressList = [];
        }
    }

    loadUnitProgress(studentId: number): void {
        // In a real application, this would call a service method to get the unit progress
        // For now, we'll simulate with mock data
        setTimeout(() => {
            this.unitProgressList = this.generateMockUnitProgress(studentId);
            this.loading = false;
        }, 1000);
    }

    private generateMockUnitProgress(studentId: number): UnitProgress[] {
        // Generate mock unit progress data
        const mockUnits: Unit[] = [];

        return mockUnits.map((unit, index) => {
            const completionPercentage = Math.floor(Math.random() * 101); // 0-100
            const completed = completionPercentage === 100;
            const assessmentsPassed = Math.floor(Math.random() * 5);
            const assessmentsFailed = Math.floor(Math.random() * 3);

            return {
                id: `${studentId}-${unit.id}`,
                student: this.selectedStudent!,
                unit: unit,
                completionPercentage: completionPercentage,
                completed: completed,
                lessonProgress: Math.floor(Math.random() * 10) + 1, // 1-10
                assessmentsPassed: assessmentsPassed,
                assessmentsFailed: assessmentsFailed,
                completionDate: completed ? new Date().toISOString() : null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
        });
    }

    getProgressColorClass(percentage: number): string {
        if (percentage < 30) return 'bg-red-500';
        if (percentage < 70) return 'bg-yellow-500';
        return 'bg-green-500';
    }

    exportProgress(): void {
        if (!this.selectedStudent || this.unitProgressList.length === 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No progress data to export'
            });
            return;
        }

        // In a real application, this would generate and download a report
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Progress report for ${this.selectedStudent.name} exported`
        });
    }
}
