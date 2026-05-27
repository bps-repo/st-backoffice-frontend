// src/app/features/schoolar/features/assessments/pages/detail/tabs/general/general.component.ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { Assessment } from 'src/app/core/models/academic/assessment';
import { AssessmentStatus } from 'src/app/core/enums/assessment-status';
import { AssessmentType } from 'src/app/core/enums/assessment-type';
import { EvaluationType } from 'src/app/core/enums/evaluation-type';
import { ASSESSMENT_DETAIL_TOKEN } from 'src/app/shared/tokens/assessment-detail.token';

@Component({
    selector: 'app-general',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, TagModule],
    templateUrl: './general.component.html',
})
export class GeneralComponent {
    readonly assessment = inject<Assessment>(ASSESSMENT_DETAIL_TOKEN, { optional: true } as any);

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

    statusSeverity(status: AssessmentStatus): 'success' | 'warn' | 'danger' | 'secondary' {
        const map: Record<AssessmentStatus, 'success' | 'warn' | 'danger' | 'secondary'> = {
            [AssessmentStatus.ACTIVE]: 'success',
            [AssessmentStatus.DRAFT]: 'warn',
            [AssessmentStatus.INACTIVE]: 'secondary',
            [AssessmentStatus.ARCHIVED]: 'secondary',
        };
        return map[status] ?? 'secondary';
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
}
