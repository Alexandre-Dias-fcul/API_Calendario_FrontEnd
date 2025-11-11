import { Component } from '@angular/core';
import { AuthorizationService } from '../../../services/back-office/authorization.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PersonalContactService } from '../../../services/back-office-personal-contact/personal-contact.service';
import { personalContact } from '../../../models/personalContact';
import { pagination } from '../../../models/pagination';

@Component({
  selector: 'app-personal-contact-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './personal-contact-list.component.html',
  styleUrl: './personal-contact-list.component.css'
})
export class PersonalContactListComponent {

  employeeId: number;

  pagination: pagination<personalContact> = {
    items: [],
    pageNumber: 1,
    pageSize: 5,
    totalCount: 0,
    totalPages: 0
  };

  errorMessage: string | null = null;

  searchTerm: string = '';
  pagesArray: number[] = [];


  constructor(
    private authorization: AuthorizationService,
    private personalContactService: PersonalContactService,

  ) {

    this.employeeId = Number(this.authorization.getId());

    this.getPersonalContacts(this.employeeId, this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);
  }

  getPersonalContacts(employeeId: number, pageNumber: number, pageSize: number, searchTerm: string) {
    this.personalContactService.getPersonalContactPaginationByEmployeeId(employeeId, pageNumber, pageSize, searchTerm).subscribe({
      next: (response) => {

        this.pagination = response;
        this.pagesArray = this.getPagesArray();
      },
      error: (error) => {
        console.error('Error fetching personal contacts', error);
        this.errorMessage = error;
      }
    });
  }

  onSearch(event: Event) {

    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value;
    this.getPersonalContacts(this.employeeId, this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);

  }

  getPagesArray(): number[] {
    let pages: number[] = [];

    for (let i = 1; i <= this.pagination.totalPages; i++) {
      pages.push(i);
    }

    return pages;
  }

  decrement() {
    if (this.pagination.pageNumber > 1) {
      this.pagination.pageNumber--;
      this.getPersonalContacts(this.employeeId, this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);
    }
  }

  goToPage(page: number) {
    this.pagination.pageNumber = page;
    this.getPersonalContacts(this.employeeId, this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);
  }

  increment() {
    if (this.pagination.pageNumber < this.pagination.totalPages) {
      this.pagination.pageNumber++;
      this.getPersonalContacts(this.employeeId, this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);
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
