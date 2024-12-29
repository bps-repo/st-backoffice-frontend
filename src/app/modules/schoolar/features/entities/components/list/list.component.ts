import { Component } from '@angular/core';
import { Company } from 'src/app/core/models/company';
import { TableStudentsEntityComponent } from 'src/app/shared/components/table-students-entity/table-students-entity.component';
import { TableWithFiltersComponent } from 'src/app/shared/components/table-with-filters/table-with-filters.component';
import { ENTITIES } from 'src/app/shared/constants/app';
import { COMPANIES } from 'src/app/shared/constants/companies';

@Component({
    selector: 'app-list',
    standalone: true,
    imports: [TableWithFiltersComponent],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
})
export class ListComponent {
    tableLabel = 'Entidades';
    columns = [
        { field: 'id', header: 'Número' },
        { field: 'name', header: 'Nome' },
        { field: 'phone', header: 'Telefone' },
        { field: 'address', header: 'Endereço' },
        { field: 'students', header: 'Estudantes' },
    ];
    entities: Company[] = COMPANIES;

    globalFilterFields: string[] = [];
}
