import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Level } from 'src/app/core/models/course/level';
import { Service } from 'src/app/core/models/course/service';

@Component({
    selector: 'app-create-level-dialog',
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
    templateUrl: './create-level-dialog.component.html'
})
export class CreateLevelDialogComponent implements OnInit {
    visible: boolean = false;

    level: Level = {
        id: '',
        name: '',
        description: '',
        duration: 0,
        maximumUnits: 0,
        course: { id: '', name: '', description: '', value: 0, active: true, type: 'REGULAR_COURSE' },
        createdAt: '',
        updatedAt: ''
    };

    // Dropdown options
    courseOptions: Service[] = [];

    constructor() {}

    ngOnInit() {
        // Initialize course options (mocked for now, replace with real data)
        this.courseOptions = [
            { id: '1', name: 'Course A', description: 'Description A', value: 100, active: true, type: 'REGULAR_COURSE' },
            { id: '2', name: 'Course B', description: 'Description B', value: 200, active: true, type: 'WORKSHOP' },
            { id: '3', name: 'Course C', description: 'Description C', value: 300, active: false, type: 'PRIVATE_LESSONS' }
        ];
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    saveLevel() {
        // In a real application, you would save the level data using a service
        console.log('Level saved:', this.level);
        this.hide();
    }

    resetForm() {
        this.level = {
            id: '',
            name: '',
            description: '',
            duration: 0,
            maximumUnits: 0,
            course: { id: '', name: '', description: '', value: 0, active: true, type: 'REGULAR_COURSE' },
            createdAt: '',
            updatedAt: ''
        };
    }
}