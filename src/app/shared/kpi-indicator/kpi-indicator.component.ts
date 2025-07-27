import {Component, Input} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {MatIcon, MatIconModule} from "@angular/material/icon";


export type Kpi = { label: string; value: number, icon: { label: string, color: string, type?: string } };

@Component({
    selector: 'app-kpi-indicators',
    imports: [
        NgClass,
        MatIconModule,
        NgIf
    ],
    template: `
        <div class="card h-full">
            <span class="font-semibold text-lg">{{ kpi.label }}</span>
            <div class="flex justify-content-between  align-items-center mt-3">
                <span class="text-4xl font-bold text-900">{{ kpi.value }}</span>
                <div [ngClass]="kpi.icon.color " class="text-2xl">
                    <mat-icon class="text-2xl" svgIcon="{{kpi.icon.label}}" aria-hidden="false"
                              aria-label="thumb-nail"></mat-icon>
                </div>
            </div>
        </div>`,
})
export class KpiIndicatorsComponent {
    @Input()
    kpi: Kpi = {label: '', value: 0, icon: {type: '', label: '', color: ''}}
}
