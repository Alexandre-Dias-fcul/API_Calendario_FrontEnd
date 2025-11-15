import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AgentService } from '../../../services/back-office/agent.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { contact } from '../../../models/contact';

@Component({
  selector: 'app-agent-new-contact',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './agent-new-contact.component.html',
  styleUrl: './agent-new-contact.component.css'
})
export class AgentNewContactComponent {

  agentId: number;
  contactForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder,
    private agentService: AgentService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.contactForm = this.fb.group({
      contactType: ['', [Validators.required]],
      value: ['', [Validators.required]]
    });

    this.agentId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.agentId) {
      return;
    }

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
        id: 0,
        contactType: Number(type),
        value: value,
      };

      this.agentService.agentAddContact(contactData, this.agentId).subscribe({
        next: () => {
          this.router.navigate(['/main-page/agent-contact-list', this.agentId]);
        },
        error: (error) => {
          console.error('Erro ao adicionar contacto:', error);
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
