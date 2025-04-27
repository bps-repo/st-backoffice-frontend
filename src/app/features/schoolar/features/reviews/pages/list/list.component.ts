import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableReviewComponent } from 'src/app/shared/components/tables/table-review/table-review.component';

@Component({
    selector: 'app-list',
    imports: [TableReviewComponent, CommonModule],
    templateUrl: './list.component.html'
})
export class ListComponent {}
