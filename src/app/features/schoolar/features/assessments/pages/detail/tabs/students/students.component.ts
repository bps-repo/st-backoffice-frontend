import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Exam } from 'src/app/core/models/academic/exam';
import { selectSelectedExam } from 'src/app/core/store/schoolar/selectors/exams.selectors';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-students',
    standalone: true,
    imports: [CommonModule, TableModule],
    templateUrl: './students.component.html'
})
export class StudentsComponent implements OnInit {
    exam$: Observable<Exam | null>;
    students: any[] = []; // This would be populated with actual student data

    constructor(private store: Store) {
        this.exam$ = this.store.select(selectSelectedExam);
    }

    ngOnInit(): void {
        // In a real implementation, we would fetch the students data
        // based on the student IDs in the exam
        this.exam$.subscribe(exam => {
            if (exam && exam.students) {
                // Mock student data for demonstration
                this.students = exam.students.map((id, index) => ({
                    id,
                    name: `Student ${index + 1}`,
                    email: `student${index + 1}@example.com`,
                    attendance: Math.random() > 0.2 ? 'Present' : 'Absent',
                    score: Math.floor(Math.random() * 100)
                }));
            }
        });
    }
}
