import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CheckboxModule} from "primeng/checkbox";

@Component({
    selector: 'app-center-reports',
    templateUrl: './center-reports.component.html',
    standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule, CheckboxModule]
})
export class CenterReports implements OnInit {
    reportForm!: FormGroup;

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.reportForm = this.fb.group({
            centerName: ['', Validators.required],
            reportType: ['financial', Validators.required],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            includeInactive: [false]
        });
    }

    generateReport() {
        if (this.reportForm.valid) {
            console.log('Generating center report with parameters:', this.reportForm.value);
            // Here you would typically call a service to generate the report
        }
    }
}
