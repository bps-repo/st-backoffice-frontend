import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Material } from 'src/app/core/models/academic/material';
import { Unit } from 'src/app/core/models/course/unit';
import { Observable, of } from 'rxjs';
import { VideoModalComponent } from 'src/app/shared/components/video-modal/video-modal.component';
import { isValidYouTubeUrl } from 'src/app/shared/utils/youtube.utils';
import { Store } from '@ngrx/store';
import { selectUnitsByLevelId } from 'src/app/core/store/schoolar/units/unit.selectors';
import { LevelActions } from 'src/app/core/store/schoolar/level/level.actions';
import { Level } from 'src/app/core/models/course/level';
import { selectSelectedLevel } from 'src/app/core/store/schoolar/level/level.selectors';
import { MaterialActions } from 'src/app/core/store/schoolar/materials/material.actions';
import { selectAnyLoading, selectMaterialsByEntityAndId, selectMaterialsByEntityValue } from 'src/app/core/store/schoolar/materials/material.selectors';

@Component({
    selector: 'app-level-materials',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        ButtonModule,
        TagModule,
        TooltipModule,
        ProgressSpinnerModule,
        VideoModalComponent,
    ],
    templateUrl: 'level-materials.component.html',
    styleUrl: 'level-materials.component.css'
})
export class LevelMaterialsComponent implements OnInit {
    levelId: string = '';
    levelName: string = '';
    levelMaterials$: Observable<Material[]> = of([]);

    level$!: Observable<Level | null>

    units$: Observable<Unit[]> = of([]);

    loading$: Observable<boolean> = of(true);

    tipsCount: number = 0;

    unitsCount: number = 0;

    // Video modal properties
    showVideoModal: boolean = false;
    selectedVideoUrl: string = '';
    selectedVideoTitle: string = '';
    selectedVideoDescription: string = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private store$: Store,
    ) { }

    ngOnInit(): void {
        this.levelId = this.route.snapshot.paramMap.get('levelId') || '';

        this.level$ = this.store$.select(selectSelectedLevel)

        this.loading$ = this.store$.select(selectAnyLoading)

        this.levelMaterials$ = this.store$.select(selectMaterialsByEntityAndId("LEVEL", this.levelId))

        if (this.levelId) {
            this.store$.dispatch(LevelActions.loadLevel({ id: this.levelId }))
            this.store$.dispatch(MaterialActions.loadMaterialsByEntity({ entity: "LEVEL", entityId: this.levelId }))
            this.units$ = this.store$.select(selectUnitsByLevelId(this.levelId))
        }
    }

    goToTips(): void {

    }

    goToUnits(): void {
        this.router.navigate(['/schoolar/materials/level', this.levelId, 'units'], {
            state: { units: this.units$, levelName: this.levelName }
        });
    }

    goBack(): void {
        this.router.navigate(['/schoolar/materials']);
    }

    getIconForType(fileType: string | undefined): string {
        if (!fileType) {
            return 'pi pi-file text-gray-500';
        }

        switch (fileType) {
            case 'PDF':
                return 'pi pi-file-pdf text-red-500';
            case 'VIDEO':
                return 'pi pi-video text-blue-500';
            case 'AUDIO':
                return 'pi pi-volume-up text-green-500';
            case 'PRESENTATION':
                return 'pi pi-presentation text-purple-500';
            case 'WORKSHEET':
                return 'pi pi-file-edit text-orange-500';
            case 'DOCX':
                return 'pi pi-file-word text-blue-600';
            case 'EXCEL':
                return 'pi pi-file-excel text-green-600';
            default:
                return 'pi pi-file text-gray-500';
        }
    }

    formatDate(dateString: string): string {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('pt-BR');
    }

    viewMaterial(material: Material): void {
        this.router.navigate(['/schoolar/materials', material.id]);
    }

    downloadMaterial(material: Material): void {
        if (material.fileUrl) {
            window.open(material.fileUrl, '_blank');
        }
    }

    isVideo(material: Material): boolean {
        return material.fileType === 'VIDEO' && isValidYouTubeUrl(material.fileUrl);
    }

    playVideo(material: Material): void {
        console.log('=== PLAY VIDEO CLICKED ===');
        console.log('Material:', material);
        console.log('Is video:', this.isVideo(material));
        console.log('File URL:', material.fileUrl);
        console.log('File Type:', material.fileType);

        if (this.isVideo(material)) {
            console.log('Setting video data...');
            this.selectedVideoUrl = material.fileUrl;
            this.selectedVideoTitle = material.title;
            this.selectedVideoDescription = material.description;

            console.log('Video data set:');
            console.log('  URL:', this.selectedVideoUrl);
            console.log('  Title:', this.selectedVideoTitle);
            console.log('  Description:', this.selectedVideoDescription);

            console.log('Opening modal...');
            this.showVideoModal = true;

            console.log('Modal state after opening:', this.showVideoModal);
        } else {
            console.warn('Material is not a valid video:', material);
        }
    }

    closeVideoModal(): void {
        this.showVideoModal = false;
        this.selectedVideoUrl = '';
        this.selectedVideoTitle = '';
        this.selectedVideoDescription = '';
    }
}
