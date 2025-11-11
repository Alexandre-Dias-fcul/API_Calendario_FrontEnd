import { Component } from '@angular/core';
import { AuthorizationService } from '../../../services/back-office/authorization.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { listing } from '../../../models/listing';
import { ListingService } from '../../../services/back-office-agent/listing.service';
import { pagination } from '../../../models/pagination';


@Component({
  selector: 'app-listing-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './listing-list.component.html',
  styleUrl: './listing-list.component.css'
})
export class ListingListComponent {

  pagination: pagination<listing> = {
    items: [],
    pageNumber: 1,
    pageSize: 5,
    totalCount: 0,
    totalPages: 0
  };

  id: number = 0;

  role: string | null = null;

  errorMessage: string | null = null;

  searchTerm: string = '';
  pagesArray: number[] = [];

  constructor(private listingService: ListingService,
    private authorization: AuthorizationService) {

    this.role = this.authorization.getRole();

    this.id = Number(this.authorization.getId());

    this.getListings(this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);

  }

  getListings(pageNumber: number, pageSize: number, searchTerm: string) {
    this.listingService.getAllListingsPagination(pageNumber, pageSize, searchTerm).subscribe(
      {
        next: (data) => {
          this.pagination = data;
          this.pagesArray = this.getPagesArray();

        },
        error: (error) => {
          console.error('Error fetching listings:', error);
          this.errorMessage = error;
        }
      }
    );

  }

  onSearch(event: Event) {

    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value;
    this.getListings(this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);

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
      this.getListings(this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);
    }
  }


  goToPage(page: number) {
    this.pagination.pageNumber = page;
    this.getListings(this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);
  }

  increment() {
    if (this.pagination.pageNumber < this.pagination.totalPages) {
      this.pagination.pageNumber++;
      this.getListings(this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);
    }
  }

  deleteList(id: number) {
    if (confirm("Tem a certeza que quer apagar este imóvel?")) {
      this.listingService.deleteListing(id).subscribe({
        next: () => {
          window.location.reload();
        },
        error: (error) => {
          console.error('Error deleting listing:', error);
          this.errorMessage = error;
        }
      });
    }
  }


}


