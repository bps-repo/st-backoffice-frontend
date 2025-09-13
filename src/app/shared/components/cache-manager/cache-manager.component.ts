import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { selectCacheStatus as selectLevelCacheStatus } from 'src/app/core/store/schoolar/level/level.selectors';
import { selectUnitsState } from 'src/app/core/store/schoolar/units/unit.selectors';
import { selectMaterialState } from 'src/app/core/store/schoolar/materials/material.feature';
import { LevelActions } from 'src/app/core/store/schoolar/level/level.actions';
import { UnitActions } from 'src/app/core/store/schoolar/units/unit.actions';
import { MaterialActions } from 'src/app/core/store/schoolar/materials/material.actions';
import { CacheService } from 'src/app/core/services/cache.service';

@Component({
  selector: 'app-cache-manager',
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe],
  template: `
    <div class="p-card">
      <div class="p-card-header">
        <h3>Cache Manager</h3>
      </div>
      <div class="p-card-content">
        <div class="grid">
          <!-- Levels Cache -->
          <div class="col-12 md:col-4">
            <div class="p-card">
              <div class="p-card-header">
                <h4>Levels Cache</h4>
              </div>
              <div class="p-card-content">
                <div *ngIf="levelCacheStatus$ | async as cache" class="cache-info">
                  <p><strong>Last Fetch:</strong> {{ cache.lastFetch | date:'short' }}</p>
                  <p><strong>Age:</strong> {{ cache.age | number }}ms</p>
                  <p><strong>Expired:</strong> {{ cache.isExpired ? 'Yes' : 'No' }}</p>
                  <p><strong>Timeout:</strong> {{ cache.timeout | number }}ms</p>
                </div>
                <div class="p-buttons">
                  <button pButton type="button" label="Refresh" (click)="refreshLevels()" class="p-button-sm"></button>
                  <button pButton type="button" label="Clear" (click)="clearLevels()" class="p-button-sm p-button-secondary"></button>
                </div>
              </div>
            </div>
          </div>

          <!-- Units Cache -->
          <div class="col-12 md:col-4">
            <div class="p-card">
              <div class="p-card-header">
                <h4>Units Cache</h4>
              </div>
              <div class="p-card-content">
                <div *ngIf="unitState$ | async as state" class="cache-info">
                  <p><strong>Last Fetch:</strong> {{ state.lastFetch ? (state.lastFetch | date:'short') : 'Never' }}</p>
                  <p><strong>Age:</strong> {{ getCacheAge(state.lastFetch) | number }}ms</p>
                  <p><strong>Expired:</strong> {{ state.cacheExpired ? 'Yes' : 'No' }}</p>
                  <p><strong>Timeout:</strong> {{ state.cacheTimeout | number }}ms</p>
                </div>
                <div class="p-buttons">
                  <button pButton type="button" label="Refresh" (click)="refreshUnits()" class="p-button-sm"></button>
                  <button pButton type="button" label="Clear" (click)="clearUnits()" class="p-button-sm p-button-secondary"></button>
                </div>
              </div>
            </div>
          </div>

          <!-- Materials Cache -->
          <div class="col-12 md:col-4">
            <div class="p-card">
              <div class="p-card-header">
                <h4>Materials Cache</h4>
              </div>
              <div class="p-card-content">
                <div *ngIf="materialState$ | async as state" class="cache-info">
                  <p><strong>Last Fetch:</strong> {{ state.lastFetch ? (state.lastFetch | date:'short') : 'Never' }}</p>
                  <p><strong>Age:</strong> {{ getCacheAge(state.lastFetch) | number }}ms</p>
                  <p><strong>Expired:</strong> {{ state.cacheExpired ? 'Yes' : 'No' }}</p>
                  <p><strong>Timeout:</strong> {{ state.cacheTimeout | number }}ms</p>
                </div>
                <div class="p-buttons">
                  <button pButton type="button" label="Refresh" (click)="refreshMaterials()" class="p-button-sm"></button>
                  <button pButton type="button" label="Clear" (click)="clearMaterials()" class="p-button-sm p-button-secondary"></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Global Actions -->
        <div class="p-card mt-3">
          <div class="p-card-header">
            <h4>Global Actions</h4>
          </div>
          <div class="p-card-content">
            <div class="p-buttons">
              <button pButton type="button" label="Refresh All" (click)="refreshAll()" class="p-button"></button>
              <button pButton type="button" label="Clear All" (click)="clearAll()" class="p-button p-button-secondary"></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cache-info p {
      margin: 0.5rem 0;
    }
    .p-buttons {
      margin-top: 1rem;
    }
    .p-buttons button {
      margin-right: 0.5rem;
    }
  `]
})
export class CacheManagerComponent implements OnInit {
  levelCacheStatus$: Observable<any>;
  unitState$: Observable<any>;
  materialState$: Observable<any>;

  constructor(
    private store: Store,
    private cacheService: CacheService
  ) {
    this.levelCacheStatus$ = this.store.select(selectLevelCacheStatus);
    this.unitState$ = this.store.select(selectUnitsState);
    this.materialState$ = this.store.select(selectMaterialState);
  }

  ngOnInit(): void {
    // Load initial data
    this.store.dispatch(LevelActions.loadLevels({}));
    this.store.dispatch(UnitActions.loadUnits());
    this.store.dispatch(MaterialActions.loadMaterials());
  }

  getCacheAge(lastFetch: number | null): number {
    return this.cacheService.getCacheAge(lastFetch);
  }

  refreshLevels(): void {
    this.store.dispatch(LevelActions.refreshCache());
  }

  clearLevels(): void {
    this.store.dispatch(LevelActions.clearCache());
  }

  refreshUnits(): void {
    this.store.dispatch(UnitActions.refreshCache());
  }

  clearUnits(): void {
    this.store.dispatch(UnitActions.clearCache());
  }

  refreshMaterials(): void {
    this.store.dispatch(MaterialActions.refreshCache());
  }

  clearMaterials(): void {
    this.store.dispatch(MaterialActions.clearCache());
  }

  refreshAll(): void {
    this.refreshLevels();
    this.refreshUnits();
    this.refreshMaterials();
  }

  clearAll(): void {
    this.clearLevels();
    this.clearUnits();
    this.clearMaterials();
  }
}
