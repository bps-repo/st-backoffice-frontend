import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {TagModule} from 'primeng/tag';
import {DividerModule} from 'primeng/divider';
import {Unit} from 'src/app/core/models/course/unit';

@Component({
    selector: 'app-view-unit-detail-dialog',
    standalone: true,
    imports: [CommonModule, DialogModule, ButtonModule, TagModule, DividerModule],
    templateUrl: './view-unit-detail-dialog.component.html',
})
export class ViewUnitDetailDialogComponent {
    visible = false;
    unit: Unit | null = null;
    levelName = '';

    show(unit: Unit, levelName?: string): void {
        this.unit = unit;
        this.levelName = levelName ?? unit.level?.name ?? '—';
        this.visible = true;
    }

    hide(): void {
        this.visible = false;
    }

    reset(): void {
        this.unit = null;
        this.levelName = '';
    }

    statusSeverity(status: Unit['status']): 'success' | 'warn' | 'secondary' {
        if (status === 'active') return 'success';
        if (status === 'inactive') return 'warn';
        return 'secondary';
    }
}
