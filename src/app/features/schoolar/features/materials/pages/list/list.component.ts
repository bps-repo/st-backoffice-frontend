import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableMaterialComponent } from 'src/app/shared/components/table-material/table-material.component';

@Component({
    selector: 'app-list',
    imports: [TableMaterialComponent, CommonModule],
    templateUrl: './list.component.html'
})
export class ListComponent {}
