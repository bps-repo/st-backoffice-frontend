import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AccordionModule } from 'primeng/accordion';
import { MaterialService } from 'src/app/core/services/material.service';
import { Material } from 'src/app/core/models/academic/material';
import { Unit } from 'src/app/core/models/course/unit';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { VideoModalComponent } from 'src/app/shared/components/video-modal/video-modal.component';
import { isValidYouTubeUrl } from 'src/app/shared/utils/youtube.utils';

interface UnitWithMaterials {
  unit: Unit;
  materials: Material[];
  loading: boolean;
}

@Component({
  selector: 'app-units-materials',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    TooltipModule,
    ProgressSpinnerModule,
    AccordionModule,
    VideoModalComponent
  ],
  template: `
    <div class="grid">
      <!-- Header -->
      <div class="col-12 mb-4">
        <div class="flex justify-content-between align-items-center">
          <div>
            <h2 class="font-bold text-2xl mb-1">
              {{ levelName ? ('Unidades - ' + levelName) : 'Materiais por Unidades' }}
            </h2>
            <span class="text-lg">
              {{ levelName ? 'Materiais organizados por unidades do nível' : 'Selecione uma unidade para ver os materiais' }}
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

      <!-- Units with Materials -->
      <div class="col-12" *ngIf="!loading">
        <p-accordion>
          <p-accordionTab
            *ngFor="let unitData of unitsWithMaterials; let i = index"
            [header]="unitData.unit.name"
            [selected]="i === 0"
          >
            <div class="p-3">
              <p class="text-gray-600 mb-3">{{ unitData.unit.description || 'Sem descrição' }}</p>

              <!-- Unit Loading -->
              <div *ngIf="unitData.loading" class="flex justify-content-center py-4">
                <p-progressSpinner [style]="{'width': '30px', 'height': '30px'}"></p-progressSpinner>
              </div>

              <!-- Unit Materials -->
              <div *ngIf="!unitData.loading && unitData.materials.length > 0" class="grid">
                <div *ngFor="let material of unitData.materials" class="col-12 md:col-6 lg:col-4 mb-3">
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

              <!-- Empty State for Unit -->
              <div *ngIf="!unitData.loading && unitData.materials.length === 0" class="text-center py-6">
                <i class="pi pi-inbox text-4xl text-gray-400 mb-3"></i>
                <h4 class="text-lg font-bold mb-2">Nenhum material encontrado</h4>
                <p class="text-gray-600">Esta unidade ainda não possui materiais disponíveis.</p>
              </div>
            </div>
          </p-accordionTab>
        </p-accordion>
      </div>

      <!-- Empty State -->
      <div class="col-12" *ngIf="!loading && unitsWithMaterials.length === 0">
        <p-card>
          <div class="text-center py-6">
            <i class="pi pi-inbox text-6xl text-gray-400 mb-3"></i>
            <h3 class="text-xl font-bold mb-2">Nenhuma unidade encontrada</h3>
            <p class="text-gray-600">Este nível ainda não possui unidades disponíveis.</p>
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
      .material-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .material-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      ::ng-deep .p-accordion .p-accordion-tab {
        margin-bottom: 1rem;
      }

      ::ng-deep .p-accordion .p-accordion-header .p-accordion-header-link {
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: 8px;
        padding: 1rem;
        font-weight: 600;
      }

      ::ng-deep .p-accordion .p-accordion-header.p-highlight .p-accordion-header-link {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
      }
    </style>
  `
})
export class UnitsMaterialsComponent implements OnInit {
  levelId: string = '';
  levelName: string = '';
  unitsWithMaterials: UnitWithMaterials[] = [];
  loading: boolean = true;

  // Video modal properties
  showVideoModal: boolean = false;
  selectedVideoUrl: string = '';
  selectedVideoTitle: string = '';
  selectedVideoDescription: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private materialService: MaterialService
  ) {}

  ngOnInit(): void {
    this.levelId = this.route.snapshot.paramMap.get('levelId') || '';

    // Get data from navigation state
    const nav = history.state as any;
    if (nav?.units && nav?.levelName) {
      this.levelName = nav.levelName;
      this.unitsWithMaterials = nav.units.map((unit: Unit) => ({
        unit,
        materials: [],
        loading: true
      }));
      this.loading = false;
      this.loadMaterialsForAllUnits();
    } else if (this.levelId) {
      this.loadLevelData();
    } else {
      this.loading = false;
    }
  }

  private loadLevelData(): void {
    // This would load units from a service if not provided via navigation state
    // For now, we'll show empty state
    this.loading = false;
  }

  private loadMaterialsForAllUnits(): void {
    this.unitsWithMaterials.forEach((unitData, index) => {
      this.loadMaterialsForUnit(unitData, index);
    });
  }

  private loadMaterialsForUnit(unitData: UnitWithMaterials, index: number): void {
    if (!unitData.unit.id) {
      this.unitsWithMaterials[index].materials = [];
      this.unitsWithMaterials[index].loading = false;
      return;
    }

    this.materialService.getMaterialsByEntity('UNIT', unitData.unit.id).pipe(
      catchError(() => of([]))
    ).subscribe({
      next: (materials) => {
        this.unitsWithMaterials[index].materials = materials;
        this.unitsWithMaterials[index].loading = false;
      },
      error: (error) => {
        console.error(`Error loading materials for unit ${unitData.unit.name}:`, error);
        this.unitsWithMaterials[index].materials = [];
        this.unitsWithMaterials[index].loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/schoolar/materials/level', this.levelId]);
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
    if (this.isVideo(material)) {
      this.selectedVideoUrl = material.fileUrl;
      this.selectedVideoTitle = material.title;
      this.selectedVideoDescription = material.description;
      this.showVideoModal = true;
    }
  }

  closeVideoModal(): void {
    this.showVideoModal = false;
    this.selectedVideoUrl = '';
    this.selectedVideoTitle = '';
    this.selectedVideoDescription = '';
  }
}
