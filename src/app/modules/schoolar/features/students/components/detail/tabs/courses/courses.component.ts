import { Component } from '@angular/core';
import { GlobalTableComponent } from 'src/app/shared/components/global-table/global-table.component';

@Component({
    selector: 'app-courses',
    standalone: true,
    imports: [GlobalTableComponent],
    templateUrl: './courses.component.html',
    styleUrl: './courses.component.scss',
})
export class CoursesComponent {
    columns: any[] = [
        { field: 'name', header: 'Name' },
        { field: 'start', header: 'Início' },
        { field: 'end', header: 'Término' },
        { field: 'price', header: 'Valor' },
        { field: 'operator', header: 'Operador' },
        { field: 'status', header: 'Estado' },
        { field: 'actions', header: 'Acções' },
    ];
    data: any[] = [];
    constructor() {}
}
