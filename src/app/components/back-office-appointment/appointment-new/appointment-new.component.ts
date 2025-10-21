import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthorizationService } from '../../../services/back-office/authorization.service';
import { AppointmentService } from '../../../services/back-office-appointment/appointment.service';
import { Router, RouterLink } from '@angular/router';
import { appointment } from '../../../models/appointment';

@Component({
  selector: 'app-appointment-new',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './appointment-new.component.html',
  styleUrl: './appointment-new.component.css'
})
export class AppointmentNewComponent {

  appointmentForm: FormGroup;

  errorMessage: string | null = null;

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
    }, { validators: this.hoursValidator('hourStart', 'hourEnd') }
    );

  }

  onSubmit() {
    if (this.appointmentForm.valid) {

      const appointmentData: appointment = this.appointmentForm.value as appointment;

      appointmentData.date = this.appointmentForm.get('date')?.value;
      appointmentData.hourStart = this.appointmentForm.get('hourStart')?.value + ':00';
      appointmentData.hourEnd = this.appointmentForm.get('hourEnd')?.value + ':00';
      appointmentData.status = Number(this.appointmentForm.get('status')?.value);

      this.appointmentService.addAppointment(appointmentData).subscribe({
        next: (response) => {
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
