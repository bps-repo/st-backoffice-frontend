import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Lesson } from 'src/app/core/models/academic/lesson';
import { TableWithFiltersComponent } from 'src/app/shared/components/table-with-filters/table-with-filters.component';
import { LESSONS } from 'src/app/shared/constants/lessons';
import { TableService } from 'src/app/shared/services/table.service';
@Component({
    selector: 'app-classes',
    imports: [TableWithFiltersComponent, CommonModule],
    templateUrl: './classes.component.html'
})
export class ClassesComponent {
    lessons: Lesson[] = LESSONS;
    columns: any[] = [];
    globalFilterFields: string[] = [];
    constructor(private tableService: TableService<Lesson>) {
        this.tableService.populateColumnsFromModel(
            this.lessons[0],
            this.columns,
            this.globalFilterFields
        );
    }
}
