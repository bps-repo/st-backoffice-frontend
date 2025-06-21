import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Store } from '@ngrx/store';
import { Student } from 'src/app/core/models/academic/student';
import { Contract } from 'src/app/core/models/corporate/contract';
import { StudentService } from 'src/app/core/services/student.service';
import { selectAllStudents } from 'src/app/core/store/schoolar/reducers/students.reducers';
import { studentsActions } from 'src/app/core/store/schoolar/actions/students.actions';

@Component({
  selector: 'app-create-contract',
  templateUrl: './create-contract.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    DropdownModule,
    TableModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    InputTextareaModule,
    ToastModule
  ],
  providers: [MessageService]
})
export class CreateContractComponent implements OnInit {
  students: Student[] = [];
  selectedStudent: Student | null = null;
  contractForm: FormGroup;
  loading = false;

  contractTypes = [
    { label: 'Full Course', value: 'FULL_COURSE' },
    { label: 'Monthly', value: 'MONTHLY' },
    { label: 'Quarterly', value: 'QUARTERLY' },
    { label: 'Annual', value: 'ANNUAL' }
  ];

  paymentFrequencies = [
    { label: 'Monthly', value: 'MONTHLY' },
    { label: 'Quarterly', value: 'QUARTERLY' },
    { label: 'Semi-Annual', value: 'SEMI_ANNUAL' },
    { label: 'Annual', value: 'ANNUAL' },
    { label: 'One-time', value: 'ONE_TIME' }
  ];

  statuses = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Expired', value: 'EXPIRED' },
    { label: 'Cancelled', value: 'CANCELLED' }
  ];

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private studentsService: StudentService,
    private messageService: MessageService
  ) {
    this.contractForm = this.fb.group({
      student: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      contractType: [null, Validators.required],
      paymentFrequency: [null, Validators.required],
      paymentAmount: [null, [Validators.required, Validators.min(0)]],
      status: ['ACTIVE', Validators.required],
      terms: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.store.dispatch(studentsActions.loadStudents());
    this.store.select(selectAllStudents).subscribe(students => {
      this.students = students;
    });
  }

  onSubmit(): void {
    if (this.contractForm.invalid || !this.selectedStudent) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required fields'
      });
      return;
    }

    this.loading = true;

    // Create contract object
    const contract: Contract = {
      studentId: this.selectedStudent.id!.toString(),
      startDate: this.formatDate(this.contractForm.value.startDate),
      endDate: this.formatDate(this.contractForm.value.endDate),
      contractType: this.contractForm.value.contractType,
      paymentFrequency: this.contractForm.value.paymentFrequency,
      paymentAmount: this.contractForm.value.paymentAmount,
      status: this.contractForm.value.status,
      terms: this.contractForm.value.terms,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // In a real application, this would call a service method to create the contract
    // For now, we'll simulate a successful operation
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Contract created for ${this.selectedStudent!.name}`
      });
      this.contractForm.reset({
        status: 'ACTIVE'
      });
      this.selectedStudent = null;
      this.loading = false;
    }, 1000);
  }

  private formatDate(date: Date): string {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  }
}
