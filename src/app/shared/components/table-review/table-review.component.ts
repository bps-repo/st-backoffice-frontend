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
import { INSTALATIONS } from '../../constants/representatives';
import { TableColumn } from '../table-with-filters/table-with-filters.component';
import { Exam } from 'src/app/core/models/academic/exam';
import { EXAMS } from '../../constants/exams';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-table-review',
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
    styleUrl: './table-review.component.scss'
})
export class TableReviewComponent implements OnInit {
    @Input() tableLable = '';

    @Input() entity = '';

    exams: Exam[] = EXAMS;

    expandedRows: expandedRows = {};

    isExpanded: boolean = false;

    instalations: SelectItem[] = INSTALATIONS;

    columns: TableColumn[] = [];

    options: any[] = [];

    selectedOption = signal('table_reviews');

    selectedList: SelectItem = { value: '' };

    selectedDrop: SelectItem = { value: '' };
    @ViewChild('filter') filter!: ElementRef;

    constructor(private router: Router) {}
    ngOnInit(): void {
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
