import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StaffService } from '../../../services/back-office-staff/staff.service';


@Component({
  selector: 'app-staff-contact',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './staff-contact.html',
  styleUrl: './staff-contact.css'
})
export class StaffContact {

  contactForm: FormGroup;
  staffId: number;
  errorMessage: string | null = null;
  contactId: number;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private staffService: StaffService,
    private router: Router
  ) {
    this.contactForm = this.fb.group({
      contactType: ['', [Validators.required]],
      value: ['', [Validators.required]]
    });

    this.staffId = Number(this.route.snapshot.paramMap.get('idStaff'));

    this.contactId = Number(this.route.snapshot.paramMap.get('idContact'));

    if (!this.staffId) {
      return;
    }

    if (this.contactId) {
      this.staffService.getByIdWithAll(this.staffId).subscribe({
        next: (response) => {
          const contact = response.entityLink?.contacts?.find(contacto => contacto.id === this.contactId);
          if (contact) {
            this.contactForm.patchValue({
              contactType: contact.contactType,
              value: contact.value
            });
          }
        },
        error: (error) => {
          console.error('Error fetching staff data:', error);
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

      const contactData = {
        id: this.contactId ? this.contactId : 0,
        contactType: Number(type),
        value: value,
      };

      if (this.contactId) {

        this.staffService.staffUpdateContact(contactData, this.staffId, this.contactId).subscribe({
          next: () => {
            this.router.navigate(['/main-page/agent-contact-list', this.staffId]);
          },
          error: (error) => {
            console.error('Erro ao alterar contacto:', error);
            this.errorMessage = error;
          }
        });

      } else {
        this.staffService.staffAddContact(contactData, this.staffId).subscribe({
          next: () => {
            this.router.navigate(['/main-page/agent-contact-list', this.staffId]);
          },
          error: (error) => {
            console.error('Erro ao adicionar contacto:', error);
            this.errorMessage = error;
          }
        });
      }
    }
    else {
      console.log('Formulário inválido.');
      this.errorMessage = 'Formulário inválido.';
    }
  }
}
