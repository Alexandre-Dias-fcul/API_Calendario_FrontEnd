import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { agent } from '../../../models/agent';
import { AgentService } from '../../../services/back-office/agent.service';
import { CommonModule } from '@angular/common';
import { AuthorizationService } from '../../../services/back-office/authorization.service';

@Component({
  selector: 'app-agent-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './agent-list.component.html',
  styleUrl: './agent-list.component.css'
})
export class AgentListComponent {

  agents: agent[] = [];
  id: number;
  errorMessage: string | null = null;
  role: string | null;

  constructor(private agentService: AgentService,
    private authorization: AuthorizationService,
    private router: Router) {

    this.role = this.authorization.getRole();

    this.id = Number(this.authorization.getId());

    if (!this.role || (this.role !== 'Staff' && this.role !== 'Manager' && this.role !== 'Broker' && this.role !== 'Admin')) {

      this.router.navigate(['/front-page', 'login']);

      return;
    }

    if (!this.id) {

      this.router.navigate(['/front-page', 'login']);

      return;
    }

    this.agentService.getAllAgents().subscribe({

      next: (data) => {
        this.agents = data;
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