import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AgentService } from '../../../services/back-office/agent.service';
import { AppointmentService } from '../../../services/back-office-appointment/appointment.service';
import { StaffService } from '../../../services/back-office-staff/staff.service';

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

    this.participantForm = this.fb.group({
      type: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.idAppointment = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.idAppointment) {
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

}
