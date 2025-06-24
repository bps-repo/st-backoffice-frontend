import {Component, ElementRef, OnInit, ViewChild, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {SelectItem} from 'primeng/api';
import {Table} from 'primeng/table';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {SplitButtonModule} from 'primeng/splitbutton';
import {Customer, Representative} from 'src/app/core/models/mocks/customer';
import {CustomerService} from 'src/app/core/services/customer.service';
import {GlobalTable, TableColumn} from 'src/app/shared/components/tables/global-table/global-table.component';
import {GLOBAL_FILTERS, INVOICE_COLUMNS} from "../invoice.contants";

@Component({
    selector: 'app-list',
    imports: [
        CommonModule,
        GlobalTable,
        FormsModule,
        ButtonModule,
        InputTextModule,
        DropdownModule,
        SplitButtonModule
    ],
    templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
    customers: Customer[] = [];
    loading: boolean = true;

    columns: TableColumn[] = INVOICE_COLUMNS;

    globalFilterFields: string[] = GLOBAL_FILTERS

    statuses: any[] = [];
    representatives: Representative[] = [];

    instalations: SelectItem[] = [];

    items: any[] = [];
    options: any[] = [];
    selectedDrop: SelectItem = {value: ''};

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
            this.customers = customers;
            this.loading = false;

            this.customers.forEach(
                (customer) =>
                    (customer.date = new Date(
                        customer.date as string
                    ).toISOString())
            );
        });

        this.representatives = [
            {name: 'Amy Elsner', image: 'amyelsner.png'},
            {name: 'Anna Fali', image: 'annafali.png'},
            {name: 'Asiya Javayant', image: 'asiyajavayant.png'},
            {name: 'Bernardo Dominic', image: 'bernardodominic.png'},
            {name: 'Elwin Sharvill', image: 'elwinsharvill.png'},
            {name: 'Ioni Bowcher', image: 'ionibowcher.png'},
            {name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png'},
            {name: 'Onyama Limba', image: 'onyamalimba.png'},
            {name: 'Stephen Shaw', image: 'stephenshaw.png'},
            {name: 'XuXue Feng', image: 'xuxuefeng.png'},
        ];

        this.statuses = [
            {label: 'Unqualified', value: 'unqualified'},
            {label: 'Qualified', value: 'qualified'},
            {label: 'New', value: 'new'},
            {label: 'Negotiation', value: 'negotiation'},
            {label: 'Renewal', value: 'renewal'},
            {label: 'Proposal', value: 'proposal'},
        ];

        this.options = [
            {
                label: 'Produto1',
                value: 'table_reviews',
            },
            {label: 'Produto2', value: 'table_presences'},
            {
                label: 'Produto3',
                value: 'table_presences_supervisors',
            },
        ];

        this.instalations = [
            {
                label: 'Cidade',
                value: {id: 1, name: 'New York', code: 'NY'},
            },
            {label: 'Centro', value: {id: 2, name: 'Rome', code: 'RM'}},
            {
                label: 'Maculusso',
                value: {id: 3, name: 'London', code: 'LDN'},
            },
            {
                label: 'Nova Vida',
                value: {id: 4, name: 'Istanbul', code: 'IST'},
            },
            {label: 'Patriota', value: {id: 5, name: 'Paris', code: 'PRS'}},
        ];
    }

    exportToExcel() {
        throw new Error('Method not implemented.');
    }

    exportToPdf() {
        throw new Error('Method not implemented.');
    }

    navigateToCreateInvoices() {
        this.router.navigate(['/finances/invoices/create']);
    }
}
