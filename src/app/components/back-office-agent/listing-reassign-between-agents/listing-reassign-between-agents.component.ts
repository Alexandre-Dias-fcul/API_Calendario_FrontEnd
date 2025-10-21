import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ListingService } from '../../../services/back-office-agent/listing.service';
import { AgentService } from '../../../services/back-office/agent.service';

@Component({
  selector: 'app-listing-reassign-between-agents',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './listing-reassign-between-agents.component.html',
  styleUrl: './listing-reassign-between-agents.component.css'
})

export class ListingReassignBetweenAgentsComponent {

  reassignForm: FormGroup;
  idListing: number;
  idAgent: number;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private listingService: ListingService,
    private agentService: AgentService
  ) {

    this.reassignForm = this.fb.group(
      {
        emailAgent: ['', [Validators.required, Validators.email]],
      }
    );

    this.idAgent = Number(this.route.snapshot.paramMap.get('idAgent'));

    this.idListing = Number(this.route.snapshot.paramMap.get('idListing'));

    if (!this.idAgent || !this.idListing) {
      return;
    }

  }

  onSubmit() {
    if (this.reassignForm.valid) {

      const emailAgent = this.reassignForm.get('emailAgent')?.value;

      this.agentService.getAgentByEmail(emailAgent).subscribe({
        next: (agent) => {

          if (!agent) {
            console.error(`Agente com email ${emailAgent} não encontrado.`);
            return;
          }

          this.reassign(agent.id);
        },
        error: (error) => {
          console.error('Erro ao obter agent por email', error);
          this.errorMessage = error;
        }
      });
    }
    else {
      console.log('Formulário invárido.');
      this.errorMessage = 'Formulário inválido';
    }
  }

  reassign(idAgent: number) {

    this.listingService.reassignBetween(this.idListing, idAgent).subscribe({
      next: () => {

        this.router.navigate(['/main-page/agent-reassign/', this.idAgent]).then(() => {
          window.location.reload();
        });

      }, error: (error) => {
        console.error('Erro no ReassignBetween', error);
        this.errorMessage = error;
      }
    });


  }
}
