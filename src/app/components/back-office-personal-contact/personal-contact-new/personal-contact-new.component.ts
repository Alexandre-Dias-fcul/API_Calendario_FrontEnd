import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthorizationService } from '../../../services/back-office/authorization.service';
import { PersonalContactService } from '../../../services/back-office-personal-contact/personal-contact.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { personalContact } from '../../../models/personalContact';

@Component({
  selector: 'app-personal-contact-new',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './personal-contact-new.component.html',
  styleUrl: './personal-contact-new.component.css'
})
export class PersonalContactNewComponent {

  personalContactForm: FormGroup;

  errorMessage: string | null = null;

  id: number;

  continue: string | null;

  constructor(private fb: FormBuilder,
    private router: Router,
    private personalContactService: PersonalContactService,
    private route: ActivatedRoute
  ) {

    this.personalContactForm = this.fb.group({
      name: ['', [Validators.required]],
      isPrimary: [null, [Validators.required]],
      notes: ['']
    })

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.continue = this.route.snapshot.paramMap.get('continue');

    if (this.id) {
      this.personalContactService.getPersonalContactById(this.id).subscribe({

        next: (response) => {
          this.personalContactForm.patchValue({
            name: response.name,
            isPrimary: response.isPrimary,
            notes: response.notes
          });
        },
        error: (error) => {

          console.error('Erro ao obter personal-contact:', error);

          this.errorMessage = error;
        }
      });
    }
  }

  onSubmit() {
    if (this.personalContactForm.valid) {

      const personalContactData: personalContact = this.personalContactForm.value as personalContact;

      personalContactData.name = this.personalContactForm.get('name')?.value;
      personalContactData.isPrimary = this.personalContactForm.get('isPrimary')?.value === 'true';
      personalContactData.notes = this.personalContactForm.get('notes')?.value;


      if (this.id) {
        personalContactData.id = this.id;

        this.personalContactService.updatePersonalContact(personalContactData).subscribe({

          next: (response) => {
            this.personalContactForm.reset();

            if (this.continue) {
              this.router.navigate(['/main-page', 'personal-contact-detail-new', response.id, "continua"]);
            }
            else {
              this.router.navigate(['/main-page', 'personal-contact-list']);
            }
          }
          , error: (error) => {
            console.error('Erro ao alterar personal contact:', error);
            this.errorMessage = error;
          }
        });
      }
      else {
        this.personalContactService.addPersonalContact(personalContactData).subscribe({
          next: (response) => {

            this.personalContactForm.reset();

            this.router.navigate(['/main-page', 'personal-contact-detail-new', response.id, "continua"]);
          },
          error: (error) => {

            console.error('Erro ao criar personal contact:', error);

            this.errorMessage = error;
          }
        });
      }


    }
    else {
      console.log('Formulário inválido');
      this.errorMessage = 'Formulário inválido.';
    }
  }
}
