import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AgentService } from '../../../services/back-office/agent.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthorizationService } from '../../../services/back-office/authorization.service';

@Component({
  selector: 'app-agent-new-account',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './agent-new-account.component.html',
  styleUrl: './agent-new-account.component.css'
})
export class AgentNewAccountComponent {

  agentId: number;
  accountForm: FormGroup;
  continue: number;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder,
    private authorization: AuthorizationService,
    private agentService: AgentService,
    private route: ActivatedRoute,
    private router: Router
  ) {

    this.accountForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
      });

    this.agentId = Number(this.route.snapshot.paramMap.get('id'));

    this.continue = Number(this.route.snapshot.paramMap.get('continue'))

    if (!this.agentId) {
      return;
    }
  }

  onSubmit() {
    if (this.accountForm.valid) {
      const accountData = this.accountForm.value;
      this.agentService.agentAddAccount(accountData, this.agentId).subscribe(
        (response) => {
          console.log('Conta criada com sucesso:', response);
          this.router.navigate(['/main-page/agent-list']);
        },
        (error) => {
          console.error('Erro ao criar conta:', error);
          this.errorMessage = error;
        }
      );
    }
    else {
      console.log('Formulário inválido.');
      this.errorMessage = 'Formulário inválido.';
    }
  }
}
