// src/app/features/schoolar/features/assessments/pages/attempt/attempt.component.ts
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextarea } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { AssessmentBookingService } from 'src/app/core/services/assessment-booking.service';
import { Assessment } from 'src/app/core/models/academic/assessment';
import { AssessmentBooking } from 'src/app/core/models/academic/assessment-booking';
import { EvaluationType } from 'src/app/core/enums/evaluation-type';
import { forkJoin } from 'rxjs';

interface SkillRow {
    skillId: string;
    skillName: string;
    score: number;
    feedback: string;
}

interface UnitRow {
    unitId: string;
    unitName: string;
    score: number;
    feedback: string;
}

@Component({
    selector: 'app-attempt',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        InputNumberModule,
        InputTextarea,
        DropdownModule,
        ToastModule,
        ProgressSpinnerModule,
        TagModule,
    ],
    providers: [MessageService],
    templateUrl: './attempt.component.html',
})
export class AttemptComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private assessmentService = inject(AssessmentService);
    private bookingService = inject(AssessmentBookingService);
    private messageService = inject(MessageService);

    readonly EvaluationType = EvaluationType;

    readonly assessment = signal<Assessment | null>(null);
    readonly bookings = signal<AssessmentBooking[]>([]);
    readonly loading = signal(true);
    readonly submitting = signal(false);

    readonly selectedStudentId = signal<string | null>(null);
    readonly skillRows = signal<SkillRow[]>([]);
    readonly unitRows = signal<UnitRow[]>([]);

    readonly canSubmit = computed(() =>
        !!this.selectedStudentId() && !this.submitting() && !!this.assessment()
    );

    readonly studentOptions = computed(() =>
        this.bookings().map((b) => ({ label: b.studentName, value: b.studentId }))
    );

    ngOnInit(): void {
        const assessmentId = this.route.snapshot.params['id'];
        if (!assessmentId) {
            this.router.navigate(['/schoolar/assessments']);
            return;
        }

        forkJoin({
            assessment: this.assessmentService.getAssessmentById(assessmentId),
            bookings: this.bookingService.getBookingsByAssessment(assessmentId),
        }).subscribe({
            next: ({ assessment, bookings }) => {
                this.assessment.set(assessment);
                this.bookings.set(bookings);
                this.initRows(assessment);
                this.loading.set(false);
            },
            error: (err: HttpErrorResponse) => {
                this.loading.set(false);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: err.error?.error ?? 'Não foi possível carregar a avaliação.',
                });
            },
        });
    }

    updateSkillScore(skillId: string, score: number): void {
        this.skillRows.update((rows) =>
            rows.map((r) => (r.skillId === skillId ? { ...r, score } : r))
        );
    }

    updateSkillFeedback(skillId: string, feedback: string): void {
        this.skillRows.update((rows) =>
            rows.map((r) => (r.skillId === skillId ? { ...r, feedback } : r))
        );
    }

    updateUnitScore(unitId: string, score: number): void {
        this.unitRows.update((rows) =>
            rows.map((r) => (r.unitId === unitId ? { ...r, score } : r))
        );
    }

    updateUnitFeedback(unitId: string, feedback: string): void {
        this.unitRows.update((rows) =>
            rows.map((r) => (r.unitId === unitId ? { ...r, feedback } : r))
        );
    }

    submit(): void {
        const assessment = this.assessment();
        const studentId = this.selectedStudentId();
        if (!assessment || !studentId) return;

        this.submitting.set(true);
        this.assessmentService
            .recordAttempt(assessment.id, {
                studentId,
                skillEvaluations: this.skillRows().map(({ skillId, score, feedback }) => ({
                    skillId,
                    score,
                    feedback,
                })),
                unitEvaluations: this.unitRows().map(({ unitId, score, feedback }) => ({
                    unitId,
                    score,
                    feedback,
                })),
            })
            .subscribe({
                next: () => {
                    this.submitting.set(false);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Tentativa registada com sucesso.',
                    });
                    setTimeout(() => this.router.navigate(['/schoolar/assessments', assessment.id]), 1000);
                },
                error: (err: HttpErrorResponse) => {
                    this.submitting.set(false);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: err.error?.error ?? 'Não foi possível registar a tentativa.',
                    });
                },
            });
    }

    cancel(): void {
        const id = this.assessment()?.id;
        this.router.navigate(id ? ['/schoolar/assessments', id] : ['/schoolar/assessments']);
    }

    private initRows(assessment: Assessment): void {
        this.skillRows.set(
            (assessment.skills ?? []).map((s) => ({
                skillId: s.id,
                skillName: s.name,
                score: 0,
                feedback: '',
            }))
        );
        this.unitRows.set(
            (assessment.evaluatedUnits ?? []).map((u) => ({
                unitId: u.id,
                unitName: u.name,
                score: 0,
                feedback: '',
            }))
        );
    }
}
