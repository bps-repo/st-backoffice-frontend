import {Component, OnInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Subject, takeUntil} from 'rxjs';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {InputNumberModule} from 'primeng/inputnumber';
import {DropdownModule} from 'primeng/dropdown';
import {TabViewModule} from 'primeng/tabview';
import {Exam} from 'src/app/core/models/academic/exam';
import {selectSelectedExam} from 'src/app/core/store/schoolar/assessments/exams.selectors';
import {SkillCategory} from 'src/app/core/enums/skill-category';

interface SkillEvaluation {
    score: number;
    feedback: string;
}

interface StudentAttempt {
    studentId: string;
    studentName: string;
    assessmentId: string;
    date: Date;
    skillEvaluations: Record<SkillCategory, SkillEvaluation>;
}

@Component({
    selector: 'app-attempt',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CardModule,
        InputTextModule,
        InputTextareaModule,
        InputNumberModule,
        DropdownModule,
        TabViewModule
    ],
    templateUrl: './attempt.component.html'
})
export class AttemptComponent implements OnInit, OnDestroy {
    exam: Exam | null = null;
    students: any[] = []; // This would be populated from a service
    selectedStudent: any = null;

    attempt: StudentAttempt = {
        studentId: '',
        studentName: '',
        assessmentId: '',
        date: new Date(),
        skillEvaluations: {} as Record<SkillCategory, SkillEvaluation>
    };

    // Convert enum to array for UI
    skillCategories = Object.keys(SkillCategory)
        .filter(key => isNaN(Number(key)))
        .map(key => ({
            label: key,
            value: SkillCategory[key as keyof typeof SkillCategory]
        }));

    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private store: Store
    ) {
    }

    ngOnInit(): void {
        // Initialize empty skill evaluations for each skill category
        this.skillCategories.forEach(category => {
            this.attempt.skillEvaluations[category.value] = {
                score: 0,
                feedback: ''
            };
        });

        // Get the assessment ID from the route
        this.route.params
            .pipe(takeUntil(this.destroy$))
            .subscribe(params => {
                const id = params['id'];
                if (id) {
                    this.attempt.assessmentId = id;
                    // Load the exam details
                    this.store.select(selectSelectedExam)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe(exam => {
                            this.exam = exam;
                        });

                    // In a real application, you would load the students for this assessment
                    // For now, we'll use mock data
                    this.students = [
                        {id: '1', name: 'John Doe'},
                        {id: '2', name: 'Jane Smith'},
                        {id: '3', name: 'Bob Johnson'}
                    ];
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onStudentChange(): void {
        if (this.selectedStudent) {
            this.attempt.studentId = this.selectedStudent.id;
            this.attempt.studentName = this.selectedStudent.name;
        }
    }

    saveAttempt(): void {
        // In a real application, you would save the attempt data using a service
        console.log('Attempt saved:', this.attempt);
        // Navigate back to the assessment details page
        this.router.navigate(['/schoolar/assessments', this.attempt.assessmentId]);
    }

    cancel(): void {
        // Navigate back to the assessment details page without saving
        this.router.navigate(['/schoolar/assessments', this.attempt.assessmentId]);
    }
}
