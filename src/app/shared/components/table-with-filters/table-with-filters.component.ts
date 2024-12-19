import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { Customer, Representative } from 'src/app/core/models/customer';
import { CustomerService } from 'src/app/core/services/customer.service';
import {
    CITIES,
    REPRESENTATIVIES,
    STATUSES,
} from '../../constants/representatives';

@Component({
    selector: 'app-table-with-filters',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        RatingModule,
        ButtonModule,
        SliderModule,
        InputTextModule,
        ToggleButtonModule,
        RippleModule,
        MultiSelectModule,
        DropdownModule,
        ProgressBarModule,
        ToastModule,
        FileUploadModule,
        ToolbarModule,
        RouterModule,
    ],
    templateUrl: './table-with-filters.component.html',
    styleUrl: './table-with-filters.component.scss',
})
export class TableWithFiltersComponent implements OnInit {
    @Input() tableLable = '';
    @Input() type = '';
    @Input() entity = '';

    customers1: Customer[] = [];

    loading: boolean = true;

    statuses: any[] = STATUSES;

    representatives: Representative[] = REPRESENTATIVIES;

    activityValues: number[] = [0, 100];

    cities: SelectItem[] = CITIES;

    selectedList: SelectItem = { value: '' };

    selectedDrop: SelectItem = { value: '' };
    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private customerService: CustomerService,
        private router: Router
    ) {}
    ngOnInit(): void {
        this.customerService.getCustomersLarge().then((customers) => {
            this.customers1 = customers;
            this.loading = false;

            this.customers1.forEach(
                (customer) =>
                    (customer.date = new Date(
                        customer.date as string
                    ).toISOString())
            );
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    navigateToCreateStudent() {
        this.router.navigate([`/modules/schoolar/${this.entity}/create`]);
    }
}
