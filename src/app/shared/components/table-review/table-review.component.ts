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
import { Customer, Representative } from 'src/app/core/models/customer';
import { CustomerService } from 'src/app/core/services/customer.service';

@Component({
    selector: 'app-table-review',
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
    ],
    templateUrl: './table-review.component.html',
    styleUrl: './table-review.component.scss',
})
export class TableReviewComponent implements OnInit {
    @Input() tableLable = '';

    @Input() entity = '';

    exams: Customer[] = [];

    loading: boolean = true;

    statuses: any[] = [];

    representatives: Representative[] = [];

    expandedRows: expandedRows = {};

    isExpanded: boolean = false;

    idFrozen: boolean = false;

    activityValues: number[] = [0, 100];

    instalations: SelectItem[] = [];

    options: any[] = [];

    selectedOption = signal('table_reviews');

    selectedList: SelectItem = { value: '' };

    selectedDrop: SelectItem = { value: '' };
    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private customerService: CustomerService,
        private router: Router
    ) {}
    ngOnInit(): void {
        this.customerService.getCustomersLarge().then((customers) => {
            this.reviews = customers;
            this.loading = false;

            this.reviews.forEach(
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
                label: 'Listagem da Avaliações por presença',
                value: 'table_reviews',
            },
            {
                label: 'Listagem de Avaliações por Alunos',
                value: 'table_presences',
            },
            {
                label: 'Listagem de presenças de orientadores',
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

    expandAll() {
        if (!this.isExpanded) {
            this.exams.forEach((exam) =>
                exam && exam.name ? (this.expandedRows[exam.name] = true) : ''
            );
        } else {
            this.expandedRows = {};
        }
        this.isExpanded = !this.isExpanded;
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

    navigateToCreateReviews() {
        this.router.navigate([`/modules/schoolar/${this.entity}/create`]);
    }
}
