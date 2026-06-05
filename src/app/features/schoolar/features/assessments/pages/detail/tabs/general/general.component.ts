// src/app/features/schoolar/features/assessments/pages/detail/tabs/general/general.component.ts
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { Assessment } from 'src/app/core/models/academic/assessment';
import { AssessmentStatus } from 'src/app/core/enums/assessment-status';
import { AssessmentType } from 'src/app/core/enums/assessment-type';
import { EvaluationType } from 'src/app/core/enums/evaluation-type';
import { ASSESSMENT_DETAIL_TOKEN } from 'src/app/shared/tokens/assessment-detail.token';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { SkillService } from 'src/app/core/services/skill.service';
import { UnitService } from 'src/app/core/services/unit.service';
import { LevelService } from 'src/app/core/services/level.service';
import { Skill } from 'src/app/core/models/academic/skill';
import { Unit } from 'src/app/core/models/course/unit';
import { Level } from 'src/app/core/models/course/level';

@Component({
    selector: 'app-general',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TagModule,
        ButtonModule,
        DialogModule,
        DropdownModule,
        ToastModule,
        ProgressSpinnerModule,
    ],
    providers: [MessageService],
    templateUrl: './general.component.html',
})
export class GeneralComponent {
    private assessmentService = inject(AssessmentService);
    private skillService = inject(SkillService);
    private unitService = inject(UnitService);
    private levelService = inject(LevelService);
    private messageService = inject(MessageService);

    // Token is always provided by the tab view injector — non-null assertion is safe here
    readonly assessment = signal<Assessment>(inject<Assessment>(ASSESSMENT_DETAIL_TOKEN, { optional: true } as any)!);

    readonly removingSkillId = signal<string | null>(null);
    readonly removingUnitId = signal<string | null>(null);
    readonly addingItem = signal(false);

    readonly showAddSkillDialog = signal(false);
    readonly showAddUnitDialog = signal(false);

    readonly availableSkills = signal<Skill[]>([]);
    readonly availableUnits = signal<Unit[]>([]);
    readonly availableLevels = signal<Level[]>([]);
    readonly selectedSkillId = signal<string | null>(null);
    readonly selectedUnitId = signal<string | null>(null);
    readonly selectedLevelId = signal<string | null>(null);
    readonly skillFilterValue = signal('');
    readonly creatingSkill = signal(false);

    readonly skillOptions = computed(() => {
        const currentIds = new Set((this.assessment()?.skills ?? []).map((s) => s.id));
        return this.availableSkills()
            .filter((s) => !currentIds.has(s.id))
            .map((s) => ({ label: s.name, value: s.id }));
    });

    readonly showCreateSkillButton = computed(() => {
        const filter = this.skillFilterValue().trim().toLowerCase();
        if (!filter) return false;
        return !this.skillOptions().some((o) => o.label.toLowerCase() === filter);
    });

    readonly levelOptions = computed(() =>
        this.availableLevels().map((l) => ({ label: l.name, value: l.id }))
    );

    readonly unitOptions = computed(() => {
        const currentIds = new Set((this.assessment()?.evaluatedUnits ?? []).map((u) => u.id));
        return this.availableUnits()
            .filter((u) => u.levelId === this.selectedLevelId() && !currentIds.has(u.id))
            .map((u) => ({ label: u.name, value: u.id }));
    });

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

    // --- Skills ---

    openAddSkillDialog(): void {
        this.selectedSkillId.set(null);
        this.skillFilterValue.set('');
        this.showAddSkillDialog.set(true);
        if (this.availableSkills().length === 0) {
            this.skillService.getSkills().subscribe({
                next: (skills) => this.availableSkills.set(skills),
                error: () => this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar as habilidades.' }),
            });
        }
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
                this.availableSkills.update((list) => [...list, newSkill]);
                this.selectedSkillId.set(newSkill.id);
                this.creatingSkill.set(false);
                this.messageService.add({ severity: 'success', summary: 'Habilidade criada', detail: `"${name}" adicionada com sucesso.` });
            },
            error: () => {
                this.creatingSkill.set(false);
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível criar a habilidade.' });
            },
        });
    }

    confirmAddSkill(): void {
        const assessment = this.assessment();
        const skillId = this.selectedSkillId();
        if (!assessment || !skillId) return;

        this.addingItem.set(true);
        this.assessmentService.addSkillToAssessment(assessment.id, skillId).subscribe({
            next: (updated) => {
                this.assessment.set(updated);
                this.addingItem.set(false);
                this.showAddSkillDialog.set(false);
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Habilidade adicionada.' });
            },
            error: () => {
                this.addingItem.set(false);
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível adicionar a habilidade.' });
            },
        });
    }

    removeSkill(skillId: string): void {
        const assessment = this.assessment();
        if (!assessment) return;

        this.removingSkillId.set(skillId);
        this.assessmentService.removeSkillFromAssessment(assessment.id, skillId).subscribe({
            next: () => {
                this.assessment.update((a) => ({
                    ...a,
                    skills: a.skills.filter((s) => s.id !== skillId),
                }));
                this.removingSkillId.set(null);
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Habilidade removida.' });
            },
            error: () => {
                this.removingSkillId.set(null);
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível remover a habilidade.' });
            },
        });
    }

    // --- Evaluated Units ---

    openAddUnitDialog(): void {
        this.selectedUnitId.set(null);
        this.selectedLevelId.set(null);
        this.showAddUnitDialog.set(true);

        if (this.availableLevels().length === 0) {
            this.levelService.getLevels().subscribe({
                next: (levels) => this.availableLevels.set(levels),
                error: () => this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar os níveis.' }),
            });
        }

        if (this.availableUnits().length === 0) {
            this.unitService.loadUnits().subscribe({
                next: (units) => this.availableUnits.set(units),
                error: () => this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar as unidades.' }),
            });
        }
    }

    onLevelChange(levelId: string | null): void {
        this.selectedLevelId.set(levelId);
        this.selectedUnitId.set(null);
    }

    confirmAddUnit(): void {
        const assessment = this.assessment();
        const unitId = this.selectedUnitId();
        if (!assessment || !unitId) return;

        this.addingItem.set(true);
        this.assessmentService.addEvaluatedUnit(assessment.id, unitId).subscribe({
            next: (updated) => {
                this.assessment.set(updated);
                this.addingItem.set(false);
                this.showAddUnitDialog.set(false);
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Unidade adicionada.' });
            },
            error: () => {
                this.addingItem.set(false);
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível adicionar a unidade.' });
            },
        });
    }

    removeUnit(unitId: string): void {
        const assessment = this.assessment();
        if (!assessment) return;

        this.removingUnitId.set(unitId);
        this.assessmentService.removeEvaluatedUnit(assessment.id, unitId).subscribe({
            next: () => {
                this.assessment.update((a) => ({
                    ...a,
                    evaluatedUnits: a.evaluatedUnits.filter((u) => u.id !== unitId),
                }));
                this.removingUnitId.set(null);
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Unidade removida.' });
            },
            error: () => {
                this.removingUnitId.set(null);
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível remover a unidade.' });
            },
        });
    }
}
