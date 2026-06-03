import {CommonModule} from '@angular/common';
import {ChangeDetectorRef, Component, inject, output, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import {InputNumberModule} from 'primeng/inputnumber';
import {Unit, toUpdateUnitPayload} from 'src/app/core/models/course/unit';
import {UnitService} from 'src/app/core/services/unit.service';

@Component({
    selector: 'app-edit-unit-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DialogModule,
        ButtonModule,
        InputTextModule,
        TextareaModule,
        InputNumberModule,
    ],
    templateUrl: './edit-unit-dialog.component.html',
})
export class EditUnitDialogComponent {
    private unitService = inject(UnitService);
    private cdr = inject(ChangeDetectorRef);

    unitUpdated = output<Unit>();

    visible = false;
    private unitId = '';

    form = {
        name: '',
        description: '',
        orderUnit: 1,
        maximumAssessmentAttempt: 1,
    };

    loading = signal(false);
    error = signal<string | null>(null);

    show(unit: Unit): void {
        this.unitId = unit.id;
        this.error.set(null);
        this.form = {
            name: unit.name,
            description: unit.description,
            orderUnit: unit.orderUnit,
            maximumAssessmentAttempt: unit.maximumAssessmentAttempt,
        };
        this.visible = true;
    }

    hide(): void {
        this.visible = false;
    }

    saveUnit(): void {
        if (!this.unitId || !this.form.name.trim() || !this.form.description.trim()) {
            return;
        }

        const payload = toUpdateUnitPayload({
            name: this.form.name.trim(),
            description: this.form.description.trim(),
            orderUnit: this.form.orderUnit,
            maximumAssessmentAttempt: this.form.maximumAssessmentAttempt,
        });

        this.loading.set(true);
        this.error.set(null);
        this.cdr.detectChanges();

        this.unitService.updateUnit(this.unitId, payload).subscribe({
            next: (response) => {
                this.loading.set(false);
                this.unitUpdated.emit(response.data);
                this.hide();
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.loading.set(false);
                this.error.set(err?.message ?? 'Erro ao atualizar unidade.');
                this.cdr.detectChanges();
            },
        });
    }

    resetForm(): void {
        this.form = {
            name: '',
            description: '',
            orderUnit: 1,
            maximumAssessmentAttempt: 1,
        };
        this.unitId = '';
        this.error.set(null);
        this.loading.set(false);
    }
}
