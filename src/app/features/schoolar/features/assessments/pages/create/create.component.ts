import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { ChipModule } from 'primeng/chip';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { SkillCategory } from 'src/app/core/enums/skill-category';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-create',
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CardModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        CalendarModule,
        InputNumberModule,
        ChipModule,
        MultiSelectModule,
        CheckboxModule,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './create.component.html'
})
export class CreateComponent {
    assessment: any = {
        name: '',
        type: null,
        assignTo: null,
        unit: null,
        date: null,
        maxScore: 100,
        status: 'Rascunho',
        competencies: {
            listening: false,
            speaking: false,
            writing: false,
            vocabulary: false,
            grammar: false,
            fluency: false
        }
    };

    loading = false;

    constructor(
        private assessmentService: AssessmentService,
        private router: Router,
        private messageService: MessageService
    ) {}

    assessmentTypes = [
        { label: 'Prova Oral', value: 'oral' },
        { label: 'Prova Escrita', value: 'written' },
        { label: 'Quiz', value: 'quiz' },
        { label: 'Teste', value: 'test' }
    ];

    assignToOptions = [
        { label: 'Turma Inteira', value: 'entire-class' },
        { label: 'Grupos Específicos', value: 'specific-groups' },
        { label: 'Alunos Individuais', value: 'individual-students' }
    ];

    unitOptions = [
        { label: 'Selecione a unidade', value: null },
        { label: 'Basic Level - Unit 1', value: 'basic-unit-1' },
        { label: 'Basic Level - Unit 2', value: 'basic-unit-2' },
        { label: 'Intermediate Level - Unit 1', value: 'intermediate-unit-1' },
        { label: 'Advanced Level - Unit 1', value: 'advanced-unit-1' }
    ];

    statusOptions = [
        { label: 'Rascunho', value: 'Rascunho' },
        { label: 'Ativa', value: 'Ativa' },
        { label: 'Agendada', value: 'Agendada' }
    ];

    saveAssessment() {
        if (!this.isFormValid()) {
            this.messageService.add({
                severity: 'error',
                summary: 'Formulário Inválido',
                detail: 'Por favor, preencha todos os campos obrigatórios'
            });
            return;
        }

        this.loading = true;

        // Prepare assessment data
        const assessmentData = {
            ...this.assessment,
            competencies: Object.keys(this.assessment.competencies)
                .filter(key => this.assessment.competencies[key])
        };

        // In real app, save to service
        console.log('Saving assessment:', assessmentData);

        // Simulate API call
        setTimeout(() => {
            this.loading = false;
            this.messageService.add({
                severity: 'success',
                summary: 'Avaliação Salva',
                detail: 'A avaliação foi criada com sucesso!'
            });

            // Navigate back to list after delay
            setTimeout(() => {
                this.router.navigate(['/schoolar/assessments']);
            }, 2000);
        }, 1000);
    }

    cancel() {
        this.router.navigate(['/schoolar/assessments']);
    }

    isFormValid(): boolean {
        return !!(this.assessment.name &&
                 this.assessment.type &&
                 this.assessment.assignTo &&
                 this.assessment.unit &&
                 this.assessment.date);
    }

    hasSelectedCompetencies(): boolean {
        return Object.values(this.assessment.competencies).some(value => value === true);
    }
}
