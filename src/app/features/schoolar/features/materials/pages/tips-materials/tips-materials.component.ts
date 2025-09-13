import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Material } from 'src/app/core/models/academic/material';

@Component({
  selector: 'app-tips-materials',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    TooltipModule
  ],
  template: `
    <div class="grid">
      <!-- Header -->
      <div class="col-12 mb-4">
        <div class="flex justify-content-between align-items-center">
          <div>
            <h2 class="font-bold text-2xl mb-1">
              {{ levelName ? ('Dicas - ' + levelName) : 'Dicas do Nível' }}
            </h2>
            <span class="text-lg">
              {{ levelName ? 'Materiais de dicas e orientações para este nível' : 'Materiais de dicas disponíveis' }}
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

      <!-- Tips Materials List -->
      <div class="col-12" *ngIf="tipsMaterials.length > 0">
        <div class="grid">
          <div *ngFor="let material of tipsMaterials" class="col-12 md:col-6 lg:col-4 mb-3">
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
      </div>

      <!-- Empty State -->
      <div class="col-12" *ngIf="tipsMaterials.length === 0">
        <p-card>
          <div class="text-center py-6">
            <i class="pi pi-lightbulb text-6xl text-gray-400 mb-3"></i>
            <h3 class="text-xl font-bold mb-2">Nenhuma dica encontrada</h3>
            <p class="text-gray-600">Este nível ainda não possui materiais de dicas disponíveis.</p>
          </div>
        </p-card>
      </div>
    </div>

    <style>
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
export class TipsMaterialsComponent implements OnInit {
  levelId: string = '';
  levelName: string = '';
  tipsMaterials: Material[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.levelId = this.route.snapshot.paramMap.get('levelId') || '';

    // Get data from navigation state
    const nav = history.state as any;
    if (nav?.materials && nav?.levelName) {
      this.levelName = nav.levelName;
      this.tipsMaterials = nav.materials;
    } else {
      // If no data provided, show empty state
      this.tipsMaterials = [];
    }
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
}
