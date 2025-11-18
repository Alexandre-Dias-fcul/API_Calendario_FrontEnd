import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { contact } from '../../../models/contact';
import { UserService } from '../../../services/front-office/user.service';

@Component({
  selector: 'app-user-contact-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './user-contact-list.html',
  styleUrl: './user-contact-list.css'
})
export class UserContactList {

  userId: number;
  contacts: contact[] = [];
  errorMessage: string | null = null;

  constructor(private userService: UserService,
    private route: ActivatedRoute
  ) {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.userId) {
      return;
    }

    this.userService.getByIdWithAll(this.userId).subscribe({
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
      this.userService.userDeleteContact(this.userId, idContact).subscribe({
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
