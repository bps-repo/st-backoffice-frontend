// src/app/features/schoolar/features/assessments/pages/detail/detail.component.ts
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { TabViewComponent } from 'src/app/shared/components/tables/tab-view/tab-view.component';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { Assessment } from 'src/app/core/models/academic/assessment';
import { AssessmentStatus } from 'src/app/core/enums/assessment-status';
import { AssessmentType } from 'src/app/core/enums/assessment-type';
import { EvaluationType } from 'src/app/core/enums/evaluation-type';
import { ASSESSMENTS_TABS } from 'src/app/shared/constants/reviews';
import { Tab } from 'src/app/shared/@types/tab';

@Component({
    selector: 'app-assessment-detail',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        TagModule,
        ToastModule,
        ProgressSpinnerModule,
        TabViewComponent,
    ],
    providers: [MessageService],
    templateUrl: './detail.component.html',
})
export class DetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private assessmentService = inject(AssessmentService);
    private messageService = inject(MessageService);

    readonly assessment = signal<Assessment | null>(null);
    readonly loading = signal(true);
    readonly exportingPdf = signal(false);
    readonly tabs: Tab[] = ASSESSMENTS_TABS;

    readonly assessmentTypeLabels: Record<AssessmentType, string> = {
        [AssessmentType.QUIZ]: 'Quiz',
        [AssessmentType.MIDTERM]: 'Prova Parcial',
        [AssessmentType.PLACEMENT]: 'Nivelamento',
        [AssessmentType.FINAL]: 'Prova Final',
        [AssessmentType.SKILL_CHECK]: 'Verificação de Habilidades',
    };

    readonly evaluationTypeLabels: Record<EvaluationType, string> = {
        [EvaluationType.SKILLS]: 'Habilidades',
        [EvaluationType.UNITS]: 'Unidades',
    };

    ngOnInit(): void {
        const id = this.route.snapshot.params['id'];
        if (!id) {
            this.router.navigate(['/schoolar/assessments']);
            return;
        }

        this.assessmentService.getAssessmentById(id).subscribe({
            next: (assessment) => {
                this.assessment.set(assessment);
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

    statusSeverity(status: AssessmentStatus): 'success' | 'warn' | 'danger' | 'secondary' | 'info' {
        const map: Record<AssessmentStatus, 'success' | 'warn' | 'danger' | 'secondary' | 'info'> = {
            [AssessmentStatus.ACTIVE]: 'success',
            [AssessmentStatus.DRAFT]: 'warn',
            [AssessmentStatus.INACTIVE]: 'secondary',
            [AssessmentStatus.ARCHIVED]: 'secondary',
        };
        return map[status] ?? 'info';
    }

    statusLabel(status: AssessmentStatus): string {
        const map: Record<AssessmentStatus, string> = {
            [AssessmentStatus.ACTIVE]: 'Ativa',
            [AssessmentStatus.DRAFT]: 'Rascunho',
            [AssessmentStatus.INACTIVE]: 'Inativa',
            [AssessmentStatus.ARCHIVED]: 'Arquivada',
        };
        return map[status] ?? status;
    }

    edit(): void {
        const id = this.assessment()?.id;
        if (id) this.router.navigate(['/schoolar/assessments/edit', id]);
    }

    recordAttempt(): void {
        const id = this.assessment()?.id;
        if (id) this.router.navigate(['/schoolar/assessments/attempt', id]);
    }

    exportSummaryPdf(): void {
        const assessment = this.assessment();
        if (!assessment) return;

        this.exportingPdf.set(true);
        this.assessmentService.getAssessmentSummaryPdf(assessment.id).subscribe({
            next: (blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `avaliacao-${assessment.id}-resumo.pdf`;
                a.click();
                URL.revokeObjectURL(url);
                this.exportingPdf.set(false);
            },
            error: (err: HttpErrorResponse) => {
                this.exportingPdf.set(false);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: err.error?.error ?? 'Não foi possível exportar o resumo.',
                });
            },
        });
    }

    goBack(): void {
        this.router.navigate(['/schoolar/assessments']);
    }
}
