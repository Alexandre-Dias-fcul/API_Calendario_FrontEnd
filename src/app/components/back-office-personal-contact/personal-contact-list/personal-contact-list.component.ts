import { Component } from '@angular/core';
import { AuthorizationService } from '../../../services/back-office/authorization.service';
import { Router, RouterLink } from '@angular/router';
import { AgentService } from '../../../services/back-office/agent.service';
import { agentPersonalContact } from '../../../models/agentPersonalContact';
import { CommonModule } from '@angular/common';
import { PersonalContactService } from '../../../services/back-office-personal-contact/personal-contact.service';

@Component({
  selector: 'app-personal-contact-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './personal-contact-list.component.html',
  styleUrl: './personal-contact-list.component.css'
})
export class PersonalContactListComponent {

  agentPersonalContacts: agentPersonalContact = {
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


  constructor(private authorization: AuthorizationService,
    private router: Router,
    private agentService: AgentService,
    private personalContactService: PersonalContactService

  ) {
    const role = this.authorization.getRole();

    if (!role || (role !== 'Staff' && role !== 'Agent' && role !== 'Manager' && role !== 'Broker' && role !== 'Admin')) {

      this.router.navigate(['/front-page', 'login']);

      return;
    }

    const id = Number(authorization.getId());

    if (!id) {

      this.router.navigate(['/front-page', 'login']);

      return;
    }

    this.agentService.getByIdWithPersonalContacts(id).subscribe({

      next: (response) => {

        this.agentPersonalContacts = response;
      },
      error: (error) => {
        console.error('Erro ao obter agentWithPersonalContacts');

        this.errorMessage = error;
      }
    })
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
