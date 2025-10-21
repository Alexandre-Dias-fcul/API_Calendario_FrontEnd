import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { userAll } from '../../../models/userAll';
import { AuthorizationService } from '../../../services/back-office/authorization.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/front-office/user.service';

@Component({
  selector: 'app-user-edit-account',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './user-edit-account.component.html',
  styleUrl: './user-edit-account.component.css'
})
export class UserEditAccountComponent {

  accountForm: FormGroup;

  userAll: userAll = {
    id: 0,
    name:
    {
      firstName: '',
      middleNames: [],
      lastName: ''

    },
    isActive: true,
    gender: '',
    dateOfBirth: null,
    photoFileName: '',
    entityLink: {
      id: 0,
      entityType: 0,
      entityId: 0,
      addresses: [],
      contacts: [],
      account: {
        email: '',
        password: ''
      }
    }
  }

  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserService,

  ) {
    this.accountForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })

    const userId = Number(this.route.snapshot.paramMap.get('id'));

    if (!userId) {
      return;
    }

    this.userService.getByIdWithAll(userId).subscribe(
      {
        next: (response) => {
          this.userAll = response;
          this.accountForm.patchValue({
            email: response.entityLink?.account?.email
          })
        },
        error: (error) => {
          console.error('Erro ao obter user:', error);
          this.errorMessage = error;
        }
      }

    );
  }

  onSubmit() {

    if (this.accountForm.valid) {
      const accountData = this.accountForm.value;

      this.userService.userUpdateAccount(accountData, this.userAll.id).subscribe({

        next: () => {
          this.accountForm.reset();
          this.router.navigate(['/main-page', 'user-edit', this.userAll.id]);

        },
        error: (error) => {
          console.error('Erro ao atualizar account:', error);
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
