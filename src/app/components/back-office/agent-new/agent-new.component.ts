import { Component } from '@angular/core';
import { agent } from '../../../models/agent';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AgentService } from '../../../services/back-office/agent.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { agentAll } from '../../../models/agentAll';

@Component({
  selector: 'app-agent-new',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './agent-new.component.html',
  styleUrl: './agent-new.component.css'
})

export class AgentNewComponent {

  agentForm: FormGroup;
  id: number | null = null;
  errorMessage: string | null = null;
  possibleSupervisors: agentAll[] = [];
  photoFileName: string = '';

  constructor(private fb: FormBuilder,
    private agentService: AgentService,
    private router: Router,
    private route: ActivatedRoute) {

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (this.id) {

      this.agentForm = this.fb.group(
        {
          name: this.fb.group({
            firstName: ['', [Validators.required]],
            middleNames: [''],
            lastName: ['', [Validators.required]],
          }),
          isActive: [null, [Validators.required]],
          gender: ['', [Validators.required]],
          dateOfBirth: [null],
          hiredDate: [null],
          dateOfTermination: [null],
          image: [null],
          supervisorEmail: [null],
          role: [null, Validators.required],
        }, {
        validators: Validators.compose([
          this.hireDateValidator('hiredDate', 'dateOfTermination'),
          this.dateOfBirthValidator('dateOfBirth', 'hiredDate')
        ])
      }
      );

    }
    else {
      this.agentForm = this.fb.group(
        {
          name: this.fb.group({
            firstName: ['', [Validators.required]],
            middleNames: [''],
            lastName: ['', [Validators.required]],
          }),
          isActive: [null, [Validators.required]],
          gender: ['', [Validators.required]],
          dateOfBirth: [null],
          hiredDate: [null],
          dateOfTermination: [null],
          image: [null, Validators.required],
          supervisorEmail: [null],
          role: [null, Validators.required],
        }, {
        validators: Validators.compose([
          this.hireDateValidator('hiredDate', 'dateOfTermination'),
          this.dateOfBirthValidator('dateOfBirth', 'hiredDate')
        ])
      }
      );
    }

    if (this.id) {
      this.agentService.getAgentById(this.id).subscribe(agent => {

        const agentData = { ...agent };


        agentData.name = { ...agent.name };


        const middleNamesString = Array.isArray(agent.name.middleNames) && agent.name.middleNames.length > 0
          ? agent.name.middleNames.join(' ')
          : '';

        if (agent.supervisorId != null) {
          this.agentService.getByIdWithAll(agent.supervisorId).subscribe(
            {
              next: (supervisor) => {

                this.agentForm.patchValue({
                  name: {
                    firstName: agentData.name.firstName,
                    lastName: agentData.name.lastName,

                    middleNames: middleNamesString
                  },
                  isActive: agentData.isActive,
                  gender: agentData.gender,
                  dateOfBirth: this.toDateInputString(agentData.dateOfBirth),
                  hiredDate: this.toDateInputString(agentData.hiredDate),
                  dateOfTermination: this.toDateInputString(agentData.dateOfTermination),
                  role: agentData.role,
                  supervisorEmail: supervisor.entityLink?.account?.email || null,

                });
                this.photoFileName = agent.photoFileName || '';
              }, error: (error) => {
                console.error('Erro ao obter agent:', error);
                this.errorMessage = error;
              }
            });
        } else {

          this.agentForm.patchValue({
            name: {
              firstName: agentData.name.firstName,
              lastName: agentData.name.lastName,

              middleNames: middleNamesString
            },
            isActive: agentData.isActive,
            gender: agentData.gender,
            dateOfBirth: this.toDateInputString(agentData.dateOfBirth),
            hiredDate: this.toDateInputString(agentData.hiredDate),
            dateOfTermination: this.toDateInputString(agentData.dateOfTermination),
            role: agentData.role,
            supervisorEmail: null,

          });

          this.photoFileName = agent.photoFileName || '';
        }

        this.choseSupervisor(agentData.role);
      });


    }

  }

  getFileName(path: string) {

    let fileName = path.split('/').pop();

    if (fileName) {
      fileName = fileName.replace(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g, "").replace(/__/g, "_").trim();
    }

    return fileName;

  }

  uploadFile(event: any) {

    const file = event.target.files[0];

    if (!file) return;

    document.getElementById('imageName')!.textContent = file.name;

    this.agentForm.patchValue({ image: file });
    this.agentForm.get('image')?.updateValueAndValidity();
  }

  changeSupervisor(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    const role = Number(value);
    this.choseSupervisor(role);
  }

  choseSupervisor(role: number) {

    let agents: agent[] = [];

    this.possibleSupervisors = [];

    this.agentService.getAllAgents().subscribe(

      {
        next: (response) => {

          agents = response;
          agents = agents.filter((agent) => (agent.role > role && agent.id != this.id));
          agents.forEach((agent) => this.agentService.getByIdWithAll(agent.id).subscribe({
            next: (data) => {
              this.possibleSupervisors.push(data);
              this.possibleSupervisors = this.possibleSupervisors.filter((agent) => (agent.entityLink?.account !== null
                && agent.entityLink?.account !== undefined));

            }, error: (error) => {

              console.error('Erro ao obter agente:', error);
              this.errorMessage = error;
            }
          }));
        }
        , error: (error) => {
          console.error('Erro ao obter agentes:', error);
          this.errorMessage = error;
        }
      }
    )

  }

  onSubmit() {

    if (this.agentForm.valid) {

      const formData = new FormData();

      formData.append('Name.FirstName', this.agentForm.get('name.firstName')?.value);
      formData.append('Name.LastName', this.agentForm.get('name.lastName')?.value);
      formData.append('DateOfBirth', this.agentForm.get('dateOfBirth')?.value || '');
      formData.append('Gender', this.agentForm.get('gender')?.value);
      formData.append('IsActive', Boolean(this.agentForm.get('isActive')?.value).toString());
      formData.append('HiredDate', this.agentForm.get('hiredDate')?.value || '');
      formData.append('DateOfTermination', this.agentForm.get('dateOfTermination')?.value || '');
      formData.append('Role', Number(this.agentForm.get('role')?.value).toString());

      const middleNamesValue = this.agentForm.get('name.middleNames')?.value;

      if (middleNamesValue) {
        const middleNamesArray: string[] = middleNamesValue.split(' ');

        middleNamesArray.forEach(m => {
          formData.append('Name.MiddleNames', m);
        });
      }

      const file = this.agentForm.get('image')?.value;
      if (file) {
        formData.append('PhotoFileName', file);
      }

      console.log(file);

      if (this.agentForm.get('supervisorEmail')?.value === null || this.agentForm.get('supervisorEmail')?.value === undefined
        || this.agentForm.get('supervisorEmail')?.value === '') {

        formData.append('SupervisorId', '');

        this.saveAgent(formData);
      }
      else {
        this.agentService.getAgentByEmail(this.agentForm.get('supervisorEmail')?.value).subscribe(
          {
            next: (response) => {

              formData.append('SupervisorId', response.id.toString());

              this.saveAgent(formData);
            },
            error: (error) => {
              console.error('Erro ao buscar agent:', error);
              this.errorMessage = error;
            }
          }
        )

      }

    }
    else {
      console.log('Formulário inválido');
      this.errorMessage = 'Formulário inválido.';
    }
  }

  private saveAgent(agentData: FormData) {
    if (this.id) {
      // UPDATE
      this.agentService.updateAgent(this.id, agentData).subscribe({
        next: (response) => {
          this.router.navigate(['/main-page/agent-new-account/', response.id, 1]);
        },
        error: (error) => {
          console.error('Erro ao atualizar agente:', error);
          this.errorMessage = error;
        }
      });
    } else {
      // CREATE
      this.agentService.addAgent(agentData).subscribe({
        next: (response) => {

          this.agentForm.reset();
          this.router.navigate(['/main-page/agent-new-account/', response.id, 1]);
        },
        error: (error) => {
          console.error('Erro ao criar agente:', error);
          this.errorMessage = error;
        }
      });
    }

  }

  private dateOfBirthValidator(dateOfBirthField: string, hiredDateField: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const dobField = formGroup.get(dateOfBirthField)?.value;
      const hiredField = formGroup.get(hiredDateField)?.value;
      if (dobField > hiredField) {

        formGroup.get(hiredDateField)?.setErrors({ invalidBirthDate: true });
        return { invalidBirthDate: true };
      } else {
        formGroup.get(hiredDateField)?.setErrors(null);
        return null;
      }
    };
  }

  private hireDateValidator(hiredDateField: string, dateOfTerminationField: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const hiredField = formGroup.get(hiredDateField)?.value;
      const terminationField = formGroup.get(dateOfTerminationField)?.value;

      if (hiredField > terminationField) {
        formGroup.get(dateOfTerminationField)?.setErrors({ invalidDates: true });
        return { invalidDates: true };
      } else {
        formGroup.get(dateOfTerminationField)?.setErrors(null);
        return null;
      }
    };
  }

  private toDateInputString(date: Date | string | null | undefined): string | null {
    // Caso seja null, undefined ou string vazia
    if (!date) return null;

    // Se já estiver no formato YYYY-MM-DD, retorna direto
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }

    // Tenta converter para Date
    const d = typeof date === 'string' ? new Date(date) : date;

    // Verifica se a data é válida
    if (!(d instanceof Date) || isNaN(d.getTime())) {
      return null;
    }

    // Formata para YYYY-MM-DD (formato aceito por inputs type="date")
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

}
