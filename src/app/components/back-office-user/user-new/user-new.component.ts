import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/front-office/user.service';

@Component({
  selector: 'app-user-new',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './user-new.component.html',
  styleUrl: './user-new.component.css'
})
export class UserNewComponent {

  userForm: FormGroup;

  id: number;

  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder
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
    })

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (this.id) {
      this.userService.getUserById(this.id).subscribe({
        next: (user) => {

          const middleNamesString = Array.isArray(user.name.middleNames) && user.name.middleNames.length > 0
            ? user.name.middleNames.join(' ') : '';

          this.userForm.patchValue({

            name: {
              firstName: user.name.firstName,
              middleNames: middleNamesString,
              lastName: user.name.lastName,
            },
            isActive: user.isActive,
            gender: user.gender,
            dateOfBirth: this.toDateInputString(user.dateOfBirth),
            photoFileName: user.photoFileName
          })
        },
        error: (error) => {
          console.error('Erro ao obter user.');
          this.errorMessage = error;
        }
      });
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      const userData = {
        id: 0,
        name: {
          firstName: this.userForm.get('name.firstName')?.value,
          middleNames: this.userForm.get('name.middleNames')?.value ?
            this.userForm.get('name.middleNames')?.value.split(' ') : [],
          lastName: this.userForm.get('name.lastName')?.value,
        },
        isActive: this.userForm.get('isActive')?.value === 'true',
        gender: this.userForm.get('gender')?.value,
        dateOfBirth: this.userForm.get('dateOfBirth')?.value,
        photoFileName: this.userForm.get('photoFileName')?.value
      }

      if (this.id) {
        userData.id = this.id;

        this.userService.updateUser(userData).subscribe({
          next: (response) => {
            this.userForm.reset();
            this.router.navigate(['/main-page', 'user-new-account', response.id, 1]);

          },
          error: (error) => {
            console.error('Erro ao atualizar utilizador.');
            this.errorMessage = error;
          }
        })
      }
      else {
        this.userService.addUser(userData).subscribe({

          next: (response) => {
            this.userForm.reset();
            this.router.navigate(['/main-page', 'user-new-account', response.id, 1]);
          },
          error: (error) => {
            console.error('Erro ao adicionar utilizador:', error);
            this.errorMessage = error;
          }
        })
      }
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

