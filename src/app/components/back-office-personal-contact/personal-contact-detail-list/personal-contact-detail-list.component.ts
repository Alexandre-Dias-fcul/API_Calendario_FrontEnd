import { Component } from '@angular/core';
import { personalContactWithDetail } from '../../../models/personalContactWithDetail';
import { AuthorizationService } from '../../../services/back-office/authorization.service';
import { PersonalContactService } from '../../../services/back-office-personal-contact/personal-contact.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-personal-contact-detail-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './personal-contact-detail-list.component.html',
  styleUrl: './personal-contact-detail-list.component.css'
})
export class PersonalContactDetailListComponent {

  personalContact: personalContactWithDetail =
    {
      id: 0,
      name: '',
      isPrimary: false,
      notes: '',
      personalContactDetails: []
    };

  id: number;
  errorMessage: string | null = null;

  constructor(private authorization: AuthorizationService,
    private router: Router,
    private route: ActivatedRoute,
    private personalContactService: PersonalContactService) {

    const role = this.authorization.getRole();

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (!role || (role !== 'Staff' && role !== 'Agent' && role !== 'Manager' && role !== 'Broker' && role !== 'Admin')) {

      this.router.navigate(['/front-page', 'login']);

      return;
    }

    this.personalContactService.getPersonalContactWithDetail(this.id).subscribe({

      next: (response) => {
        this.personalContact = response;
      },
      error: (error) => {
        console.error('Erro ao obter personal contact.', error);
        this.errorMessage = error;

      }
    });
  }

  deleteContact(idContact: number) {
    if (confirm('Tem a certeza que pretende apagar o contacto?')) {

      this.personalContactService.deleteDetail(this.personalContact.id, idContact).subscribe({
        next: () => {
          window.location.reload();
        },
        error: (error) => {
          console.error('Error ao apagar personal contact detail:', error);
          this.errorMessage = error
        }
      })
    }
  }

}
