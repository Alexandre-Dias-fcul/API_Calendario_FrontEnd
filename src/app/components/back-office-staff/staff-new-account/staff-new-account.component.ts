import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthorizationService } from '../../../services/back-office/authorization.service';
import { StaffService } from '../../../services/back-office-staff/staff.service';

@Component({
  selector: 'app-staff-new-account',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './staff-new-account.component.html',
  styleUrl: './staff-new-account.component.css'
})
export class StaffNewAccountComponent {

  accountForm: FormGroup;
  staffId: number;
  continue: number;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private staffService: StaffService) {
    this.accountForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.staffId = Number(this.route.snapshot.paramMap.get('id'));

    this.continue = Number(this.route.snapshot.paramMap.get('continue'));

    if (!this.staffId) {
      return;
    }
  }


  onSubmit() {
    if (this.accountForm.valid) {
      const accountData = this.accountForm.value;

      this.staffService.staffAddAccount(accountData, this.staffId).subscribe({
        next: (response) => {
          this.accountForm.reset();
          this.router.navigate(['/main-page', 'staff-list']);

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


