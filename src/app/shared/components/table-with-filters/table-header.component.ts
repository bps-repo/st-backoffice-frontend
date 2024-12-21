import { Component, Input } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CITIES } from '../../constants/representatives';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SelectItem } from 'primeng/api';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-table-header',
    standalone: true,
    imports: [DropdownModule, SplitButtonModule, CommonModule, FormsModule],
    template: ` <div class="flex justify-content-between gap-2 mb-5">
        <div class="flex align-items-center gap-4">
            <h1>{{ tableLable }}</h1>
            <p-dropdown
                [options]="cities"
                [(ngModel)]="selectedDrop"
                placeholder="Selecione a Instalação"
                [showClear]="true"
            ></p-dropdown>
        </div>
        <div class="flex gap-1 h-rem">
            <button
                pButton
                pRipple
                (click)="navigateToCreateStudent()"
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
                [model]="items"
                styleClass="p-button-info h-5rem text-5xl"
            ></p-splitButton>
        </div>
    </div>`,
})
export class TableHeaderComponent<T> {
    cities: any[] = CITIES;
    items: any[] = [];
    selectedDrop: SelectItem = { value: '' };
    @Input() tableLable = 'Alunos';
    constructor(private router: Router) {}
    navigateToCreateStudent() {
        this.router.navigate(['/students/create']);
    }
}
