import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthorizationService } from '../../../services/back-office/authorization.service';
import { ListingService } from '../../../services/back-office-agent/listing.service';
import { agent } from '../../../models/agent';
import { AgentService } from '../../../services/back-office/agent.service';

@Component({
  selector: 'app-listing-reassign-to-agent',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './listing-reassign-to-agent.component.html',
  styleUrl: './listing-reassign-to-agent.component.css'
})
export class ListingReassignToAgentComponent {

  reassignForm: FormGroup;
  idListing: number;
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

    this.idListing = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.idListing) {
      return;
    }

  }

  onSubmit() {
    if (this.reassignForm.valid) {

      const emailAgent = this.reassignForm.get('emailAgent')?.value;

      this.agentService.getAgentByEmail(emailAgent).subscribe((agent: agent) => {

        if (!agent) {
          console.error(`Agente com email ${emailAgent} não encontrado.`);
        }

        this.reassign(agent.id);

      }
        , error => {
          console.error('Erro ao buscar agente por email:', error);
          this.errorMessage = error;
        });
    }
    else {
      console.log('Formulário inválido');
      this.errorMessage = 'Formulário inválido';
    }
  }

  reassign(idAgent: number) {
    this.listingService.reassignTo(this.idListing, idAgent).subscribe(() => {
      this.router.navigate(['/main-page/listing-list']);
    }, error => {
      console.error('Erro ao reatribuir o listing:', error);
      this.errorMessage = error;
    });
  }
}
