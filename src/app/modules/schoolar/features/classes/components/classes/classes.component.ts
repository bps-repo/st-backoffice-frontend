import { Component } from '@angular/core';
import { Lesson } from 'src/app/core/models/lesson';
import { TableClassesComponent } from 'src/app/shared/components/table-classes/table-classes.component';
import { TableWithFiltersComponent } from 'src/app/shared/components/table-with-filters/table-with-filters.component';
import { LESSONS } from 'src/app/shared/constants/lessons';

@Component({
    selector: 'app-classes',
    standalone: true,
    imports: [TableWithFiltersComponent],
    templateUrl: './classes.component.html',
    styleUrl: './classes.component.scss',
})
export class ClassesComponent {
    lessons: Lesson[] = LESSONS; //
    columns: any[] = []; //
    globalFilterFields: string[] = []; //
    constructor() {
        this.columns = [
            { field: 'date', header: 'Data' },
            { field: 'class', header: 'Turma' },
            { field: 'time', header: 'Horário' },
            { field: 'teacher', header: 'Professor' },
            { field: 'center', header: 'Centro' },
            { field: 'level', header: 'Nível' },
            { field: 'description', header: 'Descrição' },
            { field: 'students', header: 'Alunos' },
        ];
    }
}
