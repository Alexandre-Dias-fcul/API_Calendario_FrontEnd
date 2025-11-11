import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { user } from '../../../models/user';
import { UserService } from '../../../services/front-office/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private router: Router) {
    this.registerForm = this.fb.group({
      name: this.fb.group({
        firstName: ['', Validators.required],
        middleNames: [''],
        lastName: ['', Validators.required],
      }),
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator('password', 'confirmPassword') });
  }

  onSubmit() {

    if (this.registerForm.valid) {

      const userData: user = {
        id: 0,
        name: {
          firstName: this.registerForm.get('name.firstName')?.value,
          middleNames: this.registerForm.get('name.middleNames')?.value ?
            this.registerForm.get('name.middleNames')?.value.split(' ') : [],
          lastName: this.registerForm.get('name.lastName')?.value
        },

        gender: '',
        dateOfBirth: null,
        photoFileName: '',
        isActive: true

      } as user;

      const accountData = {
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      };

      this.userService.addUser(userData).subscribe({
        next: (userResponse) => {
          this.userService.userAddAccount(accountData, userResponse.id).subscribe({
            next: (accountResponse) => {
              console.log('Usuário registrado com sucesso:', accountResponse);

              this.router.navigate(['/front-page', 'login-user-employee']);

            },
            error: (error) => {
              console.error('Erro ao adicionar conta ao usuário:', error);
              this.errorMessage = error;
            }
          });
        },
        error: (error) => {
          console.error('Erro ao registrar usuário:', error);
          this.errorMessage = error;
        }
      });

    } else {
      console.log('Formulário inválido.');
      this.errorMessage = 'Formulário inválido.';
    }
  }

  private passwordMatchValidator(passwordField: string, confirmPasswordField: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get(passwordField)?.value;
      const confirmPassword = formGroup.get(confirmPasswordField)?.value;

      if (password && confirmPassword && password !== confirmPassword) {
        formGroup.get(confirmPasswordField)?.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        formGroup.get(confirmPasswordField)?.setErrors(null);
        return null;
      }
    };
  }
}