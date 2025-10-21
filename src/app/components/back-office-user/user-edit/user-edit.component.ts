import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { userAll } from '../../../models/userAll';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/front-office/user.service';
import { user } from '../../../models/user';

@Component({
  selector: 'app-user-edit',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent {

  userForm: FormGroup;

  id: number;

  userAll: userAll = {
    id: 0,
    name: {
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
  };

  errorMessage: string | null = null;

  constructor(private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {
    this.userForm = this.fb.group({
      name: this.fb.group({
        firstName: ['', [Validators.required]],
        middleNames: [''],
        lastName: ['', [Validators.required]]
      }),
      isActive: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      dateOfBirth: [null],
      photoFileName: ['']
    });

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.id) {
      return;
    }

    this.userService.getByIdWithAll(this.id).subscribe(
      {
        next: (response) => {
          this.userAll = response;

          this.userForm.patchValue({
            name: {
              firstName: response.name.firstName,
              middleNames: Array.isArray(response.name.middleNames) && response.name.middleNames.length > 0
                ? response.name.middleNames.join(' ') : '',
              lastName: response.name.lastName
            },
            isActive: response.isActive,
            gender: response.gender,
            dateOfBirth: this.toDateInputString(response.dateOfBirth),
            photoFileName: response.photoFileName
          });
        }, error: (error) => {
          console.error('Erro ao obter user:', error);
          this.errorMessage = error;

        }
      });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const userData: user = {
        id: this.id,
        name: {
          firstName: this.userForm.get('name.firstName')?.value,
          middleNames: this.userForm.get('name.middleNames')?.value ?
            this.userForm.get('name.middleNames')?.value.split(' ') : [],
          lastName: this.userForm.get('name.lastName')?.value
        },
        isActive: this.userForm.get('isActive')?.value === 'true',
        gender: this.userForm.get('gender')?.value,
        dateOfBirth: this.userForm.get('dateOfBirth')?.value,
        photoFileName: this.userForm.get('photoFileName')?.value,
      }

      this.userService.updateUser(userData).subscribe({

        next: () => {
          this.userForm.reset();
          this.router.navigate(['/main-page', 'user-list']);
        },
        error: (error) => {
          console.error('Erro ao alterar utilizador:', error);
          this.errorMessage = error;
        }
      });
    }
    else {
      console.log('Formulário inválido.');
      this.errorMessage = 'Formulário inválido.';
    }
  }

  private toDateInputString(date: Date | string | null | undefined): string | null {
    // Caso seja null, undefined ou string vazia
    if (!date) return null;

    // Se já estiver no formato YYYY-MM-DD, retorna direto
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }

    // Tenta converter para Date
    const d = typeof date === 'string' ? new Date(date) : date;

    // Verifica se a data é válida
    if (!(d instanceof Date) || isNaN(d.getTime())) {
      return null;
    }

    // Formata para YYYY-MM-DD (formato aceito por inputs type="date")
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
