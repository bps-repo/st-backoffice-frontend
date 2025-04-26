import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { Lesson } from 'src/app/core/models/academic/lesson';
import { LESSONS } from 'src/app/shared/constants/lessons';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SelectItem } from 'primeng/api';
import { LEVELS } from 'src/app/shared/constants/app';
import { INSTALATIONS } from 'src/app/shared/constants/representatives';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ClassesService } from '../../services/classes.service';
import { TableWithFiltersComponent } from 'src/app/shared/components/table-with-filters/table-with-filters.component';

@Component({
    selector: 'app-classes',
    standalone: true,
    imports: [
        TableWithFiltersComponent,
        DialogModule,
        ToastModule,
        CommonModule,
        DropdownModule,
        InputTextModule,
        InputTextareaModule,
        FormsModule,
        ButtonModule,
    ],
    templateUrl: './create-classes-dialog.component.html',

})
export class CreateClassesDialogComponent implements OnInit, OnDestroy {
    lesson: Lesson = {} as Lesson;

    instalations: any[] = INSTALATIONS;

    selected: SelectItem[] = [];

    types: any[] = ['VIP', 'Online', 'In Center'];

    levels = LEVELS;

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
        this.classeService.createClassDialog$.subscribe((state) => {
            this.createClassDialog = state;
        });

        this.classeService.deleteClassDialog$.subscribe((state) => {
            this.deleteClasstDialog = state;
        });
    }

    ngOnDestroy(): void {
        this.classeService.setCreateClassDialogState(false);
        this.classeService.setDeleteClassDialogState(false);
    }

    saveClass(): void {}

    hideDialog() {
        this.classeService.setCreateClassDialogState(false);
        this.classeService.setDeleteClassDialogState(false);
    }

    confirmDelete() {}
}
