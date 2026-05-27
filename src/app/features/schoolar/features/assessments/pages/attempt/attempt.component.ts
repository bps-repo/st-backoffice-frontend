import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Subject, takeUntil} from 'rxjs';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {InputNumberModule} from 'primeng/inputnumber';
import {DropdownModule} from 'primeng/dropdown';
import {TabViewModule} from 'primeng/tabview';
import {Exam} from 'src/app/core/models/academic/exam';
import {selectSelectedExam} from 'src/app/core/store/schoolar/assessments/exams.selectors';
import {SkillCategory} from 'src/app/core/enums/skill-category';
import {AssessmentService} from 'src/app/core/services/assessment.service';

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
        InputNumberModule,
        DropdownModule,
        TabViewModule
    ],
    templateUrl: './attempt.component.html'
})
export class AttemptComponent implements OnInit, OnDestroy {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private store = inject(Store);
    private assessmentService = inject(AssessmentService);

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

    loading = false;

    saveAttempt(): void {
        if (!this.attempt.studentId) {
            console.error('No student selected');
            return;
        }

        this.loading = true;
        this.assessmentService.submitAssessmentResult(
            this.attempt.assessmentId,
            this.attempt.studentId,
            this.attempt as unknown as Record<string, unknown>
        ).subscribe({
            next: (result: unknown) => {
                console.log('Attempt saved successfully:', result);
                this.loading = false;
                // Navigate back to the assessment details page
                this.router.navigate(['/schoolar/assessments', this.attempt.assessmentId]);
            },
            error: (error: unknown) => {
                console.error('Error saving attempt:', error);
                this.loading = false;
                // In a real application, you would show an error message to the user
            }
        });
    }

    cancel(): void {
        // Navigate back to the assessment details page without saving
        this.router.navigate(['/schoolar/assessments', this.attempt.assessmentId]);
    }
}
