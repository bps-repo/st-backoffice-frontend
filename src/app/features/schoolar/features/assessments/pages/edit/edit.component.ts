import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { AssessmentService } from 'src/app/core/services/assessment.service';

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
    assessmentId: string | null = null;
    assessment: any = {
        title: '',
        description: '',
        type: null,
        date: null,
        totalPoints: 100,
        passingScore: 60
    };
    loading = false;

    assessmentTypes = [
        { label: 'Exam', value: 'Exam' },
        { label: 'Quiz', value: 'Quiz' },
        { label: 'Assignment', value: 'Assignment' },
        { label: 'Project', value: 'Project' }
    ];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private assessmentService: AssessmentService
    ) {}

    ngOnInit(): void {
        this.assessmentId = this.route.snapshot.paramMap.get('id');
        if (this.assessmentId) {
            this.loading = true;
            this.assessmentService.getAssessmentById(this.assessmentId).subscribe({
                next: (data) => {
                    this.assessment = data;
                    // Convert type to dropdown format if needed
                    if (data.type && typeof data.type === 'string') {
                        this.assessment.type = this.assessmentTypes.find(t => t.value === data.type) || null;
                    }
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error fetching assessment:', error);
                    this.loading = false;
                    // In a real application, you would show an error message to the user
                }
            });
        }
    }

    saveAssessment() {
        if (!this.assessmentId) {
            console.error('Assessment ID is missing');
            return;
        }

        // Prepare assessment data for submission
        const assessmentData = { ...this.assessment };
        // Convert type from dropdown format if needed
        if (assessmentData.type && typeof assessmentData.type === 'object') {
            assessmentData.type = assessmentData.type.value;
        }

        this.loading = true;
        this.assessmentService.updateAssessment(this.assessmentId, assessmentData).subscribe({
            next: (updatedAssessment) => {
                console.log('Assessment updated successfully:', updatedAssessment);
                this.loading = false;
                // Navigate back to the assessment detail page
                this.router.navigate(['/schoolar/assessments', this.assessmentId]);
            },
            error: (error) => {
                console.error('Error updating assessment:', error);
                this.loading = false;
                // In a real application, you would show an error message to the user
            }
        });
    }
}
