import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../../services/back-office/login.service';
import { AuthorizationService } from '../../../services/back-office/authorization.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { login } from '../../../models/login';

@Component({
  selector: 'app-login-user-employee',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login-user-employee.html',
  styleUrl: './login-user-employee.css'
})
export class LoginUserEmployee {

  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder,
    private loginService: LoginService,
    private authorizationService: AuthorizationService,
    private router: Router) {
    this.loginForm = this.fb.group({
      type: ['user', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  onSubmit() {

    if (this.loginForm.valid) {
      const type: string = this.loginForm.get('type')?.value;

      const loginData: login = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      };

      if (type === 'user') {

        this.loginService.loginUser(loginData).subscribe({

          next: (response) => {

            this.authorizationService.setToken(response);
            this.loginForm.reset();
            this.router.navigate(['/front-page', 'view-listings']);
            window.location.reload();

          },
          error: (error) => {
            console.error('Erro no login:', error);
            this.errorMessage = error;
          }
        });

      } else if (type === 'employee') {

        this.loginService.loginEmployee(loginData).subscribe({
          next: (response) => {

            this.authorizationService.setToken(response);
            this.loginForm.reset();

            const role = this.authorizationService.getRole();

            if (role === 'Manager' || role === 'Broker' || role === 'Admin') {
              this.router.navigate(['/main-page/agent-list']);
            }
            else if (role === 'Agent') {
              this.router.navigate(['/main-page/listing-list']);
            }
            else if (role == 'Staff') {
              this.router.navigate(['/main-page/appointment-list'])
            }
          },
          error: (error) => {
            console.error('Erro no login:', error);
            this.errorMessage = error;
          }
        });

      }
    }
    else {
      console.log('Formulário inválido.');
      this.errorMessage = 'Formulário inválido.';
    }
  }
}
