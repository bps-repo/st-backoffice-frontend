import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
    selector: 'app-general-settings',
    templateUrl: './general-settings.component.html',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule]
})
export class GeneralSettingsComponent implements OnInit {
    settingsForm!: FormGroup;

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.settingsForm = this.fb.group({
            companyName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.required],
            address: ['', Validators.required],
            taxId: ['', Validators.required]
        });
    }

    saveSettings() {
        if (this.settingsForm.valid) {
            console.log('Settings saved:', this.settingsForm.value);
            // Here you would typically call a service to save the settings
        }
    }
}
