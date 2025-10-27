import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators, ValidatorFn } from '@angular/forms';
import { AgentService } from '../../../services/back-office/agent.service';
import { AppointmentService } from '../../../services/back-office-appointment/appointment.service';
import { StaffService } from '../../../services/back-office-staff/staff.service';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { appointment } from '../../../models/appointment';

@Component({
  selector: 'app-participant-new',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './participant-new.component.html',
  styleUrl: './participant-new.component.css'
})
export class ParticipantNewComponent {

  participantForm: FormGroup;

  idAppointment: number = 0;

  errorMessage: string | null = null;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private agentService: AgentService,
    private staffService: StaffService,
    private appointmentService: AppointmentService
  ) {

    this.idAppointment = Number(this.route.snapshot.paramMap.get('id'));

    this.participantForm = this.fb.group(
      {
        type: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
      }
    );

    if (this.idAppointment) {
      this.participantForm.setAsyncValidators(
        this.conflictsValidator('type', 'email', this.idAppointment)
      );
    }
    else {
      return;
    }

  }


  onSubmit() {

    if (this.participantForm.valid) {

      const type = this.participantForm.get('type')?.value;
      const email = this.participantForm.get('email')?.value;

      if (type === 'Agent') {
        this.agentService.getAgentByEmail(email).subscribe(
          {

            next: (agent) => {
              if (agent) {
                this.appointmentService.addParticipant(this.idAppointment, agent.id).subscribe({
                  next: () => {
                    this.router.navigate(['/main-page', 'participant-list', this.idAppointment]);
                  },
                  error: (error) => {
                    console.error('Error adding participant:', error);
                    this.errorMessage = error;
                  }
                });
              } else {
                this.participantForm.get('email')?.setErrors({ notFound: true });
              }
            },
            error: (error) => {
              console.error('Erro ao obter agent por email', error);
              this.errorMessage = error;
            }
          });
      }
      else if (type === 'Staff') {

        this.staffService.getStaffByEmail(email).subscribe({

          next: (staff) => {
            if (staff) {
              this.appointmentService.addParticipant(this.idAppointment, staff.id).subscribe({
                next: () => {
                  this.router.navigate(['/main-page', 'participant-list', this.idAppointment]);
                },
                error: (error) => {
                  console.error('Error adding participant:', error);
                  this.errorMessage = error;
                }
              });
            } else {
              this.participantForm.get('email')?.setErrors({ notFound: true });
            }
          }, error: (error) => {
            console.error("Erro ao obter staff por email:", error);
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


  private conflictsValidator(
    typeField: string,
    emailField: string,
    idAppointment: number
  ): AsyncValidatorFn {
    return (formGroup: AbstractControl): Observable<ValidationErrors | null> => {
      const type = formGroup.get(typeField)?.value;
      const email = formGroup.get(emailField)?.value;

      if (type === 'Agent' && formGroup.get(emailField)?.valid) {

        return this.agentService.getAgentByEmail(email).pipe(
          switchMap(agent =>
            this.appointmentService.getAppointmentById(idAppointment).pipe(
              switchMap(appointment =>
                this.appointmentService.getAppointmentIntersections(
                  appointment.date.toString(),
                  appointment.hourStart,
                  appointment.hourEnd
                )
              ),
              map(intersections => {
                const hasConflict = intersections.some(app =>
                  app.participants.some(p => p.employeeId === agent.id)
                );

                return hasConflict ? { invalidConflicts: true } : null;
              })
            )
          ),
          catchError(error => {
            console.error('Erro ao validar conflitos:', error);
            return of(null);
          })
        );

      } else if (type === 'Staff' && formGroup.get(emailField)?.valid) {
        return this.staffService.getStaffByEmail(email).pipe(
          switchMap(staff =>
            this.appointmentService.getAppointmentById(idAppointment).pipe(
              switchMap(appointment =>
                this.appointmentService.getAppointmentIntersections(
                  appointment.date.toISOString(),
                  appointment.hourStart,
                  appointment.hourEnd
                )
              ),
              map(intersections => {
                const hasConflict = intersections.some(app =>
                  app.participants.some(p => p.employeeId === staff.id)
                );
                return hasConflict ? { invalidConflicts: true } : null;
              })
            )
          ),
          catchError(error => {
            console.error('Erro ao validar conflitos:', error);
            return of(null);
          })
        );
      }

      return of(null);
    };
  }
}
