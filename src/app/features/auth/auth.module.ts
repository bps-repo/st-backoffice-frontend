import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthRoutes } from './auth.routes';
import { LoginComponent } from './pages/login/login.component';
import { RequestPasswordResetComponent } from './pages/request-password-reset/request-password-reset.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(AuthRoutes),

    LoginComponent,
    RequestPasswordResetComponent,
  ],
  exports: []
})
export class AuthModule {}
