import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {Employee, EmployeeStatus} from 'src/app/core/models/corporate/employee';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        DropdownModule,
        CalendarModule
    ]
})
export class CreateComponent implements OnInit {
    employeeForm!: FormGroup;
    loading = false;
    statusOptions = [
        {label: 'Ativo', value: 'ACTIVE'},
        {label: 'Inativo', value: 'INACTIVE'},
        {label: 'De Licença', value: 'ON_LEAVE'},
        {label: 'Terminado', value: 'TERMINATED'}
    ];

    constructor(
        private fb: FormBuilder,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.initForm();
    }

    initForm(): void {
        this.employeeForm = this.fb.group({
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: [''],
            dateOfBirth: [null],
            department: ['', Validators.required],
            position: ['', Validators.required],
            hireDate: [new Date(), Validators.required],
            status: ['ACTIVE', Validators.required]
        });
    }

    onSubmit(): void {
        if (this.employeeForm.invalid) {
            return;
        }

        this.loading = true;
        const formValue = this.employeeForm.value;

        const employee: Partial<Employee> = {
            id: '',
            hireDate: formValue.hireDate ? formValue.hireDate.toISOString() : '',
            resignationDate: formValue.hireDate ? formValue.hireDate.toISOString() : '',
            wage: 23,
            status: formValue.status as EmployeeStatus,
            roles: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }

    cancel(): void {
        this.router.navigate(['/corporate/employees']);
    }
}
