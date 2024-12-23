import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableMaterialComponent } from 'src/app/shared/components/table-material/table-material.component';

@Component({
    selector: 'app-list',
    standalone: true,
    imports: [TableMaterialComponent, CommonModule],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
})
export class ListComponent {}
