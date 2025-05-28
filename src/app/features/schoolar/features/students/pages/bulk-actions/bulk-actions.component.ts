import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Store } from '@ngrx/store';
import { Student } from 'src/app/core/models/academic/student';
import { Center } from 'src/app/core/models/corporate/center';
import { Class } from 'src/app/core/models/academic/class';
import { CenterService } from 'src/app/core/services/center.service';
import { StudentsService } from 'src/app/core/services/students.service';
import { selectAllStudents } from 'src/app/core/store/schoolar/reducers/students.reducers';
import { studentsActions } from 'src/app/core/store/schoolar/actions/students.actions';

@Component({
  selector: 'app-bulk-actions',
  templateUrl: './bulk-actions.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    DropdownModule,
    TableModule,
    InputTextModule,
    RadioButtonModule,
    ToastModule
  ],
  providers: [MessageService]
})
export class BulkActionsComponent implements OnInit {
  students: Student[] = [];
  centers: Center[] = [];
  classes: Class[] = [];
  selectedStudents: Student[] = [];
  form: FormGroup;
  loading = false;

  actionTypes = [
    { label: 'Add to Center', value: 'ADD_TO_CENTER' },
    { label: 'Add to Class', value: 'ADD_TO_CLASS' },
    { label: 'Create Contracts', value: 'CREATE_CONTRACTS' }
  ];

  selectedActionType: string = 'ADD_TO_CENTER';

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private centerService: CenterService,
    private studentsService: StudentsService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      actionType: ['ADD_TO_CENTER', Validators.required],
      center: [null],
      class: [null],
      contractType: ['FULL_COURSE'],
      paymentFrequency: ['MONTHLY'],
      paymentAmount: [0]
    });

    // Add conditional validators based on action type
    this.form.get('actionType')?.valueChanges.subscribe(value => {
      this.selectedActionType = value;

      // Reset validators
      this.form.get('center')?.clearValidators();
      this.form.get('class')?.clearValidators();
      this.form.get('contractType')?.clearValidators();
      this.form.get('paymentFrequency')?.clearValidators();
      this.form.get('paymentAmount')?.clearValidators();

      // Set validators based on action type
      if (value === 'ADD_TO_CENTER') {
        this.form.get('center')?.setValidators(Validators.required);
      } else if (value === 'ADD_TO_CLASS') {
        this.form.get('class')?.setValidators(Validators.required);
      } else if (value === 'CREATE_CONTRACTS') {
        this.form.get('contractType')?.setValidators(Validators.required);
        this.form.get('paymentFrequency')?.setValidators(Validators.required);
        this.form.get('paymentAmount')?.setValidators([Validators.required, Validators.min(0)]);
      }

      // Update validators
      this.form.get('center')?.updateValueAndValidity();
      this.form.get('class')?.updateValueAndValidity();
      this.form.get('contractType')?.updateValueAndValidity();
      this.form.get('paymentFrequency')?.updateValueAndValidity();
      this.form.get('paymentAmount')?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.loadStudents();
    this.loadCenters();
    this.loadClasses();
  }

  loadStudents(): void {
    this.store.dispatch(studentsActions.loadStudents());
    this.store.select(selectAllStudents).subscribe(students => {
      this.students = students;
    });
  }

  loadCenters(): void {
    this.centerService.getAllCenters().subscribe(centers => {
      this.centers = centers;
    });
  }

  loadClasses(): void {
    // In a real application, this would fetch classes from a service
    // For now, we'll use mock data
    this.classes = [
      { id: 1, name: 'English A1', schedule: 'Mon/Wed 9-11', center: { id: '1', name: 'Downtown Center' }, students: [] },
      { id: 2, name: 'Spanish B2', schedule: 'Tue/Thu 14-16', center: { id: '1', name: 'Downtown Center' }, students: [] },
      { id: 3, name: 'French A2', schedule: 'Fri 10-13', center: { id: '2', name: 'Uptown Center' }, students: [] }
    ];
  }

  onSubmit(): void {
    if (this.form.invalid || this.selectedStudents.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required fields and select at least one student'
      });
      return;
    }

    this.loading = true;

    // Perform the selected action
    switch (this.selectedActionType) {
      case 'ADD_TO_CENTER':
        this.addStudentsToCenter();
        break;
      case 'ADD_TO_CLASS':
        this.addStudentsToClass();
        break;
      case 'CREATE_CONTRACTS':
        this.createStudentContracts();
        break;
    }
  }

  addStudentsToCenter(): void {
    const centerName = this.form.value.center.name;

    // Process each selected student
    const promises = this.selectedStudents.map(student => {
      const updatedStudent = { ...student, center: centerName };
      return this.studentsService.updateStudent(updatedStudent);
    });

    Promise.all(promises)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${this.selectedStudents.length} students added to ${centerName}`
        });
        this.selectedStudents = [];
        this.loadStudents(); // Refresh the list
      })
      .catch(error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add students to center'
        });
        console.error('Error adding students to center:', error);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  addStudentsToClass(): void {
    const className = this.form.value.class.name;

    // Process each selected student
    const promises = this.selectedStudents.map(student => {
      // In a real application, this would call a service method to add the student to the class
      // For now, we'll simulate a successful operation
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          // Update the student's classEntity field
          const updatedStudent = { ...student, classEntity: this.form.value.class };
          this.studentsService.updateStudent(updatedStudent);
          resolve();
        }, 500);
      });
    });

    Promise.all(promises)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${this.selectedStudents.length} students added to ${className}`
        });
        this.selectedStudents = [];
        this.loadStudents(); // Refresh the list
      })
      .catch(error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add students to class'
        });
        console.error('Error adding students to class:', error);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  createStudentContracts(): void {
    // In a real application, this would call a service method to create contracts for the selected students
    // For now, we'll simulate a successful operation
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Contracts created for ${this.selectedStudents.length} students`
      });
      this.selectedStudents = [];
      this.loading = false;
    }, 1000);
  }
}
