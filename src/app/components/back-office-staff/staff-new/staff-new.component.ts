import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { staff } from '../../../models/staff';
import { AuthorizationService } from '../../../services/back-office/authorization.service';
import { StaffService } from '../../../services/back-office-staff/staff.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-staff-new',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './staff-new.component.html',
  styleUrl: './staff-new.component.css'
})
export class StaffNewComponent {

  staffForm: FormGroup;
  id: number;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder,
    private staffService: StaffService,
    private authorization: AuthorizationService,
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.staffForm = this.fb.group({

      name: this.fb.group({
        firstName: ['', [Validators.required]],
        middleNames: [''],
        lastName: ['', [Validators.required]],
      }),
      isActive: [null, [Validators.required]],
      gender: ['', [Validators.required]],
      dateOfBirth: [null],
      hiredDate: [null],
      dateOfTermination: [null],
      photoFileName: ['']
    }, {
      validators: Validators.compose([
        this.hireDateValidator('hiredDate', 'dateOfTermination'),
        this.dateOfBirthValidator('dateOfBirth', 'hiredDate')
      ])
    });


    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (this.id) {

      this.staffService.getStaffById(this.id).subscribe(
        {
          next: (staff) => {

            const staffData = { ...staff };

            const middleNamesString = Array.isArray(staff.name.middleNames) && staff.name.middleNames.length > 0
              ? staff.name.middleNames.join(' ')
              : '';


            this.staffForm.patchValue({
              name: {
                firstName: staffData.name.firstName,
                middleNames: middleNamesString,
                lastName: staffData.name.lastName
              },
              isActive: staffData.isActive,
              gender: staffData.gender,
              dateOfBirth: this.toDateInputString(staffData.dateOfBirth),
              hiredDate: this.toDateInputString(staffData.hiredDate),
              dateOfTermination: this.toDateInputString(staffData.dateOfTermination),
              photoFileName: staffData.photoFileName
            });
          },
          error: (error) => {
            console.error('Erro ao obter staff:', error);
            this.errorMessage = error;

          }
        });
    }
  }

  onSubmit() {
    if (this.staffForm.valid) {

      const staffData: staff =
      {
        id: 0,
        name: {
          firstName: this.staffForm.get('name.firstName')?.value,
          middleNames: this.staffForm.get('name.middleNames')?.value ?
            this.staffForm.get('name.middleNames')?.value.split(' ') : [],
          lastName: this.staffForm.get('name.lastName')?.value
        },
        isActive: this.staffForm.get('isActive')?.value === 'true',
        gender: this.staffForm.get('gender')?.value,
        hiredDate: this.staffForm.get('hiredDate')?.value,
        dateOfBirth: this.staffForm.get('dateOfBirth')?.value,
        dateOfTermination: this.staffForm.get('dateOfTermination')?.value,
        photoFileName: this.staffForm.get('photoFileName')?.value,

      }


      if (this.id) {
        staffData.id = this.id;

        this.staffService.updateStaff(staffData).subscribe({
          next: (response) => {
            this.staffForm.reset();
            this.router.navigate(['/main-page', 'staff-new-account', response.id, 1]);
          },
          error: (error) => {
            console.error('Erro ao atualizar o administrativo:', error);
            this.errorMessage = error;
          }
        });
      }
      else {
        this.staffService.addStaff(staffData).subscribe({
          next: (response) => {
            this.staffForm.reset();
            this.router.navigate(['/main-page', 'staff-new-account', response.id, 1]);
          },
          error: (error) => {
            console.error('Erro ao adicionar o administrativo:', error);
            this.errorMessage = error;
          }
        });
      }
    }
    else {
      console.error('Formulário inválido.');
      this.errorMessage = 'Formulário inválido.';
    }
  }

  private dateOfBirthValidator(dateOfBirthField: string, hiredDateField: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const dobField = formGroup.get(dateOfBirthField)?.value;
      const hiredField = formGroup.get(hiredDateField)?.value;
      if (dobField > hiredField) {

        formGroup.get(hiredDateField)?.setErrors({ invalidBirthDate: true });
        return { invalidBirthDate: true };
      } else {
        formGroup.get(hiredDateField)?.setErrors(null);
        return null;
      }
    };
  }

  private hireDateValidator(hiredDateField: string, dateOfTerminationField: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const hiredField = formGroup.get(hiredDateField)?.value;
      const terminationField = formGroup.get(dateOfTerminationField)?.value;

      if (hiredField > terminationField) {
        formGroup.get(dateOfTerminationField)?.setErrors({ invalidDates: true });
        return { invalidDates: true };
      } else {
        formGroup.get(dateOfTerminationField)?.setErrors(null);
        return null;
      }
    };
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
