import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-detail',
    standalone: true,
    imports: [CommonModule, TabViewModule, ButtonModule, CardModule],
    templateUrl: './detail.component.html',
})
export class DetailComponent implements OnInit {
    assessmentId: string | null = null;
    assessment: any = {
        id: 1,
        title: 'Midterm Exam',
        description: 'Comprehensive assessment of student knowledge',
        type: 'Exam',
        date: '2023-06-15',
        status: 'Completed',
        totalPoints: 100,
        passingScore: 60
    };

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.assessmentId = this.route.snapshot.paramMap.get('id');
        // In a real application, you would fetch the assessment data from a service
        // this.assessmentService.getAssessment(this.assessmentId).subscribe(data => {
        //     this.assessment = data;
        // });
    }
}
