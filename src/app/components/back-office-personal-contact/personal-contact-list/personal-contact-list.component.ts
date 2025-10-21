import { Component } from '@angular/core';
import { AuthorizationService } from '../../../services/back-office/authorization.service';
import { RouterLink } from '@angular/router';
import { AgentService } from '../../../services/back-office/agent.service';
import { agentPersonalContact } from '../../../models/agentPersonalContact';
import { CommonModule } from '@angular/common';
import { PersonalContactService } from '../../../services/back-office-personal-contact/personal-contact.service';
import { StaffService } from '../../../services/back-office-staff/staff.service';
import { staffPersonalContact } from '../../../models/staffPersonalContact';

@Component({
  selector: 'app-personal-contact-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './personal-contact-list.component.html',
  styleUrl: './personal-contact-list.component.css'
})
export class PersonalContactListComponent {

  employeePersonalContacts: agentPersonalContact | staffPersonalContact = {
    id: 0,
    name: {
      firstName: '',
      middleNames: [],
      lastName: ''
    },
    dateOfBirth: null,
    gender: '',
    hiredDate: null,
    dateOfTermination: null,
    photoFileName: '',
    role: 0,
    supervisorId: null,
    isActive: true,
    personalContacts: []

  }

  errorMessage: string | null = null;


  constructor(
    private authorization: AuthorizationService,
    private agentService: AgentService,
    private personalContactService: PersonalContactService,
    private staffService: StaffService

  ) {

    const role = this.authorization.getRole();
    const id = Number(this.authorization.getId());

    if (role === 'Staff') {

      this.staffService.getByIdWithPersonalContacts(id).subscribe({

        next: (response) => {

          this.employeePersonalContacts = response;
        },
        error: (error) => {
          console.error('Erro ao obter employeeWithPersonalContacts');

          this.errorMessage = error;
        }
      })
    }
    else {
      this.agentService.getByIdWithPersonalContacts(id).subscribe({

        next: (response) => {

          this.employeePersonalContacts = response;
        },
        error: (error) => {
          console.error('Erro ao obter employeeWithPersonalContacts');

          this.errorMessage = error;
        }
      });
    }

  }

  deletePersonalContact(idPersonalContact: number) {
    if (confirm('Tem a certeza que pretende apagar este contacto?')) {
      this.personalContactService.deletePersonalContact(idPersonalContact).subscribe({
        next: () => {
          window.location.reload();
        },
        error: (error) => {
          console.error('Error ao apagar personal contact:', error);
          this.errorMessage = error
        }
      });
    }
  }
}
