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

interface Estudantes {
    nome: string;
    associados: string;
}

interface SelectItems {
    label: string;
    value: any;
}

@Component({
    selector: 'app-table-students-entity',
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
        SplitButtonModule,
    ],
    templateUrl: './table-students-entity.component.html',
    styleUrl: './table-students-entity.component.scss',
})
export class TableStudentsEntityComponent implements OnInit {
    @Input() tableLable = '';
    @Input() entity = '';

    customers1: Customer[] = [];
    estudantes: Estudantes[] = [];
    loading: boolean = true;
    items: any[] = [];

    tiposDeMateriais: any[] = [];

    instalations: SelectItem[] = [];

    options: SelectItem[] = [];

    selectedOption = signal('table_entities');
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

        this.estudantes = [
            {
                nome: 'Aphonso Davies',
                associados: 'Internacional',
            },
            {
                nome: 'Aphonso Davies',
                associados: 'Internacional',
            },
            {
                nome: 'Aphonso Davies',
                associados: 'Internacional',
            },
        ];

        this.loading = false;

        this.tiposDeMateriais = [
            { label: 'PDF', value: 'PDF' },
            { label: 'Vídeo', value: 'Vídeo' },
            { label: 'Documento Word', value: 'Word' },
        ];

        this.options = [
            { label: 'Materiais Didáticos', value: 'table_materials' },
            { label: 'Relatórios de Presença', value: 'table_presences' },
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

    navigateToEvaluateStudents() {
        this.router.navigate([`/modules/schoolar/${this.entity}/evaluate`]);
    }
}
