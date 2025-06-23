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
        // In a real application, you would save the assessment data using a service
        console.log('Assessment saved:', this.assessment);
        // Navigate back to the list page
    }
}
