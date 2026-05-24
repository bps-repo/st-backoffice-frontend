import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Level } from 'src/app/core/models/course/level';
import { LevelActions } from 'src/app/core/store/schoolar/level/level.actions';
import { selectAllLevels, selectLevelsLoading } from 'src/app/core/store/schoolar/level/level.selector';

@Component({
    selector: 'app-materials-levels',
    standalone: true,
    imports: [CommonModule, ButtonModule, TagModule],
    template: `
        <style>
            .page-header { margin-bottom: 2rem; }
            .page-header h2 { margin: 0 0 0.25rem; font-size: 1.6rem; font-weight: 700; }
            .page-header p  { margin: 0; color: var(--text-color-secondary); font-size: 0.95rem; }

            /* ── Skeleton ── */
            .skeleton-card {
                height: 320px;
                border-radius: 16px;
                background: var(--surface-200);
                animation: pulse 1.6s ease-in-out infinite;
            }
            @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.45} }

            /* ── Level Card ── */
            .level-card {
                background: var(--surface-card);
                border: 1px solid var(--surface-border);
                border-radius: 16px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                cursor: pointer;
                height: 100%;
                transition: transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease;
            }
            .level-card:hover {
                transform: translateY(-6px);
                box-shadow: 0 16px 40px rgba(0,0,0,0.11);
            }

            /* coloured top bar */
            .level-accent {
                height: 5px;
                width: 100%;
                flex-shrink: 0;
            }

            /* card body */
            .level-body {
                padding: 1.5rem 1.5rem 1rem;
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            /* header row: icon + badges */
            .level-header {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 0.75rem;
            }
            .level-icon {
                width: 52px;
                height: 52px;
                border-radius: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                font-size: 1.5rem;
            }
            .level-badges {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 0.3rem;
            }
            .order-badge {
                font-size: 0.7rem;
                font-weight: 700;
                letter-spacing: 0.05em;
                text-transform: uppercase;
                padding: 0.2rem 0.6rem;
                border-radius: 20px;
                background: var(--surface-ground);
                color: var(--text-color-secondary);
            }
            .status-badge {
                font-size: 0.7rem;
                font-weight: 600;
                padding: 0.2rem 0.6rem;
                border-radius: 20px;
            }
            .status-active   { background: #dcfce7; color: #16a34a; }
            .status-inactive { background: #fef9c3; color: #ca8a04; }
            .status-archived { background: #f1f5f9; color: #64748b; }

            /* title + description */
            .level-name { margin: 0; font-size: 1.15rem; font-weight: 700; color: var(--text-color); }
            .level-desc {
                margin: 0;
                font-size: 0.85rem;
                color: var(--text-color-secondary);
                line-height: 1.5;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            /* stat chips */
            .level-stats { display: flex; gap: 0.6rem; flex-wrap: wrap; }
            .stat-chip {
                display: flex;
                align-items: center;
                gap: 0.4rem;
                font-size: 0.8rem;
                padding: 0.3rem 0.75rem;
                border-radius: 8px;
                background: var(--surface-ground);
                color: var(--text-color-secondary);
            }
            .stat-chip i { font-size: 0.75rem; opacity: 0.7; }
            .stat-chip strong { color: var(--text-color); font-weight: 600; }

            /* footer */
            .level-footer {
                padding: 0.85rem 1.5rem;
                border-top: 1px solid var(--surface-border);
                background: var(--surface-ground);
            }
            .level-footer button {
                width: 100%;
                justify-content: center;
                border-radius: 10px !important;
                font-size: 0.875rem !important;
            }
        </style>

        <div class="grid">
            <!-- Page header -->
            <div class="col-12 flex justify-content-between align-items-start page-header">
                <div>
                    <h2>Gestão de materiais didáticos</h2>
                    <p>Escolha um nível para visualizar os materiais disponíveis</p>
                </div>
                <p-button label="Adicionar material" icon="pi pi-plus" (onClick)="goToCreateMaterial()"></p-button>
            </div>

            <!-- Loading skeletons -->
            <ng-container *ngIf="(loading$ | async); else levelsGrid">
                <div class="col-12 md:col-4" *ngFor="let s of [1,2,3]">
                    <div class="skeleton-card"></div>
                </div>
            </ng-container>

            <!-- Levels grid -->
            <ng-template #levelsGrid>
                <div class="col-12 md:col-4" *ngFor="let level of (levels$ | async); let i = index">
                    <div class="level-card" (click)="goToLevel(level)">

                        <!-- Coloured accent bar -->
                        <div class="level-accent" [style.background]="getAccentColor(level, i)"></div>

                        <div class="level-body">
                            <!-- Icon + badges -->
                            <div class="level-header">
                                <div class="level-icon"
                                    [style.background]="getAccentColor(level, i) + '1a'"
                                    [style.color]="getAccentColor(level, i)">
                                    <i [class]="getLevelIcon(i)"></i>
                                </div>
                                <div class="level-badges">
                                    <span class="order-badge">Nível {{ level.order }}</span>
                                    <span class="status-badge" [ngClass]="'status-' + level.status">
                                        {{ getStatusLabel(level.status) }}
                                    </span>
                                </div>
                            </div>

                            <!-- Title & description -->
                            <div>
                                <h3 class="level-name">{{ level.name }}</h3>
                                <p class="level-desc">{{ level.description }}</p>
                            </div>

                            <!-- Stats -->
                            <div class="level-stats">
                                <div class="stat-chip">
                                    <i class="pi pi-calendar"></i>
                                    <strong>{{ level.duration }}</strong> semanas
                                </div>
                                <div class="stat-chip">
                                    <i class="pi pi-book"></i>
                                    <strong>{{ level.maximumUnits }}</strong> unidades
                                </div>
                            </div>
                        </div>

                        <!-- Footer action -->
                        <div class="level-footer">
                            <p-button
                                label="Acessar nível"
                                icon="pi pi-arrow-right"
                                iconPos="right"
                                [outlined]="true"
                                [style]="{'--p-button-outlined-border-color': getAccentColor(level, i), '--p-button-outlined-color': getAccentColor(level, i), 'width': '100%'}">
                            </p-button>
                        </div>

                    </div>
                </div>
            </ng-template>
        </div>
    `,
})
export class MaterialsLevelsComponent implements OnInit {
    private router = inject(Router);
    private store = inject(Store);

    levels$: Observable<Level[]> = this.store.select(selectAllLevels);
    loading$: Observable<boolean> = this.store.select(selectLevelsLoading);

    private readonly fallbackColors = ['#6366f1', '#f59e0b', '#10b981', '#3b82f6', '#ec4899'];
    private readonly levelIcons = ['pi pi-star', 'pi pi-chart-line', 'pi pi-trophy', 'pi pi-bolt', 'pi pi-crown'];

    ngOnInit(): void {
        this.store.dispatch(LevelActions.loadLevels({}));
    }

    goToCreateMaterial(): void {
        this.router.navigate(['/schoolar/materials/create']);
    }

    goToLevel(level: Level): void {
        this.router.navigate(['/schoolar/materials/level', level.id], { state: { level } });
    }

    getAccentColor(level: Level, index: number): string {
        return level.color || this.fallbackColors[index % this.fallbackColors.length];
    }

    getLevelIcon(index: number): string {
        return this.levelIcons[index % this.levelIcons.length];
    }

    getStatusLabel(status: string): string {
        const map: Record<string, string> = { active: 'Ativo', inactive: 'Inativo', archived: 'Arquivado' };
        return map[status] ?? status;
    }
}


