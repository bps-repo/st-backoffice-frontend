import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MaterialService } from 'src/app/core/services/material.service';
import { LevelService } from 'src/app/core/services/level.service';
import { UnitService } from 'src/app/core/services/unit.service';
import { Material } from 'src/app/core/models/academic/material';
import { Unit } from 'src/app/core/models/course/unit';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { VideoModalComponent } from 'src/app/shared/components/video-modal/video-modal.component';
import { isValidYouTubeUrl } from 'src/app/shared/utils/youtube.utils';

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
    template: `
    <div class="grid">
      <!-- Header -->
      <div class="col-12 mb-4">
        <div class="flex justify-content-between align-items-center">
          <div>
            <h2 class="font-bold text-2xl mb-1">
              {{ levelName ? ('Materiais - ' + levelName) : 'Materiais do Nível' }}
            </h2>
            <span class="text-lg">
              {{ levelName ? 'Materiais disponíveis para este nível' : 'Selecione uma opção abaixo' }}
            </span>
          </div>
          <p-button
            label="Voltar"
            icon="pi pi-arrow-left"
            class="p-button-outlined"
            (onClick)="goBack()"
          ></p-button>
        </div>
      </div>

      <!-- Loading State -->
      <div class="col-12" *ngIf="loading">
        <div class="flex justify-content-center align-items-center" style="height: 200px;">
          <p-progressSpinner></p-progressSpinner>
        </div>
      </div>

      <!-- Main Cards -->
      <div class="col-12" *ngIf="!loading">
        <div class="grid">
          <!-- Dicas do Nível Card -->
          <div class="col-12 md:col-6 mb-4">
            <p-card class="cursor-pointer card-hover" (click)="goToTips()" styleClass="h-full">
              <div class="flex align-items-center gap-3 mb-3">
                <i class="pi pi-lightbulb text-3xl text-yellow-500"></i>
                <div>
                  <h3 class="text-xl font-bold mb-1">Dicas do Nível</h3>
                  <p class="text-gray-600">Materiais de dicas e orientações</p>
                </div>
              </div>
              <div class="flex justify-content-between align-items-center">
                <span class="text-sm text-gray-500">{{ tipsCount }} materiais</span>
                <i class="pi pi-arrow-right text-primary"></i>
              </div>
            </p-card>
          </div>

          <!-- Unidades Card -->
          <div class="col-12 md:col-6 mb-4">
            <p-card class="cursor-pointer card-hover" (click)="goToUnits()" styleClass="h-full">
              <div class="flex align-items-center gap-3 mb-3">
                <i class="pi pi-book text-3xl text-blue-500"></i>
                <div>
                  <h3 class="text-xl font-bold mb-1">Unidades</h3>
                  <p class="text-gray-600">Materiais organizados por unidades</p>
                </div>
              </div>
              <div class="flex justify-content-between align-items-center">
                <span class="text-sm text-gray-500">{{ unitsCount }} unidades</span>
                <i class="pi pi-arrow-right text-primary"></i>
              </div>
            </p-card>
          </div>
        </div>
      </div>

      <!-- Level Materials List -->
      <div class="col-12" *ngIf="!loading && levelMaterials.length > 0">
        <p-card>
          <ng-template pTemplate="header">
            <div class="p-3">
              <h3 class="text-lg font-bold">Todos os Materiais do Nível</h3>
            </div>
          </ng-template>

          <div class="grid">
            <div *ngFor="let material of levelMaterials" class="col-12 md:col-6 lg:col-4 mb-3">
              <p-card class="material-card">
                <div class="flex align-items-start gap-3 mb-3">
                  <i class="text-2xl" [ngClass]="getIconForType(material.fileType)"></i>
                  <div class="flex-1">
                    <h4 class="font-bold text-lg mb-1">{{ material.title }}</h4>
                    <p class="text-sm text-gray-600 mb-2">{{ material.description }}</p>
                    <div class="flex gap-2 mb-2">
                      <p-tag [value]="material.type" severity="info"></p-tag>
                      <p-tag [value]="material.fileType" severity="secondary"></p-tag>
                    </div>
                  </div>
                </div>

                    <div class="flex justify-content-between align-items-center">
                      <span class="text-sm text-gray-500">
                        {{ formatDate(material.availabilityStartDate) }} - {{ formatDate(material.availabilityEndDate) }}
                      </span>
                      <div class="flex gap-1">
                        <button
                          pButton
                          icon="pi pi-play"
                          class="p-button-text p-button-sm"
                          (click)="playVideo(material)"
                          pTooltip="Reproduzir vídeo"
                          *ngIf="isVideo(material)"
                        ></button>
                        <button
                          pButton
                          icon="pi pi-eye"
                          class="p-button-text p-button-sm"
                          (click)="viewMaterial(material)"
                          pTooltip="Ver detalhes"
                        ></button>
                        <button
                          pButton
                          icon="pi pi-download"
                          class="p-button-text p-button-sm"
                          (click)="downloadMaterial(material)"
                          pTooltip="Baixar"
                        ></button>
                      </div>
                    </div>
              </p-card>
            </div>
          </div>
        </p-card>
      </div>

      <!-- Empty State -->
      <div class="col-12" *ngIf="!loading && levelMaterials.length === 0">
        <p-card>
          <div class="text-center py-6">
            <i class="pi pi-inbox text-6xl text-gray-400 mb-3"></i>
            <h3 class="text-xl font-bold mb-2">Nenhum material encontrado</h3>
            <p class="text-gray-600">Este nível ainda não possui materiais disponíveis.</p>
          </div>
        </p-card>
      </div>
    </div>

    <!-- Video Modal -->
    <app-video-modal
      [visible]="showVideoModal"
      [videoUrl]="selectedVideoUrl"
      [videoTitle]="selectedVideoTitle"
      [videoDescription]="selectedVideoDescription"
      [autoplay]="true"
      (onCloseEvent)="closeVideoModal()"
    ></app-video-modal>

    <style>
      .card-hover {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .card-hover:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      }
      .material-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .material-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
    </style>
  `
})
export class LevelMaterialsComponent implements OnInit {
    levelId: string = '';
    levelName: string = '';
    levelMaterials: Material[] = [];
    units: Unit[] = [];
    loading: boolean = true;
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
        private materialService: MaterialService,
        private levelService: LevelService,
        private unitService: UnitService
    ) { }

    ngOnInit(): void {
        this.levelId = this.route.snapshot.paramMap.get('levelId') || '';

        if (this.levelId) {
            this.loadLevelData();
        } else {
            this.loading = false;
        }
    }

    private loadLevelData(): void {
        if (!this.levelId) {
            this.loading = false;
            return;
        }

        this.loading = true;

        // Load level information
        this.levelService.getLevelById(this.levelId).subscribe({
            next: (level) => {
                this.levelName = level?.name || 'Nível';
            },
            error: () => {
                this.levelName = 'Nível';
            }
        });

        // Load level materials and units in parallel
        forkJoin({
            materials: this.materialService.getMaterialsByEntity('LEVEL', this.levelId).pipe(
                catchError(() => of([]))
            ),
            units: this.unitService.loadUnits().pipe(
                map(units => units.filter(unit => unit.levelId === this.levelId)),
                catchError(() => of([]))
            )
        }).subscribe({
            next: (data) => {
                this.levelMaterials = data.materials;
                this.units = data.units;
                this.unitsCount = data.units.length;
                this.tipsCount = data.materials.filter(m => m.type === 'TIPS').length;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading level data:', error);
                this.loading = false;
            }
        });
    }

    goToTips(): void {
        // Filter materials by TIPS type and navigate to a tips view
        const tipsMaterials = this.levelMaterials.filter(m => m.type === 'TIPS');
        this.router.navigate(['/schoolar/materials/level', this.levelId, 'tips'], {
            state: { materials: tipsMaterials, levelName: this.levelName }
        });
    }

    goToUnits(): void {
        this.router.navigate(['/schoolar/materials/level', this.levelId, 'units'], {
            state: { units: this.units, levelName: this.levelName }
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
