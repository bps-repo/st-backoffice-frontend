import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Lesson } from 'src/app/core/models/lesson';
import { LEVELS } from 'src/app/shared/constants/app';
import { INSTALATIONS } from 'src/app/shared/constants/representatives';

@Component({
    selector: 'app-create-lesson',
    standalone: true,
    imports: [
        CommonModule,
        CheckboxModule,
        RadioButtonModule,
        FileUploadModule,
        DropdownModule,
        FormsModule,
        InputTextModule,
        InputTextareaModule,
    ],
    templateUrl: './create-lesson.component.html',
    styleUrl: './create-lesson.component.scss',
})
export class CreateLessonComponent {
    lesson: Lesson = {} as Lesson;

    instalations: any[] = INSTALATIONS;

    selected: SelectItem[] = [];

    types: any[] = ['VIP', 'Online', 'In Center'];

    levels = LEVELS;
}
