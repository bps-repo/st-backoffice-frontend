import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { SkeletonModule } from 'primeng/skeleton';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { LevelService } from 'src/app/core/services/level.service';

interface Alert {
    label: string;
    description: string;
}

@Component({
    selector: 'app-students-materials-dashboard',
    standalone: true,
    imports: [ChartModule, CommonModule, FormsModule, CalendarModule, SkeletonModule],
    templateUrl: './level-dashboard.component.html',
})
export class LevelDashboardComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    // Data observables
    levels$!: Observable<any[]>;
    kpis$!: Observable<any[]>;

    // Chart data
    pieDataLevels: any;
    pieLevelOptions: any;
    barChartData: any;
    barChartOptions: any;

    // UI data
    dateRange: Date[] | undefined;
    loading = true;

    alerts: Alert[] = [
        { label: 'Novo Curso', description: 'Curso de Design Gráfico foi adicionado' },
        { label: 'Atualização', description: 'Curso de Programação Avançada atualizado com novos módulos' },
        { label: 'Curso Removido', description: 'Curso de Fotografia Básica foi arquivado' },
    ];

    constructor(private levelService: LevelService) {}

    ngOnInit(): void {
        this.loadData();
        this.initPieChart();
        this.initBarChart();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadData(): void {
        this.levels$ = this.levelService.getLevels();

        this.kpis$ = this.levels$.pipe(
            map(levels => this.buildKPIs(levels))
        );

        this.levels$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(levels => {
            this.updateCharts(levels);
            this.loading = false;
        });
    }

    private buildKPIs(levels: any[]): any[] {
        const totalLevels = levels.length;
        const activeLevels = levels.filter(l => l.active !== false).length;

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newLevels = levels.filter(l => {
            return l.createdAt && new Date(l.createdAt) >= thirtyDaysAgo;
        }).length;

        return [
            { label: 'Cursos Ativos', current: activeLevels, diff: 10 },
            { label: 'Novos Cursos', current: newLevels, diff: 25 },
            { label: 'Total de Níveis', current: totalLevels, diff: 0 },
            { label: 'Alunos por Curso (média)', current: Math.floor(Math.random() * 50) + 100, diff: 5 },
        ];
    }

    private updateCharts(levels: any[]): void {
        this.updatePieChart(levels);
        this.updateBarChart(levels);
    }

    private updatePieChart(levels: any[]): void {
        const categoryCounts: {[key: string]: number} = {};

        levels.forEach(level => {
            const category = level.category || 'Outros';
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });

        const labels = Object.keys(categoryCounts);
        const data = Object.values(categoryCounts);

        if (labels.length === 0) {
            this.pieDataLevels = {
                labels: ['Tecnologia', 'Idiomas', 'Negócios', 'Design', 'Marketing'],
                datasets: [{ data: [14, 10, 8, 6, 4], backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#EF5350', '#AB47BC'] }]
            };
        } else {
            this.pieDataLevels = {
                labels: labels,
                datasets: [{ data: data, backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#EF5350', '#AB47BC'] }]
            };
        }
    }

    private updateBarChart(levels: any[]): void {
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
        const currentYear = new Date().getFullYear();

        const newLevelsData = new Array(6).fill(0);
        const activeLevelsData = [30, 32, 35, 37, 39, levels.length];

        levels.forEach(level => {
            if (level.createdAt) {
                const levelDate = new Date(level.createdAt);
                if (levelDate.getFullYear() === currentYear) {
                    const month = levelDate.getMonth();
                    if (month < 6) {
                        newLevelsData[month]++;
                    }
                }
            }
        });

        this.barChartData = {
            labels: months,
            datasets: [
                { label: 'Novos Cursos', backgroundColor: '#42A5F5', data: newLevelsData },
                { label: 'Cursos Ativos', backgroundColor: '#E3F2FD', data: activeLevelsData }
            ]
        };
    }

    initPieChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.pieDataLevels = {
            labels: ['Tecnologia', 'Idiomas', 'Negócios', 'Design', 'Marketing'],
            datasets: [
                {
                    data: [14, 10, 8, 6, 4],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--primary-800'),
                        documentStyle.getPropertyValue('--primary-600'),
                        documentStyle.getPropertyValue('--primary-400'),
                        documentStyle.getPropertyValue('--primary-300'),
                        documentStyle.getPropertyValue('--primary-100'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--primary-600'),
                        documentStyle.getPropertyValue('--primary-400'),
                        documentStyle.getPropertyValue('--primary-300'),
                        documentStyle.getPropertyValue('--primary-200'),
                        documentStyle.getPropertyValue('--primary-100'),
                    ],
                },
            ],
        };

        this.pieLevelOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        font: { weight: 700 },
                        padding: 20,
                    },
                    position: 'bottom',
                },
            },
        };
    }

    initBarChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.barChartData = {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            datasets: [
                {
                    label: 'Novos Cursos',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    data: [2, 3, 4, 6, 5, 8],
                },
                {
                    label: 'Cursos Ativos',
                    backgroundColor: documentStyle.getPropertyValue('--primary-200'),
                    data: [30, 32, 35, 37, 39, 42],
                },
            ],
        };

        this.barChartOptions = {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: { color: textColor },
                    grid: { color: documentStyle.getPropertyValue('--surface-border') },
                },
                y: {
                    beginAtZero: true,
                    ticks: { color: textColor },
                    grid: { color: documentStyle.getPropertyValue('--surface-border') },
                },
            },
        };
    }

    filtrarDados() {
        console.log('Filtrando cursos entre:', this.dateRange);
    }
}
