import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { SplitButtonModule } from 'primeng/splitbutton';
import { INSTALATIONS } from '../../../constants/representatives';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SelectItem } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { RippleModule } from "primeng/ripple";

export interface TableHeaderAction {
    label: string;
    icon: string;
    command: () => void;
}

@Component({
    selector: 'app-table-header',
    imports: [DropdownModule, SplitButtonModule, CommonModule, FormsModule, RippleModule],
    template: `
        <div class="flex justify-content-between gap-2 mb-5">
            <div class="flex align-items-center gap-4">
                <h1>{{ tableLable }}</h1>
                <p-dropdown
                    [options]="installations"
                    [(ngModel)]="selectedDrop"
                    placeholder="Selecione a Instalação"
                    [showClear]="true"
                ></p-dropdown>
            </div>
            <div class="flex gap-1 h-rem">
                <button
                    pButton
                    pRipple
                    (click)="onCreateEntity()"
                    icon="pi pi-plus"
                    class="p-button-success"
                ></button>
                <button
                    pButton
                    pRipple
                    icon="pi pi-upload"
                    class="p-button-help"
                ></button>
                <p-splitButton
                    icon="pi pi-file-export"
                    [model]="actions"
                    styleClass="p-button-info h-5rem text-5xl"
                ></p-splitButton>
            </div>
        </div>`
})
export class TableHeaderComponent implements OnInit {
    installations: any[] = INSTALATIONS;

    @Input()
    actions: TableHeaderAction[] = []

    selectedDrop: SelectItem = { value: '' };

    @Input() tableLable = 'Alunos';
    @Input() entity = 'students';

    @Output() createEntity = new EventEmitter<void>();

    constructor(private router: Router) {
    }

    navigateToCreateEntity() {
        this.router.navigate([`/schoolar/${this.entity}/create`]);
    }

    ngOnInit(): void {
    }

    onCreateEntity() {
        this.createEntity.emit();
    }

    exportToExcel() {
        alert('Exportar para Excel');
    }

    exportToPdf() {
        alert('Exportar para PDF');
    }
}
