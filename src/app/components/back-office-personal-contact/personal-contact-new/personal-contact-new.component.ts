import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthorizationService } from '../../../services/back-office/authorization.service';
import { PersonalContactService } from '../../../services/back-office-personal-contact/personal-contact.service';
import { Router, RouterLink } from '@angular/router';
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

  constructor(private fb: FormBuilder,
    private authorization: AuthorizationService,
    private router: Router,
    private personalContactService: PersonalContactService
  ) {

    this.personalContactForm = this.fb.group({
      name: ['', [Validators.required]],
      isPrimary: [null, [Validators.required]],
      notes: ['']
    })

    const role = this.authorization.getRole();

    if (!role || (role !== 'Staff' && role !== 'Agent' && role !== 'Manager' && role !== 'Broker' && role !== 'Admin')) {

      this.router.navigate(['/front-page', 'login']);

      return;
    }
  }

  onSubmit() {
    if (this.personalContactForm.valid) {

      const personalContactData: personalContact = this.personalContactForm.value as personalContact;

      personalContactData.name = this.personalContactForm.get('name')?.value;
      personalContactData.isPrimary = this.personalContactForm.get('isPrimary')?.value == 'true';
      personalContactData.notes = this.personalContactForm.get('notes')?.value;

      this.personalContactService.addPersonalContact(personalContactData).subscribe({
        next: () => {

          this.personalContactForm.reset();

          this.router.navigate(['/main-page', 'personal-contact-list']);
        },
        error: (error) => {

          console.error('Erro ao criar personal contact:', error);

          this.errorMessage = error;
        }
      });

    }
  }
}
