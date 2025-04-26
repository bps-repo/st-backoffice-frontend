import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-request-password-reset',
  templateUrl: './request-password-reset.component.html',
  styleUrls: ['./request-password-reset.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule]
})
export class RequestPasswordResetComponent {
  resetForm: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const email = this.resetForm.value.email;

    // Simulação de requisição (substituir com requisição real)
    setTimeout(() => {
      console.log(`Link de redefinição enviado para: ${email}`);
      this.isSubmitting = false;

      // Opcional: navegar para outra página ou mostrar um alerta
      alert('Um link de recuperação foi enviado ao seu email!');
    }, 2000);
  }
}
