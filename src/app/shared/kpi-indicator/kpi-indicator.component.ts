import {Component, Input} from '@angular/core';
import {DecimalPipe, NgClass} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";


export interface Kpi {
    label: string;
    value: number,
    icon: { label: string, color: string, type?: string }
}

@Component({
    selector: 'app-kpi-indicators',
    imports: [
        NgClass,
        DecimalPipe,
        MatIconModule,
    ],
    template: `
        <div class="card h-full min-h-10rem mb-0 flex flex-column justify-content-between">
            <span class="font-semibold text-base md:text-lg line-height-3">{{ kpi.label }}</span>
            <div class="flex justify-content-between align-items-end gap-2 mt-3">
                <span class="text-2xl sm:text-3xl xl:text-4xl font-bold text-900">{{ kpi.value | number }}</span>
                <div [ngClass]="kpi.icon.color" class="flex-shrink-0 text-xl md:text-2xl">
                    <mat-icon class="text-xl md:text-2xl" svgIcon="{{kpi.icon.label}}" aria-hidden="false"
                              aria-label="thumb-nail"></mat-icon>
                </div>
            </div>
        </div>`,
})
export class KpiIndicatorsComponent {
    @Input()
    kpi: Kpi = {label: '', value: 0, icon: {type: '', label: '', color: ''}}
}
