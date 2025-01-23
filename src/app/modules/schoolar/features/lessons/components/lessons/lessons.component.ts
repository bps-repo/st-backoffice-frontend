import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { Lesson } from 'src/app/core/models/lesson';
import { LessonsService } from '../../services/classes.service';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SelectItem } from 'primeng/api';
import { LEVELS } from 'src/app/shared/constants/app';
import { INSTALATIONS } from 'src/app/shared/constants/representatives';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { GlobalTableComponent } from 'src/app/shared/components/global-table/global-table.component';
import { LessonService } from 'src/app/core/services/lesson.service';

@Component({
    selector: 'app-classes',
    standalone: true,
    imports: [
        GlobalTableComponent,
        DialogModule,
        ToastModule,
        CommonModule,
        DropdownModule,
        InputTextModule,
        InputTextareaModule,
        FormsModule,
        ButtonModule,
    ],
    templateUrl: './lessons.component.html',
})
export class LessonsComponent implements OnInit, OnDestroy {
    lesson: Lesson = {} as Lesson;

    instalations: any[] = INSTALATIONS;

    selected: SelectItem[] = [];

    types: any[] = ['VIP', 'Online', 'In Center'];

    levels = LEVELS;

    lessons: Lesson[] = []; //

    columns: any[] = []; //

    globalFilterFields: string[] = []; //

    createClassDialog: boolean = false;

    deleteClasstDialog: boolean = false;

    constructor(
        private classeService: LessonsService,
        private lessonService: LessonService
    ) {
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
        this.lessonService.getLessons().subscribe((lessons) => {
            this.lessons = lessons;
            console.log(this.lessons);
        });

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
