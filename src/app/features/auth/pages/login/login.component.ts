// login.component.ts
import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from "@angular/common";
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
      });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      console.log('Form submitted:', this.loginForm.value);

      // Simula um delay (remover e substituir com a lógica real depois)
      setTimeout(() => {
        this.isSubmitting = false;
        // Lógica de autenticação real aqui
      }, 2000);
    }
  }

  loginWithGoogle() {
    console.log('Login with Google');
    // Implement Google login
  }

  loginWithFacebook() {
    console.log('Login with Facebook');
    // Implement Facebook login
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
