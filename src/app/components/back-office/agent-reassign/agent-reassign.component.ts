import { Component } from '@angular/core';
import { agentListing } from '../../../models/agentListing';
import { AuthorizationService } from '../../../services/back-office/authorization.service';
import { AgentService } from '../../../services/back-office/agent.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agent-reassign',
  imports: [RouterLink, CommonModule],
  templateUrl: './agent-reassign.component.html',
  styleUrl: './agent-reassign.component.css'
})
export class AgentReassignComponent {

  agent: agentListing = {
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
    listings: []
  };

  id: number;

  errorMessage: string | null = null;

  constructor(
    private agentService: AgentService,
    private route: ActivatedRoute,
  ) {

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.id) {
      return;
    }

    this.agentService.getByIdWithListings(this.id).subscribe({

      next: (data) => {
        this.agent = data;
      },
      error: (error) => {
        console.error('Error fetching agent:', error);
        this.errorMessage = error;

      }
    })
  }
}
