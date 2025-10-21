import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthorizationService } from '../../../services/back-office/authorization.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/front-office/user.service';

@Component({
  selector: 'app-user-new-account',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './user-new-account.component.html',
  styleUrl: './user-new-account.component.css'
})
export class UserNewAccountComponent {

  accountForm: FormGroup;

  userId: number;

  continue: number;

  errorMessage: string | null = null;

  constructor(private authorization: AuthorizationService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder
  ) {

    this.accountForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    this.continue = Number(this.route.snapshot.paramMap.get('continue'));

    if (this.userId) {
      return;
    }

  }

  onSubmit() {
    if (this.accountForm.valid) {

      const accountData = this.accountForm.value;

      this.userService.userAddAccount(accountData, this.userId).subscribe(
        {
          next: () => {

            this.accountForm.reset();
            this.router.navigate(['/main-page', 'user-list']);

          },
          error: (error) => {
            console.error('Erro ao criar conta:', error);
            this.errorMessage = error;
          }
        });
    }
    else {
      console.log('Formulário inválido.');
      this.errorMessage = 'Formulário inválido.';
    }
  }
}
