import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { Lesson } from 'src/app/core/models/lesson';
import { TableClassesComponent } from 'src/app/shared/components/table-classes/table-classes.component';
import { TableWithFiltersComponent } from 'src/app/shared/components/table-with-filters/table-with-filters.component';
import { LESSONS } from 'src/app/shared/constants/lessons';
import { ClassesService } from '../../services/classes.service';

@Component({
    selector: 'app-classes',
    standalone: true,
    imports: [
        TableWithFiltersComponent,
        DialogModule,
        ToastModule,
        CommonModule,
    ],
    templateUrl: './classes.component.html',
    styleUrl: './classes.component.scss',
})
export class ClassesComponent implements OnInit {
    lessons: Lesson[] = LESSONS; //

    columns: any[] = []; //

    globalFilterFields: string[] = []; //

    createClassDialog: boolean = false;

    deleteClasstDialog: boolean = false;

    constructor(private classeService: ClassesService) {
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

    ngOnInit(): void {
        this.createClassDialog = this.classeService.createClassDialog();
        this.deleteClasstDialog = this.classeService.deleteClassDialog();
    }

    saveClass(): void {}

    hideDialog() {}

    confirmDelete() {}
}
