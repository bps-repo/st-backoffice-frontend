import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
    selector: 'app-general-reports',
    templateUrl: './general-reports.component.html',
    standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule]
})
export class GeneralReportsComponent implements OnInit {
    constructor() {}

    ngOnInit() {
        // Initialize component
    }
}
