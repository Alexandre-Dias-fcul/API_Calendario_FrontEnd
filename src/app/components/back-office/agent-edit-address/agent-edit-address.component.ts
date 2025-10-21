import { Component } from '@angular/core';
import { agentAll } from '../../../models/agentAll';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AgentService } from '../../../services/back-office/agent.service';



@Component({
  selector: 'app-agent-edit-address',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './agent-edit-address.component.html',
  styleUrl: './agent-edit-address.component.css'
})
export class AgentEditAddressComponent {

  addressForm: FormGroup;
  addressId: number;

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


  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private agentService: AgentService
  ) {
    this.addressForm = this.fb.group({
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      country: ['', [Validators.required]]
    });

    const agentId = Number(this.route.snapshot.paramMap.get('idAgent'));

    this.addressId = Number(this.route.snapshot.paramMap.get('idAddress'));

    if (!agentId || !this.addressId) {
      return;
    }

    this.agentService.getByIdWithAll(agentId).subscribe({
      next: (response: agentAll) => {
        this.agent = response;
        const address = this.agent.entityLink?.addresses?.find(a => a.id === this.addressId);
        if (address) {
          this.addressForm.patchValue({
            street: address.street,
            city: address.city,
            postalCode: address.postalCode,
            country: address.country
          });
        }
      },
      error: (error) => {
        console.error('Erro ao obter agente:', error);
        this.errorMessage = error;
      }
    });

  }

  onSubmit() {
    if (this.addressForm.valid) {

      const addressData = this.addressForm.value;
      addressData.id = this.addressId;

      this.agentService.agentUpdateAddress(addressData, this.agent.id, this.addressId).subscribe({
        next: () => {
          this.router.navigate(['/main-page/agent-address-list', this.agent.id]);
        },
        error: (error) => {
          console.error('Erro ao editar endereço:', error);
          this.errorMessage = error;
        }
      });
    }
    else {
      console.log('Formulário inválido.');
      this.errorMessage = 'Formulário inválido.';
    }
  }

}
