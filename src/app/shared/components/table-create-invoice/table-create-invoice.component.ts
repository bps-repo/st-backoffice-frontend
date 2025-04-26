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
import { EXAMS, EXAMS_ } from '../../constants/exams';
import { DISCOUNTS, LEVELS } from '../../constants/app';
import { ListboxModule } from 'primeng/listbox';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-table-create-invoice',
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
        ListboxModule,
        MultiSelectModule,
    ],
    templateUrl: './table-review.component.html',
    styleUrl: './table-review.component.scss',
})
export class TableCreateInvoice implements OnInit {
    exams: Exam[] = EXAMS_;

    discounts: SelectItem[] = DISCOUNTS;

    selectedDrop: SelectItem[] = [{ value: '' }];

    courses: any[] = LEVELS;
    selectedList: any[] = [];

    @ViewChild('filter') filter!: ElementRef;

    constructor(private router: Router) {}
    ngOnInit(): void {}

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
}
