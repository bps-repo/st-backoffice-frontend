import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Unit } from 'src/app/core/models/course/unit';
import { Level } from 'src/app/core/models/course/level';

@Component({
    selector: 'app-create-unit-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DialogModule,
        ButtonModule,
        DropdownModule,
        InputTextModule,
        InputTextareaModule
    ],
    templateUrl: './create-unit-dialog.component.html'
})
export class CreateUnitDialogComponent implements OnInit {
    visible: boolean = false;

    unit: Unit = {
        id: '',
        name: '',
        description: '',
        level: { id: '', name: '', description: '', duration: 0, maximumUnits: 0, course: { id: '', name: '', description: '', value: 0, active: false, type: 'REGULAR_COURSE' }, createdAt: '', updatedAt: '' },
        order: 0,
        maximumAssessmentAttempt: 0,
        createdAt: '',
        updatedAt: ''
    };

    // Dropdown options
    levelOptions: Level[] = [];

    constructor() {}

    ngOnInit() {
        // Initialize level options (mocked for now, replace with real data)
        this.levelOptions = [
            { id: '1', name: 'Level A', description: 'Description A', duration: 10, maximumUnits: 5, course: { id: '1', name: 'Course A', description: 'Course Description A', value: 100, active: true, type: 'REGULAR_COURSE' }, createdAt: '', updatedAt: '' },
            { id: '2', name: 'Level B', description: 'Description B', duration: 20, maximumUnits: 10, course: { id: '2', name: 'Course B', description: 'Course Description B', value: 200, active: true, type: 'REGULAR_COURSE' }, createdAt: '', updatedAt: '' },
            { id: '3', name: 'Level C', description: 'Description C', duration: 30, maximumUnits: 15, course: { id: '3', name: 'Course C', description: 'Course Description C', value: 300, active: true, type: 'REGULAR_COURSE' }, createdAt: '', updatedAt: '' }
        ];
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    saveUnit() {
        // In a real application, you would save the unit data using a service
        console.log('Unit saved:', this.unit);
        this.hide();
    }

    resetForm() {
        this.unit = {
            id: '',
            name: '',
            description: '',
            level: { id: '', name: '', description: '', duration: 0, maximumUnits: 0, course: { id: '', name: '', description: '', value: 0, active: false, type: 'REGULAR_COURSE' }, createdAt: '', updatedAt: '' },
            order: 0,
            maximumAssessmentAttempt: 0,
            createdAt: '',
            updatedAt: ''
        };
    }
}
