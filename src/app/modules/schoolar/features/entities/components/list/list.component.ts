import { Component } from '@angular/core';
import { TableWithFiltersComponent } from 'src/app/shared/components/table-with-filters/table-with-filters.component';

@Component({
    selector: 'app-list',
    standalone: true,
    imports: [TableWithFiltersComponent],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
})
export class ListComponent {
    tableLabel = 'Customers';
    columns = [
        { field: 'name', header: 'Nome' },
        { field: 'email', header: 'E-mail' },
        { field: 'phone', header: 'Telefone' },
        { field: 'address', header: 'Endereço' },
        { field: 'status', header: 'Status' },
    ];
    data = [
        {
            name: 'John Doe',
            email: 'johndoe@example.com',
            phone: '123-456-7890',
            address: '123 Main St',
            status: 'Active',
        },
        {
            name: 'Jane Smith',
            email: 'janesmith@example.com',
            phone: '987-654-3210',
            address: '456 Elm St',
            status: 'Inactive',
        },
        // Add more customers here...
    ];
    loading = false;
    globalFilterFields = ['name', 'email', 'phone', 'address', 'status'];
    entity = 'customer';
}
