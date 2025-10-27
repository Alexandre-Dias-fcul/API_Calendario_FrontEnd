import { Component } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthorizationService } from '../../../services/back-office/authorization.service';
import { AppointmentService } from '../../../services/back-office-appointment/appointment.service';
import { Router, RouterLink } from '@angular/router';
import { appointment } from '../../../models/appointment';
import { catchError, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-appointment-new',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './appointment-new.component.html',
  styleUrl: './appointment-new.component.css'
})
export class AppointmentNewComponent {

  appointmentForm: FormGroup;

  errorMessage: string | null = null;

  id: number;

  constructor(private fb: FormBuilder,
    private authorization: AuthorizationService,
    private router: Router,
    private appointmentService: AppointmentService
  ) {

    this.appointmentForm = this.fb.group({

      title: ['', [Validators.required]],
      description: [''],
      date: [null, [Validators.required]],
      hourStart: ['', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):[0-5]\d$/)]],
      hourEnd: ['', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):[0-5]\d$/)]],
      status: ['', [Validators.required]]
    }, {
      validators: [
        this.hoursValidator('hourStart', 'hourEnd'),
      ],
      asyncValidators: [
        this.conflictsValidator('date', 'hourStart', 'hourEnd')
      ]
    }
    );

    this.id = Number(this.authorization.getId());
  }

  onSubmit() {
    if (this.appointmentForm.valid) {

      const appointmentData: appointment = this.appointmentForm.value as appointment;

      appointmentData.date = this.appointmentForm.get('date')?.value;
      appointmentData.hourStart = this.appointmentForm.get('hourStart')?.value + ':00';
      appointmentData.hourEnd = this.appointmentForm.get('hourEnd')?.value + ':00';
      appointmentData.status = Number(this.appointmentForm.get('status')?.value);

      this.appointmentService.addAppointment(appointmentData).subscribe({
        next: () => {
          this.appointmentForm.reset();
          this.router.navigate(['/main-page', 'appointment-list']);
        },
        error: (error) => {
          console.error('Error creating appointment:', error);
          this.errorMessage = error;
        }
      });

    } else {
      console.log('Formulário inválido.');
      this.errorMessage = 'Formulário inválido.';
    }
  }

  private conflictsValidator(dateField: string, hourStartField: string, hourEndField: string): AsyncValidatorFn {
    return (formGroup: AbstractControl): Observable<ValidationErrors | null> => {
      const date = formGroup.get(dateField)?.value;
      const hourStart = formGroup.get(hourStartField)?.value;
      const hourEnd = formGroup.get(hourEndField)?.value;

      if (!date || !hourStart || !hourEnd) {
        return of(null);
      }

      return this.appointmentService.getAppointmentIntersections(date, hourStart, hourEnd).pipe(
        map(response => {
          const hasConflict = response.some(app =>
            app.participants.some(p => p.employeeId === this.id)
          );

          return hasConflict ? { invalidConflicts: true } : null;
        }),
        catchError(error => {
          console.error('Erro ao obter intersecções:', error);
          this.errorMessage = error;
          return of(null);
        })
      );
    };
  }

  private hoursValidator(hourStartField: string, hourEndField: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const hourStart = formGroup.get(hourStartField)?.value;
      const hourEnd = formGroup.get(hourEndField)?.value;

      if (hourStart > hourEnd) {
        formGroup.get(hourEndField)?.setErrors({ invalidHours: true });
        return { invalidHours: true };
      } else {
        formGroup.get(hourEndField)?.setErrors(null);
        return null;
      }
    };
  }
}
