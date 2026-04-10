import { LoginRequestDTO } from './dto/login-request-dto';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../utils/auth-service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private requestDTO!: LoginRequestDTO;

  loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  submit(): void {
    if (this.loginForm.valid) {
      this.requestDTO = this.loginForm.getRawValue();

      this.authService.login(this.requestDTO).subscribe({
        next: () => {
          this.router.navigate(['/monthly-budgets']);
        },
        error: () => {
          Swal.fire({
            title: 'Error!',
            text: 'Something went wrong. Please try again.',
            icon: 'error',
            confirmButtonColor: '#1f2937',
          });
        },
      });
    }
  }
}
