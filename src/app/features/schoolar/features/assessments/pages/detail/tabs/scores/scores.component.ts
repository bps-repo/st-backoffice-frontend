import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Exam } from 'src/app/core/models/academic/exam';
import { selectSelectedExam } from 'src/app/core/store/schoolar/assessments/exams.selectors';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
    selector: 'app-scores',
    standalone: true,
    imports: [CommonModule, ChartModule, CardModule, TagModule, ProgressBarModule],
    templateUrl: './scores.component.html'
})
export class ScoresComponent implements OnInit {
    exam$: Observable<Exam | null>;

    // Chart data
    radarData: any;
    barData: any;
    pieData: any;
    chartOptions: any;
    pieOptions: any;

    // Analytics data
    skillAnalysis: any[] = [];
    overallPerformance: string = '';
    strongAreas: string[] = [];
    weakAreas: string[] = [];

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

        this.pieOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: '#495057'
                    }
                }
            }
        };
    }

    private initCharts(exam: Exam): void {
        const skills = {
            reading: parseInt(exam.reading || '0'),
            writing: parseInt(exam.writing || '0'),
            listening: parseInt(exam.listening || '0'),
            speaking: parseInt(exam.speaking || '0'),
            grammar: parseInt(exam.grammar || '0'),
            vocabulary: parseInt(exam.vocabulary || '0'),
            comprehension: parseInt(exam.comprehension || '0')
        };

        // Radar chart for skill scores
        this.radarData = {
            labels: ['Reading', 'Writing', 'Listening', 'Speaking', 'Grammar', 'Vocabulary', 'Comprehension'],
            datasets: [
                {
                    label: 'Pontuação por Habilidade',
                    backgroundColor: 'rgba(66, 165, 245, 0.2)',
                    borderColor: 'rgba(66, 165, 245, 1)',
                    pointBackgroundColor: 'rgba(66, 165, 245, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(66, 165, 245, 1)',
                    data: [skills.reading, skills.writing, skills.listening, skills.speaking, skills.grammar, skills.vocabulary, skills.comprehension]
                }
            ]
        };

        // Bar chart for comparison with class average (mock data)
        this.barData = {
            labels: ['Reading', 'Writing', 'Listening', 'Speaking', 'Grammar', 'Vocabulary', 'Comprehension'],
            datasets: [
                {
                    label: 'Média da Avaliação',
                    backgroundColor: 'rgba(66, 165, 245, 0.8)',
                    data: [skills.reading, skills.writing, skills.listening, skills.speaking, skills.grammar, skills.vocabulary, skills.comprehension]
                },
                {
                    label: 'Média da Turma',
                    backgroundColor: 'rgba(156, 39, 176, 0.8)',
                    data: [75, 70, 80, 85, 65, 75, 80]
                }
            ]
        };

        // Pie chart for performance distribution
        const performanceDistribution = this.calculatePerformanceDistribution(skills);
        this.pieData = {
            labels: ['Excelente (90-100%)', 'Bom (80-89%)', 'Satisfatório (70-79%)', 'Necessita Melhoria (<70%)'],
            datasets: [
                {
                    data: [performanceDistribution.excellent, performanceDistribution.good, performanceDistribution.satisfactory, performanceDistribution.needsImprovement],
                    backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#F44336']
                }
            ]
        };

        // Generate analytics
        this.generateAnalytics(skills);
    }

    private calculatePerformanceDistribution(skills: any): any {
        const scores = Object.values(skills) as number[];
        return {
            excellent: scores.filter(score => score >= 90).length,
            good: scores.filter(score => score >= 80 && score < 90).length,
            satisfactory: scores.filter(score => score >= 70 && score < 80).length,
            needsImprovement: scores.filter(score => score < 70).length
        };
    }

    private generateAnalytics(skills: any): void {
        const skillEntries = Object.entries(skills) as [string, number][];
        const average = skillEntries.reduce((sum, [, score]) => sum + score, 0) / skillEntries.length;

        // Overall performance
        if (average >= 90) this.overallPerformance = 'Excelente';
        else if (average >= 80) this.overallPerformance = 'Bom';
        else if (average >= 70) this.overallPerformance = 'Satisfatório';
        else this.overallPerformance = 'Necessita Melhoria';

        // Strong and weak areas
        this.strongAreas = skillEntries.filter(([, score]) => score >= 80).map(([skill]) => skill);
        this.weakAreas = skillEntries.filter(([, score]) => score < 70).map(([skill]) => skill);

        // Detailed skill analysis
        this.skillAnalysis = skillEntries.map(([skill, score]) => ({
            skill,
            score,
            level: score >= 90 ? 'Excelente' : score >= 80 ? 'Bom' : score >= 70 ? 'Satisfatório' : 'Necessita Melhoria',
            color: score >= 90 ? 'success' : score >= 80 ? 'info' : score >= 70 ? 'warning' : 'danger'
        }));
    }
}
