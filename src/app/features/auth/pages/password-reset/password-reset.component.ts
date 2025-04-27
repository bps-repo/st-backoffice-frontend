import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-reset-password',
    templateUrl: './password-reset.component.html',
    styleUrls: ['./password-reset.component.scss'],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule]
})
export class PasswordResetComponent {
  resetForm: FormGroup;
  isSubmitting = false;
  hidePassword = true;

  constructor(private fb: FormBuilder) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, {
      validator: this.passwordsMatch
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }


  passwordsMatch(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  onSubmit() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const password = this.resetForm.value.password;

    // Simulação da requisição
    setTimeout(() => {
      console.log('Nova senha:', password);
      this.isSubmitting = false;
      alert('Sua palavra-passe foi redefinida com sucesso!');
    }, 2000);
  }
}
