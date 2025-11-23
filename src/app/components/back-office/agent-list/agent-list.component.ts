import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { agent } from '../../../models/agent';
import { AgentService } from '../../../services/back-office/agent.service';
import { CommonModule } from '@angular/common';
import { AuthorizationService } from '../../../services/back-office/authorization.service';
import { pagination } from '../../../models/pagination';

@Component({
  selector: 'app-agent-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './agent-list.component.html',
  styleUrl: './agent-list.component.css'
})
export class AgentListComponent {

  pagination: pagination<agent> = {
    items: [],
    pageNumber: 1,
    pageSize: 5,
    totalCount: 0,
    totalPages: 0
  };

  id: number;
  errorMessage: string | null = null;
  role: string | null;

  searchTerm: string = '';
  pagesArray: (number | string)[] = [];

  constructor(private agentService: AgentService,
    private authorization: AuthorizationService) {

    this.role = this.authorization.getRole();

    this.id = Number(this.authorization.getId());

    this.getAgents(this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);
  }

  onSearch(event: Event) {

    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value;
    this.getAgents(this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);

  }

  getPagesArray(totalPages: number, currentPage: number): (number | string)[] {
    const pages: (number | string)[] = [];

    if (totalPages <= 1) {
      return [1];
    }

    pages.push(1);

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) {
      pages.push("...");
    }

    for (let p = start; p <= end; p++) {
      pages.push(p);
    }

    if (end < totalPages - 1) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  }

  decrement() {
    if (this.pagination.pageNumber > 1) {
      this.pagination.pageNumber--;
      this.getAgents(this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);
    }
  }


  goToPage(page: number) {
    this.pagination.pageNumber = page;
    this.getAgents(this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);
  }

  increment() {
    if (this.pagination.pageNumber < this.pagination.totalPages) {
      this.pagination.pageNumber++;
      this.getAgents(this.pagination.pageNumber, this.pagination.pageSize, this.searchTerm);
    }
  }

  getAgents(pageNumber: number, pageSize: number, searchTerm: string) {
    this.agentService.getAllAgentsPagination(pageNumber, pageSize, searchTerm).subscribe({
      next: (data) => {

        this.pagination = data;

        this.pagesArray = this.getPagesArray(this.pagination.totalPages, this.pagination.pageNumber);
      },
      error: (error) => {
        console.error('Error fetching agents:', error);
        this.errorMessage = error;
      }
    });
  }

  deleteAgent(id: number) {
    if (confirm("Tem a certeza que quer apagar este agent ?")) {
      this.agentService.deleteAgent(id).subscribe({
        next: () => {
          window.location.reload();
        },
        error: (error) => {
          console.error("Erro deleting agent.");
          this.errorMessage = error;
        }
      });
    }
  }
}