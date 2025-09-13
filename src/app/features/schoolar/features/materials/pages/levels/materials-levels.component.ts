import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Level } from 'src/app/core/models/course/level';
import { LevelActions } from 'src/app/core/store/schoolar/level/level.actions';
import { selectAllLevels, selectLoading } from 'src/app/core/store/schoolar/level/level.selector';
import { MaterialService } from 'src/app/core/services/material.service';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-materials-levels',
    standalone: true,
    imports: [CommonModule, CardModule, ButtonModule],
    template: `
        <style>
            .card-hover { transition: transform .35s ease, box-shadow .35s ease; }
            .card-hover:hover { transform: translateY(-6px); box-shadow: 0 14px 30px rgba(0,0,0,0.18); }
            .img-zoom { transition: transform .6s ease; }
            .card-hover:hover .img-zoom { transform: scale(1.06); }
        </style>
        <div class="grid">
            <div class="col-12 flex justify-content-between align-items-center">
                <div class="mb-3">
                    <h2 class="font-bold text-2xl">Gestão de materiais didáticos</h2>
                    <span class="text-lg">Escolha um nível para visualizar os materiais</span>
                </div>

                <div class="mb-3">
                    <p-button label="Adicionar material" icon="pi pi-plus" (onClick)="goToCreateMaterial()"></p-button>
                </div>
            </div>

            <div class="col-12" *ngIf="(loading$ | async); else levelsGrid">
                <div class="grid">
                    <div class="col-12 md:col-4" *ngFor="let skeleton of [1,2,3]">
                        <p-card styleClass="h-20rem surface-200 animate-pulse"></p-card>
                    </div>
                </div>
            </div>

            <ng-template #levelsGrid>
                <div class="col-12">
                    <div class="grid">
                        <div class="col-12 md:col-4" *ngFor="let level of (levels$ | async); let i = index">
                            <p-card class="cursor-pointer overflow-hidden card-hover" (click)="goToLevel(level)" styleClass="h-full p-0">
                                <div class="relative" style="height: 220px;">
                                    <div class="w-full h-full bg-cover bg-center img-zoom" [ngStyle]="getCardBackgroundStyle(i)"></div>
                                    <div class="absolute top-0 left-0 w-full h-full" style="background: linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.75) 100%);"></div>
                                    <div class="absolute bottom-0 left-0 w-full p-3 text-white">
                                        <div class="text-xl font-bold flex align-items-center gap-2">
                                            <span class="border-round-sm bg-primary px-2 py-1 text-sm" style="backdrop-filter: blur(6px); background-color: rgba(255,255,255,0.15);">Nível</span>
                                            {{ level.name }}
                                        </div>
                                        <div class="opacity-80 mt-1">{{ level.description }}</div>
                                        <div class="mt-2 text-sm opacity-90">
                                            {{ (materialsCountByLevelId$ | async)?.[level.id] || 0 }} materiais
                                        </div>
                                    </div>
                                </div>
                                <ng-template pTemplate="footer">
                                    <button pButton type="button" label="Entrar" icon="pi pi-arrow-right"></button>
                                </ng-template>
                            </p-card>
                        </div>
                    </div>
                </div>
            </ng-template>
        </div>
    `,
})
export class MaterialsLevelsComponent implements OnInit {
    levels$: Observable<Level[]> = this.store.select(selectAllLevels);
    loading$: Observable<boolean> = this.store.select(selectLoading);
    materialsCountByLevelId$: Observable<Record<string, number>> = this.materialService.getMaterials().pipe(
        map((materials) => {
            const counts: Record<string, number> = {};
            for (const material of materials) {
                if (!material.units) continue;
                for (const unit of material.units) {
                    const lid = unit.levelId || unit.level?.id;
                    if (!lid) continue;
                    counts[lid] = (counts[lid] || 0) + 1;
                }
            }
            return counts;
        })
    );

    private backgroundPath: string = 'assets/background_login.png';

    constructor(private router: Router, private store: Store, private materialService: MaterialService) { }

    ngOnInit(): void {
        this.store.dispatch(LevelActions.loadLevels({}));
    }

    goToCreateMaterial() {
        this.router.navigate(['/schoolar/materials/create']);
    }

    goToLevel(level: Level) {
        this.router.navigate(['/schoolar/materials/level', level.id], { state: { level } });
    }

    getCardBackgroundStyle(index: number): { [key: string]: string } {
        const positions = ['center', 'top', 'bottom', 'left', 'right', 'center 20%'];
        return {
            'background-image': `url(${this.backgroundPath})`,
            'background-position': positions[index % positions.length],
        };
    }
}


