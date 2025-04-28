import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {SelectItem} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {CalendarModule} from 'primeng/calendar';
import {LEVELS, INSTALATIONS} from 'src/app/shared/constants/app';

@Component({
    selector: 'app-create-lesson-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DialogModule,
        ButtonModule,
        DropdownModule,
        InputTextModule,
        InputTextareaModule,
        CalendarModule
    ],
    templateUrl: './create-lesson-dialog.component.html'
})
export class CreateLessonDialogComponent implements OnInit {
    visible: boolean = false;

    lesson: any = {
        date: null,
        type: null,
        level: null,
        center: null,
        startTime: null,
        endTime: null,
        description: '',
        status: 'active'
    };

    // Dropdown options
    typeOptions: SelectItem[] = [];
    levelOptions: SelectItem[] = [];
    centerOptions: SelectItem[] = [];
    statusOptions: SelectItem[] = [
        {label: 'Active', value: 'active'},
        {label: 'Cancelled', value: 'cancelled'},
        {label: 'Completed', value: 'completed'}
    ];

    constructor() {
    }

    ngOnInit() {
        // Initialize dropdown options
        this.typeOptions = [
            {label: 'VIP', value: 'VIP'},
            {label: 'Online', value: 'Online'},
            {label: 'In Center', value: 'In Center'}
        ];

        this.levelOptions = LEVELS.map(level => ({
            label: level.label,
            value: level.value
        }));

        this.centerOptions = INSTALATIONS.map(center => ({
            label: center,
            value: center
        }));
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    saveLesson() {
        // In a real application, you would save the lesson data using a service
        console.log('Lesson saved:', this.lesson);
        this.hide();
    }

    resetForm() {
        this.lesson = {
            date: null,
            type: null,
            level: null,
            center: null,
            startTime: null,
            endTime: null,
            description: '',
            status: 'active'
        };
    }
}
