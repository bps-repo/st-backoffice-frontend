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
    templateUrl: './create.component.html'
})
export class CreateComponent {
    evaluation: any = {
        title: '',
        class: null,
        date: null,
        type: null,
        description: '',
        maxScore: 100,
        passingScore: 60,
        status: 'Draft'
    };

    classes = [
        { label: 'English Beginner', value: 'English Beginner' },
        { label: 'English Intermediate', value: 'English Intermediate' },
        { label: 'Spanish Beginner', value: 'Spanish Beginner' },
        { label: 'French Beginner', value: 'French Beginner' }
    ];

    evaluationTypes = [
        { label: 'Exam', value: 'Exam' },
        { label: 'Quiz', value: 'Quiz' },
        { label: 'Test', value: 'Test' },
        { label: 'Project', value: 'Project' },
        { label: 'Assignment', value: 'Assignment' }
    ];

    statuses = [
        { label: 'Draft', value: 'Draft' },
        { label: 'Scheduled', value: 'Scheduled' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Completed', value: 'Completed' },
        { label: 'Cancelled', value: 'Cancelled' }
    ];

    saveEvaluation() {
        // In a real application, you would save the evaluation data using a service
        console.log('Evaluation saved:', this.evaluation);
        // Navigate back to the list page
    }
}
