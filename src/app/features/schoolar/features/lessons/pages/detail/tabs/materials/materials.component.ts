import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { selectSelectedClass } from 'src/app/core/store/schoolar/selectors/classes.selectors';
import { Lesson } from "../../../../../../../../core/models/academic/lesson";
import { Material } from "../../../../../../../../core/models/academic/material";

@Component({
    selector: 'app-materials-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CardModule,
        TableModule,
        ButtonModule,
        TagModule,
        TooltipModule,
        DialogModule,
        InputTextModule,
        InputTextareaModule,
        CalendarModule
    ],
    templateUrl: './materials.component.html'
})
export class MaterialsComponent implements OnInit, OnDestroy {
    lessonItem: Lesson | null = null;
    materials: Material[] = [];
    displayAddDialog: boolean = false;
    newMaterial: Partial<Material> = {};

    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private store: Store
    ) {}

    ngOnInit(): void {
        // Subscribe to the selected lesson
        this.store.select(selectSelectedClass)
            .pipe(takeUntil(this.destroy$))
            .subscribe(classItem => {
                this.lessonItem = classItem!;
                if (this.lessonItem && this.lessonItem.materials) {
                    this.materials = this.lessonItem.materials;
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    showAddMaterialDialog(): void {
        this.newMaterial = {
            active: true
        };
        this.displayAddDialog = true;
    }

    hideAddMaterialDialog(): void {
        this.displayAddDialog = false;
    }

    getMaterialTypeIcon(type: string): string {
        switch (type?.toLowerCase()) {
            case 'pdf':
                return 'pi pi-file-pdf';
            case 'doc':
            case 'docx':
                return 'pi pi-file-word';
            case 'xls':
            case 'xlsx':
                return 'pi pi-file-excel';
            case 'ppt':
            case 'pptx':
                return 'pi pi-file-powerpoint';
            case 'jpg':
            case 'jpeg':
            case 'png':
                return 'pi pi-image';
            case 'mp4':
            case 'avi':
            case 'mov':
                return 'pi pi-video';
            case 'mp3':
            case 'wav':
                return 'pi pi-volume-up';
            case 'zip':
            case 'rar':
                return 'pi pi-file-zip';
            default:
                return 'pi pi-file';
        }
    }

    formatDate(date: string): string {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // This would be implemented with actual API calls in a real application
    addMaterial(): void {
        // Mock implementation - in a real app, this would call a service
        console.log('Adding material:', this.newMaterial);
        this.hideAddMaterialDialog();
    }

    // This would be implemented with actual API calls in a real application
    downloadMaterial(material: Material): void {
        // Mock implementation - in a real app, this would call a service
        console.log('Downloading material:', material);
        window.open(material.fileUrl, '_blank');
    }
}
