// src/app/features/schoolar/features/assessments/pages/create/create.component.ts
import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DropdownModule } from 'primeng/dropdown';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { UnitService } from 'src/app/core/services/unit.service';
import { AssessmentType } from 'src/app/core/enums/assessment-type';
import { AssessmentStatus } from 'src/app/core/enums/assessment-status';
import { EvaluationType } from 'src/app/core/enums/evaluation-type';
import { CreateAssessmentRequest } from 'src/app/core/models/academic/assessment';
import { Unit } from 'src/app/core/models/course/unit';

@Component({
    selector: 'app-create-assessment',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CardModule,
        InputTextModule,
        TextareaModule,
        DropdownModule,
        DatePickerModule,
        InputNumberModule,
        MultiSelectModule,
        ToastModule,
    ],
    providers: [MessageService],
    templateUrl: './create.component.html',
})
export class CreateComponent implements OnInit {
    private assessmentService = inject(AssessmentService);
    private unitService = inject(UnitService);
    private router = inject(Router);
    private messageService = inject(MessageService);

    readonly loading = signal(false);
    readonly units = signal<Unit[]>([]);

    // Form model
    title = '';
    description = '';
    assessmentType: AssessmentType | null = null;
    evaluationType: EvaluationType | null = null;
    status: AssessmentStatus = AssessmentStatus.DRAFT;
    passingScore: number = 50;
    startDatetime: Date | null = null;
    endDatetime: Date | null = null;
    unitId: string | null = null;
    selectedSkillIds: string[] = [];
    selectedEvaluatedUnitIds: string[] = [];

    readonly isSkillsMode = computed(() => this.evaluationType === EvaluationType.SKILLS);
    readonly isUnitsMode = computed(() => this.evaluationType === EvaluationType.UNITS);

    // Dropdown options
    readonly assessmentTypeOptions = [
        { label: 'Quiz', value: AssessmentType.QUIZ },
        { label: 'Midterm', value: AssessmentType.MIDTERM },
        { label: 'Placement', value: AssessmentType.PLACEMENT },
        { label: 'Final', value: AssessmentType.FINAL },
        { label: 'Skill Check', value: AssessmentType.SKILL_CHECK },
    ];

    readonly evaluationTypeOptions = [
        { label: 'Habilidades (Skills)', value: EvaluationType.SKILLS },
        { label: 'Unidades', value: EvaluationType.UNITS },
    ];

    readonly statusOptions = [
        { label: 'Rascunho', value: AssessmentStatus.DRAFT },
        { label: 'Ativa', value: AssessmentStatus.ACTIVE },
        { label: 'Inativa', value: AssessmentStatus.INACTIVE },
        { label: 'Arquivada', value: AssessmentStatus.ARCHIVED },
    ];

    // Skill options — loaded from API in a real app; static list for now
    readonly skillOptions = [
        { label: 'Reading Comprehension', value: 'skill-reading' },
        { label: 'Writing', value: 'skill-writing' },
        { label: 'Listening', value: 'skill-listening' },
        { label: 'Speaking', value: 'skill-speaking' },
        { label: 'Grammar', value: 'skill-grammar' },
        { label: 'Vocabulary', value: 'skill-vocabulary' },
    ];

    readonly unitOptions = computed(() =>
        this.units().map((u) => ({ label: u.name, value: u.id }))
    );

    ngOnInit(): void {
        this.unitService.loadUnits().subscribe({
            next: (units) => this.units.set(units),
            error: () => {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Aviso',
                    detail: 'Não foi possível carregar as unidades.',
                });
            },
        });
    }

    isFormValid(): boolean {
        if (!this.title.trim() || !this.assessmentType || !this.evaluationType || !this.unitId) {
            return false;
        }
        if (!this.startDatetime || !this.endDatetime) return false;
        if (this.isSkillsMode() && this.selectedSkillIds.length === 0) return false;
        if (this.isUnitsMode() && this.selectedEvaluatedUnitIds.length === 0) return false;
        return true;
    }

    save(): void {
        if (!this.isFormValid()) {
            this.messageService.add({
                severity: 'error',
                summary: 'Formulário inválido',
                detail: 'Preencha todos os campos obrigatórios.',
            });
            return;
        }

        const body: CreateAssessmentRequest = {
            title: this.title.trim(),
            description: this.description.trim(),
            assessmentType: this.assessmentType!,
            evaluationType: this.evaluationType!,
            status: this.status,
            passingScore: this.passingScore,
            startDatetime: this.startDatetime!.toISOString().slice(0, 19),
            endDatetime: this.endDatetime!.toISOString().slice(0, 19),
            unitId: this.unitId!,
            skillIds: this.isSkillsMode() ? this.selectedSkillIds : [],
            evaluatedUnitIds: this.isUnitsMode() ? this.selectedEvaluatedUnitIds : [],
        };

        this.loading.set(true);
        this.assessmentService.createAssessment(body).subscribe({
            next: () => {
                this.loading.set(false);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Avaliação criada com sucesso!',
                });
                setTimeout(() => this.router.navigate(['/schoolar/assessments']), 1500);
            },
            error: () => {
                this.loading.set(false);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível criar a avaliação.',
                });
            },
        });
    }

    cancel(): void {
        this.router.navigate(['/schoolar/assessments']);
    }
}
