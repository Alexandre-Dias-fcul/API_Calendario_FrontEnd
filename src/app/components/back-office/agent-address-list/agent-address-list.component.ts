import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { agentAll } from '../../../models/agentAll';
import { AgentService } from '../../../services/back-office/agent.service';

@Component({
  selector: 'app-agent-address-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './agent-address-list.component.html',
  styleUrl: './agent-address-list.component.css'
})
export class AgentAddressListComponent {

  agent: agentAll = {
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
    entityLink: {
      id: 0,
      entityType: 0,
      entityId: 0,
      addresses: [],
      contacts: [],
      account: {
        email: '',
        password: ''
      }
    }
  };
  errorMessage: string | null = null;

  constructor(
    private agentService: AgentService,
    private route: ActivatedRoute) {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      return;
    }

    this.agentService.getByIdWithAll(id).subscribe({
      next: (response: agentAll) => {
        this.agent = response;
      },
      error: (error) => {
        console.error('Erro ao obter agente:', error);
        this.errorMessage = error;
      }
    });
  }


  deleteAddress(idAddress: number) {
    if (confirm('Tem a certeza que pretende apagar o endereço?')) {
      this.agentService.agentDeleteAddress(this.agent.id, idAddress).subscribe({
        next: () => {
          window.location.reload();
        },
        error: (error) => {
          console.error('Error deleting address:', error);
          this.errorMessage = error;
        }
      });
    }
  }
}
