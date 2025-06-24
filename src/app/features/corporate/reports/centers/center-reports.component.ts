import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {PaymentReport, PaymentReportFrequency, PaymentReportType} from "../../../../core/models/payment/payment.model";

@Component({
    selector: 'app-center-reports',
    templateUrl: './center-reports.component.html',
    standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule]
})
export class CenterReports {}
