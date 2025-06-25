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
import { SkillCategory } from 'src/app/core/enums/skill-category';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { Router } from '@angular/router';

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
        MultiSelectModule
    ],
    templateUrl: './create.component.html'
})
export class CreateComponent {
    assessment: any = {
        title: '',
        description: '',
        type: null,
        date: null,
        totalPoints: 100,
        passingScore: 60,
        skillEvaluations: []
    };

    loading = false;
    unitId = '1'; // This would typically come from a route parameter or selection

    constructor(
        private assessmentService: AssessmentService,
        private router: Router
    ) {}

    assessmentTypes = [
        { label: 'Exam', value: 'Exam' },
        { label: 'Quiz', value: 'Quiz' },
        { label: 'Assignment', value: 'Assignment' },
        { label: 'Project', value: 'Project' }
    ];

    // Available skill categories for selection
    skillCategories = Object.keys(SkillCategory)
        .filter(key => isNaN(Number(key)))
        .map(key => ({
            label: key,
            value: SkillCategory[key as keyof typeof SkillCategory]
        }));

    saveAssessment() {
        this.loading = true;
        this.assessmentService.createAssessment(this.unitId, this.assessment).subscribe({
            next: (createdAssessment) => {
                console.log('Assessment created successfully:', createdAssessment);
                this.loading = false;
                // Navigate back to the assessments list
                this.router.navigate(['/schoolar/assessments']);
            },
            error: (error) => {
                console.error('Error creating assessment:', error);
                this.loading = false;
                // In a real application, you would show an error message to the user
            }
        });
    }
}
