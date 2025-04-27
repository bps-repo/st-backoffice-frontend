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
    templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {
    assessmentId: string | null = null;
    assessment: any = {
        id: 1,
        title: 'Midterm Exam',
        description: 'Comprehensive assessment of student knowledge',
        type: { label: 'Exam', value: 'Exam' },
        date: new Date('2023-06-15'),
        status: 'Completed',
        totalPoints: 100,
        passingScore: 60
    };

    assessmentTypes = [
        { label: 'Exam', value: 'Exam' },
        { label: 'Quiz', value: 'Quiz' },
        { label: 'Assignment', value: 'Assignment' },
        { label: 'Project', value: 'Project' }
    ];

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.assessmentId = this.route.snapshot.paramMap.get('id');
        // In a real application, you would fetch the assessment data from a service
        // this.assessmentService.getAssessment(this.assessmentId).subscribe(data => {
        //     this.assessment = data;
        // });
    }

    saveAssessment() {
        // In a real application, you would save the assessment data using a service
        console.log('Assessment updated:', this.assessment);
        // Navigate back to the detail page
    }
}
