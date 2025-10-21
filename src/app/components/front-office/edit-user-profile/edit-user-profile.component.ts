import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/front-office/user.service';
import { AuthorizationService } from '../../../services/back-office/authorization.service';
import { user } from '../../../models/user';

@Component({
  selector: 'app-edit-user-profile',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './edit-user-profile.component.html',
  styleUrl: './edit-user-profile.component.css'
})
export class EditUserProfileComponent {

  userForm: FormGroup;
  id: number;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private authorization: AuthorizationService,
    private router: Router
  ) {

    this.userForm = this.fb.group({
      name: this.fb.group({
        firstName: ['', [Validators.required]],
        middleNames: [''],
        lastName: ['', [Validators.required]],
      }),
      dateOfBirth: [Validators.required],
      gender: ['', [Validators.required]],
      photoFileName: ['']
    });

    this.id = Number(this.authorization.getId());

    this.userService.getUserById(this.id).subscribe(
      {
        next: (data) => {

          this.userForm.patchValue({

            name: {
              firstName: data.name.firstName,
              middleNames: Array.isArray(data.name.middleNames) && data.name.middleNames.length > 0 ?
                data.name.middleNames.join(' ') : '',
              lastName: data.name.lastName
            },
            gender: data.gender,
            dateOfBirth: this.toDateInputString(data.dateOfBirth),
            photoFileName: data.photoFileName,

          });

        },
        error: (err) => {
          console.error('Error fetching users:', err);
          this.errorMessage = err;
        }
      });
  }

  onSubmit() {

    if (this.userForm.valid) {

      const userData: user = {
        id: 0,
        name: {
          firstName: '',
          middleNames: [],
          lastName: ''
        },
        dateOfBirth: null,
        gender: '',
        photoFileName: '',
        isActive: true
      };

      userData.name.firstName = this.userForm.get('name.firstName')?.value;
      userData.name.middleNames = this.userForm.get('name.middleNames')?.value ?
        this.userForm.get('name.middleNames')?.value.split(' ') : [];
      userData.name.lastName = this.userForm.get('name.lastName')?.value;
      userData.dateOfBirth = this.userForm.get('dateOfBirth')?.value;
      userData.gender = this.userForm.get('gender')?.value;
      userData.isActive = true;
      userData.photoFileName = this.userForm.get('photoFileName')?.value;

      userData.id = this.id;

      this.userService.updateUser(userData).subscribe({

        next: () => {

          this.userForm.reset();
          this.router.navigate(['/front-page', 'user-profile']);
        }
        ,
        error: (err) => {
          console.error('Erro ao atualizar user:', err);
          this.errorMessage = err;

        }
      })
    }
    else {
      console.log('Formulário inválido.');
      this.errorMessage = 'Formulario inválido.';
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
