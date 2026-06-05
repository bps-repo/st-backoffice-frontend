// src/app/features/schoolar/features/assessments/pages/edit/edit.component.ts
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DropdownModule } from 'primeng/dropdown';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { UnitService } from 'src/app/core/services/unit.service';
import { SkillService } from 'src/app/core/services/skill.service';
import { LevelService } from 'src/app/core/services/level.service';
import { AssessmentType } from 'src/app/core/enums/assessment-type';
import { AssessmentStatus } from 'src/app/core/enums/assessment-status';
import { EvaluationType } from 'src/app/core/enums/evaluation-type';
import { UpdateAssessmentRequest } from 'src/app/core/models/academic/assessment';
import { ApiError } from 'src/app/core/models/ApiError';
import { Unit } from 'src/app/core/models/course/unit';
import { Skill } from 'src/app/core/models/academic/skill';
import { Level } from 'src/app/core/models/course/level';

@Component({
    selector: 'app-edit',
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
        ProgressSpinnerModule,
    ],
    providers: [MessageService],
    templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private assessmentService = inject(AssessmentService);
    private unitService = inject(UnitService);
    private skillService = inject(SkillService);
    private levelService = inject(LevelService);
    private messageService = inject(MessageService);

    readonly loading = signal(false);
    readonly saving = signal(false);
    readonly units = signal<Unit[]>([]);
    readonly skills = signal<Skill[]>([]);
    readonly levels = signal<Level[]>([]);

    readonly evaluationType = signal<EvaluationType | null>(null);
    readonly selectedLevelId = signal<string | null>(null);
    readonly skillFilterValue = signal('');

    private assessmentId!: string;

    title = '';
    description = '';
    assessmentType: AssessmentType | null = null;
    status: AssessmentStatus = AssessmentStatus.DRAFT;
    passingScore = 50;
    sharedDate: Date | null = null;
    startTime: Date | null = null;
    endTime: Date | null = null;
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

    readonly showCreateSkillButton = computed(() => {
        const filter = this.skillFilterValue().trim().toLowerCase();
        if (!filter) return false;
        return !this.skillOptions().some((o) => o.label.toLowerCase() === filter);
    });

    ngOnInit(): void {
        this.assessmentId = this.route.snapshot.paramMap.get('id')!;

        this.loading.set(true);

        this.levelService.getLevels().subscribe({
            next: (levels) => this.levels.set(levels),
        });

        this.unitService.loadUnits().subscribe({
            next: (units) => this.units.set(units),
        });

        this.skillService.getSkills().subscribe({
            next: (skills) => this.skills.set(skills),
        });

        this.assessmentService.getAssessmentById(this.assessmentId).subscribe({
            next: (assessment) => {
                this.title = assessment.title;
                this.description = assessment.description ?? '';
                this.assessmentType = assessment.assessmentType;
                this.status = assessment.status;
                this.passingScore = assessment.passingScore;
                this.evaluationType.set(assessment.evaluationType);

                const start = new Date(assessment.startDatetime);
                const end = new Date(assessment.endDatetime);
                this.sharedDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
                this.startTime = start;
                this.endTime = end;

                if (assessment.evaluationType === EvaluationType.SKILLS) {
                    this.selectedSkillIds = (assessment.skills ?? []).map((s) => s.id);
                } else {
                    const units = assessment.evaluatedUnits ?? [];
                    this.selectedEvaluatedUnitIds = units.map((u) => u.id);
                    if (units.length > 0) {
                        this.selectedLevelId.set(units[0].levelId);
                    }
                }

                this.loading.set(false);
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar a avaliação.' });
                this.loading.set(false);
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

    onSkillFilter(event: { filter: string }): void {
        this.skillFilterValue.set(event.filter ?? '');
    }

    isFormValid(): boolean {
        if (!this.title.trim() || !this.assessmentType || !this.evaluationType()) return false;
        if (!this.sharedDate || !this.startTime || !this.endTime) return false;
        if (this.isSkillsMode() && this.selectedSkillIds.length === 0) return false;
        if (this.isUnitsMode() && (!this.selectedLevelId() || this.selectedEvaluatedUnitIds.length === 0)) return false;
        return true;
    }

    save(): void {
        if (!this.isFormValid()) {
            this.messageService.add({ severity: 'error', summary: 'Formulário inválido', detail: 'Preencha todos os campos obrigatórios.' });
            return;
        }

        const body: UpdateAssessmentRequest = {
            title: this.title.trim(),
            description: this.description.trim(),
            assessmentType: this.assessmentType!,
            evaluationType: this.evaluationType()!,
            status: this.status,
            passingScore: this.passingScore,
            startDatetime: this.combineDateTime(this.sharedDate!, this.startTime!),
            endDatetime: this.combineDateTime(this.sharedDate!, this.endTime!),
            skillIds: this.isSkillsMode() ? this.selectedSkillIds : [],
            evaluatedUnitIds: this.isUnitsMode() ? this.selectedEvaluatedUnitIds : [],
        };

        this.saving.set(true);
        this.assessmentService.updateAssessment(this.assessmentId, body).subscribe({
            next: () => {
                this.saving.set(false);
                this.router.navigate(['/schoolar/assessments', this.assessmentId]);
            },
            error: (err: HttpErrorResponse) => {
                this.saving.set(false);
                const apiError = err.error as ApiError;
                if (apiError?.errorCode === 'VALIDATION_ERROR' && apiError.validationErrors?.length) {
                    apiError.validationErrors.forEach((ve) =>
                        this.messageService.add({ severity: 'error', summary: 'Campo inválido', detail: ve.message })
                    );
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: apiError?.error ?? apiError?.message ?? 'Não foi possível salvar a avaliação.',
                    });
                }
            },
        });
    }

    cancel(): void {
        this.router.navigate(['/schoolar/assessments', this.assessmentId]);
    }

    private combineDateTime(date: Date, time: Date): string {
        const result = new Date(date);
        result.setHours(time.getHours(), time.getMinutes(), 0, 0);
        return result.toISOString().slice(0, 19);
    }
}
