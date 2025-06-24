import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {PaymentSettings} from "../../../../core/models/payment/payment.model";

@Component({
    selector: 'app-settings',
    templateUrl: './center-settings.component.html',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule]
})
export class CenterSettingsComponent implements OnInit {
    ngOnInit() {
    }
}
