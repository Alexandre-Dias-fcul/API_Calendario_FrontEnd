import { Component } from '@angular/core';
import { contact } from '../../../models/contact';
import { StaffService } from '../../../services/back-office-staff/staff.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-staff-contact-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './staff-contact-list.html',
  styleUrl: './staff-contact-list.css'
})
export class StaffContactList {

  staffId: number;
  contacts: contact[] = [];
  errorMessage: string | null = null;

  constructor(private staffService: StaffService,
    private route: ActivatedRoute
  ) {
    this.staffId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.staffId) {
      return;
    }

    this.staffService.getByIdWithAll(this.staffId).subscribe({
      next: (response) => {

        if (response.entityLink?.contacts) {
          this.contacts = response.entityLink.contacts;
        }
      },
      error: (error) => {
        console.error('Erro ao obter contactos:', error);
        this.errorMessage = error;
      }
    });
  }

  deleteContact(idContact: number) {
    if (confirm('Tem a certeza que pretende apagar o contacto?')) {
      this.staffService.staffDeleteContact(this.staffId, idContact).subscribe({
        next: () => {
          window.location.reload();
        },
        error: (error) => {
          console.error('Erro ao apagar contacto:', error);
          this.errorMessage = error;
        }
      });
    }
  }
}
