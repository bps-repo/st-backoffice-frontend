import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { MaterialService } from 'src/app/core/services/material.service';
import { Material } from 'src/app/core/models/academic/material';

@Component({
    selector: 'app-material-dashboard',
    standalone: true,
    imports: [
        ChartModule,
        CommonModule,
        FormsModule,
        CalendarModule,
        CardModule,
        ButtonModule,
        TableModule,
        SkeletonModule
    ],
    templateUrl: './materials-dashboard.component.html',
})
export class MaterialsDashboardComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    // Data observables
    materials$!: Observable<Material[]>;
    kpis$!: Observable<any[]>;
    topMaterials$!: Observable<any[]>;

    // Chart data
    pieDataMaterialType: any;
    pieMaterialTypeOptions: any;
    lineChartData: any;
    lineChartOptions: any;
    barChartData: any;
    barChartOptions: any;

    // UI data
    dateRange: Date[] | undefined;
    loading = true;

    constructor(private materialService: MaterialService) {}

    ngOnInit(): void {
        this.loadData();
        this.initCharts();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadData(): void {
        // Load materials data
        this.materials$ = this.materialService.getMaterials();

        // Build KPIs from real data
        this.kpis$ = this.materials$.pipe(
            map(materials => this.buildKPIs(materials))
        );

        // Build top materials from real data
        this.topMaterials$ = this.materials$.pipe(
            map(materials => this.buildTopMaterials(materials))
        );

        // Update charts when data changes
        this.materials$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(materials => {
            this.updateCharts(materials);
            this.loading = false;
        });
    }

    private buildKPIs(materials: Material[]): any[] {
        const totalMaterials = materials.length;
        const activeMaterials = materials.filter(m => m.active === true).length;

        // Calculate new uploads in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newUploads = materials.filter(m => {
            return m.createdAt && new Date(m.createdAt) >= thirtyDaysAgo;
        }).length;

        // Mock calculations for other KPIs - in real app would come from additional data
        const totalDownloads = Math.floor(Math.random() * 5000) + 2000;
        const avgRating = (4.0 + Math.random()).toFixed(1);

        return [
            { label: 'Total Materials', current: totalMaterials, diff: 10 },
            { label: 'Downloads', current: totalDownloads, diff: 15 },
            { label: 'Avg. Rating', current: `${avgRating}/5`, diff: 3 },
            { label: 'New Uploads', current: newUploads, diff: 8 },
        ];
    }

    private buildTopMaterials(materials: Material[]): any[] {
        // Get top 5 materials (enhanced with real material data)
        return materials.slice(0, 5).map((material, index) => ({
            title: material.title || `Material ${index + 1}`,
            type: material.type || 'Unknown',
            downloads: Math.floor(Math.random() * 500) + 100, // Mock downloads
            rating: `${(4.0 + Math.random()).toFixed(1)}/5` // Mock rating
        }));
    }

    private updateCharts(materials: Material[]): void {
        this.updateMaterialTypeChart(materials);
        this.updateUsageTrendChart(materials);
        this.updateRatingsChart(materials);
    }

    private updateMaterialTypeChart(materials: Material[]): void {
        const typeCounts: {[key: string]: number} = {};

        materials.forEach(material => {
            const type = material.type || 'Other';
            typeCounts[type] = (typeCounts[type] || 0) + 1;
        });

        const labels = Object.keys(typeCounts);
        const data = Object.values(typeCounts);

        if (labels.length === 0) {
            // Fallback to mock data if no real data available
            this.pieDataMaterialType = {
                labels: ['PDF', 'Video', 'Audio', 'Interactive', 'Slides', 'Other'],
                datasets: [{
                    data: [40, 20, 15, 10, 10, 5],
                    backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#EF5350', '#AB47BC', '#EC407A']
                }]
            };
        } else {
            this.pieDataMaterialType = {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#EF5350', '#AB47BC', '#EC407A']
                }]
            };
        }
    }

    private updateUsageTrendChart(materials: Material[]): void {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentYear = new Date().getFullYear();

        const uploadsData = new Array(12).fill(0);
        const downloadsData = new Array(12).fill(0);

        materials.forEach(material => {
            if (material.createdAt) {
                const materialDate = new Date(material.createdAt);
                if (materialDate.getFullYear() === currentYear) {
                    const month = materialDate.getMonth();
                    uploadsData[month]++;
                }
            }
        });

        // Mock downloads data
        months.forEach((_, index) => {
            downloadsData[index] = Math.floor(Math.random() * 100) + 200;
        });

        this.lineChartData = {
            labels: months,
            datasets: [
                {
                    label: 'Downloads',
                    data: downloadsData,
                    borderColor: '#42A5F5',
                    tension: 0.4,
                    pointBackgroundColor: '#42A5F5'
                },
                {
                    label: 'Uploads',
                    data: uploadsData,
                    borderColor: '#66BB6A',
                    tension: 0.4,
                    pointBackgroundColor: '#66BB6A'
                }
            ]
        };
    }

    private updateRatingsChart(materials: Material[]): void {
        // Mock ratings distribution - in real app would come from material ratings
        const ratingData = [10, 30, 120, 450, 340];

        this.barChartData = {
            labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
            datasets: [{
                label: 'Number of Materials',
                backgroundColor: '#42A5F5',
                data: ratingData
            }]
        };
    }

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // Material type distribution pie chart
        this.pieDataMaterialType = {
            labels: ['PDF', 'Video', 'Audio', 'Interactive', 'Slides', 'Other'],
            datasets: [
                {
                    data: [40, 20, 15, 10, 10, 5],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--blue-500'),
                        documentStyle.getPropertyValue('--green-500'),
                        documentStyle.getPropertyValue('--yellow-500'),
                        documentStyle.getPropertyValue('--orange-500'),
                        documentStyle.getPropertyValue('--purple-500'),
                        documentStyle.getPropertyValue('--pink-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--blue-400'),
                        documentStyle.getPropertyValue('--green-400'),
                        documentStyle.getPropertyValue('--yellow-400'),
                        documentStyle.getPropertyValue('--orange-400'),
                        documentStyle.getPropertyValue('--purple-400'),
                        documentStyle.getPropertyValue('--pink-400'),
                    ],
                },
            ],
        };

        this.pieMaterialTypeOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        font: { weight: 500 },
                        padding: 20,
                    },
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Material Type Distribution',
                    font: { size: 16, weight: 'bold' },
                    color: textColor
                }
            },
        };

        // Material downloads trend line chart
        this.lineChartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Downloads',
                    data: [250, 280, 300, 320, 340, 360, 380, 400, 420, 450, 480, 520],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    tension: 0.4,
                    pointBackgroundColor: documentStyle.getPropertyValue('--blue-500')
                },
                {
                    label: 'Uploads',
                    data: [30, 35, 32, 38, 40, 42, 39, 45, 48, 50, 55, 60],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--green-500'),
                    tension: 0.4,
                    pointBackgroundColor: documentStyle.getPropertyValue('--green-500')
                }
            ]
        };

        this.lineChartOptions = {
            plugins: {
                legend: {
                    labels: { color: textColor }
                },
                title: {
                    display: true,
                    text: 'Material Usage Trends',
                    font: { size: 16, weight: 'bold' },
                    color: textColor
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };

        // Material ratings bar chart
        this.barChartData = {
            labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
            datasets: [
                {
                    label: 'Number of Materials',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    data: [10, 30, 120, 450, 340]
                }
            ]
        };

        this.barChartOptions = {
            plugins: {
                legend: {
                    labels: { color: textColor }
                },
                title: {
                    display: true,
                    text: 'Material Ratings Distribution',
                    font: { size: 16, weight: 'bold' },
                    color: textColor
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };
    }

    filterData() {
        // Implement filtering logic based on date range
        console.log('Filtering by date range:', this.dateRange);
    }
}
