import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PersonalContactService } from '../../../services/back-office-personal-contact/personal-contact.service';
import { personalContactDetail } from '../../../models/personalContactDetail';

@Component({
  selector: 'app-personal-contact-detail-new',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './personal-contact-detail-new.component.html',
  styleUrl: './personal-contact-detail-new.component.css'
})
export class PersonalContactDetailNewComponent {

  contactForm: FormGroup;
  errorMessage: string | null = null;
  idPersonalContact: number;
  idDetail: number;
  continue: number | null;

  constructor(private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private personalContactService: PersonalContactService
  ) {

    this.contactForm = this.fb.group({
      contactType: ['', [Validators.required]],
      value: ['', [Validators.required]]
    });

    this.idPersonalContact = Number(this.route.snapshot.paramMap.get('idPersonalContact'));

    this.idDetail = Number(this.route.snapshot.paramMap.get('idDetail'));

    this.continue = Number(this.route.snapshot.paramMap.get('continue'));

    if (this.idPersonalContact && this.idDetail) {

      this.personalContactService.getPersonalContactWithDetail(this.idPersonalContact).subscribe({

        next: (response) => {
          const contact = response.personalContactDetails.find(detail => detail.id === this.idDetail);
          this.contactForm.patchValue({
            contactType: contact?.contactType,
            value: contact?.value,
          });
        },
        error: (error) => {
          console.error('Erro ao obter contact detail:', error);
          this.errorMessage = error;
        }

      });

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

      const contactData: personalContactDetail =
      {
        id: this.idDetail,
        contactType: Number(type),
        value: value,
      };

      if (this.idPersonalContact && this.idDetail) {

        this.personalContactService.updateDetail(this.idPersonalContact, contactData).subscribe({

          next: () => {
            this.contactForm.reset();
            this.router.navigate(['/main-page/personal-contact-detail-list', this.idPersonalContact]);
          },
          error: (error) => {
            console.error('Erro ao alterar personal contact detail:', error);
            this.errorMessage = error;
          }
        });

      }
      else {

        this.personalContactService.addDetail(this.idPersonalContact, contactData).subscribe({

          next: () => {

            this.contactForm.reset();

            if (this.continue) {
              this.router.navigate(['/main-page/personal-contact-list']);
            }
            else {
              this.router.navigate(['/main-page/personal-contact-detail-list', this.idPersonalContact]);
            }

          },
          error: (error) => {
            console.error('Erro ao adicionar personal contact detail:', error);
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
