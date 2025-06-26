import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-student',
    imports: [
        CommonModule,
        TabViewModule,
        ButtonModule,
        CardModule,
        TableModule,
        TagModule
    ],
    templateUrl: './detail.component.html'
})
export class DetailComponent implements OnInit {
    evaluationId: string | null = null;
    evaluation: any = {
        id: 1,
        title: 'Midterm Exam',
        class: 'English Beginner',
        date: '2023-03-15',
        type: 'Exam',
        description: 'Comprehensive assessment of student knowledge',
        maxScore: 100,
        passingScore: 60,
        status: 'Completed',
        students: [
            { id: 1, name: 'John Doe', score: 85, grade: 'B', status: 'Passed' },
            { id: 2, name: 'Jane Smith', score: 92, grade: 'A', status: 'Passed' },
            { id: 3, name: 'Michael Johnson', score: 78, grade: 'C', status: 'Passed' },
            { id: 4, name: 'Emily Brown', score: 55, grade: 'F', status: 'Failed' }
        ],
        questions: [
            { id: 1, text: 'What is the past tense of "go"?', type: 'Multiple Choice', points: 5 },
            { id: 2, text: 'Translate the following sentence to English', type: 'Text', points: 10 },
            { id: 3, text: 'Complete the dialogue with appropriate phrases', type: 'Fill in the blanks', points: 15 }
        ]
    };

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.evaluationId = this.route.snapshot.paramMap.get('id');
        // In a real application, you would fetch the evaluation data from a service
        // this.evaluationService.getEvaluation(this.evaluationId).subscribe(data => {
        //     this.evaluation = data;
        // });
    }

    getSeverity(status: string) {
        switch (status) {
            case 'Passed':
                return 'success';
            case 'Failed':
                return 'danger';
            case 'Pending':
                return 'warning';
            case 'Completed':
                return 'info';
            default:
                return 'info';
        }
    }
}
