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

  constructor(private agentService: AgentService,
    private authorization: AuthorizationService) {

    this.role = this.authorization.getRole();

    this.id = Number(this.authorization.getId());

    this.agentService.getAllAgentsPagination(1, 5, "").subscribe({

      next: (data) => {
        this.pagination = data;
      },
      error: (error) => {
        console.error('Error fetching agents:', error);
        this.errorMessage = error;
      }
    }

    );
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