import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableWithFiltersComponent } from 'src/app/shared/components/table-with-filters/table-with-filters.component';

@Component({
    selector: 'app-list',
    standalone: true,
    imports: [TableWithFiltersComponent, CommonModule],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
})
export class ListComponent {}
