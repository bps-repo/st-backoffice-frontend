import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
    selector: 'app-employee-settings',
    templateUrl: './employee-settings.component.html',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule]
})
export class EmployeeSettingsComponent implements OnInit {
    employeeSettingsForm!: FormGroup;

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.employeeSettingsForm = this.fb.group({
            defaultWorkHours: [8, [Validators.required, Validators.min(1), Validators.max(24)]],
            defaultVacationDays: [22, [Validators.required, Validators.min(0), Validators.max(30)]],
            defaultSickDays: [15, [Validators.required, Validators.min(0)]],
            overtimeMultiplier: [1.5, [Validators.required, Validators.min(1)]],
            weekendMultiplier: [2, [Validators.required, Validators.min(1)]],
            holidayMultiplier: [2.5, [Validators.required, Validators.min(1)]]
        });
    }

    saveSettings() {
        if (this.employeeSettingsForm.valid) {
            console.log('Employee settings saved:', this.employeeSettingsForm.value);
            // Here you would typically call a service to save the settings
        }
    }
}
