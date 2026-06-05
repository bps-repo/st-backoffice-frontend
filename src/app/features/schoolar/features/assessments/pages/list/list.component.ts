// src/app/features/schoolar/features/assessments/pages/list/list.component.ts
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    inject,
    signal,
    computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CreateComponent } from '../create/create.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { Assessment } from 'src/app/core/models/academic/assessment';
import { AssessmentType } from 'src/app/core/enums/assessment-type';
import { AssessmentStatus } from 'src/app/core/enums/assessment-status';

@Component({
    selector: 'app-assessments-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CardModule,
        DropdownModule,
        InputTextModule,
        TableModule,
        TagModule,
        TooltipModule,
        ToastModule,
        ConfirmDialogModule,
        CreateComponent,
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
    private assessmentService = inject(AssessmentService);
    private router = inject(Router);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    readonly assessments = signal<Assessment[]>([]);
    readonly loading = signal(false);
    readonly totalRecords = signal(0);
    readonly pageSize = signal(10);
    readonly currentPage = signal(0);
    readonly showCreateModal = signal(false);

    readonly totalPages = computed(() => Math.ceil(this.totalRecords() / this.pageSize()));

    readonly typeOptions = [
        { label: 'Todos os Tipos', value: null },
        { label: 'Quiz', value: AssessmentType.QUIZ },
        { label: 'Midterm', value: AssessmentType.MIDTERM },
        { label: 'Placement', value: AssessmentType.PLACEMENT },
        { label: 'Final', value: AssessmentType.FINAL },
        { label: 'Skill Check', value: AssessmentType.SKILL_CHECK },
    ];

    readonly statusOptions = [
        { label: 'Todos os Status', value: null },
        { label: 'Ativa', value: AssessmentStatus.ACTIVE },
        { label: 'Inativa', value: AssessmentStatus.INACTIVE },
        { label: 'Rascunho', value: AssessmentStatus.DRAFT },
        { label: 'Arquivada', value: AssessmentStatus.ARCHIVED },
    ];

    selectedType: AssessmentType | null = null;
    selectedStatus: AssessmentStatus | null = null;

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        this.loading.set(true);
        this.assessmentService
            .listAssessments({ page: this.currentPage(), size: this.pageSize() })
            .subscribe({
                next: (res) => {
                    this.assessments.set(res.data.content);
                    this.totalRecords.set(res.data.totalElements);
                    this.loading.set(false);
                },
                error: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Não foi possível carregar as avaliações.',
                    });
                    this.loading.set(false);
                },
            });
    }

    onPage(event: { first: number; rows: number }): void {
        this.currentPage.set(event.first / event.rows);
        this.pageSize.set(event.rows);
        this.load();
    }

    openCreateModal(): void {
        this.showCreateModal.set(true);
    }

    viewDetails(assessment: Assessment): void {
        this.router.navigate(['/schoolar/assessments', assessment.id]);
    }

    editAssessment(assessment: Assessment): void {
        this.router.navigate(['/schoolar/assessments/edit', assessment.id]);
    }

    confirmDelete(assessment: Assessment): void {
        this.confirmationService.confirm({
            message: `Tem certeza que deseja excluir a avaliação "${assessment.title}"?`,
            header: 'Confirmar exclusão',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.assessmentService.deleteAssessment(assessment.id).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Avaliação excluída com sucesso.',
                        });
                        this.load();
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Não foi possível excluir a avaliação.',
                        });
                    },
                });
            },
        });
    }

    statusSeverity(status: AssessmentStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        const map: Record<AssessmentStatus, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
            [AssessmentStatus.ACTIVE]: 'success',
            [AssessmentStatus.DRAFT]: 'warn',
            [AssessmentStatus.INACTIVE]: 'secondary',
            [AssessmentStatus.ARCHIVED]: 'danger',
        };
        return map[status] ?? 'secondary';
    }

    assessmentTypeLabel(type: AssessmentType): string {
        const map: Record<AssessmentType, string> = {
            [AssessmentType.QUIZ]: 'Quiz',
            [AssessmentType.MIDTERM]: 'Midterm',
            [AssessmentType.PLACEMENT]: 'Placement',
            [AssessmentType.FINAL]: 'Final',
            [AssessmentType.SKILL_CHECK]: 'Skill Check',
        };
        return map[type] ?? type;
    }
}
