// src/app/features/schoolar/features/assessments/pages/create/create.component.ts
import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
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
import { SkillService } from 'src/app/core/services/skill.service';
import { LevelService } from 'src/app/core/services/level.service';
import { AssessmentType } from 'src/app/core/enums/assessment-type';
import { AssessmentStatus } from 'src/app/core/enums/assessment-status';
import { EvaluationType } from 'src/app/core/enums/evaluation-type';
import { CreateAssessmentRequest } from 'src/app/core/models/academic/assessment';
import { ApiError } from 'src/app/core/models/ApiError';
import { Unit } from 'src/app/core/models/course/unit';
import { Skill } from 'src/app/core/models/academic/skill';
import { Level } from 'src/app/core/models/course/level';

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
    private skillService = inject(SkillService);
    private levelService = inject(LevelService);
    private router = inject(Router);
    private messageService = inject(MessageService);

    readonly loading = signal(false);
    readonly units = signal<Unit[]>([]);
    readonly skills = signal<Skill[]>([]);
    readonly levels = signal<Level[]>([]);

    // Signals so computed() tracks them correctly under OnPush
    readonly evaluationType = signal<EvaluationType | null>(null);
    readonly selectedLevelId = signal<string | null>(null);

    title = '';
    description = '';
    assessmentType: AssessmentType | null = null;
    status: AssessmentStatus = AssessmentStatus.DRAFT;
    passingScore: number = 50;
    startDatetime: Date | null = null;
    endDatetime: Date | null = null;
    selectedSkillIds: string[] = [];
    selectedEvaluatedUnitIds: string[] = [];

    readonly isSkillsMode = computed(() => this.evaluationType() === EvaluationType.SKILLS);
    readonly isUnitsMode = computed(() => this.evaluationType() === EvaluationType.UNITS);
    readonly hasLevelSelected = computed(() => !!this.selectedLevelId());

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

    readonly levelOptions = computed(() =>
        this.levels().map((l) => ({ label: l.name, value: l.id }))
    );

    readonly skillOptions = computed(() =>
        this.skills().map((s) => ({ label: s.name, value: s.id }))
    );

    readonly filteredUnitOptions = computed(() =>
        this.units()
            .filter((u) => u.levelId === this.selectedLevelId())
            .map((u) => ({ label: u.name, value: u.id }))
    );

    ngOnInit(): void {
        this.levelService.getLevels().subscribe({
            next: (levels) => this.levels.set(levels),
            error: () => {
                this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: 'Não foi possível carregar os níveis.' });
            },
        });

        this.unitService.loadUnits().subscribe({
            next: (units) => this.units.set(units),
            error: () => {
                this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: 'Não foi possível carregar as unidades.' });
            },
        });

        this.skillService.getSkills().subscribe({
            next: (skills) => this.skills.set(skills),
            error: () => {
                this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: 'Não foi possível carregar as habilidades.' });
            },
        });
    }

    onEvaluationTypeChange(val: EvaluationType | null): void {
        this.evaluationType.set(val);
        this.selectedSkillIds = [];
        this.selectedLevelId.set(null);
        this.selectedEvaluatedUnitIds = [];
    }

    onLevelChange(val: string | null): void {
        this.selectedLevelId.set(val);
        this.selectedEvaluatedUnitIds = [];
    }

    isFormValid(): boolean {
        if (!this.title.trim() || !this.assessmentType || !this.evaluationType()) {
            return false;
        }
        if (!this.startDatetime || !this.endDatetime) return false;
        if (this.isSkillsMode() && this.selectedSkillIds.length === 0) return false;
        if (this.isUnitsMode() && (!this.selectedLevelId() || this.selectedEvaluatedUnitIds.length === 0)) return false;
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
            evaluationType: this.evaluationType()!,
            status: this.status,
            passingScore: this.passingScore,
            startDatetime: this.startDatetime!.toISOString().slice(0, 19),
            endDatetime: this.endDatetime!.toISOString().slice(0, 19),
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
            error: (err: HttpErrorResponse) => {
                this.loading.set(false);
                const apiError = err.error as ApiError;
                if (apiError?.errorCode === 'VALIDATION_ERROR' && apiError.validationErrors?.length) {
                    apiError.validationErrors.forEach((ve) =>
                        this.messageService.add({ severity: 'error', summary: 'Campo inválido', detail: ve.message })
                    );
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: apiError?.error ?? apiError?.message ?? 'Não foi possível criar a avaliação.',
                    });
                }
            },
        });
    }

    cancel(): void {
        this.router.navigate(['/schoolar/assessments']);
    }
}
