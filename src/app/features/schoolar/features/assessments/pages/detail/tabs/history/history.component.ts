// src/app/features/schoolar/features/assessments/pages/detail/tabs/history/history.component.ts
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Assessment, AssessmentAttempt } from 'src/app/core/models/academic/assessment';
import { EvaluationType } from 'src/app/core/enums/evaluation-type';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { ASSESSMENT_DETAIL_TOKEN } from 'src/app/shared/tokens/assessment-detail.token';

@Component({
    selector: 'app-history',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, TableModule, TagModule, TooltipModule],
    templateUrl: './history.component.html',
})
export class HistoryComponent implements OnInit {
    private assessmentService = inject(AssessmentService);
    readonly assessment = inject<Assessment | null>(ASSESSMENT_DETAIL_TOKEN, { optional: true });

    readonly attempts = signal<AssessmentAttempt[]>([]);
    readonly loading = signal(true);
    readonly error = signal<string | null>(null);
    readonly expandedRows = signal<Record<string, boolean>>({});

    readonly EvaluationType = EvaluationType;

    toggleRow(id: string): void {
        this.expandedRows.update((m) => {
            const next = { ...m };
            if (next[id]) {
                delete next[id];
            } else {
                next[id] = true;
            }
            return next;
        });
    }

    ngOnInit(): void {
        if (!this.assessment?.id) {
            this.loading.set(false);
            return;
        }

        this.assessmentService.getAssessmentHistory(this.assessment.id).subscribe({
            next: (data) => {
                this.attempts.set(data);
                this.loading.set(false);
            },
            error: (err: HttpErrorResponse) => {
                this.error.set(err.error?.error ?? 'Não foi possível carregar o histórico.');
                this.loading.set(false);
            },
        });
    }
}
