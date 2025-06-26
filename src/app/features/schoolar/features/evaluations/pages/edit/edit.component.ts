import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
    selector: 'app-edit',
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
    templateUrl: './edit.component.html'
})
export class EditComponent implements OnInit {
    evaluationId: string | null = null;
    evaluation: any = {
        id: 1,
        title: 'Midterm Exam',
        class: { label: 'English Beginner', value: 'English Beginner' },
        date: new Date('2023-03-15'),
        type: { label: 'Exam', value: 'Exam' },
        description: 'Comprehensive assessment of student knowledge',
        maxScore: 100,
        passingScore: 60,
        status: { label: 'Completed', value: 'Completed' }
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

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.evaluationId = this.route.snapshot.paramMap.get('id');
        // In a real application, you would fetch the evaluation data from a service
        // this.evaluationService.getEvaluation(this.evaluationId).subscribe(data => {
        //     this.evaluation = data;
        // });
    }

    saveEvaluation() {
        // In a real application, you would save the evaluation data using a service
        console.log('Evaluation updated:', this.evaluation);
        // Navigate back to the student page
    }
}
