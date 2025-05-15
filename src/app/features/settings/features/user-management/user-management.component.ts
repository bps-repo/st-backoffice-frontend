import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

interface User {
  firstname: string;
  lastname: string;
  username: string;
  photo: string;
  gender: string;
  dateOfBirth: string;
  role: string;
  isActive: boolean;
  mfaEnabled: boolean;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CalendarModule,
    DropdownModule,
    TableModule,
    CheckboxModule,
    ButtonModule,
    InputTextModule
  ],
  templateUrl: './user-management.component.html',
})
export class UserManagementComponent {
  userForm = this.fb.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    username: ['', Validators.required],
    gender: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    role: ['', Validators.required],
    mfaEnabled: [false]
  });

  roles = ['Admin', 'Editor', 'Viewer'];
  users: User[] = [
    {
      firstname: 'John',
      lastname: 'Doe',
      username: 'johndoe',
      photo: '/uploads/photos/johndoe.jpg',
      gender: 'MALE',
      dateOfBirth: '1990-01-01',
      role: 'Admin',
      isActive: true,
      mfaEnabled: true
    }
  ];
  logs: string[] = [];

  constructor(private fb: FormBuilder) {}

  createUser() {
    const formValue = this.userForm.value;
    if (this.userForm.valid) {
      const newUser: User = {
        ...formValue,
        photo: '/uploads/photos/default.jpg',
        isActive: true
      } as User;
      this.users.push(newUser);
      this.logs.push(`Usuário ${newUser.username} criado com perfil ${newUser.role}`);
      this.userForm.reset();
    }
  }

  toggleStatus(user: User) {
    user.isActive = !user.isActive;
    this.logs.push(`${user.username} foi ${user.isActive ? 'ativado' : 'desativado'}`);
  }

  toggleMFA(user: User) {
    user.mfaEnabled = !user.mfaEnabled;
    this.logs.push(`MFA ${user.mfaEnabled ? 'ativado' : 'desativado'} para ${user.username}`);
  }
}
