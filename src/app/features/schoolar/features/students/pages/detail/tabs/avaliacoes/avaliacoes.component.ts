// src/app/features/schoolar/features/students/pages/detail/tabs/avaliacoes/avaliacoes.component.ts
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    SimpleChanges,
    computed,
    inject,
    signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { AssessmentService } from '../../../../../../../../core/services/assessment.service';
import { AssessmentAttempt } from '../../../../../../../../core/models/academic/assessment';
import { EvaluationType } from '../../../../../../../../core/enums/evaluation-type';

@Component({
    selector: 'app-avaliacoes',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, TableModule, TagModule, TooltipModule, ButtonModule, SkeletonModule],
    templateUrl: './avaliacoes.component.html',
})
export class AvaliacoesComponent implements OnChanges, OnDestroy {
    @Input() studentId: string | null = null;

    private assessmentService = inject(AssessmentService);
    private destroy$ = new Subject<void>();

    readonly attempts = signal<AssessmentAttempt[]>([]);
    readonly loading = signal(false);
    readonly error = signal<string | null>(null);
    readonly expandedRows = signal<Record<string, boolean>>({});

    readonly totalAttempts = computed(() => this.attempts().length);
    readonly passedCount = computed(() => this.attempts().filter((a) => a.passed).length);
    readonly passRate = computed(() => {
        const total = this.totalAttempts();
        return total ? Math.round((this.passedCount() / total) * 100) : 0;
    });
    readonly bestScore = computed(() => {
        const scores = this.attempts().map((a) => a.score);
        return scores.length ? Math.max(...scores) : 0;
    });

    readonly EvaluationType = EvaluationType;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['studentId'] && this.studentId) this.loadHistory();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

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

    reload(): void {
        this.loadHistory();
    }

    getTypeLabel(type: string): string {
        const map: Record<string, string> = {
            QUIZ: 'Quiz',
            MIDTERM: 'Intermédio',
            PLACEMENT: 'Nivelamento',
            FINAL: 'Final',
            SKILL_CHECK: 'Competências',
        };
        return map[type] ?? type;
    }

    getTypeSeverity(type: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        switch (type) {
            case 'QUIZ': return 'info';
            case 'MIDTERM': return 'warn';
            case 'FINAL': return 'danger';
            case 'PLACEMENT': return 'secondary';
            case 'SKILL_CHECK': return 'success';
            default: return 'info';
        }
    }

    private loadHistory(): void {
        if (!this.studentId) return;
        this.loading.set(true);
        this.error.set(null);
        this.expandedRows.set({});
        this.assessmentService
            .getStudentHistory(this.studentId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data) => {
                    this.attempts.set(data ?? []);
                    this.loading.set(false);
                },
                error: (err: HttpErrorResponse) => {
                    this.error.set(err.error?.error ?? 'Não foi possível carregar o histórico de avaliações.');
                    this.loading.set(false);
                },
            });
    }
}
