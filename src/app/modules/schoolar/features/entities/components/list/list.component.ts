import { Component } from '@angular/core';
import { TableWithFiltersComponent } from 'src/app/shared/components/table-with-filters/table-with-filters.component';

@Component({
    selector: 'app-list',
    standalone: true,
    imports: [TableWithFiltersComponent],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
})
export class ListComponent {}
