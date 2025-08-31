import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Observable, Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

export interface VirtualListItem {
    id: string;
    [key: string]: any;
}

export interface VirtualListConfig {
    itemHeight: number;
    minBufferPx: number;
    maxBufferPx: number;
    pageSize: number;
}

@Component({
    selector: 'app-virtual-list',
    standalone: true,
    imports: [CommonModule, ScrollingModule, ReactiveFormsModule, ProgressSpinnerModule],
    template: `
    <div class="virtual-list-container">
      <!-- Search Input -->
      <div class="search-container mb-3" *ngIf="showSearch">
        <input
          type="text"
          [formControl]="searchControl"
          placeholder="Buscar..."
          class="w-full p-2 border-round"
        />
      </div>

      <!-- Virtual Scroll Viewport -->
      <cdk-virtual-scroll-viewport
        [itemSize]="config.itemHeight"
        [minBufferPx]="config.minBufferPx"
        [maxBufferPx]="config.maxBufferPx"
        class="virtual-scroll-viewport"
        (scrolledIndexChange)="onScrollIndexChange($event)"
      >
        <div
          *cdkVirtualFor="let item of filteredItems; trackBy: trackByFn"
          class="virtual-list-item"
          [style.height.px]="config.itemHeight"
          (click)="onItemClick(item)"
        >
          <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item }">
          </ng-container>
        </div>
      </cdk-virtual-scroll-viewport>

      <!-- Loading Indicator -->
      <div *ngIf="loading" class="loading-indicator text-center p-3">
        <p-progressSpinner styleClass="w-2rem h-2rem"></p-progressSpinner>
        <p class="mt-2">Carregando mais itens...</p>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && filteredItems.length === 0" class="empty-state text-center p-4">
        <i class="pi pi-inbox text-4xl text-500 mb-3"></i>
        <p class="text-500">Nenhum item encontrado</p>
      </div>
    </div>
  `,
    styles: [`
    .virtual-list-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .virtual-scroll-viewport {
      height: 400px;
      border: 1px solid var(--surface-border);
      border-radius: var(--border-radius);
    }

    .virtual-list-item {
      padding: 0.75rem;
      border-bottom: 1px solid var(--surface-border);
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .virtual-list-item:hover {
      background-color: var(--surface-hover);
    }

    .virtual-list-item:last-child {
      border-bottom: none;
    }

    .search-container input {
      border: 1px solid var(--surface-border);
      background-color: var(--surface-card);
      color: var(--text-color);
    }

    .search-container input:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px var(--primary-color-alpha-20);
    }

    .loading-indicator {
      border-top: 1px solid var(--surface-border);
    }

    .empty-state {
      color: var(--text-color-secondary);
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VirtualListComponent<T extends VirtualListItem> implements OnInit, OnDestroy {
    @Input() items: T[] = [];
    @Input() loading = false;
    @Input() showSearch = true;
    @Input() config: VirtualListConfig = {
        itemHeight: 60,
        minBufferPx: 100,
        maxBufferPx: 200,
        pageSize: 20
    };
    @Input() itemTemplate!: any; // Template reference

    @Output() itemClick = new EventEmitter<T>();
    @Output() loadMore = new EventEmitter<void>();
    @Output() searchChange = new EventEmitter<string>();

    searchControl = new FormControl('');
    filteredItems: T[] = [];
    private destroy$ = new Subject<void>();

    constructor(private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.setupSearch();
        this.updateFilteredItems();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private setupSearch(): void {
        this.searchControl.valueChanges.pipe(
            takeUntil(this.destroy$),
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(searchTerm => {
            this.searchChange.emit(searchTerm || '');
            this.updateFilteredItems();
        });
    }

    private updateFilteredItems(): void {
        const searchTerm = this.searchControl.value?.toLowerCase() || '';

        if (!searchTerm) {
            this.filteredItems = this.items;
        } else {
            this.filteredItems = this.items.filter(item =>
                Object.values(item).some(value =>
                    value?.toString().toLowerCase().includes(searchTerm)
                )
            );
        }

        this.cdr.markForCheck();
    }

    onItemClick(item: T): void {
        this.itemClick.emit(item);
    }

    onScrollIndexChange(index: number): void {
        // Load more items when user scrolls near the end
        const threshold = this.filteredItems.length - this.config.pageSize;
        if (index >= threshold && !this.loading) {
            this.loadMore.emit();
        }
    }

    trackByFn(index: number, item: T): string {
        return item.id;
    }

    // Public method to update items
    updateItems(items: T[]): void {
        this.items = items;
        this.updateFilteredItems();
    }

    // Public method to clear search
    clearSearch(): void {
        this.searchControl.setValue('');
    }
}
