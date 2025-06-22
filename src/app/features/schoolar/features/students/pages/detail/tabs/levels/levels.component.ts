import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {ProgressBarModule} from 'primeng/progressbar';
import {TagModule} from 'primeng/tag';

@Component({
    selector: 'app-levels',
    imports: [
        CommonModule,
        CardModule,
        ButtonModule,
        ProgressBarModule,
        TagModule
    ],
    templateUrl: './levels.component.html'
})
export class LevelsComponent implements OnInit {
    courses = [
        {
            id: 1,
            name: 'Intermediate Level',
            description: 'Comprehensive English course for intermediate students',
            startDate: '2023-01-15',
            endDate: '2023-12-15',
            progress: 65,
            status: 'In Progress',
            instructor: 'John Smith',
            image: 'assets/demo/images/levels/level.png'
        },
        {
            id: 2,
            name: 'Beginner Level',
            description: 'Introduction to Spanish language and culture',
            startDate: '2023-03-01',
            endDate: '2023-09-01',
            progress: 100,
            status: 'completed',
            instructor: 'Maria Rodriguez',
            image: 'assets/demo/images/levels/level.png'
        },
        {
            id: 3,
            name: 'Elementary Level',
            description: 'Learn basic French conversation skills',
            startDate: '2022-09-15',
            endDate: '2023-03-15',
            progress: 100,
            status: 'Completed',
            instructor: 'Pierre Dupont',
            image: 'assets/demo/images/levels/level.png'
        }
    ];

    ngOnInit() {
        // In a real application, you would fetch the student's levels from a service
    }

    getSeverity(status: string) {
        switch (status) {
            case 'Completed':
                return 'success';
            case 'In Progress':
                return 'info';
            case 'Not Started':
                return 'warning';
            default:
                return 'info';
        }
    }

    viewCourseDetails(courseId: number) {
        console.log('Viewing course details for course ID:', courseId);
        // In a real application, this would navigate to the course details page
    }
}
