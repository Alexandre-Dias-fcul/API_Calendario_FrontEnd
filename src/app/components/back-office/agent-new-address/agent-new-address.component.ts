import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AgentService } from '../../../services/back-office/agent.service';

@Component({
  selector: 'app-agent-new-address',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './agent-new-address.component.html',
  styleUrl: './agent-new-address.component.css'
})
export class AgentNewAddressComponent {

  agentId: number;
  addressForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder,
    private agentService: AgentService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.addressForm = this.fb.group({
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      postalCode: ['', [Validators.required]]
    });

    this.agentId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.agentId) {
      return;
    }
  }

  onSubmit() {
    if (this.addressForm.valid) {
      const addressData = this.addressForm.value;

      this.agentService.agentAddAddress(addressData, this.agentId).subscribe({
        next: () => {
          this.router.navigate(['/main-page/agent-address-list', this.agentId]);
        },
        error: (error) => {
          console.error('Erro ao adicionar endereço:', error);
          this.errorMessage = error;
        }
      });
    }
    else {
      console.log('Formulário inválido.');
      this.errorMessage = 'Formulario inválido';
    }
  }
}
