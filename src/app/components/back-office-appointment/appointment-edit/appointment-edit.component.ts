import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { appointment } from '../../../models/appointment';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppointmentService } from '../../../services/back-office-appointment/appointment.service';
import { AuthorizationService } from '../../../services/back-office/authorization.service';

@Component({
  selector: 'app-appointment-edit',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './appointment-edit.component.html',
  styleUrl: './appointment-edit.component.css'
})
export class AppointmentEditComponent {

  appointmentForm: FormGroup;

  id: number = 0;

  appointment: appointment =
    {
      id: 0,
      title: '',
      description: '',
      date: new Date(),
      hourStart: '',
      hourEnd: '',
      status: 0
    }

  errorMessage: string | null = null;

  constructor(private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.appointmentForm = this.fb.group(
      {
        title: ['', [Validators.required]],
        description: [''],
        date: [null, [Validators.required]],
        hourStart: ['', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):[0-5]\d$/)]],
        hourEnd: ['', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):[0-5]\d$/)]],
        status: ['', [Validators.required]]
      }, { validators: this.hoursValidator('hourStart', 'hourEnd') }
    );

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.id) {
      return;
    }

    this.appointmentService.getAppointmentById(this.id).subscribe({
      next: (data) => {

        this.appointment = data;

        this.appointmentForm.patchValue({

          title: data.title,
          description: data.description,
          date: this.toDateInputString(data.date),
          hourStart: data.hourStart?.slice(0, 5),
          hourEnd: data.hourStart?.slice(0, 5),
          status: String(data.status)
        });

      },
      error: (error) => {
        console.error('Erro ao obter appointment:', error);
        this.errorMessage = error;
      }
    });
  }


  onSubmit() {

    if (this.appointmentForm.valid) {

      const appointmentData: appointment = this.appointmentForm.value as appointment;

      appointmentData.date = this.appointmentForm.get('date')?.value;
      appointmentData.hourStart = this.appointmentForm.get('hourStart')?.value + ':00';
      appointmentData.hourEnd = this.appointmentForm.get('hourEnd')?.value + ':00';
      appointmentData.status = Number(this.appointmentForm.get('status')?.value);
      appointmentData.id = this.id;

      this.appointmentService.updateAppointment(appointmentData).subscribe({
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
