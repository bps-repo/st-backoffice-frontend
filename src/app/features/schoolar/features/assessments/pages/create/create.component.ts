// src/app/features/schoolar/features/assessments/pages/create/create.component.ts
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    inject,
    signal,
    computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DropdownModule } from 'primeng/dropdown';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
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
        DialogModule,
        InputTextModule,
        TextareaModule,
        DropdownModule,
        DatePickerModule,
        InputNumberModule,
        MultiSelectModule,
        ToastModule,
        DividerModule,
    ],
    providers: [MessageService],
    templateUrl: './create.component.html',
})
export class CreateComponent implements OnInit {
    private assessmentService = inject(AssessmentService);
    private unitService = inject(UnitService);
    private skillService = inject(SkillService);
    private levelService = inject(LevelService);
    private messageService = inject(MessageService);

    @Input() set visible(val: boolean) {
        this.dialogVisible.set(val);
        if (val) this.resetForm();
    }
    @Input() set initialDate(date: Date | null) {
        this._initialDate = date;
    }
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() created = new EventEmitter<void>();

    private _initialDate: Date | null = null;

    readonly dialogVisible = signal(false);
    readonly loading = signal(false);
    readonly creatingSkill = signal(false);
    readonly units = signal<Unit[]>([]);
    readonly skills = signal<Skill[]>([]);
    readonly levels = signal<Level[]>([]);

    readonly evaluationType = signal<EvaluationType | null>(null);
    readonly selectedLevelId = signal<string | null>(null);
    readonly skillFilterValue = signal('');

    title = '';
    description = '';
    assessmentType: AssessmentType | null = null;
    status: AssessmentStatus = AssessmentStatus.DRAFT;
    passingScore: number = 50;
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

    onSkillFilter(event: { filter: string }): void {
        this.skillFilterValue.set(event.filter ?? '');
    }

    createSkillInline(): void {
        const name = this.skillFilterValue().trim();
        if (!name) return;

        this.creatingSkill.set(true);
        this.skillService.createSkill({ name, description: '' }).subscribe({
            next: (newSkill) => {
                this.skills.update((list) => [...list, newSkill]);
                this.selectedSkillIds = [...this.selectedSkillIds, newSkill.id];
                this.creatingSkill.set(false);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Habilidade criada',
                    detail: `"${name}" adicionada com sucesso.`,
                });
            },
            error: () => {
                this.creatingSkill.set(false);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível criar a habilidade.',
                });
            },
        });
    }

    isFormValid(): boolean {
        if (!this.title.trim() || !this.assessmentType || !this.evaluationType()) {
            return false;
        }
        if (!this.sharedDate || !this.startTime || !this.endTime) return false;
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
            startDatetime: this.combineDateTime(this.sharedDate!, this.startTime!),
            endDatetime: this.combineDateTime(this.sharedDate!, this.endTime!),
            skillIds: this.isSkillsMode() ? this.selectedSkillIds : [],
            evaluatedUnitIds: this.isUnitsMode() ? this.selectedEvaluatedUnitIds : [],
        };

        this.loading.set(true);
        this.assessmentService.createAssessment(body).subscribe({
            next: () => {
                this.loading.set(false);
                this.created.emit();
                this.close();
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

    close(): void {
        this.dialogVisible.set(false);
    }

    onDialogHide(): void {
        this.visibleChange.emit(false);
    }

    private combineDateTime(date: Date, time: Date): string {
        const result = new Date(date);
        result.setHours(time.getHours(), time.getMinutes(), 0, 0);
        return result.toISOString().slice(0, 19);
    }

    private resetForm(): void {
        this.title = '';
        this.description = '';
        this.assessmentType = null;
        this.status = AssessmentStatus.DRAFT;
        this.passingScore = 50;
        this.sharedDate = this._initialDate ? new Date(this._initialDate) : null;
        this.startTime = this._initialDate ? new Date(this._initialDate) : null;
        this.endTime = this._initialDate ? new Date(this._initialDate.getTime() + 60 * 60 * 1000) : null;
        this.selectedSkillIds = [];
        this.selectedEvaluatedUnitIds = [];
        this.evaluationType.set(null);
        this.selectedLevelId.set(null);
        this.skillFilterValue.set('');
    }
}
