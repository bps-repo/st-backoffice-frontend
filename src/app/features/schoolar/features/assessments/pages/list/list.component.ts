import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    TableColumn,
} from 'src/app/shared/components/tables/global-table/global-table.component';
import {TableService} from 'src/app/shared/services/table.service';
import {Router} from "@angular/router";
import {AssessmentService} from 'src/app/core/services/assessment.service';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {TabViewModule} from 'primeng/tabview';
import {BadgeModule} from 'primeng/badge';
import {TableModule} from 'primeng/table';
import {TagModule} from 'primeng/tag';
import {TooltipModule} from 'primeng/tooltip';
import {FormsModule} from '@angular/forms';

@Component({
    selector: 'app-general',
    imports: [
        CommonModule,
        CardModule,
        ButtonModule,
        InputTextModule,
        DropdownModule,
        TabViewModule,
        BadgeModule,
        TableModule,
        TagModule,
        TooltipModule,
        FormsModule
    ],
    templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
    assessments: any[] = []; // This would be populated from a service
    columns: TableColumn[] = [];
    globalFilterFields: string[] = [];
    loading = false;

    // KPI metrics
    totalAssessments = 2;
    activeAssessments = 1;
    completedAssessments = 1;
    gradesReleased = 1;

    // Current view and filters
    currentView = 'assessments';
    searchTerm = '';
    typeFilter = '';
    statusFilter = '';

    // Filter options
    typeOptions = [
        { label: 'Todos os Tipos', value: '' },
        { label: 'Prova Oral', value: 'oral' },
        { label: 'Prova Escrita', value: 'written' },
        { label: 'Quiz', value: 'quiz' }
    ];

    statusOptions = [
        { label: 'Todos os Status', value: '' },
        { label: 'Ativa', value: 'active' },
        { label: 'Concluída', value: 'completed' },
        { label: 'Rascunho', value: 'draft' }
    ];

    // Sample assessment data
    sampleAssessments = [
        {
            id: 1,
            name: 'Unit 1 - Basic Conversation',
            type: 'Prova Oral',
            unit: 'Basic Level - Unit 1',
            date: '15/01/2024',
            status: 'Concluída',
            competencies: ['speaking', 'listening', 'vocabulary'],
            score: 100
        },
        {
            id: 2,
            name: 'Grammar Test - Present Tense',
            type: 'Prova Escrita',
            unit: 'Basic Level - Unit 2',
            date: '20/01/2024',
            status: 'Ativa',
            competencies: ['grammar', 'writing'],
            score: 50
        }
    ];

    constructor(
        private tableService: TableService<any>,
        private router: Router,
        private assessmentService: AssessmentService
    ) {}

    ngOnInit(): void {
        // Initialize with sample data - in real app, load from service
        this.assessments = this.sampleAssessments;
        this.loading = false;

        // Define custom column templates for different filter types
        this.columns = [
            {
                field: 'name',
                header: 'Nome',
                filterType: 'text',
            },
            {
                field: 'type',
                header: 'Tipo',
                filterType: 'text',
            },
            {
                field: 'unit',
                header: 'Unidade',
                filterType: 'text',
            },
            {
                field: 'date',
                header: 'Data',
                filterType: 'date',
            },
            {
                field: 'status',
                header: 'Status',
                filterType: 'text',
            },
            {
                field: 'competencies',
                header: 'Competências',
                filterType: 'text',
            },
            {
                field: 'score',
                header: 'Pontuação',
                filterType: 'text',
            }
        ];

        // Populate globalFilterFields
        this.globalFilterFields = this.columns.map(col => col.field);
    }

    getStatusSeverity(status: string): string {
        switch (status) {
            case 'Concluída':
                return 'success';
            case 'Ativa':
                return 'info';
            case 'Rascunho':
                return 'warning';
            default:
                return 'secondary';
        }
    }

    getCompetencyLabel(competency: string): string {
        const labels: any = {
            'speaking': 'Speaking',
            'listening': 'Listening',
            'vocabulary': 'Vocabulary',
            'grammar': 'Grammar',
            'writing': 'Writing',
            'fluency': 'Fluency'
        };
        return labels[competency] || competency;
    }

    editAssessment(assessment: any) {
        this.router.navigate(['/schoolar/assessments/edit', assessment.id]);
    }

    deleteAssessment(assessment: any) {
        // Implement delete functionality
        console.log('Delete assessment:', assessment);
    }

    viewDetails(assessment: any) {
        this.router.navigate(['/schoolar/assessments', assessment.id]);
    }

    createAssessment() {
        this.router.navigate(['/schoolar/assessments/create']);
    }
}
