import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RoleService } from 'src/app/core/services/role.service';
import { Role } from 'src/app/core/models/auth/role';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-role',
  templateUrl: './create.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule
  ]
})
export class CreateComponent implements OnInit {
  roleForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.roleForm.invalid) {
      return;
    }

    this.loading = true;
    const formValue = this.roleForm.value;

    const role: Role = {
      id: "", // Will be assigned by the server
      name: formValue.name,
      description: formValue.description,
      permissions: []
    };

    this.roleService.createRole(role)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (createdRole) => {
          this.router.navigate(['/corporate/roles', createdRole.id]);
        },
        error: (error) => {
          console.error('Error creating role', error);
        }
      });
  }

  cancel(): void {
    this.router.navigate(['/corporate/roles']);
  }
}
