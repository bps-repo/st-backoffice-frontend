import {Component, ElementRef, OnInit, ViewChild, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {LevelService} from 'src/app/core/services/level.service';
import {FormsModule} from '@angular/forms';
import {SelectItem} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {Material} from "../../../../../../core/models/academic/material";
import {CardModule} from 'primeng/card';
import {TagModule} from 'primeng/tag';
import {PaginatorModule} from 'primeng/paginator';
import {TooltipModule} from 'primeng/tooltip';
import {Unit} from "../../../../../../core/models/course/unit";
import {HasPermissionDirective} from "../../../../../../shared/directives";


@Component({
    selector: 'app-general',
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        DropdownModule,
        InputTextModule,
        CardModule,
        TagModule,
        PaginatorModule,
        TooltipModule,
        HasPermissionDirective
    ],
    styleUrl: 'list.component.css',
    templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
    materials: Partial<Material>[] = [];

    loading: boolean = false;

    // Filtering properties
    searchText: string = '';
    selectedType: any = null;
    selectedLevel: any = null;

    // Pagination properties
    first: number = 0;
    rows: number = 10;
    totalRecords: number = 100;

    materialTypes: SelectItem[] = [];
    installations: SelectItem[] = [];

    isMainHeaderSticky: boolean = false;

    @ViewChild('filter') filter!: ElementRef;

    constructor(private router: Router, private route: ActivatedRoute, private levelService: LevelService) {
    }

    levelName: string | null = null;

    ngOnInit(): void {
        const levelId = this.route.snapshot.paramMap.get('levelId');
        const nav = history.state as any;
        if (nav?.level) {
            this.levelName = nav.level.name ?? null;
            this.selectedLevel = nav.level.name ?? null;
        } else if (levelId) {
            const levelMap: any = {'1': 'Básico', '2': 'Intermediário', '3': 'Avançado'};
            this.selectedLevel = levelMap[levelId] ?? null;
            this.levelService.getLevelById(levelId).subscribe({
                next: (level) => this.levelName = level?.name ?? this.selectedLevel,
                error: () => this.levelName = this.selectedLevel
            });
        }

        // Material types for filtering
        this.materialTypes = [
            {label: 'Conteúdo programático', value: 'Conteúdo programático'},
            {label: 'Vídeos de dicas', value: 'Vídeos de dicas'},
            {label: 'Unidades', value: 'Unidades'},
            {label: 'Livros', value: 'Livros'},
            {label: 'Exercícios', value: 'Exercícios'},
            {label: 'Material de apoio', value: 'Material de apoio'},
            {label: 'Vídeo aulas', value: 'Vídeo aulas'},
        ];

        // Levels for filtering
        this.installations = [
            {label: 'Básico', value: 'Básico'},
            {label: 'Intermediário', value: 'Intermediário'},
            {label: 'Avançado', value: 'Avançado'},
        ];
    }

    // Method to get the appropriate icon based on material type
    getIconForType(type: string): string {
        switch (type) {
            case 'PDF':
                return 'pi pi-file-pdf text-red-500';
            case 'Vídeo':
                return 'pi pi-video text-blue-500';
            case 'Word':
                return 'pi pi-file-word text-blue-500';
            default:
                return 'pi pi-file text-gray-500';
        }
    }

    // Method to get file size (mock data for now)
    getFileSize(material: Partial<Material>): string {
        // In a real application, this would come from the backend
        const sizes = {
            '1': '2.5 MB',
            '2': '15.8 MB',
            '3': '1.2 MB',
            '4': '3.7 MB'
        };
        return sizes[material.id as keyof typeof sizes] || 'N/A';
    }

    // Method to get download count (mock data for now)
    getDownloadCount(material: Partial<Material>): number {
        // In a real application, this would come from the backend
        const counts = {
            '1': 125,
            '2': 87,
            '3': 42,
            '4': 63
        };
        return counts[material.id as keyof typeof counts] || 0;
    }

    // Method to determine tag severity based on level
    getLevelSeverity(unit: Unit): string {
        switch (unit.name) {
            case 'Básico':
                return 'success';
            case 'Intermediário':
                return 'warning';
            case 'Avançado':
                return 'danger';
            default:
                return 'info';
        }
    }

    // Navigation methods
    navigateToCreateMaterial() {
        const levelId = this.route.snapshot.paramMap.get('levelId');
        this.router.navigate(['/schoolar/materials/create'], {
            state: {
                levelId: levelId ?? null,
                levelName: this.levelName ?? this.selectedLevel ?? null,
            }
        });
    }

    viewDetails(material: Partial<Material>): void {
        this.router.navigate(['/schoolar/materials', material.id]);
    }

    // Action methods
    downloadMaterial(material: Partial<Material>): void {
        // In a real application, this would trigger a download
        console.log('Downloading material:', material.title);
        window.open(material.fileUrl, '_blank');
    }

    editMaterial(material: Partial<Material>): void {
        this.router.navigate(['/schoolar/materials/edit', material.id]);
    }

    // Pagination handler
    onPageChange(event: any): void {
        this.first = event.first;
        this.rows = event.rows;
        // In a real application, this would trigger a reload of the data
        console.log('Page changed:', event);
    }
}
