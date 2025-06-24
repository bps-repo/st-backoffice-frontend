import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Exam } from 'src/app/core/models/academic/exam';
import { selectSelectedExam } from 'src/app/core/store/schoolar/assessments/exams.selectors';
import { ChartModule } from 'primeng/chart';

@Component({
    selector: 'app-scores',
    standalone: true,
    imports: [CommonModule, ChartModule],
    templateUrl: './scores.component.html'
})
export class ScoresComponent implements OnInit {
    exam$: Observable<Exam | null>;

    // Chart data
    radarData: any;
    barData: any;
    chartOptions: any;

    constructor(private store: Store) {
        this.exam$ = this.store.select(selectSelectedExam);
    }

    ngOnInit(): void {
        this.exam$.subscribe(exam => {
            if (exam) {
                this.initCharts(exam);
            }
        });

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                r: {
                    pointLabels: {
                        color: '#495057',
                    },
                    grid: {
                        color: '#ebedef',
                    },
                    angleLines: {
                        color: '#ebedef'
                    }
                }
            }
        };
    }

    private initCharts(exam: Exam): void {
        // Radar chart for skill scores
        this.radarData = {
            labels: ['Reading', 'Writing', 'Listening', 'Speaking', 'Grammar', 'Vocabulary', 'Comprehension'],
            datasets: [
                {
                    label: 'Skill Scores',
                    backgroundColor: 'rgba(66, 165, 245, 0.2)',
                    borderColor: 'rgba(66, 165, 245, 1)',
                    pointBackgroundColor: 'rgba(66, 165, 245, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(66, 165, 245, 1)',
                    data: [
                        parseInt(exam.reading || '0'),
                        parseInt(exam.writing || '0'),
                        parseInt(exam.listening || '0'),
                        parseInt(exam.speaking || '0'),
                        parseInt(exam.grammar || '0'),
                        parseInt(exam.vocabulary || '0'),
                        parseInt(exam.comprehension || '0')
                    ]
                }
            ]
        };

        // Bar chart for comparison with class average (mock data)
        this.barData = {
            labels: ['Reading', 'Writing', 'Listening', 'Speaking', 'Grammar', 'Vocabulary', 'Comprehension'],
            datasets: [
                {
                    label: 'Exam Average',
                    backgroundColor: 'rgba(66, 165, 245, 0.8)',
                    data: [
                        parseInt(exam.reading || '0'),
                        parseInt(exam.writing || '0'),
                        parseInt(exam.listening || '0'),
                        parseInt(exam.speaking || '0'),
                        parseInt(exam.grammar || '0'),
                        parseInt(exam.vocabulary || '0'),
                        parseInt(exam.comprehension || '0')
                    ]
                },
                {
                    label: 'Class Average',
                    backgroundColor: 'rgba(156, 39, 176, 0.8)',
                    data: [75, 70, 80, 85, 65, 75, 80]
                }
            ]
        };
    }
}
