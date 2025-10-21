import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StaffService } from '../../../services/back-office-staff/staff.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { staffAll } from '../../../models/staffAll';

@Component({
  selector: 'app-staff-edit-account',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './staff-edit-account.component.html',
  styleUrl: './staff-edit-account.component.css'
})
export class StaffEditAccountComponent {

  accountForm: FormGroup;

  staff: staffAll =
    {
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
      hiredDate: null,
      dateOfTermination: null,
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

  constructor(private fb: FormBuilder,
    private staffService: StaffService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.accountForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })

    const staffId = Number(this.route.snapshot.paramMap.get('id'));

    if (!staffId) {
      return;
    }



    this.staffService.getByIdWithAll(staffId).subscribe({
      next: (response) => {
        this.staff = response;

        this.accountForm.patchValue({
          email: response.entityLink?.account?.email
        });

      },
      error: (error) => {
        console.error('Erro ao obter staff:', error);
        this.errorMessage = error;
      }
    });

  }

  onSubmit() {
    if (this.accountForm.valid) {
      const accountData = this.accountForm.value;

      this.staffService.staffUpdateAccount(accountData, this.staff.id).subscribe({

        next: () => {

          this.accountForm.reset();
          this.router.navigate(['/main-page', 'staff-edit', this.staff.id]);

        },
        error: (error) => {

          console.error("Erro ao atualizar account:", error);
          this.errorMessage = error;
        }
      })
    }
    else {
      console.log('Formulário inválido.');
      this.errorMessage = 'Formulário inválido.';
    }
  }

}
