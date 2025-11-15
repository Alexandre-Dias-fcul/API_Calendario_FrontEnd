import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { agentAll } from '../../../models/agentAll';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AgentService } from '../../../services/back-office/agent.service';
import { AuthorizationService } from '../../../services/back-office/authorization.service';
import { contact } from '../../../models/contact';

@Component({
  selector: 'app-agent-edit-contact',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './agent-edit-contact.component.html',
  styleUrl: './agent-edit-contact.component.css'
})
export class AgentEditContactComponent {

  contactForm: FormGroup;
  contactId: number;

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
    private agentService: AgentService,
    private authorization: AuthorizationService
  ) {

    this.contactForm = this.fb.group({
      contactType: ['', [Validators.required]],
      value: ['', [Validators.required]]
    });

    const agentId = Number(this.route.snapshot.paramMap.get('idAgent'));

    this.contactId = Number(this.route.snapshot.paramMap.get('idContact'));

    if (!agentId || !this.contactId) {
      return;
    }

    this.agentService.getByIdWithAll(agentId).subscribe(
      {
        next:
          (response: agentAll) => {
            this.agent = response;
            const contact = this.agent.entityLink?.contacts?.find(a => a.id === this.contactId);
            if (contact) {
              this.contactForm.patchValue({
                contactType: contact.contactType,
                value: contact.value
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

    if (this.contactForm.valid) {

      const type = this.contactForm.value.contactType;
      const value = this.contactForm.value.value;

      if (type == 1) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          this.contactForm.get('value')?.setErrors({ email: true });
          return;
        }
      }

      const contactData: contact = {
        id: this.contactId,
        contactType: Number(type),
        value: value,
      };

      this.agentService.agentUpdateContact(contactData, this.agent.id, this.contactId).subscribe({
        next: () => {
          this.router.navigate(['/main-page/agent-contact-list', this.agent.id]);
        },
        error: (error) => {
          console.error('Erro ao alterar contacto:', error);
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
