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

@Component({
    selector: 'app-create',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CardModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        CalendarModule,
        InputNumberModule
    ],
    templateUrl: './create.component.html',
})
export class CreateComponent {
    assessment: any = {
        title: '',
        description: '',
        type: null,
        date: null,
        totalPoints: 100,
        passingScore: 60
    };

    assessmentTypes = [
        { label: 'Exam', value: 'Exam' },
        { label: 'Quiz', value: 'Quiz' },
        { label: 'Assignment', value: 'Assignment' },
        { label: 'Project', value: 'Project' }
    ];

    saveAssessment() {
        // In a real application, you would save the assessment data using a service
        console.log('Assessment saved:', this.assessment);
        // Navigate back to the list page
    }
}
