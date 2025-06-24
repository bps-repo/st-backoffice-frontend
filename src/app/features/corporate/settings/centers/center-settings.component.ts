import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
    selector: 'app-center-settings',
    templateUrl: './center-settings.component.html',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule]
})
export class CenterSettingsComponent implements OnInit {
    centerForm!: FormGroup;

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.centerForm = this.fb.group({
            centerName: ['', Validators.required],
            location: ['', Validators.required],
            manager: ['', Validators.required],
            contactPhone: ['', Validators.required],
            contactEmail: ['', [Validators.required, Validators.email]],
            isActive: [true]
        });
    }

    saveCenter() {
        if (this.centerForm.valid) {
            console.log('Center settings saved:', this.centerForm.value);
            // Here you would typically call a service to save the settings
        }
    }
}
