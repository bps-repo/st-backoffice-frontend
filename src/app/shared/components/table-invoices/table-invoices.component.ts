import { CommonModule } from '@angular/common';
import {
    Component,
    ElementRef,
    Input,
    OnInit,
    signal,
    ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
import { Customer, Representative } from 'src/app/core/models/mocks/customer';
import { CustomerService } from 'src/app/core/services/customer.service';
import { SplitButtonModule } from 'primeng/splitbutton';

@Component({
    selector: 'app-table-invoices',
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
        SplitButtonModule,
    ],
    templateUrl: './table-invoices.component.html',
    styleUrl: './table-invoices.component.scss'
})
export class TableInvoicesComponent implements OnInit {
    @Input() tableLable = '';
    @Input() entity = '';

    customers1: Customer[] = [];

    loading: boolean = true;

    statuses: any[] = [];

    representatives: Representative[] = [];

    activityValues: number[] = [0, 100];

    instalations: SelectItem[] = [];

    items: any[] = [];

    options: any[] = [];

    selectedOption = signal('table_invoices');

    selectedList: SelectItem = { value: '' };

    selectedDrop: SelectItem = { value: '' };
    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private customerService: CustomerService,
        private router: Router
    ) {}
    ngOnInit(): void {
        this.items = [
            {
                label: 'Exportar para Excel',
                icon: 'pi pi-file-excel',
                command: () => this.exportToExcel(),
            },
            {
                label: 'Exportar para PDF',
                icon: 'pi pi-file-pdf',
                command: () => this.exportToPdf(),
            },
        ];

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

        this.representatives = [
            { name: 'Amy Elsner', image: 'amyelsner.png' },
            { name: 'Anna Fali', image: 'annafali.png' },
            { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
            { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
            { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
            { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
            { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
            { name: 'Onyama Limba', image: 'onyamalimba.png' },
            { name: 'Stephen Shaw', image: 'stephenshaw.png' },
            { name: 'XuXue Feng', image: 'xuxuefeng.png' },
        ];

        this.statuses = [
            { label: 'Unqualified', value: 'unqualified' },
            { label: 'Qualified', value: 'qualified' },
            { label: 'New', value: 'new' },
            { label: 'Negotiation', value: 'negotiation' },
            { label: 'Renewal', value: 'renewal' },
            { label: 'Proposal', value: 'proposal' },
        ];

        this.options = [
            {
                label: 'Produto1',
                value: 'table_reviews',
            },
            { label: 'Produto2', value: 'table_presences' },
            {
                label: 'Produto3',
                value: 'table_presences_supervisors',
            },
        ];

        this.instalations = [
            {
                label: 'Cidade',
                value: { id: 1, name: 'New York', code: 'NY' },
            },
            { label: 'Centro', value: { id: 2, name: 'Rome', code: 'RM' } },
            {
                label: 'Maculusso',
                value: { id: 3, name: 'London', code: 'LDN' },
            },
            {
                label: 'Nova Vida',
                value: { id: 4, name: 'Istanbul', code: 'IST' },
            },
            { label: 'Patriota', value: { id: 5, name: 'Paris', code: 'PRS' } },
        ];
    }

    exportToExcel() {
        throw new Error('Method not implemented.');
    }
    exportToPdf() {
        throw new Error('Method not implemented.');
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

    navigateToCreateInvoices() {
        this.router.navigate([`/modules/invoices/${this.entity}/create`]);
    }
}
