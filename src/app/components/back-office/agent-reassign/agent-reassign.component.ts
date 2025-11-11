import { Component } from '@angular/core';
import { agentListing } from '../../../models/agentListing';
import { AgentService } from '../../../services/back-office/agent.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { agent } from '../../../models/agent';
import { ListingService } from '../../../services/back-office-agent/listing.service';
import { pagination } from '../../../models/pagination';
import { listing } from '../../../models/listing';

@Component({
  selector: 'app-agent-reassign',
  imports: [RouterLink, CommonModule],
  templateUrl: './agent-reassign.component.html',
  styleUrl: './agent-reassign.component.css'
})
export class AgentReassignComponent {

  agentId: number;
  pagination: pagination<listing> = {
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
    private route: ActivatedRoute,
    private listingService: ListingService
  ) {

    this.agentId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.agentId) {
      return;
    }

    this.getListings(this.agentId, this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);

  }

  getListings(agentId: number, pageNumber: number, pageSize: number, searchTerm: string) {
    this.listingService.getListingsPaginationByAgentId(agentId, pageNumber, pageSize, searchTerm).subscribe({
      next: (response) => {
        this.pagination = response;
        this.pagesArray = this.getPagesArray();
      },
      error: (error) => {
        console.error('Error fetching listings', error);
        this.errorMessage = error;
      }
    });
  }

  onSearch(event: Event) {

    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value;
    this.getListings(this.agentId, this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);

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
      this.getListings(this.agentId, this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);
    }
  }

  goToPage(page: number) {
    this.pagination.pageNumber = page;
    this.getListings(this.agentId, this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);
  }

  increment() {
    if (this.pagination.pageNumber < this.pagination.totalPages) {
      this.pagination.pageNumber++;
      this.getListings(this.agentId, this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);
    }
  }
}
