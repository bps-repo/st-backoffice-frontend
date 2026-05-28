// src/app/features/schoolar/features/settings/components/assessments/assessments-setting.component.ts
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    inject,
    signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SkillService, CreateSkillRequest } from 'src/app/core/services/skill.service';
import { Skill } from 'src/app/core/models/academic/skill';

@Component({
    selector: 'app-assessments-setting',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CardModule,
        InputTextModule,
        TextareaModule,
        TableModule,
        ToastModule,
        ConfirmDialogModule,
        DialogModule,
        TooltipModule,
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './assessments-setting.component.html',
})
export class AssessmentsSettingComponent implements OnInit {
    private skillService = inject(SkillService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private cdr = inject(ChangeDetectorRef);

    readonly skills = signal<Skill[]>([]);
    readonly loading = signal(false);
    readonly totalRecords = signal(0);
    readonly pageSize = signal(10);
    readonly currentPage = signal(0);

    // Plain booleans for PrimeNG two-way [(visible)] binding
    dialogVisible = false;
    editMode = false;

    readonly saving = signal(false);

    // Form fields
    editingId: string | null = null;
    skillName = '';
    skillDescription = '';

    ngOnInit(): void {
        this.loadSkills();
    }

    loadSkills(): void {
        this.loading.set(true);
        this.skillService.listSkills({ page: this.currentPage(), size: this.pageSize() }).subscribe({
            next: (res) => {
                this.skills.set(res.data.content);
                this.totalRecords.set(res.data.totalElements);
                this.loading.set(false);
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar as habilidades.' });
                this.loading.set(false);
            },
        });
    }

    onPage(event: { first: number; rows: number }): void {
        this.currentPage.set(event.first / event.rows);
        this.pageSize.set(event.rows);
        this.loadSkills();
    }

    openCreate(): void {
        this.editingId = null;
        this.skillName = '';
        this.skillDescription = '';
        this.editMode = false;
        this.dialogVisible = true;
    }

    openEdit(skill: Skill): void {
        this.editingId = skill.id;
        this.skillName = skill.name;
        this.skillDescription = skill.description;
        this.editMode = true;
        this.dialogVisible = true;
    }

    closeDialog(): void {
        this.dialogVisible = false;
    }

    isFormValid(): boolean {
        return this.skillName.trim().length > 0;
    }

    save(): void {
        if (!this.isFormValid()) return;

        const body: CreateSkillRequest = {
            name: this.skillName.trim(),
            description: this.skillDescription.trim(),
        };

        this.saving.set(true);

        const request$ = this.editMode && this.editingId
            ? this.skillService.updateSkill(this.editingId, body)
            : this.skillService.createSkill(body);

        request$.subscribe({
            next: () => {
                this.saving.set(false);
                this.dialogVisible = false;
                this.cdr.markForCheck();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: this.editMode ? 'Habilidade atualizada.' : 'Habilidade criada.',
                });
                this.loadSkills();
            },
            error: () => {
                this.saving.set(false);
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Operação falhou.' });
            },
        });
    }

    confirmDelete(skill: Skill): void {
        this.confirmationService.confirm({
            message: `Excluir a habilidade "${skill.name}"?`,
            header: 'Confirmar exclusão',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.skillService.deleteSkill(skill.id).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Habilidade excluída.' });
                        this.loadSkills();
                    },
                    error: () => {
                        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível excluir.' });
                    },
                });
            },
        });
    }
}
